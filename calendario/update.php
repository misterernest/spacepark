<?php

//update.php

$connect = new PDO('mysql:host=localhost;dbname=spaceparking', 'root', '');

if (isset($_POST['id']) && !empty($_POST['id']) &&
	isset($_POST['categoria']) && !empty($_POST['categoria']) &&
	isset($_POST['cliente']) && !empty($_POST['cliente']) &&
	isset($_POST['comentario']) && !empty($_POST['comentario']))
{


 $query = "
 UPDATE reserva 
 SET categoria=:categoria, cliente=:cliente, comentario=:comentario 
 WHERE id_reserva=:id
 ";
 $statement = $connect->prepare($query);
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

?>