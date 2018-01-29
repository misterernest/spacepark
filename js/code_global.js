//constantes del programa
const mts2 = 12;
const width=2217;
const height=1598;
const zoom_proporcion = 0.323;
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

/*Manejo del zoom*/
let zoom = false;

/* Manejo del Canvas y su inicializacion */
  let canvas1 = "";
  let context1 = "";
  let canvas2 = "";
  let context2 = "";
  let canvas3 = "";
  let context3 = "";


/* Variables de fecha actual para hacer la consulta incial*/
  const hoy = new Date();
  const dd = hoy.getDate();
  const mm = hoy.getMonth()+1; //hoy es 0!
  const yyyy = hoy.getFullYear();
  const hour = hoy.getHours();
  const min = 00;
  const seg = 00;
  let mesText = mesNumtext(mm);
  $('#fecha_caja').val(`${mesText} ${dd}, ${yyyy}`);

// Variable de fecha para el input range
// Fecha seleccionada para manejar consultas
  let fechaSeleccionada = hoy;


// cooredenada que vienen de la base de datos, ya estan almacenadas
  let respuestaConsulta = new Array();

// coordenadas para delimitar la bodega
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

/* Manejo del evento borrar o mover */
  let seleccionBtnEliminar = false;
  let seleccionBtnMover = false;



//Manejo de variables por medio de jquery
  $(document).ready(function(){
    /* Manejo del Canvas y su inicializacion */
    let canvas1 = $("#canvas1").get(0);
    const context1 = canvas1.getContext("2d");
    let canvas2 = $("#canvas2").get(0);
    const context2 = canvas2.getContext("2d");
    let canvas3 = $("#canvas3").get(0);
    const context3 = canvas3.getContext("2d");

    consultarBaseDatos(`${yyyy}-${mm}-${dd}`, 40, context3, canvas3);
    $('#fecha_caja').val(`${mesText} ${dd}, ${yyyy}`);
    /* Set inicial en el tamaño para el manejo del zoom */
    $('#img-park').attr("width", zoom_width);
    $('#canvas1').attr("width", zoom_width);
    $('#canvas1').attr("height", zoom_height);
    $('#canvas2').attr("width", zoom_width);
    $('#canvas2').attr("height", zoom_height);
    $('#canvas3').attr("width", zoom_width);
    $('#canvas3').attr("height", zoom_height);

    zonasMuertas(areaDisponible1, context1);
    zonasMuertas(areaDisponible2, context1);
  });
