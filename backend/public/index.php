<?php
declare(strict_types=1);

require __DIR__ . '/../src/Scene.php';
require __DIR__ . '/../src/Db.php';
require __DIR__ . '/../src/Books.php';
require __DIR__ . '/../src/StoryMaker.php';

$path = rtrim(parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/', '/') ?: '/';
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if (str_starts_with($path, '/api')) {
    handleApi($method, substr($path, 4) ?: '/');
    return;
}
serveFrontend($path);

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
        if ($route === '/books' && $method === 'GET') {
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
            $category = (body()['category'] ?? '') === 'islami' ? 'islami' : 'dongeng';
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
    $dist = realpath(__DIR__ . '/../../frontend/dist');
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
        'json' => 'application/json', 'woff2' => 'font/woff2',
    ];
    header('Content-Type: ' . ($types[pathinfo($file, PATHINFO_EXTENSION)] ?? 'application/octet-stream'));
    readfile($file);
}
