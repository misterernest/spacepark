<?php

//error_reporting(-1);
//ini_set('display_errors', 'On');

if (isset($_POST['x']) && !empty($_POST['x']) && isset($_POST['y']) && !empty($_POST['y']) && isset($_POST['ancho']) && !empty($_POST['ancho']) && isset($_POST['largo']) && !empty($_POST['largo']) && isset($_POST['date1']) && !empty($_POST['date1']) && isset($_POST['date2']) && !empty($_POST['date2']) && isset($_POST['time1']) && !empty($_POST['time1']) && isset($_POST['time2']) && !empty($_POST['time2']) && isset($_POST['categoria']) && !empty($_POST['categoria']))  {
	// Datos recibidos
    $x = $_POST['x'];
	$y = $_POST['y'];
	$ancho = $_POST['ancho'];
	$largo = $_POST['largo'];
	$date1 = $_POST['date1'];
	$date2 = $_POST['date2'];
	$time1 = $_POST['time1'];
	$time2 = $_POST['time2'];
	$categoria = $_POST['categoria'];

	// Conexion base de datos
	require_once 'config.php';

	// insert
    $query = "INSERT INTO `area_ocupada` (`id`, `coordenada_x`, `coordenada_y`, `ancho_x`, `largo_y`, `fecha_incial`, `fecha_final`, `categoria`) VALUES (NULL, '$x', '$y', '$ancho', '$largo', '$date1 $time1', '$date2 $time2', '$categoria');";
    $prepared = $pdo->prepare($query);
    $resultado = $prepared->execute();
    $prepared = null;

	if ($resultado) {
      echo 1;
    }else {
      echo 0;
    }
}
?>
