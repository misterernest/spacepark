$(document).ready(function(){

	$("#atras").click(function(){
    	
    	var data = 'ejecutar' ;

		var url = 'consultasCache.php';   //este es el PHP al que se llama por AJAX

	    $.ajax({
	        method: 'POST',
	        url: url,
	        data: data,   //acá están todos los parámetros (valores a enviar) del POST
	        success: function(response){
	          // if (response > 0) {
	          //   $('#atras').removeClass("btn-inactivo");
	          // }
	        },
	   dataType:"json"
	    });
    });


    // function traerCache(){

    // }
});//fin documento ready