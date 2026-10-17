<?php
declare(strict_types=1);

/**
 * Membuat buku cerita dari prompt. Dengan ANTHROPIC_API_KEY, Claude menyusun
 * cerita + adegan; tanpa itu dipakai penyusun cerita sederhana (offline).
 */
final class StoryMaker
{
    /** @return array{book:array<string,mixed>,mode:string,note:?string} */
    public static function generate(string $prompt, string $category = 'dongeng'): array
    {
        $key = getenv('ANTHROPIC_API_KEY') ?: '';
        $note = null;
        if ($category === 'islami' && $key === '') {
            // Isi keagamaan tidak disusun dari templat; butuh penulis AI.
            throw new InvalidArgumentException('Kisah Islami baru bisa dibuat setelah ANTHROPIC_API_KEY diatur di server.');
        }
        if ($key !== '') {
            try {
                $book = self::viaClaude($prompt, $key, $category);
                $book['category'] = $category;
                if ($category === 'islami') {
                    $book = self::withoutPeople($book);
                }
                return ['book' => $book, 'mode' => 'ai', 'note' => null];
            } catch (Throwable $e) {
                $note = 'AI tidak tersedia (' . $e->getMessage() . '), memakai penyusun cerita sederhana.';
            }
        } else {
            $note = 'ANTHROPIC_API_KEY belum diatur, memakai penyusun cerita sederhana.';
        }
        return ['book' => self::offline($prompt), 'mode' => 'offline', 'note' => $note];
    }

    /** Kisah Islami tidak menggambar manusia (nabi/sahabat): buang tokoh manusia dari adegan. @param array<string,mixed> $book @return array<string,mixed> */
    private static function withoutPeople(array $book): array
    {
        $strip = static function (mixed $scene): mixed {
            if (is_array($scene) && is_array($scene['items'] ?? null)) {
                $scene['items'] = array_values(array_filter(
                    $scene['items'],
                    static fn ($it) => !in_array($it['t'] ?? '', ['petani', 'orangorangan'], true)
                ));
            }
            return $scene;
        };
        $book['cover'] = $strip($book['cover'] ?? []);
        foreach ($book['pages'] as $i => $page) {
            $book['pages'][$i]['scene'] = $strip($page['scene'] ?? []);
        }
        return $book;
    }

    private static function systemPrompt(string $category): string
    {
        $bgs = implode(', ', Scene::BACKGROUNDS);
        $types = implode(', ', Scene::TYPES);
        $moods = implode(', ', Scene::MOODS);
        $poses = implode(', ', Scene::POSES);
        return <<<TXT
Kamu penulis buku cerita anak berbahasa Indonesia. Dari permintaan pengguna, buat satu buku cerita bergambar.
Balas HANYA dengan JSON valid (tanpa markdown) berbentuk:
{"title":str,"summary":str(1-2 kalimat),"moral":str,"cover":SCENE,"pages":[{"text":str(2-4 kalimat),"scene":SCENE}]}
Buat 6-10 halaman, alur jelas (pembuka, masalah, akal/aksi, akhir), bahasa hangat dan mudah dipahami anak.
Gambar disusun sebagai SCENE di kanvas 800x500: {"bg":BG,"items":[{"t":TIPE,"x":int,"y":int,"s":skala,"flip":bool,"pose":POSE,"mood":MOOD,"v":0-3}]}.
x,y adalah titik pijak (kaki) objek; y 430-470 untuk tanah depan, 300-360 untuk latar jauh. Urutan item = urutan gambar (belakang dulu, depan terakhir).
BG: $bgs. (sungai: tepi kiri x<170 dan kanan x>630, air di tengah; buaya berpose renang di y~400.)
TIPE: $types. Tokoh hewan/orang menghadap kanan; flip=true menghadapkan ke kiri. Tinggi kancil sekitar 125*s px, pohon ~180*s px.
MOOD (hewan/orang): $moods. POSE: $poses (lompat/lari/rebah untuk kancil; renang untuk buaya; v=1 pada pohon berarti berbuah).
Tokoh utama cerita sebaiknya kancil kecuali pengguna meminta lain; gunakan hanya TIPE yang tersedia.
TXT . ($category === 'islami' ? self::islamicRules() : '');
    }

    private static function islamicRules(): string
    {
        return <<<TXT


KATEGORI KISAH ISLAMI: ceritakan hanya kisah yang bersumber dari Al-Qur'an atau hadis shahih, dengan setia pada sumbernya; jangan menambah detail yang tidak ada dasarnya, dan sebutkan sumbernya (mis. QS. Al-Fil) di summary.
Jangan menggambar manusia, terutama para nabi, rasul, dan sahabat: hanya hewan, alam, Ka'bah (kabah), dan benda. Ceritakan peran manusia lewat teks saja. Gunakan salam penghormatan ('alaihis salam / shallallahu 'alaihi wa sallam) pada nama nabi. Tokoh utama bukan kancil kecuali memang sesuai kisahnya. Tambahan TIPE: kabah, semut, hudhud, ababil, kurma, surat, debu, sarang; BG tambahan: gurun. Akhiri dengan pesan (moral) yang sesuai.
TXT;
    }

    /** @return array<string,mixed> */
    private static function viaClaude(string $prompt, string $key, string $category): array
    {
        $ch = curl_init('https://api.anthropic.com/v1/messages');
        curl_setopt_array($ch, [
            CURLOPT_POST => true,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 120,
            CURLOPT_HTTPHEADER => [
                'content-type: application/json',
                'x-api-key: ' . $key,
                'anthropic-version: 2023-06-01',
            ],
            CURLOPT_POSTFIELDS => json_encode([
                'model' => getenv('HERBOOK_MODEL') ?: 'claude-sonnet-5-5',
                'max_tokens' => 8000,
                'system' => self::systemPrompt($category),
                'messages' => [['role' => 'user', 'content' => $prompt]],
            ]),
        ]);
        $raw = curl_exec($ch);
        $status = (int) curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
        if ($raw === false || $status >= 400) {
            throw new RuntimeException($raw === false ? curl_error($ch) : "HTTP $status");
        }
        $text = (string) (json_decode((string) $raw, true)['content'][0]['text'] ?? '');
        $start = strpos($text, '{');
        $end = strrpos($text, '}');
        $book = $start === false || $end === false ? null : json_decode(substr($text, $start, $end - $start + 1), true);
        if (!is_array($book) || empty($book['title']) || empty($book['pages'])) {
            throw new RuntimeException('jawaban tidak valid');
        }
        $book['author'] = 'Her Book AI';
        return $book;
    }

    /** @return array<string,mixed> */
    private static function offline(string $prompt): array
    {
        $p = strtolower($prompt);
        $villains = [
            'buaya' => ['Buaya', 'buaya', 'sungai', ['renang', 'berenang di sungai']],
            'harimau' => ['Harimau', 'harimau', 'hutan', ['berdiri', 'mengaum di hutan']],
            'macan' => ['Harimau', 'harimau', 'hutan', ['berdiri', 'mengaum di hutan']],
            'gajah' => ['Gajah', 'gajah', 'hutan', ['berdiri', 'berjalan di hutan']],
            'petani' => ['Pak Tani', 'petani', 'kebun', ['berdiri', 'menjaga kebunnya']],
        ];
        $v = $villains['harimau'];
        foreach ($villains as $word => $cfg) {
            if (str_contains($p, $word)) {
                $v = $cfg;
                break;
            }
        }
        [$name, $type, $bg, [$pose, $doing]] = $v;
        $solo = $type === 'buaya';
        $villain = fn (int $x, string $mood, int $y = 455, float $s = 1.1): array =>
            ['t' => $type, 'x' => $x, 'y' => $solo ? 400 : $y, 's' => $solo ? 0.7 : $s, 'mood' => $mood, 'pose' => $pose, 'flip' => $x > 500];
        $k = fn (int $x, string $mood, string $pose = 'berdiri'): array =>
            ['t' => 'kancil', 'x' => $x, 'y' => 460, 's' => 1.2, 'mood' => $mood, 'pose' => $pose];
        $trees = [['t' => 'pohon', 'x' => 90, 'y' => 410, 's' => 1.2], ['t' => 'pohon', 'x' => 720, 'y' => 400, 's' => 1.1]];
        $page = fn (string $text, string $sceneBg, array $items): array =>
            ['text' => $text, 'scene' => ['bg' => $sceneBg, 'items' => $items]];
        $sky = ['t' => 'awan', 'x' => 300, 'y' => 70];

        $title = "Kancil dan $name";
        return [
            'title' => $title,
            'author' => 'Her Book',
            'summary' => "Kisah kancil yang cerdik bertemu $name. Permintaan: " . mb_substr(trim($prompt), 0, 120),
            'moral' => 'Berpikir tenang dan cerdik membantu kita melewati kesulitan.',
            'cover' => ['bg' => $bg, 'items' => [...$trees, $villain(540, 'marah'), $k(220, 'licik')]],
            'pages' => [
                $page("Pada suatu hari, Kancil yang kecil dan cerdik berjalan-jalan riang di tepi hutan. Udara cerah dan hatinya gembira.", 'hutan', [$sky, ...$trees, $k(400, 'senang')]),
                $page("Tiba-tiba ia bertemu $name yang sedang $doing. \"Wah, ada yang datang!\" kata $name dengan tatapan lapar.", $bg, [$sky, $villain(560, 'marah'), $k(160, 'kaget')]),
                $page("Kancil gemetar sebentar. Tetapi ia ingat kata ibunya: \"Jika bahaya datang, tenanglah dan berpikirlah.\" Kancil menarik napas panjang.", $bg, [$sky, $villain(560, 'marah'), $k(160, 'takut')]),
                $page("\"Hai $name!\" seru Kancil sambil tersenyum. \"Aku membawa kabar penting dari Raja Hutan, dan kamu akan mendapat tugas istimewa!\" $name pun penasaran dan mendengarkan.", $bg, [$sky, $villain(560, 'senang'), $k(200, 'licik')]),
                $page("Sementara $name sibuk memikirkan tugas istimewa itu, Kancil melompat dan berlari secepat kilat, jauh meninggalkannya.", 'hutan', [$sky, ...$trees, $k(450, 'senang', 'lari')]),
                $page("Kancil selamat dan tertawa gembira. Ia belajar bahwa akal yang tenang lebih kuat daripada rasa takut. Tamat.", 'hutan', [$sky, ...$trees, ['t' => 'kupu', 'x' => 560, 'y' => 290], $k(420, 'senang')]),
            ],
        ];
    }
}
