<?php
declare(strict_types=1);

final class Books
{
    public const CATEGORIES = ['dongeng', 'islami', 'fabel'];

    /** @return list<array<string,mixed>> */
    public static function all(PDO $pdo): array
    {
        $rows = $pdo->query(
            'SELECT b.*, (SELECT COUNT(*) FROM pages p WHERE p.book_id = b.id) AS page_count
             FROM books b ORDER BY b.is_seed DESC, b.category ASC, b.id ASC'
        )->fetchAll();
        return array_map(static fn (array $r) => self::present($r), $rows);
    }

    /** @return array<string,mixed>|null */
    public static function find(PDO $pdo, string $slug): ?array
    {
        $stmt = $pdo->prepare('SELECT * FROM books WHERE slug = ?');
        $stmt->execute([$slug]);
        $row = $stmt->fetch();
        if (!$row) {
            return null;
        }
        $pages = $pdo->prepare('SELECT text, scene FROM pages WHERE book_id = ? ORDER BY position');
        $pages->execute([$row['id']]);
        $book = self::present($row);
        $book['pages'] = array_map(
            static fn (array $p) => ['text' => $p['text'], 'scene' => json_decode($p['scene'], true)],
            $pages->fetchAll()
        );
        $book['page_count'] = count($book['pages']);
        return $book;
    }

    /** @param array<string,mixed> $in */
    public static function create(PDO $pdo, array $in, bool $seed = false): string
    {
        $title = trim((string) ($in['title'] ?? ''));
        $pages = is_array($in['pages'] ?? null) ? $in['pages'] : [];
        if ($title === '' || count($pages) < 1) {
            throw new InvalidArgumentException('Buku butuh judul dan minimal satu halaman.');
        }
        $slug = self::uniqueSlug($pdo, (string) ($in['slug'] ?? $title), $seed);

        $pdo->beginTransaction();
        try {
            $pdo->prepare('INSERT INTO books (slug, title, author, summary, moral, cover, is_seed, category) VALUES (?,?,?,?,?,?,?,?)')
                ->execute([
                    $slug,
                    mb_substr($title, 0, 120),
                    mb_substr(trim((string) ($in['author'] ?? 'Her Book')), 0, 80),
                    mb_substr(trim((string) ($in['summary'] ?? '')), 0, 400),
                    mb_substr(trim((string) ($in['moral'] ?? '')), 0, 400),
                    json_encode(Scene::sanitize($in['cover'] ?? $pages[0]['scene'] ?? [])),
                    $seed ? 1 : 0,
                    in_array($in['category'] ?? null, self::CATEGORIES, true) ? $in['category'] : 'dongeng',
                ]);
            $bookId = (int) $pdo->lastInsertId();
            $ins = $pdo->prepare('INSERT INTO pages (book_id, position, text, scene) VALUES (?,?,?,?)');
            foreach (array_values(array_slice($pages, 0, 30)) as $i => $page) {
                $ins->execute([
                    $bookId,
                    $i + 1,
                    mb_substr(trim((string) ($page['text'] ?? '')), 0, 1200),
                    json_encode(Scene::sanitize($page['scene'] ?? [])),
                ]);
            }
            $pdo->commit();
        } catch (Throwable $e) {
            $pdo->rollBack();
            throw $e;
        }
        return $slug;
    }

    public static function delete(PDO $pdo, string $slug): string
    {
        $stmt = $pdo->prepare('SELECT is_seed FROM books WHERE slug = ?');
        $stmt->execute([$slug]);
        $row = $stmt->fetch();
        if (!$row) {
            return 'missing';
        }
        if ((int) $row['is_seed'] === 1) {
            return 'protected';
        }
        $pdo->prepare('DELETE FROM books WHERE slug = ?')->execute([$slug]);
        return 'deleted';
    }

    /** @param array<string,mixed> $r @return array<string,mixed> */
    private static function present(array $r): array
    {
        return [
            'slug' => $r['slug'],
            'title' => $r['title'],
            'author' => $r['author'],
            'summary' => $r['summary'],
            'moral' => $r['moral'],
            'cover' => json_decode($r['cover'], true),
            'category' => $r['category'],
            'is_seed' => (bool) $r['is_seed'],
            'page_count' => (int) ($r['page_count'] ?? 0),
        ];
    }

    private static function uniqueSlug(PDO $pdo, string $base, bool $exact): string
    {
        $slug = trim((string) preg_replace('/[^a-z0-9]+/', '-', strtolower($base)), '-') ?: 'buku';
        $slug = substr($slug, 0, 60);
        if ($exact) {
            return $slug;
        }
        $candidate = $slug;
        $n = 2;
        $stmt = $pdo->prepare('SELECT 1 FROM books WHERE slug = ?');
        while (true) {
            $stmt->execute([$candidate]);
            if (!$stmt->fetchColumn()) {
                return $candidate;
            }
            $candidate = $slug . '-' . $n++;
        }
    }
}
