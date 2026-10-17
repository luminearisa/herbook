<?php
declare(strict_types=1);

// Saat di-deploy, deploy/index.php mendefinisikan HERBOOK_ROOT (folder aplikasi di luar
// folder web) dan HERBOOK_DIST (folder web berisi hasil build frontend).
$root = defined('HERBOOK_ROOT') ? HERBOOK_ROOT : dirname(__DIR__);
loadEnvFile($root . '/.env');

require $root . '/src/Scene.php';
require $root . '/src/Db.php';
require $root . '/src/Auth.php';
require $root . '/src/Progress.php';
require $root . '/src/Books.php';
require $root . '/src/Lessons.php';
require $root . '/src/StoryMaker.php';

$path = rtrim(parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/', '/') ?: '/';
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if (str_starts_with($path, '/api')) {
    handleApi($method, substr($path, 4) ?: '/');
    return;
}
serveFrontend($path);

/** Memuat KEY=VALUE dari .env (di luar folder web) tanpa menimpa environment yang sudah ada. */
function loadEnvFile(string $file): void
{
    if (!is_readable($file)) {
        return;
    }
    foreach (file($file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) ?: [] as $line) {
        if ($line[0] === '#' || !str_contains($line, '=')) {
            continue;
        }
        [$key, $value] = explode('=', $line, 2);
        $key = trim($key);
        if ($key !== '' && getenv($key) === false) {
            putenv($key . '=' . trim($value, " \t\"'"));
        }
    }
}

function json(mixed $data, int $status = 200): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
}

/** @return array<string,mixed> */
function body(): array
{
    $data = json_decode(file_get_contents('php://input') ?: '', true);
    return is_array($data) ? $data : [];
}

function handleApi(string $method, string $route): void
{
    try {
        $pdo = Db::pdo();
        if ($route === '/auth/register' && $method === 'POST') {
            json(['user' => Auth::register($pdo, body())], 201);
        } elseif ($route === '/auth/login' && $method === 'POST') {
            json(['user' => Auth::login($pdo, body())]);
        } elseif ($route === '/auth/logout' && $method === 'POST') {
            Auth::logout($pdo);
            json(['ok' => true]);
        } elseif ($route === '/auth/me' && $method === 'GET') {
            json(['user' => Auth::user($pdo)]);
        } elseif ($route === '/progress' && $method === 'GET') {
            $user = Auth::user($pdo);
            json(['items' => $user ? Progress::all($pdo, $user['id']) : []]);
        } elseif ($route === '/progress' && in_array($method, ['POST', 'PUT'], true)) {
            $user = Auth::user($pdo);
            if (!$user) {
                json(['ok' => false, 'guest' => true], 200);
                return;
            }
            Progress::save($pdo, $user['id'], body());
            json(['ok' => true]);
        } elseif ($route === '/progress/merge' && $method === 'POST') {
            $user = Auth::user($pdo);
            if (!$user) {
                json(['ok' => false, 'guest' => true], 200);
                return;
            }
            Progress::merge($pdo, $user['id'], (array) (body()['items'] ?? []));
            json(['items' => Progress::all($pdo, $user['id'])]);
        } elseif ($route === '/lessons' && $method === 'GET') {
            json(Lessons::all($pdo));
        } elseif (preg_match('#^/lessons/([a-z0-9-]+)$#', $route, $lm) && $method === 'GET') {
            $lesson = Lessons::find($pdo, $lm[1]);
            $lesson ? json($lesson) : json(['error' => 'Materi tidak ditemukan.'], 404);
        } elseif ($route === '/books' && $method === 'GET') {
            json(Books::all($pdo));
        } elseif ($route === '/books' && $method === 'POST') {
            $slug = Books::create($pdo, body());
            json(Books::find($pdo, $slug), 201);
        } elseif ($route === '/books/generate' && $method === 'POST') {
            $prompt = trim((string) (body()['prompt'] ?? ''));
            if (mb_strlen($prompt) < 5) {
                json(['error' => 'Tulis ide ceritanya dulu, minimal beberapa kata.'], 422);
                return;
            }
            $category = in_array(body()['category'] ?? '', Books::CATEGORIES, true) ? body()['category'] : 'dongeng';
            $result = StoryMaker::generate(mb_substr($prompt, 0, 1000), $category);
            $slug = Books::create($pdo, $result['book']);
            json(['book' => Books::find($pdo, $slug), 'mode' => $result['mode'], 'note' => $result['note']], 201);
        } elseif (preg_match('#^/books/([a-z0-9-]+)$#', $route, $m)) {
            if ($method === 'GET') {
                $book = Books::find($pdo, $m[1]);
                $book ? json($book) : json(['error' => 'Buku tidak ditemukan.'], 404);
            } elseif ($method === 'DELETE') {
                match (Books::delete($pdo, $m[1])) {
                    'deleted' => json(['ok' => true]),
                    'protected' => json(['error' => 'Buku bawaan tidak bisa dihapus.'], 403),
                    default => json(['error' => 'Buku tidak ditemukan.'], 404),
                };
            } else {
                json(['error' => 'Metode tidak didukung.'], 405);
            }
        } else {
            json(['error' => 'Tidak ditemukan.'], 404);
        }
    } catch (InvalidArgumentException $e) {
        json(['error' => $e->getMessage()], 422);
    } catch (Throwable $e) {
        error_log((string) $e);
        json(['error' => 'Terjadi kesalahan di server.'], 500);
    }
}

/** Menyajikan hasil build React (frontend/dist), dengan fallback ke index.html. */
function serveFrontend(string $path): void
{
    $dist = realpath(defined('HERBOOK_DIST') ? HERBOOK_DIST : __DIR__ . '/../../frontend/dist');
    if ($dist === false) {
        http_response_code(503);
        echo 'Frontend belum dibangun. Jalankan "npm run build" di folder frontend, atau pakai "npm run dev".';
        return;
    }
    $file = realpath($dist . $path);
    if ($file === false || !str_starts_with($file, $dist . DIRECTORY_SEPARATOR) || !is_file($file)) {
        $file = $dist . '/index.html';
    }
    $types = [
        'html' => 'text/html; charset=utf-8', 'js' => 'text/javascript', 'css' => 'text/css',
        'svg' => 'image/svg+xml', 'png' => 'image/png', 'ico' => 'image/x-icon',
        'json' => 'application/json', 'woff2' => 'font/woff2', 'webmanifest' => 'application/manifest+json',
    ];
    header('Content-Type: ' . ($types[pathinfo($file, PATHINFO_EXTENSION)] ?? 'application/octet-stream'));
    // Berkas yang boleh berubah tiap rilis jangan tersimpan lama di cache browser
    if (in_array(basename($file), ['sw.js', 'index.html', 'manifest.webmanifest'], true)) {
        header('Cache-Control: no-cache');
    }
    readfile($file);
}
