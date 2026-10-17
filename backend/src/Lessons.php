<?php
declare(strict_types=1);

/** Materi belajar "Mengenal Sekitar": halaman bergambar (judul, penjelasan, fakta) dan kuis. */
final class Lessons
{
    /** @return list<array<string,mixed>> */
    public static function all(PDO $pdo): array
    {
        $rows = $pdo->query('SELECT * FROM lessons ORDER BY series ASC, part ASC, id ASC')->fetchAll();
        return array_map(static function (array $r): array {
            $content = json_decode($r['content'], true) ?: [];
            return self::present($r) + [
                'page_count' => count($content['pages'] ?? []),
                'quiz_count' => count($content['quiz'] ?? []),
            ];
        }, $rows);
    }

    /** @return array<string,mixed>|null */
    public static function find(PDO $pdo, string $slug): ?array
    {
        $stmt = $pdo->prepare('SELECT * FROM lessons WHERE slug = ?');
        $stmt->execute([$slug]);
        $row = $stmt->fetch();
        if (!$row) {
            return null;
        }
        $content = json_decode($row['content'], true) ?: [];
        return self::present($row) + [
            'pages' => $content['pages'] ?? [],
            'quiz' => $content['quiz'] ?? [],
            'page_count' => count($content['pages'] ?? []),
            'quiz_count' => count($content['quiz'] ?? []),
        ];
    }

    /** @param array<string,mixed> $in */
    public static function create(PDO $pdo, array $in): string
    {
        $title = trim((string) ($in['title'] ?? ''));
        $pages = [];
        foreach (array_slice(is_array($in['pages'] ?? null) ? $in['pages'] : [], 0, 30) as $p) {
            if (!is_array($p)) {
                continue;
            }
            $pages[] = [
                'title' => mb_substr(trim((string) ($p['title'] ?? '')), 0, 80),
                'text' => mb_substr(trim((string) ($p['text'] ?? '')), 0, 900),
                'fact' => mb_substr(trim((string) ($p['fact'] ?? '')), 0, 500),
                'reflection' => mb_substr(trim((string) ($p['reflection'] ?? '')), 0, 300),
                'scene' => Scene::sanitize($p['scene'] ?? []),
            ];
        }
        if ($title === '' || $pages === []) {
            throw new InvalidArgumentException('Materi butuh judul dan minimal satu halaman.');
        }
        $quiz = [];
        foreach (array_slice(is_array($in['quiz'] ?? null) ? $in['quiz'] : [], 0, 20) as $q) {
            $options = array_values(array_map('strval', is_array($q['options'] ?? null) ? array_slice($q['options'], 0, 4) : []));
            $answer = (int) ($q['answer'] ?? -1);
            if (!isset($q['q']) || count($options) < 2 || $answer < 0 || $answer >= count($options)) {
                continue;
            }
            $quiz[] = [
                'q' => mb_substr(trim((string) $q['q']), 0, 200),
                'options' => $options,
                'answer' => $answer,
                'explain' => mb_substr(trim((string) ($q['explain'] ?? '')), 0, 300),
            ];
        }
        $slug = trim((string) preg_replace('/[^a-z0-9]+/', '-', strtolower((string) ($in['slug'] ?? $title))), '-') ?: 'materi';
        $pdo->prepare('INSERT INTO lessons (slug, series, part, title, summary, cover, content) VALUES (?,?,?,?,?,?,?)')
            ->execute([
                substr($slug, 0, 60),
                preg_replace('/[^a-z0-9-]/', '', strtolower((string) ($in['series'] ?? 'alam'))) ?: 'alam',
                max(1, (int) ($in['part'] ?? 1)),
                mb_substr($title, 0, 120),
                mb_substr(trim((string) ($in['summary'] ?? '')), 0, 400),
                json_encode(Scene::sanitize($in['cover'] ?? $pages[0]['scene'])),
                json_encode(['pages' => $pages, 'quiz' => $quiz]),
            ]);
        return substr($slug, 0, 60);
    }

    /** @param array<string,mixed> $r @return array<string,mixed> */
    private static function present(array $r): array
    {
        return [
            'slug' => $r['slug'],
            'series' => $r['series'],
            'part' => (int) $r['part'],
            'title' => $r['title'],
            'summary' => $r['summary'],
            'cover' => json_decode($r['cover'], true),
        ];
    }
}
