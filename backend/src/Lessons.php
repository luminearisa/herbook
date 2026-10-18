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
        $en = self::english($row);
        $enPages = array_values(is_array($en['pages'] ?? null) ? $en['pages'] : []);
        $enQuiz = array_values(is_array($en['quiz'] ?? null) ? $en['quiz'] : []);
        $pages = $content['pages'] ?? [];
        $quiz = $content['quiz'] ?? [];
        foreach ($pages as $i => &$p) {
            $ep = is_array($enPages[$i] ?? null) ? $enPages[$i] : [];
            $p['title_en'] = (string) ($ep['title'] ?? '');
            $p['text_en'] = (string) ($ep['text'] ?? '');
            $p['fact_en'] = (string) ($ep['fact'] ?? '');
            $p['reflection_en'] = (string) ($ep['reflection'] ?? '');
        }
        unset($p);
        foreach ($quiz as $i => &$q) {
            $eq = is_array($enQuiz[$i] ?? null) ? $enQuiz[$i] : [];
            $q['q_en'] = (string) ($eq['q'] ?? '');
            $q['options_en'] = is_array($eq['options'] ?? null) ? array_values($eq['options']) : [];
            $q['explain_en'] = (string) ($eq['explain'] ?? '');
        }
        unset($q);
        return self::present($row) + [
            'pages' => $pages,
            'quiz' => $quiz,
            'page_count' => count($pages),
            'quiz_count' => count($quiz),
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
        $en = self::english($r);
        $titleEn = (string) ($en['title'] ?? '');
        return [
            'slug' => $r['slug'],
            'series' => $r['series'],
            'part' => (int) $r['part'],
            'title' => $r['title'],
            'title_en' => $titleEn,
            'summary' => $r['summary'],
            'summary_en' => (string) ($en['summary'] ?? ''),
            'cover' => json_decode($r['cover'], true),
            'has_en' => $titleEn !== '',
        ];
    }

    /** @param array<string,mixed> $r @return array<string,mixed> */
    private static function english(array $r): array
    {
        $raw = $r['en'] ?? '';
        if (!is_string($raw) || $raw === '') {
            return [];
        }
        $en = json_decode($raw, true);
        return is_array($en) ? $en : [];
    }
}
