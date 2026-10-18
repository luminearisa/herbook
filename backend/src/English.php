<?php
declare(strict_types=1);

/**
 * Modul "English untuk Balita": topik kosakata (emoji, kata Inggris, arti Indonesia).
 * Disimpan sebagai data di backend/seed/english/ lalu disalin ke tabel `english`.
 */
final class English
{
    /** @return list<array<string,mixed>> */
    public static function all(PDO $pdo): array
    {
        $rows = $pdo->query('SELECT * FROM english ORDER BY position ASC, id ASC')->fetchAll();
        return array_map(static function (array $r): array {
            $c = json_decode($r['content'], true) ?: [];
            return self::present($r) + ['word_count' => count(is_array($c['words'] ?? null) ? $c['words'] : [])];
        }, $rows);
    }

    /** @return array<string,mixed>|null */
    public static function find(PDO $pdo, string $slug): ?array
    {
        $stmt = $pdo->prepare('SELECT * FROM english WHERE slug = ?');
        $stmt->execute([$slug]);
        $row = $stmt->fetch();
        if (!$row) {
            return null;
        }
        $c = json_decode($row['content'], true) ?: [];
        $words = self::cleanWords($c['words'] ?? []);
        return self::present($row) + ['words' => $words, 'word_count' => count($words)];
    }

    /** Menyalin satu topik dari berkas seed; hanya menulis bila isinya berubah. */
    public static function upsert(PDO $pdo, array $topic, int $position): void
    {
        $slug = self::slug((string) ($topic['slug'] ?? $topic['title'] ?? ''));
        if ($slug === '') {
            return;
        }
        $content = json_encode(['words' => self::cleanWords($topic['words'] ?? [])], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        $pdo->prepare(
            'INSERT INTO english (slug, title, title_en, summary, emoji, position, content)
             VALUES (?,?,?,?,?,?,?)
             ON CONFLICT(slug) DO UPDATE SET
                title=excluded.title, title_en=excluded.title_en, summary=excluded.summary,
                emoji=excluded.emoji, position=excluded.position, content=excluded.content
             WHERE english.title<>excluded.title OR english.title_en<>excluded.title_en
                OR english.summary<>excluded.summary OR english.emoji<>excluded.emoji
                OR english.position<>excluded.position OR english.content<>excluded.content'
        )->execute([
            substr($slug, 0, 60),
            mb_substr(trim((string) ($topic['title'] ?? '')), 0, 120),
            mb_substr(trim((string) ($topic['title_en'] ?? '')), 0, 120),
            mb_substr(trim((string) ($topic['summary'] ?? '')), 0, 400),
            mb_substr((string) ($topic['emoji'] ?? ''), 0, 8),
            $position,
            $content,
        ]);
    }

    /** @param mixed $raw @return list<array{en:string,id:string,emoji:string}> */
    private static function cleanWords(mixed $raw): array
    {
        $words = [];
        foreach (is_array($raw) ? array_slice($raw, 0, 60) : [] as $w) {
            if (!is_array($w)) {
                continue;
            }
            $en = trim((string) ($w['en'] ?? ''));
            if ($en === '') {
                continue;
            }
            $words[] = [
                'en' => mb_substr($en, 0, 60),
                'id' => mb_substr(trim((string) ($w['id'] ?? '')), 0, 60),
                'emoji' => mb_substr((string) ($w['emoji'] ?? ''), 0, 8),
            ];
        }
        return $words;
    }

    /** @param array<string,mixed> $r @return array<string,mixed> */
    private static function present(array $r): array
    {
        return [
            'slug' => $r['slug'],
            'title' => $r['title'],
            'title_en' => (string) ($r['title_en'] ?? ''),
            'summary' => $r['summary'],
            'emoji' => (string) ($r['emoji'] ?? ''),
        ];
    }

    private static function slug(string $text): string
    {
        return trim((string) preg_replace('/[^a-z0-9]+/', '-', strtolower($text)), '-');
    }
}
