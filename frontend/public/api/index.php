<?php
/**
 * Dhrishta Health Care Services — self-contained PHP API for shared hosting.
 *
 * Mirrors the FastAPI backend's routes and response shapes (see backend/)
 * so the same React frontend and admin portal work unchanged on Hostinger:
 * data lives in an SQLite file on the host's storage (api/data/, web-denied).
 *
 * Endpoints: auth (login/me/logout/change-password), public bookings +
 * service-area/availability checks, contact/callback/emergency inquiries,
 * testimonials, gallery; admin analytics, bookings, contacts, testimonials,
 * staff, patients, gallery. AI chat / payments / SMS are not available on
 * shared hosting and respond 503 (the frontend degrades gracefully).
 */

declare(strict_types=1);

const DATA_DIR = __DIR__ . '/data';
const DB_PATH = DATA_DIR . '/dhrishta.sqlite';
const SECRET_PATH = DATA_DIR . '/secret.key';
const TOKEN_TTL_SECONDS = 86400; // 24h, matches JWT_EXPIRES_MINUTES=1440
const COMPANY_PHONE = '+91 9959388374';
const SERVICE_AREA = 'Chittoor, Andhra Pradesh';
const SERVED_PINCODES = [
    '517001','517002','517004','517101','517102','517127','517128','517129',
    '517131','517132','517167','517213','517214','517247','517257','517325',
    '517326','517415','517416','517417','517418','517419','517501','517502',
    '517503','517505','517507','517520','517561','517583','517584','517587',
    '517588','517589','517590','517599',
];
const PACKAGE_PRICES = ['hourly' => 249, 'daily' => 1199, 'weekly' => 7499, 'monthly' => 24999];
const PORTAL_ROLES = ['admin', 'staff'];

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

set_exception_handler(function (Throwable $e): void {
    http_response_code(500);
    error_log('API error: ' . $e->getMessage());
    echo json_encode(['detail' => 'Internal server error.']);
    exit;
});

/* ── Storage ─────────────────────────────────────────────────────────── */

function db(): PDO
{
    static $pdo = null;
    if ($pdo !== null) {
        return $pdo;
    }
    if (!is_dir(DATA_DIR)) {
        mkdir(DATA_DIR, 0755, true);
    }
    // Belt & braces: deny web access to the data dir even if the shipped
    // .htaccess was lost during upload.
    $guard = DATA_DIR . '/.htaccess';
    if (!file_exists($guard)) {
        file_put_contents($guard, "Require all denied\n");
    }
    $pdo = new PDO('sqlite:' . DB_PATH);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->exec('PRAGMA journal_mode = WAL');
    $pdo->exec('PRAGMA busy_timeout = 5000');
    bootstrap($pdo);
    return $pdo;
}

function bootstrap(PDO $pdo): void
{
    $pdo->exec(<<<'SQL'
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY, email TEXT UNIQUE NOT NULL, password TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin', name TEXT, phone TEXT,
  is_active INTEGER NOT NULL DEFAULT 1, created_at TEXT, last_login TEXT
);
CREATE TABLE IF NOT EXISTS bookings (
  id TEXT PRIMARY KEY, booking_id TEXT, doc TEXT NOT NULL,
  service_type TEXT, status TEXT NOT NULL DEFAULT 'pending',
  payment_amount REAL, payment_advance REAL, assigned_staff_id TEXT,
  created_at TEXT, updated_at TEXT
);
CREATE TABLE IF NOT EXISTS contacts (
  id TEXT PRIMARY KEY, doc TEXT NOT NULL, kind TEXT, status TEXT DEFAULT 'new', created_at TEXT
);
CREATE TABLE IF NOT EXISTS testimonials (
  id TEXT PRIMARY KEY, doc TEXT NOT NULL, status TEXT DEFAULT 'pending',
  is_featured INTEGER DEFAULT 0, is_verified INTEGER DEFAULT 0, created_at TEXT
);
CREATE TABLE IF NOT EXISTS staff (
  id TEXT PRIMARY KEY, doc TEXT NOT NULL, is_active INTEGER DEFAULT 1,
  availability_status TEXT DEFAULT 'available', created_at TEXT
);
CREATE TABLE IF NOT EXISTS patients (
  id TEXT PRIMARY KEY, doc TEXT NOT NULL, created_at TEXT
);
CREATE TABLE IF NOT EXISTS gallery (
  id TEXT PRIMARY KEY, doc TEXT NOT NULL, created_at TEXT
);
CREATE TABLE IF NOT EXISTS rate_hits (ip TEXT, bucket TEXT, ts REAL);
CREATE INDEX IF NOT EXISTS idx_rate ON rate_hits (ip, bucket, ts);
SQL);

    $count = (int) $pdo->query('SELECT COUNT(*) FROM users')->fetchColumn();
    if ($count === 0) {
        $stmt = $pdo->prepare(
            'INSERT INTO users (id, email, password, role, name, phone, is_active, created_at)
             VALUES (?, ?, ?, ?, ?, ?, 1, ?)'
        );
        $stmt->execute([
            new_id(), 'admin@dhrishta.com', password_hash('ChangeMe@123', PASSWORD_BCRYPT),
            'admin', 'Dhrishta Admin', '', now(),
        ]);
    }
}

function secret(): string
{
    if (!file_exists(SECRET_PATH)) {
        if (!is_dir(DATA_DIR)) {
            mkdir(DATA_DIR, 0755, true);
        }
        file_put_contents(SECRET_PATH, bin2hex(random_bytes(48)));
        @chmod(SECRET_PATH, 0600);
    }
    return trim((string) file_get_contents(SECRET_PATH));
}

/* ── Helpers ─────────────────────────────────────────────────────────── */

function now(): string
{
    return gmdate('Y-m-d\TH:i:s\Z');
}

function new_id(): string
{
    return bin2hex(random_bytes(12)); // 24 hex chars, ObjectId-shaped
}

function respond(mixed $data, int $code = 200): never
{
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function fail(string $detail, int $code): never
{
    respond(['detail' => $detail], $code);
}

function body(): array
{
    $raw = file_get_contents('php://input');
    $data = json_decode($raw === false ? '' : $raw, true);
    return is_array($data) ? $data : [];
}

function client_ip(): string
{
    return $_SERVER['REMOTE_ADDR'] ?? 'unknown';
}

function rate_limit(string $bucket, int $limit, int $windowSeconds = 60): void
{
    $pdo = db();
    $ip = client_ip();
    $now = microtime(true);
    $pdo->prepare('DELETE FROM rate_hits WHERE ts < ?')->execute([$now - $windowSeconds]);
    $stmt = $pdo->prepare('SELECT COUNT(*) FROM rate_hits WHERE ip = ? AND bucket = ?');
    $stmt->execute([$ip, $bucket]);
    if ((int) $stmt->fetchColumn() >= $limit) {
        header('Retry-After: ' . $windowSeconds);
        fail('Too many requests. Please try again in a minute.', 429);
    }
    $pdo->prepare('INSERT INTO rate_hits (ip, bucket, ts) VALUES (?, ?, ?)')->execute([$ip, $bucket, $now]);
}

function b64url(string $bin): string
{
    return rtrim(strtr(base64_encode($bin), '+/', '-_'), '=');
}

function jwt_issue(string $userId, string $role): string
{
    $header = b64url(json_encode(['alg' => 'HS256', 'typ' => 'JWT']));
    $payload = b64url(json_encode([
        'sub' => $userId, 'role' => $role, 'iat' => time(), 'exp' => time() + TOKEN_TTL_SECONDS,
    ]));
    $sig = b64url(hash_hmac('sha256', "$header.$payload", secret(), true));
    return "$header.$payload.$sig";
}

function jwt_verify(string $token): ?array
{
    $parts = explode('.', $token);
    if (count($parts) !== 3) {
        return null;
    }
    [$header, $payload, $sig] = $parts;
    $expected = b64url(hash_hmac('sha256', "$header.$payload", secret(), true));
    if (!hash_equals($expected, $sig)) {
        return null;
    }
    $claims = json_decode(base64_decode(strtr($payload, '-_', '+/')), true);
    if (!is_array($claims) || ($claims['exp'] ?? 0) < time()) {
        return null;
    }
    return $claims;
}

function current_user(): ?array
{
    $auth = $_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '';
    if (!preg_match('/^Bearer\s+(.+)$/i', $auth, $m)) {
        return null;
    }
    $claims = jwt_verify(trim($m[1]));
    if ($claims === null) {
        return null;
    }
    $stmt = db()->prepare('SELECT * FROM users WHERE id = ?');
    $stmt->execute([$claims['sub']]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$user || !(int) $user['is_active']) {
        return null;
    }
    unset($user['password']);
    $user['is_active'] = (bool) $user['is_active'];
    return $user;
}

function require_portal_user(): array
{
    $user = current_user();
    if ($user === null) {
        header('WWW-Authenticate: Bearer');
        fail('Invalid or expired authentication credentials.', 401);
    }
    if (!in_array($user['role'], PORTAL_ROLES, true)) {
        fail('This account does not have portal access.', 403);
    }
    return $user;
}

/** Row (doc JSON + columns) → API document. */
function unwrap(array $row, array $extraColumns = []): array
{
    $doc = json_decode($row['doc'] ?? '{}', true) ?: [];
    $doc['id'] = $row['id'];
    foreach ($extraColumns as $col) {
        if (array_key_exists($col, $row) && $row[$col] !== null) {
            $doc[$col] = is_numeric($row[$col]) && in_array($col, ['is_featured', 'is_verified', 'is_active'], true)
                ? (bool) $row[$col]
                : $row[$col];
        }
    }
    if (isset($row['created_at'])) {
        $doc['created_at'] = $row['created_at'];
    }
    return $doc;
}

function fetch_or_404(string $table, string $id, string $label): array
{
    $stmt = db()->prepare("SELECT * FROM {$table} WHERE id = ?");
    $stmt->execute([$id]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$row) {
        fail("$label not found.", 404);
    }
    return $row;
}

function save_doc(string $table, string $id, array $doc): void
{
    $stmt = db()->prepare("UPDATE {$table} SET doc = ? WHERE id = ?");
    $stmt->execute([json_encode($doc, JSON_UNESCAPED_UNICODE), $id]);
}

/* ── Routing ─────────────────────────────────────────────────────────── */

$method = $_SERVER['REQUEST_METHOD'];
$uri = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?? '/';
$path = preg_replace('#^.*?/api#', '', $uri) ?: '/';
$path = '/' . trim($path, '/');

if ($method === 'POST') {
    rate_limit($path === '/auth/login' ? 'auth' : 'post', $path === '/auth/login' ? 5 : 30);
}

/* ---- Health ---- */
if ($path === '/health') {
    respond(['status' => 'ok', 'engine' => 'php-sqlite', 'time' => now()]);
}

/* ---- Auth ---- */
if ($path === '/auth/login' && $method === 'POST') {
    $in = body();
    $email = strtolower(trim((string) ($in['email'] ?? '')));
    $password = (string) ($in['password'] ?? '');
    $stmt = db()->prepare('SELECT * FROM users WHERE email = ?');
    $stmt->execute([$email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$user || !password_verify($password, $user['password'])) {
        fail('Invalid email or password.', 401);
    }
    if (!(int) $user['is_active']) {
        fail('This account has been deactivated.', 403);
    }
    db()->prepare('UPDATE users SET last_login = ? WHERE id = ?')->execute([now(), $user['id']]);
    unset($user['password']);
    $user['is_active'] = true;
    respond([
        'access_token' => jwt_issue($user['id'], $user['role']),
        'token_type' => 'bearer',
        'expires_in' => TOKEN_TTL_SECONDS,
        'user' => $user,
    ]);
}

if ($path === '/auth/logout' && $method === 'POST') {
    respond(['message' => 'Logged out. Please discard your access token.']);
}

if ($path === '/auth/me' && $method === 'GET') {
    respond(require_portal_user());
}

if ($path === '/auth/change-password' && $method === 'POST') {
    $user = require_portal_user();
    $in = body();
    $current = (string) ($in['current_password'] ?? '');
    $new = (string) ($in['new_password'] ?? '');
    if (strlen($new) < 8) {
        fail('New password must be at least 8 characters.', 400);
    }
    $stmt = db()->prepare('SELECT password FROM users WHERE id = ?');
    $stmt->execute([$user['id']]);
    if (!password_verify($current, (string) $stmt->fetchColumn())) {
        fail('Current password is incorrect.', 401);
    }
    db()->prepare('UPDATE users SET password = ? WHERE id = ?')
        ->execute([password_hash($new, PASSWORD_BCRYPT), $user['id']]);
    respond(['message' => 'Password updated. Please sign in again with the new password.']);
}

/* ---- Public: bookings ---- */
if ($path === '/bookings' && $method === 'POST') {
    $in = body();
    $pincode = (string) ($in['contact_info']['pincode'] ?? '');
    foreach (['service_type', 'package_type', 'patient_info', 'contact_info', 'schedule'] as $required) {
        if (empty($in[$required])) {
            fail("Missing required field: $required.", 422);
        }
    }
    if (!in_array($pincode, SERVED_PINCODES, true)) {
        fail(
            "Sorry, pincode $pincode is outside our current service area (" . SERVICE_AREA . '). '
            . 'Please call ' . COMPANY_PHONE . ' to discuss options.',
            400
        );
    }
    $seq = (int) db()->query(
        "SELECT COUNT(*) FROM bookings WHERE created_at LIKE '" . gmdate('Y-m-d') . "%'"
    )->fetchColumn() + 1;
    $bookingId = 'DH' . gmdate('ymd') . str_pad((string) $seq, 3, '0', STR_PAD_LEFT);
    $estimated = PACKAGE_PRICES[$in['package_type'] ?? ''] ?? null;
    $id = new_id();
    $doc = $in + [
        'booking_id' => $bookingId,
        'status' => 'pending',
        'assigned_staff_id' => null,
        'payment' => ['amount' => $estimated, 'advance_paid' => 0, 'status' => 'unpaid'],
    ];
    db()->prepare(
        'INSERT INTO bookings (id, booking_id, doc, service_type, status, payment_amount, payment_advance, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, 0, ?, ?)'
    )->execute([
        $id, $bookingId, json_encode($doc, JSON_UNESCAPED_UNICODE),
        (string) $in['service_type'], 'pending', $estimated, now(), now(),
    ]);
    respond([
        'booking_id' => $bookingId,
        'status' => 'pending',
        'message' => 'Booking received! Our care coordinator will call you shortly to confirm.',
        'estimated_cost' => $estimated,
    ], 201);
}

if ($path === '/bookings/check-availability' && $method === 'GET') {
    $available = (int) db()->query(
        "SELECT COUNT(*) FROM staff WHERE is_active = 1 AND availability_status = 'available'"
    )->fetchColumn();
    $total = (int) db()->query('SELECT COUNT(*) FROM staff WHERE is_active = 1')->fetchColumn();
    respond([
        'date' => $_GET['date'] ?? null,
        'service_type' => $_GET['service_type'] ?? null,
        'available' => $total === 0 ? true : $available > 0,
        'available_staff' => $available,
        'message' => $total === 0 || $available > 0
            ? 'Caregivers are available — book with confidence.'
            : 'All caregivers are currently assigned — call ' . COMPANY_PHONE . ' for priority scheduling.',
    ]);
}

if ($path === '/bookings/check-service-area' && $method === 'POST') {
    $pincode = (string) (body()['pincode'] ?? '');
    $served = in_array($pincode, SERVED_PINCODES, true);
    respond([
        'pincode' => $pincode,
        'served' => $served,
        'message' => $served
            ? "Great news — we serve pincode $pincode."
            : "Pincode $pincode is outside our current service area (" . SERVICE_AREA . '). Call '
              . COMPANY_PHONE . ' to discuss options.',
    ]);
}

/* ---- Public: inquiries ---- */
$inquiryKinds = ['/contact' => 'inquiry', '/contact/callback' => 'callback', '/emergency' => 'emergency'];
if (isset($inquiryKinds[$path]) && $method === 'POST') {
    $in = body();
    if (empty($in['name']) || empty($in['phone'])) {
        fail('Name and phone are required.', 422);
    }
    $kind = $inquiryKinds[$path];
    if ($kind === 'callback') {
        $in['message'] = 'Callback requested (' . ($in['preferred_contact_time'] ?? 'any time') . ').';
    }
    if ($kind === 'emergency' && empty($in['message'])) {
        $in['message'] = 'EMERGENCY assistance requested.';
    }
    $id = new_id();
    $doc = $in + ['kind' => $kind, 'status' => 'new', 'notes' => null];
    db()->prepare('INSERT INTO contacts (id, doc, kind, status, created_at) VALUES (?, ?, ?, ?, ?)')
        ->execute([$id, json_encode($doc, JSON_UNESCAPED_UNICODE), $kind, 'new', now()]);
    $responses = [
        'inquiry' => ['id' => $id, 'message' => 'Thank you for reaching out. Our team will get back to you shortly.'],
        'callback' => ['id' => $id, 'message' => 'Callback requested. We will call you soon.'],
        'emergency' => [
            'id' => $id,
            'message' => 'Emergency request logged. For immediate help call ' . COMPANY_PHONE
                . ' now — our team responds 24/7.',
            'phone' => COMPANY_PHONE,
        ],
    ];
    respond($responses[$kind], 201);
}

/* ---- Public: testimonials & gallery ---- */
if ($path === '/testimonials' && $method === 'GET') {
    $rows = db()->query("SELECT * FROM testimonials WHERE status = 'approved' ORDER BY created_at DESC LIMIT 200")
        ->fetchAll(PDO::FETCH_ASSOC);
    respond(array_map(fn ($r) => unwrap($r, ['status', 'is_featured', 'is_verified']), $rows));
}

if ($path === '/testimonials/featured' && $method === 'GET') {
    $rows = db()->query(
        "SELECT * FROM testimonials WHERE status = 'approved' AND is_featured = 1 ORDER BY created_at DESC LIMIT 50"
    )->fetchAll(PDO::FETCH_ASSOC);
    respond(array_map(fn ($r) => unwrap($r, ['status', 'is_featured', 'is_verified']), $rows));
}

if ($path === '/testimonials' && $method === 'POST') {
    $in = body();
    if (empty($in['review']) && empty($in['text'])) {
        fail('Review text is required.', 422);
    }
    $id = new_id();
    $doc = $in + ['is_verified' => false, 'is_featured' => false, 'status' => 'pending'];
    db()->prepare('INSERT INTO testimonials (id, doc, status, created_at) VALUES (?, ?, ?, ?)')
        ->execute([$id, json_encode($doc, JSON_UNESCAPED_UNICODE), 'pending', now()]);
    respond(['id' => $id, 'message' => 'Thank you! Your review is awaiting approval.'], 201);
}

if (preg_match('#^/gallery(?:/([\w-]+))?$#', $path, $m) && $method === 'GET') {
    if (($m[1] ?? '') === '') {
        $rows = db()->query('SELECT * FROM gallery ORDER BY created_at DESC LIMIT 500')->fetchAll(PDO::FETCH_ASSOC);
    } else {
        $stmt = db()->prepare("SELECT * FROM gallery WHERE json_extract(doc, '$.category') = ? ORDER BY created_at DESC LIMIT 500");
        $stmt->execute([$m[1]]);
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    respond(array_map(fn ($r) => unwrap($r), $rows));
}

/* ---- Admin ---- */
if (str_starts_with($path, '/admin/')) {
    require_portal_user();

    /* Analytics */
    if ($path === '/admin/analytics/dashboard' && $method === 'GET') {
        $pdo = db();
        $count = fn (string $sql) => (int) $pdo->query($sql)->fetchColumn();
        $monthStart = gmdate('Y-m-01');
        respond([
            'bookings' => [
                'total' => $count('SELECT COUNT(*) FROM bookings'),
                'pending' => $count("SELECT COUNT(*) FROM bookings WHERE status = 'pending'"),
                'confirmed' => $count("SELECT COUNT(*) FROM bookings WHERE status = 'confirmed'"),
                'in_progress' => $count("SELECT COUNT(*) FROM bookings WHERE status = 'in_progress'"),
                'completed' => $count("SELECT COUNT(*) FROM bookings WHERE status = 'completed'"),
                'this_month' => $count("SELECT COUNT(*) FROM bookings WHERE created_at >= '$monthStart'"),
            ],
            'revenue' => [
                'booked_value' => (float) $pdo->query(
                    "SELECT COALESCE(SUM(payment_amount), 0) FROM bookings WHERE status != 'cancelled'"
                )->fetchColumn(),
                'collected' => (float) $pdo->query(
                    "SELECT COALESCE(SUM(payment_advance), 0) FROM bookings WHERE status != 'cancelled'"
                )->fetchColumn(),
            ],
            'staff' => [
                'total' => $count('SELECT COUNT(*) FROM staff WHERE is_active = 1'),
                'available' => $count(
                    "SELECT COUNT(*) FROM staff WHERE is_active = 1 AND availability_status = 'available'"
                ),
            ],
            'patients' => $count('SELECT COUNT(*) FROM patients'),
            'contacts_new' => $count("SELECT COUNT(*) FROM contacts WHERE status = 'new'"),
            'testimonials_pending' => $count("SELECT COUNT(*) FROM testimonials WHERE status = 'pending'"),
        ]);
    }

    if ($path === '/admin/analytics/bookings' && $method === 'GET') {
        $days = max(1, min(365, (int) ($_GET['days'] ?? 30)));
        $since = gmdate('Y-m-d', time() - $days * 86400);
        $rows = db()->query(
            "SELECT substr(created_at, 1, 10) AS day, status, COUNT(*) AS count
             FROM bookings WHERE created_at >= '$since' GROUP BY day, status ORDER BY day"
        )->fetchAll(PDO::FETCH_ASSOC);
        $trend = [];
        foreach ($rows as $row) {
            $day = $row['day'];
            $trend[$day] ??= ['date' => $day, 'total' => 0];
            $trend[$day][$row['status']] = (int) $row['count'];
            $trend[$day]['total'] += (int) $row['count'];
        }
        ksort($trend);
        respond(['days' => $days, 'trend' => array_values($trend)]);
    }

    if ($path === '/admin/analytics/revenue' && $method === 'GET') {
        $months = max(1, min(24, (int) ($_GET['months'] ?? 6)));
        $since = gmdate('Y-m-d', time() - $months * 31 * 86400);
        $rows = db()->query(
            "SELECT substr(created_at, 1, 7) AS month, COUNT(*) AS bookings,
                    COALESCE(SUM(payment_amount), 0) AS booked_value,
                    COALESCE(SUM(payment_advance), 0) AS collected
             FROM bookings WHERE created_at >= '$since' AND status != 'cancelled'
             GROUP BY month ORDER BY month"
        )->fetchAll(PDO::FETCH_ASSOC);
        respond(['months' => $months, 'report' => array_map(fn ($r) => [
            'month' => $r['month'],
            'bookings' => (int) $r['bookings'],
            'booked_value' => (float) $r['booked_value'],
            'collected' => (float) $r['collected'],
        ], $rows)]);
    }

    if ($path === '/admin/analytics/services' && $method === 'GET') {
        $rows = db()->query(
            "SELECT service_type, COUNT(*) AS bookings, COALESCE(SUM(payment_amount), 0) AS booked_value
             FROM bookings WHERE status != 'cancelled' GROUP BY service_type ORDER BY bookings DESC"
        )->fetchAll(PDO::FETCH_ASSOC);
        respond(['services' => array_map(fn ($r) => [
            'service_type' => $r['service_type'],
            'bookings' => (int) $r['bookings'],
            'booked_value' => (float) $r['booked_value'],
        ], $rows)]);
    }

    /* Bookings */
    if ($path === '/admin/bookings' && $method === 'GET') {
        $status = $_GET['status'] ?? null;
        $skip = max(0, (int) ($_GET['skip'] ?? 0));
        $limit = max(1, min(200, (int) ($_GET['limit'] ?? 50)));
        $where = $status ? 'WHERE status = :status' : '';
        $stmt = db()->prepare("SELECT COUNT(*) FROM bookings $where");
        $stmt->execute($status ? ['status' => $status] : []);
        $total = (int) $stmt->fetchColumn();
        $stmt = db()->prepare(
            "SELECT * FROM bookings $where ORDER BY created_at DESC LIMIT :limit OFFSET :skip"
        );
        if ($status) {
            $stmt->bindValue('status', $status);
        }
        $stmt->bindValue('limit', $limit, PDO::PARAM_INT);
        $stmt->bindValue('skip', $skip, PDO::PARAM_INT);
        $stmt->execute();
        respond([
            'total' => $total,
            'items' => array_map(
                fn ($r) => unwrap($r, ['booking_id', 'status', 'assigned_staff_id']),
                $stmt->fetchAll(PDO::FETCH_ASSOC)
            ),
        ]);
    }

    if (preg_match('#^/admin/bookings/([0-9a-f]{24})$#', $path, $m)) {
        $row = fetch_or_404('bookings', $m[1], 'Booking');
        if ($method === 'GET') {
            respond(unwrap($row, ['booking_id', 'status', 'assigned_staff_id']));
        }
        if ($method === 'PUT') {
            $doc = json_decode($row['doc'], true) ?: [];
            $updates = array_filter(body(), fn ($v) => $v !== null);
            $doc = array_replace($doc, $updates);
            save_doc('bookings', $row['id'], $doc);
            $stmt = db()->prepare(
                'UPDATE bookings SET status = ?, assigned_staff_id = ?, payment_amount = ?, payment_advance = ?, updated_at = ? WHERE id = ?'
            );
            $stmt->execute([
                $doc['status'] ?? $row['status'],
                $doc['assigned_staff_id'] ?? $row['assigned_staff_id'],
                $doc['payment']['amount'] ?? $row['payment_amount'],
                $doc['payment']['advance_paid'] ?? $row['payment_advance'],
                now(), $row['id'],
            ]);
            respond(unwrap(fetch_or_404('bookings', $row['id'], 'Booking'), ['booking_id', 'status', 'assigned_staff_id']));
        }
        if ($method === 'DELETE') {
            db()->prepare("UPDATE bookings SET status = 'cancelled', updated_at = ? WHERE id = ?")
                ->execute([now(), $row['id']]);
            respond(['message' => 'Booking ' . ($row['booking_id'] ?: $row['id']) . ' cancelled.']);
        }
    }

    if (preg_match('#^/admin/bookings/([0-9a-f]{24})/assign-staff$#', $path, $m) && $method === 'POST') {
        $row = fetch_or_404('bookings', $m[1], 'Booking');
        $staffId = (string) (body()['staff_id'] ?? '');
        fetch_or_404('staff', $staffId, 'Staff member');
        $doc = json_decode($row['doc'], true) ?: [];
        $doc['assigned_staff_id'] = $staffId;
        if (($doc['status'] ?? '') === 'pending') {
            $doc['status'] = 'confirmed';
        }
        save_doc('bookings', $row['id'], $doc);
        db()->prepare('UPDATE bookings SET assigned_staff_id = ?, status = ?, updated_at = ? WHERE id = ?')
            ->execute([$staffId, $doc['status'], now(), $row['id']]);
        respond(unwrap(fetch_or_404('bookings', $row['id'], 'Booking'), ['booking_id', 'status', 'assigned_staff_id']));
    }

    /* Contacts */
    if ($path === '/admin/contacts' && $method === 'GET') {
        $status = $_GET['status'] ?? null;
        $where = $status ? "WHERE status = :status" : '';
        $stmt = db()->prepare("SELECT COUNT(*) FROM contacts $where");
        $stmt->execute($status ? ['status' => $status] : []);
        $total = (int) $stmt->fetchColumn();
        $stmt = db()->prepare("SELECT * FROM contacts $where ORDER BY created_at DESC LIMIT 200");
        $stmt->execute($status ? ['status' => $status] : []);
        respond([
            'total' => $total,
            'items' => array_map(fn ($r) => unwrap($r, ['kind', 'status']), $stmt->fetchAll(PDO::FETCH_ASSOC)),
        ]);
    }

    if (preg_match('#^/admin/contacts/([0-9a-f]{24})$#', $path, $m) && $method === 'PUT') {
        $row = fetch_or_404('contacts', $m[1], 'Inquiry');
        $doc = array_replace(json_decode($row['doc'], true) ?: [], array_filter(body(), fn ($v) => $v !== null));
        save_doc('contacts', $row['id'], $doc);
        db()->prepare('UPDATE contacts SET status = ? WHERE id = ?')
            ->execute([$doc['status'] ?? $row['status'], $row['id']]);
        respond(unwrap(fetch_or_404('contacts', $row['id'], 'Inquiry'), ['kind', 'status']));
    }

    /* Testimonials */
    if ($path === '/admin/testimonials' && $method === 'GET') {
        $rows = db()->query('SELECT * FROM testimonials ORDER BY created_at DESC LIMIT 500')->fetchAll(PDO::FETCH_ASSOC);
        respond(array_map(fn ($r) => unwrap($r, ['status', 'is_featured', 'is_verified']), $rows));
    }

    if ($path === '/admin/testimonials' && $method === 'POST') {
        $in = body();
        $id = new_id();
        $doc = $in + ['is_verified' => true, 'is_featured' => false, 'status' => 'approved'];
        db()->prepare('INSERT INTO testimonials (id, doc, status, is_verified, created_at) VALUES (?, ?, ?, 1, ?)')
            ->execute([$id, json_encode($doc, JSON_UNESCAPED_UNICODE), 'approved', now()]);
        respond(unwrap(fetch_or_404('testimonials', $id, 'Testimonial'), ['status', 'is_featured', 'is_verified']), 201);
    }

    if (preg_match('#^/admin/testimonials/([0-9a-f]{24})(/approve)?$#', $path, $m)) {
        $row = fetch_or_404('testimonials', $m[1], 'Testimonial');
        if (($m[2] ?? '') === '/approve' && $method === 'PUT') {
            db()->prepare("UPDATE testimonials SET status = 'approved', is_verified = 1 WHERE id = ?")
                ->execute([$row['id']]);
            respond(unwrap(fetch_or_404('testimonials', $row['id'], 'Testimonial'), ['status', 'is_featured', 'is_verified']));
        }
        if ($method === 'PUT') {
            $updates = array_filter(body(), fn ($v) => $v !== null);
            $doc = array_replace(json_decode($row['doc'], true) ?: [], $updates);
            save_doc('testimonials', $row['id'], $doc);
            db()->prepare('UPDATE testimonials SET status = ?, is_featured = ?, is_verified = ? WHERE id = ?')
                ->execute([
                    $doc['status'] ?? $row['status'],
                    (int) (bool) ($doc['is_featured'] ?? $row['is_featured']),
                    (int) (bool) ($doc['is_verified'] ?? $row['is_verified']),
                    $row['id'],
                ]);
            respond(unwrap(fetch_or_404('testimonials', $row['id'], 'Testimonial'), ['status', 'is_featured', 'is_verified']));
        }
        if ($method === 'DELETE') {
            db()->prepare('DELETE FROM testimonials WHERE id = ?')->execute([$row['id']]);
            respond(['message' => 'Testimonial deleted.']);
        }
    }

    /* Staff */
    if ($path === '/admin/staff' && $method === 'GET') {
        $rows = db()->query('SELECT * FROM staff WHERE is_active = 1 ORDER BY created_at DESC LIMIT 500')
            ->fetchAll(PDO::FETCH_ASSOC);
        respond(array_map(fn ($r) => unwrap($r, ['is_active', 'availability_status']), $rows));
    }

    if ($path === '/admin/staff/available' && $method === 'GET') {
        $rows = db()->query(
            "SELECT * FROM staff WHERE is_active = 1 AND availability_status = 'available' ORDER BY created_at DESC"
        )->fetchAll(PDO::FETCH_ASSOC);
        respond(array_map(fn ($r) => unwrap($r, ['is_active', 'availability_status']), $rows));
    }

    if ($path === '/admin/staff' && $method === 'POST') {
        $in = body();
        if (empty($in['name'])) {
            fail('Staff name is required.', 422);
        }
        $id = new_id();
        $doc = $in + ['is_active' => true, 'availability_status' => $in['availability_status'] ?? 'available'];
        db()->prepare('INSERT INTO staff (id, doc, is_active, availability_status, created_at) VALUES (?, ?, 1, ?, ?)')
            ->execute([$id, json_encode($doc, JSON_UNESCAPED_UNICODE), $doc['availability_status'], now()]);
        respond(unwrap(fetch_or_404('staff', $id, 'Staff member'), ['is_active', 'availability_status']), 201);
    }

    if (preg_match('#^/admin/staff/([0-9a-f]{24})$#', $path, $m)) {
        $row = fetch_or_404('staff', $m[1], 'Staff member');
        if ($method === 'PUT') {
            $doc = array_replace(json_decode($row['doc'], true) ?: [], array_filter(body(), fn ($v) => $v !== null));
            save_doc('staff', $row['id'], $doc);
            db()->prepare('UPDATE staff SET is_active = ?, availability_status = ? WHERE id = ?')->execute([
                (int) (bool) ($doc['is_active'] ?? true),
                $doc['availability_status'] ?? $row['availability_status'],
                $row['id'],
            ]);
            respond(unwrap(fetch_or_404('staff', $row['id'], 'Staff member'), ['is_active', 'availability_status']));
        }
        if ($method === 'DELETE') {
            db()->prepare('UPDATE staff SET is_active = 0 WHERE id = ?')->execute([$row['id']]);
            respond(['message' => 'Staff member deactivated.']);
        }
    }

    /* Patients */
    if ($path === '/admin/patients' && $method === 'GET') {
        $total = (int) db()->query('SELECT COUNT(*) FROM patients')->fetchColumn();
        $rows = db()->query('SELECT * FROM patients ORDER BY created_at DESC LIMIT 200')->fetchAll(PDO::FETCH_ASSOC);
        respond(['total' => $total, 'items' => array_map(fn ($r) => unwrap($r), $rows)]);
    }

    if (preg_match('#^/admin/patients/([0-9a-f]{24})(/notes)?$#', $path, $m)) {
        $row = fetch_or_404('patients', $m[1], 'Patient');
        $doc = json_decode($row['doc'], true) ?: [];
        if (($m[2] ?? '') === '/notes' && $method === 'POST') {
            $note = trim((string) (body()['note'] ?? ''));
            if ($note === '') {
                fail('Note text is required.', 422);
            }
            $doc['care_notes'][] = ['note' => $note, 'created_at' => now()];
            save_doc('patients', $row['id'], $doc);
            respond(unwrap(fetch_or_404('patients', $row['id'], 'Patient')), 201);
        }
        if ($method === 'GET') {
            respond(unwrap($row));
        }
        if ($method === 'PUT') {
            $doc = array_replace($doc, array_filter(body(), fn ($v) => $v !== null));
            save_doc('patients', $row['id'], $doc);
            respond(unwrap(fetch_or_404('patients', $row['id'], 'Patient')));
        }
    }

    /* Gallery */
    if ($path === '/admin/gallery' && $method === 'POST') {
        $in = body();
        if (empty($in['image_url']) && empty($in['src'])) {
            fail('image_url is required.', 422);
        }
        $id = new_id();
        db()->prepare('INSERT INTO gallery (id, doc, created_at) VALUES (?, ?, ?)')
            ->execute([$id, json_encode($in, JSON_UNESCAPED_UNICODE), now()]);
        respond(unwrap(fetch_or_404('gallery', $id, 'Gallery image')), 201);
    }

    if (preg_match('#^/admin/gallery/([0-9a-f]{24})$#', $path, $m)) {
        $row = fetch_or_404('gallery', $m[1], 'Gallery image');
        if ($method === 'PUT') {
            $doc = array_replace(json_decode($row['doc'], true) ?: [], array_filter(body(), fn ($v) => $v !== null));
            save_doc('gallery', $row['id'], $doc);
            respond(unwrap(fetch_or_404('gallery', $row['id'], 'Gallery image')));
        }
        if ($method === 'DELETE') {
            db()->prepare('DELETE FROM gallery WHERE id = ?')->execute([$row['id']]);
            respond(['message' => 'Gallery image deleted.']);
        }
    }

    fail('Not found.', 404);
}

/* Features that need external providers are honest about their absence. */
if (str_starts_with($path, '/chat') || str_starts_with($path, '/payments')
    || str_starts_with($path, '/sms') || str_starts_with($path, '/whatsapp')
    || str_starts_with($path, '/email')) {
    fail('This feature is not available on shared hosting.', 503);
}

fail('Not found.', 404);
