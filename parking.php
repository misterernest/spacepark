<?php
  session_start();
  if (!$_SESSION["online"]) {
    header('Location: index.php');
  }
 ?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <link rel="stylesheet" href="css/parking.css">
  <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
  <title>space parking</title>
  <script src="./js/jquery-3.2.1.min.js"></script>
  <script type="text/javascript" src="./js/parking.js"></script>
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css" />

	<link rel="stylesheet" href="./css/bootstrap-material-datetimepicker.css" />
	<link href='http://fonts.googleapis.com/css?family=Roboto:400,500' rel='stylesheet' type='text/css'>
	<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">


	<script src="https://code.jquery.com/jquery-1.12.3.min.js"  crossorigin="anonymous"></script>
	<script type="text/javascript" src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.2/js/bootstrap.min.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-material-design/0.5.10/js/ripples.min.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-material-design/0.5.10/js/material.min.js"></script>
	<!-- <script type="text/javascript" src="https://rawgit.com/FezVrasta/bootstrap-material-design/master/dist/js/material.min.js"></script> -->
	<script type="text/javascript" src="http://momentjs.com/downloads/moment-with-locales.min.js"></script>
	<script type="text/javascript" src="./js/bootstrap-material-datetimepicker.js"></script>
</head>
<body>
  <div class="btn-park btn-lupa" id="zoom">
    <img src="img/lupa-mas.png" alt="lupa-zoom-in" id="zoom-in">
    <img src="img/lupa-menos.png" alt="lupa-zoom-out" id="zoom-out" hidden="hidden">
  </div>
  <div class="btn-park btn-gant" id="gant">
    <img src="img/diagrama-grant.png" alt="Diagrama Gant">
  </div>
  <a href="session_close.php">
    <div class="btn-park btn-session" id="session">
        <img src="img/cerrar-sesion.png" alt="Cerrar sesion">
    </div>
  </a>
  <div class="container">
    <div class="container-canvas width-70" id="container-canvas">
        <img src="img/mapa.png" class="img-park" id="img-park" >
        <canvas class="canvas1" id="canvas1">
          Su navegador no soporta canvas :(
        </canvas>
        <canvas class="canvas1" id="canvas2" >
        </canvas>
        <canvas class="canvas1" id="canvas3" >
        </canvas>
    </div>
  </div>
  <div class="container">
    <div class="row col-sm-12 col-md-12">
      <div class="col-sm-10 row col-md-10 barra-fecha">
        <input id="fecha_range" class="form-control col-sm-12 col-md-12" type="range" name="fecha_barra" min="-59" max="60" step="1" value="0" hidden="hidden">
      </div>
      <div class="col-sm-2 row col-md-2 barra-fecha">
        <input class="form-control col-sm-12 col-md-12 form-group" type="text" name="fecha_text" id="fecha_caja">
      </div>
    </div>
  </div>

  <?php include 'modal.html' ?>

</body>
</html>
