<?php 
echo "    llego al cache   ";
	require_once 'config.php';

if ( isset($_POST['consulta']) && !empty($_POST['consulta']) )  {
	//function conteo(){
		$sql="SELECT COUNT(id_cache) FROM cache;"
		$prepared = $pdo->prepare($sql);
	    $resultado = $prepared->execute();
	    return $resultado;
	    echo json_encode($resultado);
	}
}
if ( isset($_POST['ejecutar']) && !empty($_POST['ejecutar']) )  {
	
	//function traerContraconsultas(){
		$sql="SELECT consulta FROM cache WHERE id_cache = (SELECT MAX(id_cache) FROM cache);"
		$prepared = $pdo->prepare($sql);
	    $resultado = $prepared->execute();
	    $resultado= $prepared->fetch(\PDO::FETCH_ASSOC);
	    

		$prepared = $pdo->prepare($resultado['consulta']);
	    $rst = $prepared->execute();
	    
		$sql="DELETE FROM cache WHERE id_cache = $resultado['id_cache'];"
		$prepared = $pdo->prepare($sql);
	    $rst2 = $prepared->execute();

	   // return $resultado;
	//}
}
?>
