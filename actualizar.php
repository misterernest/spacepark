<?php
// Se actualiza una reserva indicando el id de la anterior reserva y la nueva coordenada y la fecha final.// La reserva actual se le actualiza la fecha final con la enviada// Se crea una nueva reserva con fecha inicial igual a la fecha final ingresada y fecha final como la fecha final original. con las coordenadas enviadas y los datos de la anterior reserva.
/* $_POST['id'] = "1";
$_POST['x'] ="936";
$_POST['y'] = "588";
$_POST['date'] = "2018-2-16 0:00:00";
$_POST['date1'] = "2018-02-12";
$_POST['date2'] = "2018-02-27";
$_POST['time1'] = "14:58:00";
$_POST['time2'] = "14:58:00";
$_POST['categoria'] = "MOTOR_YACHT";
$_POST['cliente'] = "pepepepepeep";
$_POST['date'] = "2018-2-16 0:00:00";
$_POST['ancho'] = "10";
$_POST['largo'] = "10";
$_POST['typeUpdate'] = 1; */

if (isset($_POST['id']) && !empty($_POST['id']) &&
	isset($_POST['x']) && !empty($_POST['x']) &&
	isset($_POST['y']) && !empty($_POST['y']) &&
	isset($_POST['date']) && !empty($_POST['date']) &&
	isset($_POST['date1']) && !empty($_POST['date1']) &&
	isset($_POST['date2']) && !empty($_POST['date2']) &&
	isset($_POST['time1']) && !empty($_POST['time1']) &&
	isset($_POST['time2']) && !empty($_POST['time2']) &&
	isset($_POST['categoria']) && !empty($_POST['categoria']) &&
	isset($_POST['cliente']) && !empty($_POST['cliente']) &&
	isset($_POST['date']) && !empty($_POST['date']) &&
	isset($_POST['ancho']) && !empty($_POST['ancho']) &&
	isset($_POST['largo']) && !empty($_POST['largo']) &&
	isset($_POST['typeUpdate']) && !empty($_POST['typeUpdate'])&&
	isset($_POST['comentario']))  {
	// Datos recibidos
	$xPost = $_POST['x'];
	$yPost = $_POST['y'];
	$anchoPost = $_POST['ancho'];
	$largoPost = $_POST['largo'];
	$date1 = $_POST['date1'];
	$date2 = $_POST['date2'];
	$time1 = $_POST['time1'];
	$time2 = $_POST['time2'];
	$categoriaPost = $_POST['categoria'];
  	$clientePost = $_POST['cliente'];
	$id = $_POST['id'];
	$date = $_POST['date'];
	$tipoActualizacion = $_POST['typeUpdate'];
	$comentario = $_POST['comentario'];
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

	$contraquery2='';

	if ($tipoActualizacion == 1) {
		# code...
		$valido = false;
		if ($fecha1b[0] == $fecha2b[0] && $fecha1b[1] == $fecha2b[1] && $fecha1b[2] == $fecha2b[2]) {
			$valido = false;
		}else {
			$valido = true;
		}

		if ($valido) {
			// comienza proceso del cache
			$this->contraquery2.= "DELETE FROM `area_ocupada` WHERE coordenada_x= '$xPost' AND coordenada_y '$yPost' AND fecha_incial =  'date1";
			// termina proceso cache Insert

			//insert

			$queryi = "INSERT INTO `area_ocupada`
			(
				`id`,
				`coordenada_x`,
				`coordenada_y`,
				`ancho_x`,
				`largo_y`,
				`fecha_incial`,
				`fecha_final`,
				`categoria`,
				`cliente`,
				`comentario`
			) VALUES (
				NULL, '$xPost', '$yPost', '$ancho', '$largo', '$date', '$date2 $time2', '$categoriaPost', '$clientePost', '$comentario')";
			$prepared = $pdo->prepare($queryi);
			$resulti = $prepared->execute();
			$prepared = null;
			//comienza proceso de Update cache
			cache($id);
			//termina proceso de cache

			// update anterior reserva
			$queryu = "UPDATE area_ocupada
				SET fecha_final='$date',
				cliente='$clientePost' ,
				categoria='$categoriaPost',
				comentario='$comentario'
				WHERE id=$id";
				$prepared = $pdo->prepare($queryu);
				$resultu = $prepared->execute();
				$prepared = null;


		}else{
			//comienza proceso de Update cache
			cache($id);
			//termina proceso de cache

			$queryu = "UPDATE area_ocupada
			SET coordenada_x='$xPost',
			coordenada_y='$yPost',
			fecha_final='$date2 $time2',
			cliente='$clientePost',
			categoria='$categoriaPost',
			comentario='$comentario'
			WHERE id=$id";
			$prepared = $pdo->prepare($queryu);
			$resultu = $prepared->execute();
			$prepared = null;
			$resulti = true;
		}
	} else {
		//comienza proceso de Update cache
		cache($id);
		//termina proceso de cache

		$queryu = "UPDATE area_ocupada
		SET fecha_final='$date2 $time2',
		fecha_incial = '$date1 $time1',
		cliente='$clientePost' ,
		categoria='$categoriaPost',
		comentario='$comentario'
		WHERE id=$id ";
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
function cache($id){
	// comienza proceso del cache
	require_once 'config.php';
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

	$this->contraquery2 = "UPDATE `reserva` SET
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
