<?php
// Se actualiza una reserva indicando el id de la anterior reserva y la nueva coordenada y la fecha final.// La reserva actual se le actualiza la fecha final con la enviada// Se crea una nueva reserva con fecha inicial igual a la fecha final ingresada y fecha final como la fecha final original. con las coordenadas enviadas y los datos de la anterior reserva.


ini_set('display_errors', 'On');
error_reporting(-1);

if (isset($_POST['id']) && !empty($_POST['id']) &&
	isset($_POST['x']) && !empty($_POST['x']) &&
	isset($_POST['y']) && !empty($_POST['y']) &&
	isset($_POST['date']) && !empty($_POST['date']))  {
	// Datos recibidos
	$x = $_POST['x'];
	$y = $_POST['y'];
	$id = $_POST['id'];
	$date = $_POST['date'];
	// Conexion base de datos
	require_once 'config.php';	// consultamos la reserva
	$query = "SELECT * FROM area_ocupada WHERE id = $id";
	$prepared = $pdo->query($query);
	$reserva1 = $prepared->fetch(PDO::FETCH_ASSOC);
	$prepared = null;
	$ancho = $reserva1["ancho_x"];
	$largo = $reserva1["largo_y"];
	$fechaI = $reserva1["fecha_incial"];
	$fechaf = $reserva1["fecha_final"];
	$categoria = $reserva1["categoria"];

	$fecha2a = explode(" ", $date);
	$fecha2b = explode("-", $fecha2a[0]);

	$fecha1a = explode(" ", $fechaI);
	$fecha1b = explode("-", $fecha1a[0]);
	$valido = false;
	if ($fecha1b[0] == $fecha2b[0] && $fecha1b[1] == $fecha2b[1] && $fecha1b[2] == $fecha2b[2]) {
		$valido = false;
	}else {
		$valido = true;
	}

	if ($valido) {
		//insert
		$queryi = "INSERT INTO `area_ocupada` (
			`id`,
			`coordenada_x`,
			`coordenada_y`,
			`ancho_x`,
			`largo_y`,
			`fecha_incial`,
			`fecha_final`,
			`categoria`)
			VALUES (
				NULL,
				'$x',
				'$y',
				'$ancho',
				'$largo',
				'$date',
				'$fechaf',
				'$categoria');";
		$prepared = $pdo->prepare($queryi);
		$resulti = $prepared->execute();

		// update anterior reserva
		$queryu = "UPDATE area_ocupada SET fecha_final='$date' WHERE id=$id ";
		$prepared = $pdo->prepare($queryu);
		$resultu = $prepared->execute();
		$prepared = null;

	}else{
		$queryu = "UPDATE area_ocupada SET coordenada_x='$x',coordenada_y='$y' WHERE id=$id ";
		$prepared = $pdo->prepare($queryu);
		$resultu = $prepared->execute();
		$prepared = null;
		$resulti = true;
	}


	//$resultado = array("consulta"=>$reserva1,"insert"=>$resulti,"update"=>$resultu,"queryi"=>$queryi,"queryu"=>$queryu);
	//echo json_encode($resultado);
	echo ($resultu && $resulti);
} else {
	//echo json_encode($_POST);
	echo 0;
}


?>
