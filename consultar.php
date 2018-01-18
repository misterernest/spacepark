<?php 

error_reporting(-1);
ini_set('display_errors', 'On');

if ( isset($_POST['date']) && !empty($_POST['date']) && isset($_POST['dias']) && !empty($_POST['dias']) )  {
	// Datos recibidos
	$fecha = $_POST['date'];
	$dias = $_POST['dias'];
	$categoria = $_POST['categoria'];
	
	//$fechai = date('Y-m-d');
	$nuevafechai = date('Y-m-d', strtotime("$fecha - $dias days"));
	$nuevafechaf = date('Y-m-d', strtotime("$fecha + $dias days"));
	
	// Conexion base de datos
	require_once 'config.php';

	// insert
    $query = "SELECT * FROM area_ocupada WHERE fecha_incial BETWEEN '$nuevafechai' AND '$nuevafechaf' OR fecha_final BETWEEN '$nuevafechai' AND '$nuevafechaf '";
	/*if(!empty($categoria)){
		$query = $query . " AND categoria LIKE '$categoria'";
	}*/
		
    $prepared = $pdo->query($query);
	$resultado = $prepared->fetchAll(PDO::FETCH_ASSOC);
    $prepared = null;
	echo json_encode($resultado);
}
?>