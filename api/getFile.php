<?php
// URL of the .gme file you want to fetch
$url = $_GET['url'];
$valid_url_regex = '/^https:\/\/(cdn\.)?ravensburger\.(cloud|de)\//m';
$allowedOrigins = [
    'http://localhost:3000',
    'https://localhost:4541',
    'https://tiptoi-manager.nico.dev',
];

if (!$url) {
    $contents = 'ERROR: url not specified';
    $status = array('http_code' => 'ERROR');
    exit;
} elseif (!preg_match($valid_url_regex, $url)) {
    $contents = 'ERROR: invalid url';
    $status = array('http_code' => 'ERROR');
    exit;
}

// Define the filename for the downloaded file
$fileName = basename($url);

// Fetch the .gme file from the remote server using curl
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 30);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);
curl_setopt($ch, CURLOPT_USERAGENT, 'tiptoi-manager/1.0');

$fileContents = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($fileContents === false || $httpCode !== 200) {
    // Failed to fetch the file, handle the error
    http_response_code(500);
    die('Failed to fetch the .gme file. HTTP Code: ' . $httpCode);
}
$origin = $_SERVER['HTTP_ORIGIN'];

if (in_array($origin, $allowedOrigins)) {
    header("Access-Control-Allow-Origin: $origin");
    header('Access-Control-Allow-Methods: GET');
    header('Access-Control-Allow-Headers: Content-Type');
}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Set the appropriate HTTP headers to indicate a file download
header('Content-Type: application/octet-stream');
header('Content-Disposition: attachment; filename="' . $fileName . '"');

// Output the file contents
echo $fileContents;
