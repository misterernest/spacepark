<?php


$dbHost = 'localhost';
$dbName = '';
$dbUser = '';
$dbPass = '';

/* $dbHost = 'localhost';
$dbName = '';
$dbUser = '';
$dbPass = ''; */

try {
    $pdo = new PDO("mysql:host=$dbHost;dbname=$dbName", $dbUser, $dbPass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(Exception $e) {
    echo $e->getMessage();
}
