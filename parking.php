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
  <div class="container">
    <div class="row col-sm-12">
      <div class="col-sm-12" style="padding: 1rem;">
        <input class="form-control col-sm-12" type="range" name="edad" min="0" max="90" step="1" value="80">
      </div>
    </div>
  </div>
  <div class="container">
    <div class="container-canvas">
      <div class="div-scroll">
          <img src="img/mapa.png" class="img-park" id="img-park">
          <canvas class="canvas1" id="canvas1" width="2217" height="1598">
            Su navegador no soporta canvas :(
          </canvas>
      </div>
    </div>
    <div class="cont-complemento">
      <div class="categorias">
        <div class="title-cat">
          CATEGORIAS
        </div>
        <div class="cont-cat">
          <div class="linea-cat">
            <div class="color-cat c1" id="c1">
            </div>
            <span>Contenedor</span>
          </div>
          <div class="linea-cat">
            <div class="color-cat c2" id="c2">
            </div>
            <span>Yate</span>
          </div>
          <div class="linea-cat">
            <div class="color-cat c3" id="c3">
            </div>
            <span>Velero</span>
          </div>
          <div class="linea-cat">
            <div class="color-cat c4" id="c4">
            </div>
            <span>Pesca</span>
          </div>
        </div>
      </div>
      <?php include 'modal.html' ?>
    </div>
  </div>




  <?php include "footer.html" ?>
</body>
</html>
