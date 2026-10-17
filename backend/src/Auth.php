<?php
declare(strict_types=1);

/**
 * Autentikasi pengguna: daftar, masuk, keluar. Sesi disimpan di tabel `sessions`
 * dan dikirim lewat cookie HttpOnly (aman dari JavaScript/XSS).
 */
final class Auth
{
    private const COOKIE = 'herbook_session';
    private const DAYS = 30;

    /** @param array<string,mixed> $in @return array<string,mixed> */
    public static function register(PDO $pdo, array $in): array
    {
        $name = trim((string) ($in['name'] ?? ''));
        $email = mb_strtolower(trim((string) ($in['email'] ?? '')));
        $username = mb_strtolower(trim((string) ($in['username'] ?? '')));
        $password = (string) ($in['password'] ?? '');
        $whatsapp = trim((string) ($in['whatsapp'] ?? ''));

        if (mb_strlen($name) < 2) {
            throw new InvalidArgumentException('Nama minimal 2 huruf.');
        }
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            throw new InvalidArgumentException('Alamat email tidak valid.');
        }
        if (!preg_match('/^[a-z0-9_]{3,30}$/', $username)) {
            throw new InvalidArgumentException('Username 3-30 karakter: huruf kecil, angka, atau garis bawah (_).');
        }
        if (strlen($password) < 6) {
            throw new InvalidArgumentException('Kata sandi minimal 6 karakter.');
        }
        if ($whatsapp !== '' && !preg_match('/^[0-9+][0-9+\- ]{6,19}$/', $whatsapp)) {
            throw new InvalidArgumentException('Nomor WhatsApp tidak valid.');
        }

        $st = $pdo->prepare('SELECT 1 FROM users WHERE email = ? OR username = ?');
        $st->execute([$email, $username]);
        if ($st->fetchColumn()) {
            throw new InvalidArgumentException('Email atau username sudah dipakai.');
        }

        $pdo->prepare('INSERT INTO users (name, email, username, password_hash, whatsapp) VALUES (?,?,?,?,?)')
            ->execute([mb_substr($name, 0, 80), $email, $username, password_hash($password, PASSWORD_DEFAULT), mb_substr($whatsapp, 0, 20)]);

        return self::startSession($pdo, (int) $pdo->lastInsertId());
    }

    /** @param array<string,mixed> $in @return array<string,mixed> */
    public static function login(PDO $pdo, array $in): array
    {
        $identifier = mb_strtolower(trim((string) ($in['identifier'] ?? $in['email'] ?? $in['username'] ?? '')));
        $password = (string) ($in['password'] ?? '');
        if ($identifier === '' || $password === '') {
            throw new InvalidArgumentException('Isi email/username dan kata sandi.');
        }
        $st = $pdo->prepare('SELECT * FROM users WHERE email = ? OR username = ?');
        $st->execute([$identifier, $identifier]);
        $user = $st->fetch();
        if (!$user || !password_verify($password, $user['password_hash'])) {
            throw new InvalidArgumentException('Email/username atau kata sandi salah.');
        }
        return self::startSession($pdo, (int) $user['id']);
    }

    public static function logout(PDO $pdo): void
    {
        $token = (string) ($_COOKIE[self::COOKIE] ?? '');
        if ($token !== '') {
            $pdo->prepare('DELETE FROM sessions WHERE token = ?')->execute([$token]);
        }
        self::clearCookie();
    }

    /** @return array<string,mixed>|null */
    public static function user(PDO $pdo): ?array
    {
        $token = (string) ($_COOKIE[self::COOKIE] ?? '');
        if (!preg_match('/^[a-f0-9]{64}$/', $token)) {
            return null;
        }
        $st = $pdo->prepare(
            'SELECT u.id, u.name, u.email, u.username, u.whatsapp, s.expires_at
             FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.token = ?'
        );
        $st->execute([$token]);
        $row = $st->fetch();
        if (!$row) {
            return null;
        }
        if (strtotime((string) $row['expires_at']) < time()) {
            $pdo->prepare('DELETE FROM sessions WHERE token = ?')->execute([$token]);
            return null;
        }
        return [
            'id' => (int) $row['id'],
            'name' => (string) $row['name'],
            'email' => (string) $row['email'],
            'username' => (string) $row['username'],
            'whatsapp' => (string) $row['whatsapp'],
        ];
    }

    /** @param array<string,mixed> $in @return array<string,mixed> */
    public static function updateProfile(PDO $pdo, int $userId, array $in): array
    {
        $name = trim((string) ($in['name'] ?? ''));
        $whatsapp = trim((string) ($in['whatsapp'] ?? ''));
        if (mb_strlen($name) < 2) {
            throw new InvalidArgumentException('Nama minimal 2 huruf.');
        }
        if ($whatsapp !== '' && !preg_match('/^[0-9+][0-9+\- ]{6,19}$/', $whatsapp)) {
            throw new InvalidArgumentException('Nomor WhatsApp tidak valid.');
        }
        $pdo->prepare('UPDATE users SET name = ?, whatsapp = ? WHERE id = ?')
            ->execute([mb_substr($name, 0, 80), mb_substr($whatsapp, 0, 20), $userId]);
        return self::find($pdo, $userId);
    }

    /** @param array<string,mixed> $in */
    public static function changePassword(PDO $pdo, int $userId, array $in): void
    {
        $current = (string) ($in['current'] ?? '');
        $password = (string) ($in['password'] ?? '');
        if (strlen($password) < 6) {
            throw new InvalidArgumentException('Kata sandi baru minimal 6 karakter.');
        }
        $st = $pdo->prepare('SELECT password_hash FROM users WHERE id = ?');
        $st->execute([$userId]);
        $hash = $st->fetchColumn();
        if (!is_string($hash) || !password_verify($current, $hash)) {
            throw new InvalidArgumentException('Kata sandi saat ini salah.');
        }
        $pdo->prepare('UPDATE users SET password_hash = ? WHERE id = ?')
            ->execute([password_hash($password, PASSWORD_DEFAULT), $userId]);
    }

    /** @return array<string,mixed> */
    private static function find(PDO $pdo, int $userId): array
    {
        $st = $pdo->prepare('SELECT id, name, email, username, whatsapp FROM users WHERE id = ?');
        $st->execute([$userId]);
        $row = $st->fetch();
        return [
            'id' => (int) $row['id'],
            'name' => (string) $row['name'],
            'email' => (string) $row['email'],
            'username' => (string) $row['username'],
            'whatsapp' => (string) $row['whatsapp'],
        ];
    }

    /** @return array<string,mixed> */
    private static function startSession(PDO $pdo, int $userId): array
    {
        $token = bin2hex(random_bytes(32));
        $expires = time() + self::DAYS * 86400;
        $pdo->prepare('INSERT INTO sessions (token, user_id, expires_at) VALUES (?,?,?)')
            ->execute([$token, $userId, gmdate('Y-m-d H:i:s', $expires)]);
        self::setCookie($token, $expires);

        $st = $pdo->prepare('SELECT id, name, email, username, whatsapp FROM users WHERE id = ?');
        $st->execute([$userId]);
        $row = $st->fetch();
        return [
            'id' => (int) $row['id'],
            'name' => (string) $row['name'],
            'email' => (string) $row['email'],
            'username' => (string) $row['username'],
            'whatsapp' => (string) $row['whatsapp'],
        ];
    }

    private static function setCookie(string $token, int $expires): void
    {
        setcookie(self::COOKIE, $token, [
            'expires' => $expires,
            'path' => '/',
            'httponly' => true,
            'samesite' => 'Lax',
            'secure' => self::isSecure(),
        ]);
    }

    private static function clearCookie(): void
    {
        setcookie(self::COOKIE, '', [
            'expires' => time() - 3600,
            'path' => '/',
            'httponly' => true,
            'samesite' => 'Lax',
            'secure' => self::isSecure(),
        ]);
    }

    private static function isSecure(): bool
    {
        return (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
            || (($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https');
    }
}
