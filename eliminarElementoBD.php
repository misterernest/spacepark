<?php
// Se actualiza una reserva indicando el id de la anterior reserva y la nueva coordenada y la fecha final.// La reserva actual se le actualiza la fecha final con la enviada// Se crea una nueva reserva con fecha inicial igual a la fecha final ingresada y fecha final como la fecha final original. con las coordenadas enviadas y los datos de la anterior reserva.


ini_set('display_errors', 'On');
error_reporting(-1);

if (isset($_POST['id']) && !empty($_POST['id']))  {
	// Conexion base de datos
	require_once 'config.php';	// consultamos la reserva
	// Datos recibidos
	$id = $_POST['id'];

	$sql = "DELETE FROM area_ocupada WHERE id ='".$_POST['id']."'";
	$query = $pdo->prepare($sql);
	$resulti = $query->execute([
		'id' => $id
	]);



	//$resultado = array("consulta"=>$reserva1,"insert"=>$resulti,"update"=>$resultu,"queryi"=>$queryi,"queryu"=>$queryu);
	//echo json_encode($resultado);
	echo ($resulti);
} else {
	//echo json_encode($_POST);
	echo 0;
}


?>
