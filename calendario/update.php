<?php

//update.php

include('../config.php');
if (isset($_POST['id']) && !empty($_POST['id']) &&
	isset($_POST['categoria']) && !empty($_POST['categoria']) &&
	isset($_POST['cliente']) && !empty($_POST['cliente']) &&
	isset($_POST['comentario']) && !empty($_POST['comentario']))
{
cache($_POST['id']);

 $query = "
 UPDATE reserva
 SET categoria=:categoria, cliente=:cliente, comentario=:comentario
 WHERE id_reserva=:id
 ";
 $statement = $pdo->prepare($query);
 $statement->execute(
  array(
   ':categoria'  => $_POST['categoria'],
   ':cliente' => $_POST['cliente'],
   ':comentario' => $_POST['comentario'],
   ':id'   => $_POST['id']
  )
 );
	echo ($statement && true);
} else {
	//echo json_encode($_POST);
	echo 0;
}
function cache($id){
	// comienza proceso del cache
	require_once 'Conexion.php';
	$pdo = new Conexion();
	$contraquery= "SELECT * FROM `reserva` WHERE id_reserva=$id;";

	$prepared = $pdo->prepare($contraquery);
	$rslt = $prepared->execute();
	$rslt= $prepared->fetch(\PDO::FETCH_ASSOC);
	//var_dump($rslt);
	
	$x=$rslt['coordenada_x'];
	$y=$rslt['coordenada_y'];
	$ancho=$rslt['ancho_x'];
	$largo=$rslt['largo_y'];
	$fecha_incial=$rslt['fecha_inicial'];
	$fecha_final= $rslt['fecha_final'];
	$categoria=$rslt['categoria'];
	$cliente=$rslt['cliente'];

	$contraquery2 = "UPDATE `reserva` SET
	  coordenada_x= $x, 
	  coordenada_y= $y, 
	  ancho_x= $ancho, 
	  largo_y= $largo, 
	  fecha_incial= $fecha_incial, 
	  fecha_final= $fecha_final, 
	  categoria= $categoria, 
	  cliente= $cliente)";
	 
	$contraquery3= "INSERT INTO `cache`VALUES (NULL, '$contraquery2');";

	$prepared = $pdo->prepare($contraquery3);
	$rslt = $prepared->execute();
	//var_dump($rslt);
}

?>
