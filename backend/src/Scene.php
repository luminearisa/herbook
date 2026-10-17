<?php
declare(strict_types=1);

/**
 * Kosakata adegan. Ilustrasi disimpan sebagai data (bukan gambar jadi) sehingga
 * frontend merender SVG-nya, dan buku baru dari prompt cukup menyusun adegan
 * dari kosakata ini.
 */
final class Scene
{
    public const BACKGROUNDS = ['hutan', 'sungai', 'kebun', 'desa', 'malam', 'senja'];
    public const TYPES = [
        'kancil', 'buaya', 'harimau', 'petani', 'kurakura', 'burung', 'kupu',
        'pohon', 'semak', 'batu', 'bunga', 'awan', 'timun', 'orangorangan',
        'rumah', 'kurungan', 'pagar',
    ];
    public const MOODS = ['senang', 'takut', 'licik', 'sedih', 'marah', 'kaget', 'pingsan'];
    public const POSES = ['berdiri', 'lari', 'lompat', 'rebah', 'renang'];

    /** @return array{bg:string,items:list<array<string,mixed>>} */
    public static function sanitize(mixed $scene): array
    {
        $scene = is_array($scene) ? $scene : [];
        $bg = in_array($scene['bg'] ?? null, self::BACKGROUNDS, true) ? $scene['bg'] : 'hutan';
        $items = [];
        foreach (array_slice(is_array($scene['items'] ?? null) ? $scene['items'] : [], 0, 40) as $raw) {
            if (!is_array($raw) || !in_array($raw['t'] ?? null, self::TYPES, true)) {
                continue;
            }
            $item = [
                't' => $raw['t'],
                'x' => self::num($raw['x'] ?? 400, -100, 900),
                'y' => self::num($raw['y'] ?? 450, 0, 560),
            ];
            if (isset($raw['s'])) {
                $item['s'] = self::num($raw['s'], 0.2, 3);
            }
            if (!empty($raw['flip'])) {
                $item['flip'] = true;
            }
            if (in_array($raw['pose'] ?? null, self::POSES, true)) {
                $item['pose'] = $raw['pose'];
            }
            if (in_array($raw['mood'] ?? null, self::MOODS, true)) {
                $item['mood'] = $raw['mood'];
            }
            if (isset($raw['v'])) {
                $item['v'] = (int) self::num($raw['v'], 0, 3);
            }
            $items[] = $item;
        }
        return ['bg' => $bg, 'items' => $items];
    }

    private static function num(mixed $v, float $min, float $max): float
    {
        return round(max($min, min($max, is_numeric($v) ? (float) $v : $min)), 2);
    }
}
