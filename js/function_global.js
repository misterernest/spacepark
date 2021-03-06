/*
Funcion que pinta los cuadros
 */

   function repinta(
     coordenada,
     context = context2,
     colorCategoria=color,
     sizeX = (mts2 - 2),
     sizeY = (mts2 - 2),
     cliente=""
   ){
     context.translate(0, 0);
     let size = 0;
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
       if (sizeX >= sizeY) {
         size = sizeY;
       } else{
         size = sizeX;
       }
       context.font="normal small-caps bold " + size + "px arial";
       let anchuraTexto = context.measureText(cliente).width;

       while( anchuraTexto > sizeX-5 ){
					// reducimos el tamaño del texto con 1 px
  				size--;
  				context.font = "normal small-caps bold " + size + "px arial";
  				anchuraTexto = context.measureText(cliente).width;
				}
       context.textAlign="center";
       context.fillStyle = "white";
       context.textAlign="center";
       context.textBaseline = "top";
       context.fillText(
         cliente,
         coordenada[0]+sizeX*0.5,
         coordenada[1]+sizeY*0.1
       );
     }
   }



/* Pinta un area ocupada */
function pintaAreaOcupada(objConsulta, context){
  if (zoom) {
    repinta(
      [
        objConsulta["coordenada_x"]*1,
        objConsulta["coordenada_y"]*1
      ],
      context,
      colorCategoria[objConsulta["categoria"]],
      objConsulta["ancho_x"]*mts2,
      objConsulta["largo_y"]*mts2,
      objConsulta["cliente"]
    )
  }else{
    repinta(
      [
        objConsulta["coordenada_x"] * zoom_proporcion,
        objConsulta["coordenada_y"] * zoom_proporcion
      ],
      context,
      colorCategoria[objConsulta["categoria"]],
      objConsulta["ancho_x"] * mts2 *zoom_proporcion,
      objConsulta["largo_y"] * mts2 *zoom_proporcion,
      objConsulta["cliente"]
    )
  }
}

/* Recorre el objeto de consulta */
function recorreConsulta(arrayConsulta, context, canvas){
  respuestaConsulta = arrayConsulta;
  let fechaInicialArray = new Date();
  let fechaFinalArray = new Date();
  context.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < respuestaConsulta.length; i++) {
    fechaInicialArray.setTime(Date.parse(respuestaConsulta[i]["fecha_incial"]));
    fechaFinalArray.setTime(Date.parse(respuestaConsulta[i]["fecha_final"]));
    if (
      fechaInicialArray <= fechaSeleccionada
      && fechaFinalArray >= fechaSeleccionada
      )
      {
        pintaAreaOcupada(respuestaConsulta[i], context);
      }
    }
  }

/* Consulta la base de datos por meses */
function consultarBaseDatos (date,dias, context, canvas){

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
          recorreConsulta(response, context, canvas);
        },
   dataType:"json"
    });
}

/*
mesNumtext convierte el numero del mes en texto
*/
function mesNumtext(num){
  let mesText = "";
  switch (num) {
    case 1:
      mesText = "Enero";
      break;

    case 2:
      mesText = "Febrero";
      break;

    case 3:
      mesText = "Marzo";
      break;

    case 4:
      mesText = "Abril";
      break;

    case 5:
      mesText = "Mayo";
      break;

    case 6:
      mesText = "Junio";
      break;

    case 7:
      mesText = "Julio";
      break;

    case 8:
      mesText = "Agosto";
      break;

    case 9:
      mesText = "Septiembre";
      break;

    case 10:
      mesText = "Octubre";
      break;

    case 11:
      mesText = "Noviembre";
      break;

    case 12:
      mesText = "Diciembre";
      break;

    default:
      mesText = `mes ${num}`;
  }
  return mesText;

}

/*
function public DIBUJA LA LINEA DEL PERIMETRO PERMITIDO
 */

 function zonasMuertas(arrayCoordenadas, context){
   if (context) {
     let proporcion = (zoom)?1:zoom_proporcion;
     context.lineWidth = 1;
    context.strokeStyle = "rgb(0,0,0)";
     for (var i = 0; i < arrayCoordenadas.length-1; i++) {

       context.beginPath();
      context.lineJoin = "round";
      context.moveTo(arrayCoordenadas[i][0]*proporcion, arrayCoordenadas[i][1]*proporcion);
      context.lineTo(arrayCoordenadas[i][0]*proporcion, arrayCoordenadas[i][1]*proporcion);
      context.lineTo(arrayCoordenadas[i+1][0]*proporcion, arrayCoordenadas[i+1][1]*proporcion);
      context.stroke();
     }
   }
 }


 /*
 Pinta la cuadricula en el mapa con zoom
  */
 function creaCuadricula(widthReg, heightReg, context){
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

 /* organiza el punto para que ubique la coordenada correspondiente con un cuadro */
 function ubicaCoordenada(puntoCoordenada){
   let pos1 = puntoCoordenada[0];
   let pos2 = puntoCoordenada[1];
   pos1=Math.floor(pos1/mts2) * mts2;
   pos2=Math.floor(pos2/mts2) * mts2;
   return [pos1, pos2];
 }

/*function que carga la barra de rango de fecha*/
 // function cargarDiv(){
 //   $('#container-range').load("carga_range.php");
 // }
