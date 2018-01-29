$(document).ready(function(){

  /* Manejo del Canvas y su inicializacion */
  let canvas1 = $("#canvas1").get(0);
  const context1 = canvas1.getContext("2d");
  let canvas2 = $("#canvas2").get(0);
  const context2 = canvas2.getContext("2d");
  let canvas3 = $("#canvas3").get(0);
  const context3 = canvas3.getContext("2d");

  /* Cambia el valor de la fecha seleccionada para ser consultada y la coloca en
  la caja de texto para mostrar fecha */
  $('#fecha_range').mousemove(function(){
    context3.clearRect(0, 0, canvas3.width, canvas3.width);
    let fechaActual = new Date();
    let dias = $('#fecha_range').val() * 86400;
    fechaActual.setSeconds(dias);
    fechaSeleccionada = fechaActual;
    mesText = mesNumtext(fechaSeleccionada.getMonth() + 1);
    $('#fecha_caja').val(`${mesText} ${fechaSeleccionada.getDate()}, ${fechaSeleccionada.getFullYear()}`);
    recorreConsulta(respuestaConsulta, context3, canvas3);
  });

});
