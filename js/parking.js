$(document).ready(function(){
  //constantes del programa
  const mts2 = 12;
  const width=2217;
  const height=1598;
  const zoom_proporcion = 0.323;
  const zoom_width = width * zoom_proporcion;
  const zoom_height = height*zoom_proporcion;
  const color = "rgb(120, 8, 8)";
  let guardadoExitoso = true;
  //Asigna un color a cada colorCategoria
  const colorCategoria = {
    contenedor:"rgb(255, 0, 0)",
    yate:"rgb(51, 204, 51)",
    velero:"rgb(0, 0, 255)",
    pesca:"rgb(255, 255, 0)"
  };
  // corrdenada ingresada mientras que se pinta
  let coordenadaTemp = new Array(); //array con coordenadas iniciales
  // cooredenada que vienen de la base de datos, ya estan almacenadas
  let respuestaConsulta = new Array();

  /* Variables de fecha actual para hacer la consulta incial*/
    const hoy = new Date();
    const dd = hoy.getDate();
    const mm = hoy.getMonth()+1; //hoy es 0!
    const yyyy = hoy.getFullYear();
    const hour = hoy.getHours();
    const min = 00;
    const seg = 00;
    $('#fecha_caja').val(`${dd}-${mm}-${yyyy}`)
    consultarBaseDatos(`${yyyy}-${mm}-${dd}`, 40);


    // Fecha seleccionada para consultar
    let fechaSeleccionada = hoy;

  /*
  ejemplo de consulta de base de datos
  consultarBaseDatos ('2018-01-17', 30);
  */
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
  let canvas1 = $("#canvas1").get(0);
  const context1 = canvas1.getContext("2d");
  let canvas2 = $("#canvas2").get(0);
  const context2 = canvas2.getContext("2d");
  let canvas3 = $("#canvas3").get(0);
  const context3 = canvas3.getContext("2d");

  /* Set inicial en el tamaño para el manejo del zoom */
  $('#img-park').attr("width", zoom_width);
  $('#canvas1').attr("width", zoom_width);
  $('#canvas1').attr("height", zoom_height);
  $('#canvas2').attr("width", 0);
  $('#canvas2').attr("height", 0);
  $('#canvas3').attr("width", zoom_width);
  $('#canvas3').attr("height", zoom_height);
  $('#zoom').click(function(){
    zoomDo();
  });


  $("#canvas1").mouseup(function(e){
    if (!zoom) {
      let posX1 = e.offsetX/canvas1.width;
      let posY1 = e.offsetY/canvas1.height;
      zoomDo();
      let posX = 954 * posX1;
      let posY = 1091 * posY1;
      $("#container-canvas").scrollLeft(posX);
      $("#container-canvas").scrollTop(posY);
    }
  });

  zonasMuertas(areaDisponible1);
  zonasMuertas(areaDisponible2);



/*  ****************************************************************************
FUNCIONES PRINCIPALES
********************************************************************************
 */

 /* Cambia el valor de la fecha seleccionada para ser consultada */
 $('#fecha_range').change(function(){
   let fechaActual = new Date();
   let dias = $(this).val() * 86400;
   fechaActual.setSeconds(dias);
   fechaSeleccionada = fechaActual;
   $('#fecha_caja').val(`${fechaSeleccionada.getDate()}-${fechaSeleccionada.getMonth()+1}-${fechaSeleccionada.getFullYear()}`);
   recorreConsulta(respuestaConsulta);
 });
  /*
  Hace el zoom en el DOM
   */
  function zoomDo(){
    if (zoom) {

      zoom = false;
      $('#zoom-in').removeAttr("hidden");
      $('#gant').removeAttr("hidden");
      $('#session').removeAttr("hidden");
      $('#zoom-out').attr("hidden", "hidden");

      $('#categorias').removeAttr("hidden", "hidden");
      $('#container-canvas').removeClass('width-100');
      $('#container-canvas').addClass('width-70');
      $('#img-park').attr("width", zoom_width);
      $('#canvas1').attr("width", zoom_width);
      $('#canvas1').attr("height", zoom_height);
      $('#canvas2').attr("width", 0);
      $('#canvas2').attr("height", 0);
      $('#canvas3').attr("width", zoom_width);
      $('#canvas3').attr("height", zoom_height);
      zonasMuertas(areaDisponible1);
      zonasMuertas(areaDisponible2);
      recorreConsulta(respuestaConsulta);
    }else{
      zoom = true;
      $('#zoom-out').removeAttr("hidden");
      $('#gant').attr("hidden", "hidden");
      $('#session').attr("hidden", "hidden");
      $('#zoom-in').attr("hidden", "hidden");
      $('#categorias').attr("hidden", "hidden");
      $('#container-canvas').removeClass('width-70');
      $('#container-canvas').addClass('width-100');
      $('#img-park').removeAttr("width");
      $('#canvas1').attr("width", width);
      $('#canvas1').attr("height", height);
      $('#canvas2').attr("width", width);
      $('#canvas2').attr("height", height);
      $('#canvas3').attr("width", width);
      $('#canvas3').attr("height", height);
      creaCuadricula(canvas1.width, canvas1.height);
      zonasMuertas(areaDisponible1);
      zonasMuertas(areaDisponible2);
      recorreConsulta(respuestaConsulta);
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
       categoria = $("#categoria").val();
       guardarBaseDatos(
         coordenadaTemp[0][0],
         coordenadaTemp[0][1],
         $("#anchoX").val(),
         $("#largoY").val(),
         $("#date").val(),
         $("#date1").val(),
         $("#time").val(),
         $("#time1").val(),
         categoria
       );
       if (guardadoExitoso) {
         consultarBaseDatos(`${yyyy}-${mm}-${dd}`, 40);
         $("#anchoX").val('');
         $("#largoY").val('');
         $("#date").val('');
         $("#date1").val('');
         $("#time").val('');
         $("#time1").val('');
         $("#categoria").val('');
         pintaCuadros(categoria, context1);
         coordenadaTemp = [];
         cuentaCuadros = 0;
       }
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

   function repinta(
     coordenada,
     context = context2,
     colorCategoria=color,
     sizeX = (mts2 - 2),
     sizeY = (mts2 - 2),
   ){
     if(context){
       context.lineWidth = 0.5;
       context.strokeStyle = "#00f";
       context.fillStyle = colorCategoria;
       context.strokeRect(
         coordenada[0]+1,
         coordenada[1]+1,
         sizeX,
         sizeY
       );
       context.fillRect(
         coordenada[0]+1,
         coordenada[1]+1,
         sizeX,
         sizeY
       );
     }
   }


/* Pinta el recuadro del color que se eligio la categoria */

function pintaCuadros(categoria, context){
  borraRecuadro(coordenadaTemp[0]);
  for (let i = 0; i < coordenadaTemp.length; i++) {
    repinta(coordenadaTemp[i], context,colorCategoria[categoria]);
  }
}

/*
Borra el recuadro ya pintado
 */
function borraRecuadro(coordenada){
  if(context2){
    context2.clearRect(
      coordenada[0],
      coordenada[1],
      mts2,
      mts2
    );
  }
}


/* Recorre el objeto de consulta */
function recorreConsulta(arrayConsulta){

  respuestaConsulta = arrayConsulta;
  let fechaInicialArray = new Date();
  let fechaFinalArray = new Date();
  context3.clearRect(0, 0, canvas3.width, canvas3.height);
  for (let i = 0; i < respuestaConsulta.length; i++) {
    fechaInicialArray.setTime(Date.parse(respuestaConsulta[i]["fecha_incial"]));
    fechaFinalArray.setTime(Date.parse(respuestaConsulta[i]["fecha_final"]));
    if (
      fechaInicialArray <= fechaSeleccionada
      && fechaFinalArray >= fechaSeleccionada
      )
      {
        pintaAreaOcupada(respuestaConsulta[i]);
      }
    }
  }


/* Pinta un area ocupada */
function pintaAreaOcupada(objConsulta){
  if (zoom) {
    repinta(
      [
        objConsulta["coordenada_x"]*1,
        objConsulta["coordenada_y"]*1
      ],
      context3,
      colorCategoria[objConsulta["categoria"]],
      objConsulta["ancho_x"]*mts2,
      objConsulta["largo_y"]*mts2
    )
  }else{
    repinta(
      [
        objConsulta["coordenada_x"] * zoom_proporcion,
        objConsulta["coordenada_y"] * zoom_proporcion
      ],
      context3,
      colorCategoria[objConsulta["categoria"]],
      objConsulta["ancho_x"] * mts2 *zoom_proporcion,
      objConsulta["largo_y"] * mts2 *zoom_proporcion
    )
  }
}

// devuelve si es AM O PM
function obtieneAMPM (horaConsulta){
  let jornada = "pm";
  if(horaConsulta > 0 && horaConsulta > 12){
    jornada = "am";
  }
  return jornada;
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
         if(response == "1"){
           alert("Espacio asignado correctamente");
           guardadoExitoso =  true;
         }else{
           alert("No se pudo asignar espacio error al guardar base de datos");
           guardadoExitoso =  false;
         }
       }
     });
   }

/* Consulta la base de datos por meses */
function consultarBaseDatos (date,dias){

// Convertir a objeto
var data = {};

data.date = date;
data.dias = dias;
data.categoria = '';

var url = 'consultar.php';   //este es el PHP al que se llama por AJAX

    $.ajax({
        method: 'POST',
        url: url,
        data: data,   //acá están todos los parámetros (valores a enviar) del POST
        success: function(response){
          $('fecha_range').removeAttr("hidden");
          $('echa_caja').removeAttr("hidden");
          recorreConsulta(response)
        },
   dataType:"json"
    });
}

});
