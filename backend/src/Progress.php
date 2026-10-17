<?php
declare(strict_types=1);

/**
 * Riwayat baca per pengguna: sampai halaman berapa tiap cerita/materi dibaca.
 * Progres memakai halaman terjauh (tidak pernah mundur) dan penanda selesai.
 */
final class Progress
{
    /** @return list<array<string,mixed>> */
    public static function all(PDO $pdo, int $userId): array
    {
        $st = $pdo->prepare('SELECT kind, slug, page, total, completed, updated_at FROM progress WHERE user_id = ? ORDER BY updated_at DESC, slug ASC');
        $st->execute([$userId]);
        return array_map(static fn (array $r): array => [
            'kind' => (string) $r['kind'],
            'slug' => (string) $r['slug'],
            'page' => (int) $r['page'],
            'total' => (int) $r['total'],
            'completed' => (bool) $r['completed'],
            'updated_at' => (string) $r['updated_at'],
        ], $st->fetchAll());
    }

    /** @param array<string,mixed> $in */
    public static function save(PDO $pdo, int $userId, array $in): void
    {
        $kind = self::kind($in['kind'] ?? null);
        $slug = self::slug($in['slug'] ?? null);
        if ($kind === null || $slug === null) {
            throw new InvalidArgumentException('Data riwayat tidak valid.');
        }
        self::upsert($pdo, $userId, $kind, $slug, (int) ($in['page'] ?? 0), (int) ($in['total'] ?? 0), !empty($in['completed']));
    }

    /** @param array<int,mixed> $items */
    public static function merge(PDO $pdo, int $userId, array $items): void
    {
        foreach (array_slice($items, 0, 500) as $it) {
            if (!is_array($it)) {
                continue;
            }
            $kind = self::kind($it['kind'] ?? null);
            $slug = self::slug($it['slug'] ?? null);
            if ($kind === null || $slug === null) {
                continue;
            }
            self::upsert($pdo, $userId, $kind, $slug, (int) ($it['page'] ?? 0), (int) ($it['total'] ?? 0), !empty($it['completed']));
        }
    }

    private static function upsert(PDO $pdo, int $userId, string $kind, string $slug, int $page, int $total, bool $completed): void
    {
        $page = max(0, min($page, 1000));
        $total = max(0, min($total, 1000));
        $st = $pdo->prepare('SELECT page, total, completed FROM progress WHERE user_id = ? AND kind = ? AND slug = ?');
        $st->execute([$userId, $kind, $slug]);
        $cur = $st->fetch();
        if ($cur) {
            // Progres tidak pernah mundur: simpan halaman terjauh dan penanda selesai.
            $page = max($page, (int) $cur['page']);
            $total = max($total, (int) $cur['total']);
            $completed = $completed || (bool) $cur['completed'];
            $pdo->prepare('UPDATE progress SET page = ?, total = ?, completed = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ? AND kind = ? AND slug = ?')
                ->execute([$page, $total, $completed ? 1 : 0, $userId, $kind, $slug]);
            return;
        }
        $pdo->prepare('INSERT INTO progress (user_id, kind, slug, page, total, completed) VALUES (?,?,?,?,?,?)')
            ->execute([$userId, $kind, $slug, $page, $total, $completed ? 1 : 0]);
    }

    private static function kind(mixed $v): ?string
    {
        return in_array($v, ['book', 'lesson'], true) ? (string) $v : null;
    }

    private static function slug(mixed $v): ?string
    {
        $slug = trim((string) $v);
        return preg_match('/^[a-z0-9-]{1,60}$/', $slug) ? $slug : null;
    }
}
