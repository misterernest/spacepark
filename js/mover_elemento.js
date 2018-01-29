$(document).ready(function(){
  /* Manejo del Canvas y su inicializacion */
  let canvas1 = $("#canvas1").get(0);
  const context1 = canvas1.getContext("2d");
  let canvas2 = $("#canvas2").get(0);
  const context2 = canvas2.getContext("2d");
  let canvas3 = $("#canvas3").get(0);
  const context3 = canvas3.getContext("2d");
  let paint = false;
  let idMover = 0;
  let coordenadaTemp = new Array();
  const respuestaConsultaLocal = respuestaConsulta;
  $("#mover").click(function(){
    if (seleccionBtnMover) {
      $('#zoom').removeClass("btn-inactivo");
      seleccionBtnMover = cambiaEstBtn($("#mover"), true);
    }else{
      $('#zoom').addClass("btn-inactivo");
      seleccionBtnMover = cambiaEstBtn($("#mover"), false);
      seleccionBtnEliminar = cambiaEstBtn($("#eliminar"), true);
      if(zoom){
        zoomDo(canvas1, context1, canvas2, context2, canvas3, context3);
      }
    }
  });

  $("#canvas2").mousedown(function(e){
    if (seleccionBtnMover) {
      let posCuadro = ubicaCoordenada([(e.offsetX /zoom_proporcion), (e.offsetY /zoom_proporcion)]);
      coordenadaTemp[0] = [(posCuadro[0]), (posCuadro[1])]
      coordenadaTemp[0][2] = 1;
      coordenadaTemp[0][3] = 1;
      coordenadaTemp[0][4] = `${fechaSeleccionada.getFullYear()}-${fechaSeleccionada.getMonth()+1}-${fechaSeleccionada.getDate()}`;
      coordenadaTemp[0][5] = `${fechaSeleccionada.getFullYear()}-${fechaSeleccionada.getMonth()+1}-${fechaSeleccionada.getDate()}`;
      coordenadaTemp[0][6] = `${fechaSeleccionada.getHours()}:00`;
      coordenadaTemp[0][7] = `${fechaSeleccionada.getHours()+1}:00`;
      coordenadaTemp[0][8] = "contenedor";
      let coordenadaClick = areaDisponibleLocal(coordenadaTemp, respuestaConsultaLocal);
      coordenadaTemp = Object.assign({}, coordenadaClick);
      //elementoSeleccionado();
      paint = true;
    }
  });
  $("#canvas2").mousemove(function(e){
    if (seleccionBtnMover && coordenadaTemp["id"] != 0 && paint) {
      coordenadaTemp["coordenada_x"] = e.offsetX;
      coordenadaTemp["coordenada_y"] = e.offsetY;
      mueveElemento();
    }
  });
  $("#canvas2").mouseup(function(e){

      if (seleccionBtnMover && coordenadaTemp["id"] != 0 && paint) {
        paint = false;
        let posCuadroTemp = new Array();
        posCuadroTemp[0] = coordenadaTemp.coordenada_x / zoom_proporcion;
        posCuadroTemp[1] = coordenadaTemp.coordenada_y / zoom_proporcion;
        posCuadroTemp = ubicaCoordenada(posCuadroTemp);
        coordenadaTemp.coordenada_x = posCuadroTemp[0];
        coordenadaTemp.coordenada_y = posCuadroTemp[1];
        const movimientoArray = Object.assign({}, coordenadaTemp);
        llenaMatrizLocal();
        if (Object.keys(coordenadaTemp).length > 0) {
          if(validaEspacioInterno()){
            let confirmaMovimiento = (confirm("Desea realizar el movimiento del elemento"))?true:false;
            if (confirmaMovimiento) {
              actualizarBD (
              `${movimientoArray.id}`,
              `${movimientoArray.coordenada_x}`,
              `${movimientoArray.coordenada_y}`,
              `${fechaSeleccionada.getFullYear()}-${fechaSeleccionada.getMonth()+1}-${fechaSeleccionada.getDate()}`
            )
            }else{
              context2.clearRect(0, 0, canvas2.width, canvas2.width);
            }
          }
        }else{
          context2.clearRect(0, 0, canvas2.width, canvas2.width);
        }
      }
  });
  function areaDisponibleLocal(coordenadaTempLocal, arrayAreasOcupadas){
    let arrayAreaCoincide = new Array();
    coordenadaTemp = [];
    let date1 = new Date();
    date1.setTime(Date.parse(`${coordenadaTempLocal[0][4]} ${coordenadaTempLocal[0][6]}`) );
    let date2 = new Date();
    date2.setTime(Date.parse(`${coordenadaTempLocal[0][5]} ${coordenadaTempLocal[0][7]}`));
    let dateA = new Date();
    let dateB = new Date();
    let  = 0;
    for (let i = 0; i < arrayAreasOcupadas.length; i++) {
      dateA.setTime(Date.parse(arrayAreasOcupadas[i]["fecha_incial"]));
      dateB.setTime(Date.parse(arrayAreasOcupadas[i]["fecha_final"]));
      if (((date1 > dateA && date1 < dateB)
      || (date2 > dateA && date2 < dateB)
      || (date1 < dateA && date2 > dateB))) {
        arrayAreaCoincide.push(arrayAreasOcupadas[i]);
      }
    }
    if (arrayAreaCoincide.length > 0) {
      for (var i = 0; i < arrayAreaCoincide.length; i++) {
        respuesta = llenaMatrizInternoBusca(coordenadaTempLocal, arrayAreaCoincide[i]); // si llega a coincidir en un punto lo vuelve false
        if(!respuesta){
            coordenadaTempLocal = arrayAreaCoincide[i];
          break;
        }
      }
    }
    return coordenadaTempLocal;
  }
  /* Crea la matriz con los cuadros a dibujar */
  function llenaMatrizInternoBusca(coordenadaTempLocal, arrayAreasOcupadas){
    /* cooredenadas a comparara si es posible ubicar dentro de este espacio */
    let x1 = arrayAreasOcupadas["coordenada_x"]*1;
    let y1 = arrayAreasOcupadas["coordenada_y"]*1;
    let x2 = x1 + (arrayAreasOcupadas["ancho_x"] * mts2);
    let y2 = y1 + (arrayAreasOcupadas["largo_y"] * mts2);
    //parametros que van a buscar coincidencia con rectangulo
    let OrigenX = coordenadaTempLocal[0][0];
    let OrigenY = coordenadaTempLocal[0][1];
    let ancho = coordenadaTempLocal[0][2];
    let largo = coordenadaTempLocal[0][3];
    let arrayCoordComparacion = Array(x1, x2, y1, y2);
    let respuesta = true;
    for (var i = 0; i < ancho; i++) {
      for (var j = 0; j < largo; j++) {
        //si llega a tocar
        if(!areaDisponibleInterno([OrigenX + (mts2 * i), OrigenY + (mts2 * j)], arrayCoordComparacion)){
          respuesta = false;
          break;
        }
      }
    }
    return respuesta;
  }

  /* Detecta si la coordenada esta dento de un area ocupada o libre
   si es false esta fuera de un recuadro ocupado (false si no es valido) */

    function areaDisponibleInterno(coordenada, areaOcupadaInterna){
      let puntoValido = true;
      let puntoDentro = recorreArrayAreasInternas(areaOcupadaInterna, coordenada);
      if(puntoDentro){
        puntoValido = false;
      }
      return puntoValido;
    }

  /* Verifica si el punto actual esta dentro de un area ocupada (true si esta dentro del cuadro ocupado)*/
    function recorreArrayAreasInternas(arrayCoor, coordenada){
      const x = coordenada[0];
      const y = coordenada[1];
      const x1 = arrayCoor[0];
      const x2 = arrayCoor[1];
      const y1 = arrayCoor[2];
      const y2 = arrayCoor[3];
      let respuesta = false;
      if (x >= x1 && x <= x2 && y >= y1 && y <= y2) {
        respuesta = true;
      }
      return respuesta;
    }
    function elementoSeleccionado(){
      if (context2) {
        console.log(coordenadaTemp);
        context2.beginPath();
        context2.fillStyle = colorCategoria[coordenadaTemp.categoria];
        context2.fillRect(
          coordenadaTemp["coordenada_x"],
          coordenadaTemp["coordenada_y"],
          coordenadaTemp["ancho_x"] * mts2 * zoom_proporcion,
          coordenadaTemp["largo_y"] * mts2 * zoom_proporcion
        );
      }
    }
    function mueveElemento(){
      if (context2) {
        console.log(coordenadaTemp);
        context2.clearRect(0, 0, canvas2.width, canvas2.width);
        context2.beginPath();
        context2.fillStyle = colorCategoria[coordenadaTemp.categoria];
        context2.fillRect(
          coordenadaTemp["coordenada_x"],
          coordenadaTemp["coordenada_y"],
          coordenadaTemp["ancho_x"] * mts2 * zoom_proporcion,
          coordenadaTemp["largo_y"] * mts2 * zoom_proporcion
        );
      }
    }

    /*
    Crea la matriz de cuadros a dibujar
     */
     function llenaMatrizLocal(){
       let OrigenX = coordenadaTemp["coordenada_x"];
       let OrigenY = coordenadaTemp["coordenada_y"];
       ancho = coordenadaTemp["ancho_x"];
       largo = coordenadaTemp["largo_y"];
       for (var i = 0; i < ancho; i++) {
         for (var j = 0; j < largo; j++) {
           if(!areaDisponible([OrigenX + (mts2 * i), OrigenY + (mts2 * j)])){
             coordenadaTemp = [];
             break;
           }
         }
         if (coordenadaTemp.length == 0) {
           break;
         }
       }
     }

     /* Valida lo espacios internos de las instalaciones si se esta ocupando con algun otro elemento */
     function validaEspacioInterno(){
       let respuesta = true; // si es true es valido para ubicar
       let date1 = new Date();
       date1.setTime(Date.parse(`${fechaSeleccionada.getFullYear()}-${fechaSeleccionada.getMonth()+1}-${fechaSeleccionada.getDate()}`) );
       let date2 = new Date();
       date2.setTime(Date.parse(`${coordenadaTemp.fecha_final}`));
       let dateA = new Date();
       let dateB = new Date();
       let arrayComparacion = new Array();
       for (let i = 0; i < respuestaConsultaLocal.length; i++) {
         dateA.setTime(Date.parse(respuestaConsultaLocal[i]["fecha_incial"]));
         dateB.setTime(Date.parse(respuestaConsultaLocal[i]["fecha_final"]));
         if ((date1 > dateA && date1 < dateB) || (date2 > dateA && date2 < dateB) || (date1 < dateA && date2 > dateB)) {
           arrayComparacion.push(respuestaConsultaLocal[i]);
         }
       }
       if (arrayComparacion.length > 0) {
         for (var i = 0; i < arrayComparacion.length; i++) {
           respuesta = llenaMatrizInterno(coordenadaTemp, arrayComparacion[i]); // si llega a coincidir en un punto lo vuelve false
           if(!respuesta){
             alert("Espacio ocupado por otro elelmento");
             break;
           }
         }
       }
       return respuesta;
     }

     /* Crea la matriz con los cuadros a dibujar */
     function llenaMatrizInterno(coordenaAUbicar, arrayComparacion){
       /* cooredenadas a comparara si es posible ubicar dentro de este espacio */
       let x1 = arrayComparacion["coordenada_x"]*1;
       let y1 = arrayComparacion["coordenada_y"]*1;
       let x2 = x1 + (arrayComparacion["ancho_x"] * mts2);
       let y2 = y1 + (arrayComparacion["largo_y"] * mts2);
       //parametros que van a buscar coincidencia con rectangulo
       let OrigenX = coordenaAUbicar["coordenada_x"]*1;
       let OrigenY = coordenaAUbicar["coordenada_y"]*1;
       let ancho = coordenaAUbicar["ancho_x"];
       let largo = coordenaAUbicar["largo_y"];
       let arrayCoordComparacion = Array(x1, x2, y1, y2);
       let respuesta = true;
       for (var i = 0; i < ancho; i++) {
         for (var j = 0; j < largo; j++) {
           //si llega a tocar
           if(!areaDisponibleInterno([OrigenX + (mts2 * i), OrigenY + (mts2 * j)], arrayCoordComparacion)){
             respuesta = false;
             break;
           }
         }
       }
       return respuesta;
     }

});//fin document ready **********************************************************************


//actualizarBD(600,150, 9, '2018-03-20 02:53:00');
function actualizarBD (id, x, y, date){
 // Convertir a objeto
 var data = {};

 data.date = date;
 data.id = id;
 data.x = x;
 data.y = y;

 var url = 'actualizar.php';   //este es el PHP al que se llama por AJAX

 	resultado = new Array();
     $.ajax({
       method: 'POST',
       url: url,
       data: data,   //acá están todos los parámetros (valores a enviar) del POST
       success: function(response){
         // resultado es un array que indica exitoso o no.
         if(response == "1"){
           alert("Espacio actualizado correctamente");
         }else{
           alert("No se pudo actualizar el espacio error al actualizar en base de datos");
         }
         location.reload();
       },
       error: function( jqXHR, textStatus, errorThrown ) {
         alert("Error:"+textStatus);
       }
     });
   }
