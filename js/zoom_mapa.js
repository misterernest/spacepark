$(document).ready(function(){
  /* Manejo del Canvas y su inicializacion */
  let canvas1 = $("#canvas1").get(0);
  const context1 = canvas1.getContext("2d");
  let canvas2 = $("#canvas2").get(0);
  const context2 = canvas2.getContext("2d");
  let canvas3 = $("#canvas3").get(0);
  const context3 = canvas3.getContext("2d");

  $("#canvas2").mouseup(function(e){
    if (!zoom && !seleccionBtnMover) {
      let posX1 = e.offsetX/canvas1.width;
      let posY1 = e.offsetY/canvas1.height;
      zoomDo(canvas1, context1, canvas2, context2, canvas3, context3);
      let posX = 954 * posX1;
      let posY = 1091 * posY1;
      $("#container-canvas").scrollLeft(posX);
      $("#container-canvas").scrollTop(posY);
    }
  });
});
