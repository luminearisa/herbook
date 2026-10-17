<?php
// Pintu masuk di folder web (public_html/herbook). Kode aplikasi dan database
// berada di luar folder web, di ../herbook-app.
define('HERBOOK_ROOT', dirname(__DIR__, 2) . '/herbook-app');
define('HERBOOK_DIST', __DIR__);
require HERBOOK_ROOT . '/public/index.php';
