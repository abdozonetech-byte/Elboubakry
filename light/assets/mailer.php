<?php
// Secure contact form handler for the portfolio.
// Configure CONTACT_EMAIL on the server before enabling this file.

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo 'Méthode non autorisée.';
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
$emailInput = trim((string) ($_POST['email'] ?? ''));
$email = $emailInput !== '' ? filter_var($emailInput, FILTER_VALIDATE_EMAIL) : false;
$phone = clean_text($_POST['phone'] ?? '', 40);
$subjectInput = clean_text($_POST['subject'] ?? 'Consultation gratuite', 120);
$message = clean_message($_POST['message'] ?? '', 3000);

if ($name === '' || ($phone === '' && !$email)) {
    http_response_code(400);
    echo 'Ajoutez votre téléphone ou votre email pour que je puisse vous recontacter.';
    exit;
}

$recipient = getenv('CONTACT_EMAIL');
if (!$recipient || !filter_var($recipient, FILTER_VALIDATE_EMAIL)) {
    http_response_code(500);
    echo 'L’adresse de contact n’est pas configurée.';
    exit;
}

$subject = 'Consultation gratuite: ' . $subjectInput;
$emailContent = "Nom: {$name}\n";
if ($email) {
    $emailContent .= "Email: {$email}\n";
}
if ($phone !== '') {
    $emailContent .= "Téléphone: {$phone}\n";
}
$emailContent .= "\nObjectif du projet:\n" . ($message !== '' ? $message : 'Non renseigné') . "\n";

$host = preg_replace('/[^A-Za-z0-9.-]/', '', (string) ($_SERVER['HTTP_HOST'] ?? 'localhost'));
if ($host === '') {
    $host = 'localhost';
}

$headers = array(
    'From: Portfolio Website <no-reply@' . $host . '>',
    'Content-Type: text/plain; charset=UTF-8',
    'X-Mailer: PHP/' . phpversion(),
);

if ($email) {
    $headers[] = 'Reply-To: ' . $email;
}

if (mail($recipient, $subject, $emailContent, implode("\r\n", $headers))) {
    http_response_code(200);
    echo 'Merci. Votre demande de consultation a bien été envoyée.';
} else {
    http_response_code(500);
    echo 'Votre demande n’a pas pu être envoyée.';
}
?>
