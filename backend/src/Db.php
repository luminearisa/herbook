<?php
declare(strict_types=1);

final class Db
{
    private static ?PDO $pdo = null;

    public static function pdo(): PDO
    {
        if (self::$pdo === null) {
            $path = getenv('HERBOOK_DB') ?: dirname(__DIR__) . '/data/herbook.sqlite';
            if (!is_dir(dirname($path))) {
                mkdir(dirname($path), 0775, true);
            }
            $pdo = new PDO('sqlite:' . $path, null, null, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            ]);
            $pdo->exec('PRAGMA foreign_keys = ON');
            $pdo->exec('PRAGMA journal_mode = WAL');
            self::migrate($pdo);
            self::seed($pdo);
            self::$pdo = $pdo;
        }
        return self::$pdo;
    }

    private static function migrate(PDO $pdo): void
    {
        $pdo->exec(<<<'SQL'
CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    author TEXT NOT NULL DEFAULT 'Her Book',
    summary TEXT NOT NULL DEFAULT '',
    moral TEXT NOT NULL DEFAULT '',
    cover TEXT NOT NULL,
    is_seed INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS lessons (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT NOT NULL UNIQUE,
    series TEXT NOT NULL DEFAULT 'alam',
    part INTEGER NOT NULL DEFAULT 1,
    title TEXT NOT NULL,
    summary TEXT NOT NULL DEFAULT '',
    cover TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS pages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    book_id INTEGER NOT NULL REFERENCES books(id) ON DELETE CASCADE,
    position INTEGER NOT NULL,
    text TEXT NOT NULL,
    scene TEXT NOT NULL,
    UNIQUE (book_id, position)
);
CREATE TABLE IF NOT EXISTS english (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    title_en TEXT NOT NULL DEFAULT '',
    summary TEXT NOT NULL DEFAULT '',
    emoji TEXT NOT NULL DEFAULT '',
    position INTEGER NOT NULL DEFAULT 0,
    content TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    whatsapp TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS sessions (
    token TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expires_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS progress (
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    kind TEXT NOT NULL,
    slug TEXT NOT NULL,
    page INTEGER NOT NULL DEFAULT 0,
    total INTEGER NOT NULL DEFAULT 0,
    completed INTEGER NOT NULL DEFAULT 0,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, kind, slug)
);
SQL);
        $cols = array_column($pdo->query('PRAGMA table_info(books)')->fetchAll(), 'name');
        if (!in_array('category', $cols, true)) {
            $pdo->exec("ALTER TABLE books ADD COLUMN category TEXT NOT NULL DEFAULT 'dongeng'");
        }
        if (!in_array('en', $cols, true)) {
            $pdo->exec("ALTER TABLE books ADD COLUMN en TEXT NOT NULL DEFAULT ''");
        }
        $lcols = array_column($pdo->query('PRAGMA table_info(lessons)')->fetchAll(), 'name');
        if (!in_array('en', $lcols, true)) {
            $pdo->exec("ALTER TABLE lessons ADD COLUMN en TEXT NOT NULL DEFAULT ''");
        }
        $ecols = array_column($pdo->query('PRAGMA table_info(english)')->fetchAll(), 'name');
        if (!in_array('position', $ecols, true)) {
            $pdo->exec('ALTER TABLE english ADD COLUMN position INTEGER NOT NULL DEFAULT 0');
        }
    }

    private static function seed(PDO $pdo): void
    {
        foreach (glob(dirname(__DIR__) . '/seed/lessons/*.json') ?: [] as $file) {
            $lesson = json_decode((string) file_get_contents($file), true);
            if (!is_array($lesson)) {
                continue;
            }
            $exists = $pdo->prepare('SELECT 1 FROM lessons WHERE slug = ?');
            $exists->execute([$lesson['slug']]);
            if (!$exists->fetchColumn()) {
                Lessons::create($pdo, $lesson);
            }
            self::syncTranslation($pdo, 'lessons', (string) $lesson['slug'], dirname(__DIR__) . '/seed/en/lessons/' . basename($file));
        }
        $topicPosition = 0;
        foreach (glob(dirname(__DIR__) . '/seed/english/*.json') ?: [] as $file) {
            $topic = json_decode((string) file_get_contents($file), true);
            if (is_array($topic)) {
                English::upsert($pdo, $topic, $topicPosition++);
            }
        }
        foreach (glob(dirname(__DIR__) . '/seed/*.json') ?: [] as $file) {
            $book = json_decode((string) file_get_contents($file), true);
            if (!is_array($book)) {
                continue;
            }
            $exists = $pdo->prepare('SELECT 1 FROM books WHERE slug = ?');
            $exists->execute([$book['slug']]);
            if (!$exists->fetchColumn()) {
                Books::create($pdo, $book, true);
            }
            self::syncTranslation($pdo, 'books', (string) $book['slug'], dirname(__DIR__) . '/seed/en/' . basename($file));
        }
    }

    /** Menyimpan terjemahan Inggris (kolom `en`) dari berkas seed/en bila isinya berubah. */
    private static function syncTranslation(PDO $pdo, string $table, string $slug, string $file): void
    {
        if (!is_file($file)) {
            return;
        }
        $en = json_decode((string) file_get_contents($file), true);
        if (!is_array($en)) {
            return;
        }
        $json = json_encode($en, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        $pdo->prepare("UPDATE {$table} SET en = ? WHERE slug = ? AND en <> ?")->execute([$json, $slug, $json]);
    }
}
