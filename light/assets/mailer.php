<?php
// Secure contact form handler for the portfolio.
// Configure CONTACT_EMAIL on the server before enabling this file.

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo 'Method not allowed.';
    exit;
}

function clean_text($value, $maxLength = 500) {
    $value = trim((string) $value);
    $value = str_replace(array("\r", "\n"), ' ', $value);
    $value = strip_tags($value);
    return mb_substr($value, 0, $maxLength, 'UTF-8');
}

function clean_message($value, $maxLength = 3000) {
    $value = trim((string) $value);
    $value = strip_tags($value);
    return mb_substr($value, 0, $maxLength, 'UTF-8');
}

$name = clean_text($_POST['name'] ?? '', 100);
$email = filter_var(trim((string) ($_POST['email'] ?? '')), FILTER_VALIDATE_EMAIL);
$phone = clean_text($_POST['phone'] ?? '', 40);
$subjectInput = clean_text($_POST['subject'] ?? 'Portfolio contact', 120);
$message = clean_message($_POST['message'] ?? '', 3000);

if ($name === '' || !$email || $message === '') {
    http_response_code(400);
    echo 'Please complete the required fields correctly.';
    exit;
}

$recipient = getenv('CONTACT_EMAIL');
if (!$recipient || !filter_var($recipient, FILTER_VALIDATE_EMAIL)) {
    http_response_code(500);
    echo 'Contact email is not configured.';
    exit;
}

$subject = 'Portfolio contact: ' . $subjectInput;
$emailContent = "Name: {$name}\n";
$emailContent .= "Email: {$email}\n";
if ($phone !== '') {
    $emailContent .= "Phone: {$phone}\n";
}
$emailContent .= "\nMessage:\n{$message}\n";

$host = preg_replace('/[^A-Za-z0-9.-]/', '', (string) ($_SERVER['HTTP_HOST'] ?? 'localhost'));
if ($host === '') {
    $host = 'localhost';
}

$headers = array(
    'From: Portfolio Website <no-reply@' . $host . '>',
    'Reply-To: ' . $email,
    'Content-Type: text/plain; charset=UTF-8',
    'X-Mailer: PHP/' . phpversion(),
);

if (mail($recipient, $subject, $emailContent, implode("\r\n", $headers))) {
    http_response_code(200);
    echo 'Thank you. Your message has been sent.';
} else {
    http_response_code(500);
    echo 'Message could not be sent.';
}
?>
