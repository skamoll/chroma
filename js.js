/* CARGA ELEMENTOS AL FINALIZAR LA CARGA DE LA WEB */
window.addEventListener("load", function load(event) {
    instantanea = document.getElementById("canvas").getContext("2d");
    resultado = document.getElementById("result").getContext("2d");
    temporal = document.createElement("canvas");
    temporal.height=350;
    temporal.width=400;
    buffer = temporal.getContext('2d');
    video = document.getElementById("video");
    loadCamera();
}, false);

/* REALIZA UNA CAPTURA E INICIA EL PROCESO */
function inicia(){
    instantanea.drawImage(video, 0, 0, 400, 300);
    foto = instantanea.getImageData(0, 0, 400, 300);
    chroma();
}

/* ESTABLECE UN INTERVALO DE 200ms E INICIA EL PROCESAMIENTO */
function chroma() {
	window.setInterval(function() {
		buffer.drawImage(video, 0, 0, 400, 300);
		var frame = buffer.getImageData(0, 0, 400, 300);
		for (var i = 0; i < foto.data.length; i += 4) {
			if(comp(frame.data[i], foto.data[i]) &&
			comp(frame.data[i + 1], foto.data[i + 1]) &&
			comp(frame.data[i + 2], foto.data[i + 2])) {
                //frame.data[i + 3] = 0;
			}else{
                frame.data[i + 3] = 1;
            }
		}
		resultado.putImageData(frame, 0, 0);
	}, 200);
}

/* COMPARA LOS DOS VALORES Y SI ESTA DENTRO DEL UMBRAL DEVUELVE FALSE */
function comp(frame, foto) {
    val = document.getElementById("umbral").value;
	if( (frame > (foto - val)) && (frame < (foto + val)) ) {
		return false;
	}else {
		return true;
	}
}

/* OBTIENE IMAGEN DE LA CÁMARA WEB Y LA VUELCA */
function loadCamera(){
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;
    if (navigator.getUserMedia) {
        navigator.getUserMedia({video: true}, handleVideo, videoError);
    }
    function handleVideo(stream) {
        video.src = window.URL.createObjectURL(stream);
    }
    function videoError(e) {
        console.log("Error al cargar la cámara");
    }
}