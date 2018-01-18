$(document).ready(function(){
  const mts2 = 12;
  var canvas = $("#canvas1").get(0);
  const context = canvas.getContext("2d");
  let coordenadaTemp = new Array();
  let cuentaCuadros = 0;
  creaCuadricula(canvas.width, canvas.height);
  let color = 'rgba(255,0,0,1)';

  const areaDisponible1 = Array(
    [240, 360],
    [408, 360],
    [420, 96],
    [636, 120],
    [636, 156],
    [672, 156],
    [636, 468],
    [1548, 552],
    [1548, 1476],
    [1368, 1476],
    [1368, 973],
    [216, 961],
    [216, 720],
    [624, 720],
    [624, 576],
    [120, 576],
    [120, 383],
    [240, 360]
  );
  const areaDisponible2 = Array(
    [1596, 553],
    [1992, 600],
    [2028, 600],
    [2112, 756],
    [2076, 780],
    [2112, 888],
    [1596, 888],
    [1596, 553]
  );

/* ASIGNA COLOR A LOS RECUADROS */
  $("#c1").click(function(){
    color = "rgb(255, 0, 0)";
  });
  $("#c2").click(function(){
    color = "rgb(51, 204, 51)";
  });
  $("#c3").click(function(){
    color = "rgb(0, 0, 255)";
  });
  $("#c4").click(function(){
    color = "rgb(255, 255, 0)";
  });

  let zoom_delta = 0.25;

  //captura cuando se libera el mouse punto final del recuadro
  $('#canvas1').mouseup(function(e){
    let posCuadro = ubicaCoordenada([e.offsetX, e.offsetY]);
    if (areaDisponible(posCuadro)) {
      resBusca = buscaCoordenada(posCuadro,coordenadaTemp);
      if (resBusca[0]) {
        cuentaCuadros--;
        borraRecuadro(posCuadro);
        coordenadaTemp = [];
      }else {
        if (cuentaCuadros > 0) {
          borraRecuadro(coordenadaTemp[0]);
          coordenadaTemp = [];
          cuentaCuadros--;
        }
        cuentaCuadros++;
        coordenadaTemp.push(posCuadro);
        let lengthArray = coordenadaTemp.length;
        repinta(coordenadaTemp[lengthArray - 1]);
      }
      if(coordenadaTemp.length != 0){
        $('#modal').modal('toggle');
      }/* else{
        $('#modal').modal('toggle');
      } */
    }else {
      alert("Área no permitida seleccione dentro de las intalaciones o áreas vacías");
    }
  });

  //organiza el punto para que ubique la coordenada correspondiente con un cuadro
  function ubicaCoordenada(puntoCoordenada){
    let pos1 = puntoCoordenada[0];
    let pos2 = puntoCoordenada[1];
    pos1=Math.floor(pos1/mts2) * mts2;
    pos2=Math.floor(pos2/mts2) * mts2;
    return [pos1, pos2];
  }

  function buscaCoordenada(pos, arrayCoordenadas){
    let encontro = false;
    let posicion = -1;
    for (let i = 0; i < arrayCoordenadas.length; i++) {
      if (pos[0] == arrayCoordenadas[i][0]) {
        if (pos[1] == arrayCoordenadas[i][1]) {
          encontro = true;
          posicion = i;
        }
      }
    }
    return [encontro, posicion];
  }

  function repinta(coordenada){
    if(context){
      context.lineWidth = 0.5;
			context.strokeStyle = "#00f";
      context.fillStyle = color;
      context.strokeRect(
        coordenada[0]+1,
        coordenada[1]+1,
        mts2-2,
        mts2-2
      );
      context.fillRect(
        coordenada[0]+1,
        coordenada[1]+1,
        mts2-2,
        mts2-2
      );
    }
  }

  function borraRecuadro(coordenada){
    if(context){
      context.clearRect(
        coordenada[0]+0.2,
        coordenada[1]+0.2,
        mts2-0.4,
        mts2-0.4
      );
    }
  }
/*
Detecta si la coordenada esta un punto valido
 */
  function areaDisponible(coordenada){
    let puntoValido = false;
    let numEncuentro = recorreArrayAreas(areaDisponible1, coordenada);
    numEncuentro += recorreArrayAreas(areaDisponible2, coordenada);
    if(numEncuentro % 2 != 0){
      puntoValido = true;
    }
    return puntoValido;
  }
/*
Recorre el array revisando cuantas veces toca el perimetro
 */
  function recorreArrayAreas(arrayCoor, coordenada){
    const x = coordenada[0];
    const y = coordenada[1];
    let numEncuentro = 0;
    let pendiente = 0;
    let x1 = 0;
    let y1 = 0;
    let x2 = 0;
    let y2 = 0;
    let resEcuacion = x+1;
    let numY = Array();
    for (let i = 0; i < arrayCoor.length - 1; i++) {
      numY = mayorAMenor(arrayCoor[i][1], arrayCoor[i+1][1]);
      if (y >=  numY[0] && y <= numY[1]) {
        if (x >= arrayCoor[i][0] && x >= arrayCoor[i+1][0]) {
          numEncuentro++;
        }else{
          x1 = arrayCoor[i][0];
          y1 = arrayCoor[i][1];
          x2 = arrayCoor[i+1][0];
          y2 = arrayCoor[i+1][1];
          pendiente = (y2 - y1)/(x2 - x1);
          if(pendiente != 0){
            resEcuacion = ((y - y1) / pendiente) + x1;
          }
          if(x > resEcuacion){
            numEncuentro++;
          }
          resEcuacion = x + 1;
        }
      }
    }
    return numEncuentro;
  }

  function mayorAMenor(num1, num2){
    if (num1 > num2) {
        let numTemp = num1;
        num1 = num2;
        num2 = numTemp;
    }
    return [num1, num2];
  }

  function creaCuadricula(widthReg, heightReg){
    if (context) {
      context.lineWidth = 0.1;
      context.strokeStyle = "#000";
      for (let i = 0; i <= widthReg; i= i + mts2) {
        context.beginPath();
        context.moveTo(i, 0);
        context.lineTo(i, heightReg);
        context.stroke();
      }
      for (let i = 0; i <= heightReg; i= i + mts2) {
        context.strokeStyle = "#000";
        context.beginPath();
        context.moveTo(0, i);
        context.lineTo(widthReg, i);
        context.stroke();
      }
    }
  }

/* Funciones que trabajan con el formulario */

$("#guardar").click(function(){
  anchoCuadro = $("#anchoX").val();
  largoCuadro =$("#largoY").val();
  let mensaje = "";
  let valido = true;
  if ($("#date").val() == '' || $("#time").val() == '') {
    mensaje = "Fecha y hora inicial son obligatorios\n";
    valido = false;
  }
  if ($("#date1").val() == '' || $("#time1").val() == '') {
    mensaje += "Fecha y hora final son obligatorios\n";
    valido = false;
  }
  if(anchoCuadro == '' || largoCuadro == '' || anchoCuadro <= 0 || largoCuadro <= 0){
    mensaje += "Ancho y largo del area son obligatorios y deben ser positivo\n";
    valido = false;
  }
  if (!valido) {
    alert(mensaje);
  }else{
    $('#modal').modal('toggle');
  }
  if(valido){
    llenaMatriz(anchoCuadro, largoCuadro);
	guardarBaseDatos(coordenadaTemp[0][0], coordenadaTemp[0][1], $("#anchoX").val(),$("#largoY").val(), $("#date").val(),$("#date1").val(),$("#time").val(),$("#time1").val(),$("#categoria").val());
    if (coordenadaTemp.length > 1 ) {
      $("#anchoX").val('');
      $("#largoY").val('');
      $("#date").val('');
      $("#date1").val('');
      $("#time").val('');
      $("#time1").val('');
	  $("#categoria").val('');
      pintaCuadros();
      coordenadaTemp = [];
      cuentaCuadros = 0;
    }

  }
});

function llenaMatriz(ancho, largo){
  pos = 1;
  let OrigenX = coordenadaTemp[0][0];
  let OrigenY = coordenadaTemp[0][1];
  for (var i = 0; i < ancho; i++) {
    for (var j = 0; j < largo; j++) {
      if (i == 0 && j == 0) {
        j++;
      }
      coordenadaTemp[pos] = [OrigenX + (mts2 * i), OrigenY + (mts2 * j)]
      if(!areaDisponible(coordenadaTemp[pos])){
        alert("Elemento muy grande, no cabe en el area seleccionada");
        coordenadaTemp = [];
        coordenadaTemp[0] = [OrigenX, OrigenY];
        i = ancho+1;
        j = largo+1;
      }
      pos++;
    }
  }
}

function pintaCuadros(){
  borraRecuadro(coordenadaTemp[0]);
  for (var i = 0; i < coordenadaTemp.length; i++) {
    repinta(coordenadaTemp[i]);
  }
}
zonasMuertas(areaDisponible1);
zonasMuertas(areaDisponible2);
function zonasMuertas(arrayCoordenadas){
  if (context) {
    context.lineWidth = 1;
		context.strokeStyle = "rgb(0,0,0)";
    for (var i = 0; i < arrayCoordenadas.length-1; i++) {
      context.beginPath();
			context.lineJoin = "round";
			context.moveTo(arrayCoordenadas[i][0], arrayCoordenadas[i][1]);
			context.lineTo(arrayCoordenadas[i][0], arrayCoordenadas[i][1]);
			context.lineTo(arrayCoordenadas[i+1][0], arrayCoordenadas[i+1][1]);
			context.stroke();
    }
  }
}

// AJAX Guardar Formulario

function guardarBaseDatos (x, y, ancho,largo, date1,date2,time1,time2, categoria){

// Convertir a objeto
var data = {};
data.x = x;
data.y = y;
data.ancho = ancho;
data.largo = largo;
data.date1 = date1;
data.date2 = date2;
data.time1 = time1;
data.time2 = time2;
data.categoria = categoria;

var url = 'guardar.php';   //este es el PHP al que se llama por AJAX
    $.ajax({
        method: 'POST',
        url: url,
        data: data,   //acá están todos los parámetros (valores a enviar) del POST
        success: function(response){
            // Se ejecuta al finalizar
            //   mostrar si está OK en consola
            console.log(response);
			alert(response);
        }
    });

}

});
