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
CREATE TABLE IF NOT EXISTS pages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    book_id INTEGER NOT NULL REFERENCES books(id) ON DELETE CASCADE,
    position INTEGER NOT NULL,
    text TEXT NOT NULL,
    scene TEXT NOT NULL,
    UNIQUE (book_id, position)
);
SQL);
    }

    private static function seed(PDO $pdo): void
    {
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
        }
    }
}
