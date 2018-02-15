<?php


$dbHost = 'localhost';
$dbName = 'ptw_park';
$dbUser = 'admdbptwpark';
$dbPass = 'Ldgz17^1';

/* $dbHost = 'localhost';
$dbName = 'planner';
$dbUser = 'ptwplanner';
$dbPass = 'ptwpark1298'; */

try {
    $pdo = new PDO("mysql:host=$dbHost;dbname=$dbName", $dbUser, $dbPass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(Exception $e) {
    echo $e->getMessage();
}
