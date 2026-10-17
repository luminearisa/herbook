#!/usr/bin/env bash
# Deploy Her Book ke Hostinger lewat SSH. Jalankan dari root repo:  bash deploy/deploy.sh
# Disarankan memakai kunci SSH (ssh-copy-id -p 65002 user@host), bukan password.
set -euo pipefail

HOST="${HERBOOK_HOST:-u900275524@151.106.114.38}"
PORT="${HERBOOK_PORT:-65002}"
BASE="${HERBOOK_BASE:-domains/syntaf.com}"
APP="$BASE/herbook-app"            # kode + database (di luar folder web)
WEB="$BASE/public_html/herbook"    # folder web subdomain herbook.syntaf.com

SSH="ssh -p $PORT"
cd "$(dirname "$0")/.."

echo "==> Build frontend"
npm --prefix frontend ci
npm --prefix frontend run build

echo "==> Menyiapkan folder di server"
$SSH "$HOST" "mkdir -p $APP/data $WEB && chmod 775 $APP/data"

echo "==> Upload aplikasi PHP"
rsync -az --delete -e "$SSH" backend/src backend/seed backend/public "$HOST:$APP/"

echo "==> Upload frontend dan pintu masuk"
rsync -az --delete -e "$SSH" --exclude index.php --exclude .htaccess frontend/dist/ "$HOST:$WEB/"
rsync -az -e "$SSH" deploy/index.php deploy/.htaccess "$HOST:$WEB/"

echo "==> Selesai. Buka https://herbook.syntaf.com"
echo "    Untuk membuat buku dari prompt, buat $APP/.env di server berisi:"
echo "    ANTHROPIC_API_KEY=sk-..."
