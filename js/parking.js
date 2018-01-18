$(document).ready(function(){
  //constantes del programa
  const mts2 = 12;
  const width=2217;
  const height=1598;
  const zoom_proporcion = 0.3;
  const zoom_width = width * zoom_proporcion;
  const zoom_height = height*zoom_proporcion;
  const color = "rgb(120, 8, 8)";
  //Asigna un color a cada colorCategoria
  const colorCategoria = {
    contenedor:"rgb(255, 0, 0)",
    yate:"rgb(51, 204, 51)",
    velero:"rgb(0, 0, 255)",
    pesca:"rgb(255, 255, 0)"
  };
  let coordenadaTemp = new Array(); //array con coordenadas iniciales
  let cuentaCuadros = 0; // cantidad de cuadros seleccionado con el mouse
  let zoom = false;
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
/* Manejo del Canvas y su inicializacion */
  var canvas1 = $("#canvas1").get(0);
  const context1 = canvas1.getContext("2d");
  var canvas2 = $("#canvas2").get(0);
  const context2 = canvas2.getContext("2d");

/* Variables de fecha para hacer la consulta incial*/
  let hoy = new Date();
  let dd = hoy.getDate();
  let mm = hoy.getMonth()+1; //hoy es 0!
  let yyyy = hoy.getFullYear();




  /* Set en el tamaño para el manejo del zoom */
  $('#img-park').attr("width", zoom_width);
  $('#canvas1').attr("width", zoom_width);
  $('#canvas1').attr("height", zoom_height);
  $('#canvas2').attr("width", 0);
  $('#canvas2').attr("height", 0);
  $('#zoom').click(function(){
    zoomDo();
  });
  zonasMuertas(areaDisponible1);
  zonasMuertas(areaDisponible2);
/*  ****************************************************************************
FUNCIONES PRINCIPALES
********************************************************************************
 */
  /*
  Hace el zoom en el DOM
   */
  function zoomDo(){
    if (zoom) {
      zoom = false;
      $('#zoom-in').removeAttr("hidden");
      $('#zoom-out').attr("hidden", "hidden");
      $('#categorias').removeAttr("hidden", "hidden");
      $('#container-canvas').removeClass('width-100');
      $('#container-canvas').addClass('width-70');
      $('#img-park').attr("width", zoom_width);
      $('#canvas1').attr("width", zoom_width);
      $('#canvas1').attr("height", zoom_height);
      $('#canvas2').attr("width", 0);
      $('#canvas2').attr("height", 0);
      zonasMuertas(areaDisponible1);
      zonasMuertas(areaDisponible2);
    }else{
      zoom = true;
      $('#zoom-out').removeAttr("hidden");
      $('#zoom-in').attr("hidden", "hidden");
      $('#categorias').attr("hidden", "hidden");
      $('#container-canvas').removeClass('width-70');
      $('#container-canvas').addClass('width-100');
      $('#img-park').removeAttr("width");
      $('#canvas1').attr("width", width);
      $('#canvas1').attr("height", height);
      $('#canvas2').attr("width", width);
      $('#canvas2').attr("height", height);
      creaCuadricula(canvas1.width, canvas1.height);
      zonasMuertas(areaDisponible1);
      zonasMuertas(areaDisponible2);
    }
  }

  /*
Funciones que maneja el evento del mouse sobre el canvas2 para pintar recuadros
   */
  $('#canvas2').mouseup(function(e){
    if (zoom) {
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
        }
      }else {
        alert("Área no permitida seleccione dentro de las intalaciones o áreas vacías");
      }
    }
  });

/*
Responde al evento del boton guardar del modal
 */

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
     if (coordenadaTemp.length > 1 ) {
       guardarBaseDatos(
         coordenadaTemp[0][0],
         coordenadaTemp[0][1],
         $("#anchoX").val(),
         $("#largoY").val(),
         $("#date").val(),
         $("#date1").val(),
         $("#time").val(),
         $("#time1").val(),
         $("#categoria").val()
       );
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

/*
*********************************************************************************
 */

 /*
 ********************************************************************************
FUNCIONES AUXILIARES
********************************************************************************
  */

  /*
  Detecta si la coordenada esta un punto valido
   */
    function areaDisponible(coordenada){
      let puntoValido = false;
      let numEncuentro = recorreArrayAreas(areaDisponible1, coordenada);
      if(numEncuentro % 2 != 0){
        numEncuentro += recorreArrayAreas(areaDisponible2, coordenada);
        if(numEncuentro % 2 != 0){
          puntoValido = true;
        }
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
/*
Retorna un array con dos numeros, pos1 num menor - pos2 num mayor
 */
      function mayorAMenor(num1, num2){
        if (num1 > num2) {
            let numTemp = num1;
            num1 = num2;
            num2 = numTemp;
        }
        return [num1, num2];
      }

/* Revisa si un punto esta ocupado o no */
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


  /* organiza el punto para que ubique la coordenada correspondiente con un cuadro */
  function ubicaCoordenada(puntoCoordenada){
    let pos1 = puntoCoordenada[0];
    let pos2 = puntoCoordenada[1];
    pos1=Math.floor(pos1/mts2) * mts2;
    pos2=Math.floor(pos2/mts2) * mts2;
    return [pos1, pos2];
  }

  /*
  Pinta la cuadricula en el mapa con zoom
   */
  function creaCuadricula(widthReg, heightReg){
    if (context1) {
      context1.lineWidth = 0.1;
      context1.strokeStyle = "#000";
      for (let i = 0; i <= widthReg; i= i + mts2) {
        context1.beginPath();
        context1.moveTo(i, 0);
        context1.lineTo(i, heightReg);
        context1.stroke();
      }
      for (let i = 0; i <= heightReg; i= i + mts2) {
        context1.strokeStyle = "#000";
        context1.beginPath();
        context1.moveTo(0, i);
        context1.lineTo(widthReg, i);
        context1.stroke();
      }
    }
  }

/*
Crea la matriz de cuadros a dibujar
 */
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


  /*
  DIBUJA LA LINEA DEL PERIMETRO PERMITIDO
   */

   function zonasMuertas(arrayCoordenadas){
     if (context1) {
       let proporcion = (zoom)?1:zoom_proporcion;
       context1.lineWidth = 1;
   		context1.strokeStyle = "rgb(0,0,0)";
       for (var i = 0; i < arrayCoordenadas.length-1; i++) {

         context1.beginPath();
   			context1.lineJoin = "round";
   			context1.moveTo(arrayCoordenadas[i][0]*proporcion, arrayCoordenadas[i][1]*proporcion);
   			context1.lineTo(arrayCoordenadas[i][0]*proporcion, arrayCoordenadas[i][1]*proporcion);
   			context1.lineTo(arrayCoordenadas[i+1][0]*proporcion, arrayCoordenadas[i+1][1]*proporcion);
   			context1.stroke();
       }
     }
   }
/*
Funcion que pinta los cuadros
 */
   function repinta(coordenada, colorCategoria=color){
     if(context2){
       context2.lineWidth = 0.5;
 			context2.strokeStyle = "#00f";
       context2.fillStyle = colorCategoria;
       context2.strokeRect(
         coordenada[0]+1,
         coordenada[1]+1,
         mts2-2,
         mts2-2
       );
       context2.fillRect(
         coordenada[0]+1,
         coordenada[1]+1,
         mts2-2,
         mts2-2
       );
     }
   }


/* Pinta el recuadro del color que se eligio la categoria */

function pintaCuadros(categoria){
  borraRecuadro(coordenadaTemp[0]);
  for (var i = 0; i < coordenadaTemp.length; i++) {
    repinta(coordenadaTemp[i], categoria);
  }
}

fuction categoriaColor(categoria){

}

/*
*********************************************************************************
  FUNCIONES CON BASE DE DATOS
*********************************************************************************
 */

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

/* Consulta la base de datos por meses */
consultarBaseDatos ('2018-01-17', 30);
 function consultarBaseDatos (date,dias){

 // Convertir a objeto
 var data = {};

 data.date = date;
 data.dias = dias;
 data.categoria = '';

 var url = 'consultar.php';   //este es el PHP al que se llama por AJAX

 	resultado = new Array();
     $.ajax({
         method: 'POST',
         url: url,
         data: data,   //acá están todos los parámetros (valores a enviar) del POST
         success: function(response){
             // resultado es un array con el resultado del query
             resultado = response;
 			console.log(resultado);
         },
 		dataType:"json"
     });
 }

});
