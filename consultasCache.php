<?php 
error_reporting(-1);
ini_set('display_errors', 'On');



	require_once 'config.php';

if ( isset($_POST['consulta']) && !empty($_POST['consulta']) )  {
	//function conteo(){
		$sql="SELECT COUNT(id_cache) FROM cache";
		$prepared = $pdo->prepare($sql);
	    $resultado = $prepared->execute();
	    $resultado= $prepared->fetch(PDO::FETCH_NUM);
	    echo "    entro al if   ";

//echo json_encode($resultado[0]);
//echo $resultado[0];
//return $resultado;
} else {
	//echo json_encode($_POST);
	echo 0;
}

if ( isset($_POST['ejecutar']) && !empty($_POST['ejecutar']) )  {
	
	//function traerContraconsultas(){
		$sql="SELECT consulta FROM cache WHERE id_cache = (SELECT MAX(id_cache) FROM cache)";
		$prepared = $pdo->prepare($sql);
	    $resultado = $prepared->execute();
	    $resultado= $prepared->fetch(PDO::FETCH_ASSOC);
	    

		$prepared = $pdo->prepare($resultado['consulta']);
	    $rst = $prepared->execute();
	    

	    $id=$resultado['id_cache'];
		$sql="DELETE FROM cache WHERE id_cache =$id ";
		$prepared = $pdo->prepare($sql);
	    $rst2 = $prepared->execute();

	   // return $resultado;
	//}
}
?>
