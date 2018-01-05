var y = 5; // altura inicial y 0=10%, debe leerse al iniciar si queremos que tenga alturas diferentes dependiendo del dispositivo
var v = 0;
var g = 1.622;
var a = g; //a= -g es para motor encendido
var dt = 0.016683;
var timer;
var gasolina = 100;
var dificultad = 1;
var gasolinaTotal=100
var intentos = 1;
var modeloNave = 1;
var modeloSuperficie = 1;
var timerFuel = null;

window.onload = function arrancarJuego(){
	//CAPTURA SI EL DISPOSITIVO RECIBE EVENTOS OUNTOUCH (SMARTPHONE)
	function is_touch_device() {
	if ('ontouchstart' in window) {document.getElementById("botonOn").style.display="inline-block";}		
	}
	is_touch_device();
	//CAPTURANDO EVENTOS DEL PANEL DERECHA
	document.getElementById("reanudar").onclick=function(){reanudar();};
	document.getElementById("pausa").onclick=function(){pausar();};
	document.getElementById("reiniciar").onclick=function(){reiniciarJuego();};
	document.getElementById("instrucciones").onclick=function(){mostrarInstrucciones();};
	document.getElementById("botonAjustes").onclick=function(){mostrarAjustes();};
	//CAPTURANDO EVENTOS PARA EL PANEL DERECHO EN SMARTPHONE
	document.getElementById("reanudarSmartphone").onclick=function(){reanudarSmartphone();};
	document.getElementById("pausarSmartphone").onclick=function(){pausarSmartphone();};
	document.getElementById("reiniciarSmartphone").onclick=function(){reiniciarJuegoSmartphone();};
	document.getElementById("ayudaSmartphone").onclick=function(){mostrarInstruccionesSmartphone();};
	document.getElementById("botonAjustesSmartphone").onclick=function(){mostrarAjustesSmartphone();};	
	//EVENTOS DE FIN DEL JUEGO
	document.getElementById("jugarOtraVez").onclick=function(){reiniciarJuego();};
	document.getElementById("jugarOtraVezSmartphone").onclick=function(){reiniciarJuegoSmartphone();};	
	document.getElementById("jugarAgain").onclick=function(){reiniciarJuego();};
	document.getElementById("jugarAgainSmartphone").onclick=function(){reiniciarJuegoSmartphone();};
	//CAMBIAR LA DIFICULTAD DEL JUEGO
	document.getElementById("dificultad").onclick = function cambiarDificultad(){
		switch(dificultad){
			case 1:
				gasolina=50;
				gasolinaTotal=50;
				document.getElementById("dificultad").innerHTML="Media";
				dificultad=2
				restart();
				break;
			case 2:
				gasolina=25;
				gasolinaTotal=35;
				document.getElementById("dificultad").innerHTML="Dificil";
				dificultad=3
				restart();
				break;
			case 3:
				gasolina=100;
				gasolinaTotal=100;
				document.getElementById("dificultad").innerHTML="Facil";
				dificultad=1
				restart();
				break;
			}
		}

	//CAMBIAR LA IMAGEN DE LA NAVE Y EL MOTOR
	document.getElementById("modeloNave").onclick = function cambiarModeloNave(){
		switch(modeloNave) {
			case 1:
				document.getElementById("imgNave").src="img/nave2.png";
				document.getElementById("imgMotor").src="img/propulsor.png";
				document.getElementById("modeloNave").innerHTML="Modelo Extraterrestre";
				modeloNave=2;
				restart();
				break;
			case 2:
				document.getElementById("imgNave").src="img/nave.png";
				document.getElementById("imgMotor").src="img/propulsor.png";
				document.getElementById("modeloNave").innerHTML="Modelo Estandar";
				modeloNave=1;
				restart();
				break;
			}
		}

	//Empezar a mover nave
	start();

	//ASIGNAR EVENTOS TOUCH SCREEN PARA LA VERSION SMARTPHONE
	var botonOnSmartphone = document.getElementById("botonOn");
	botonOnSmartphone.addEventListener("touchstart", handlerFunction, false);
	botonOnSmartphone.addEventListener("touchend", endingFunction, false);
	function handlerFunction(event) {
		encenderMotor();
	}
	function endingFunction(event) {
		apagarMotor();
	}
	
	//CON TECLADO (tecla ESPACIO)
	window.onkeydown=function(e) {
		var claveTecla;
		if (window.event)
			claveTecla = window.event.keyCode;
		else if (e)
			claveTecla = e.which;
		if ((claveTecla==32))
			{encenderMotor();
			}
	}
	window.onkeyup=apagarMotor;

}//TERMINA EL WINDOW.ONLOAD


//FUNCION EMPEZAR EL JUEGO
function start(){
	timer=setInterval(function(){ moverNave(); }, dt*1000);
}

//FUNCION PARAR NAVE Y CONTROLADORES
function stop(){
	clearInterval(timer);
}

//FUNCION PARA QUE CAIGA LA NAVE A TRAVES DE LA PANTALLA
function moverNave(){
	v +=a*dt;
	document.getElementById("Velocidad").innerHTML=v.toFixed(2);
	y +=v*dt;
	document.getElementById("Altura").innerHTML=y.toFixed(2);
	//mover hasta que top sea un 70% de la pantalla
	if (y<70){ 
		document.getElementById("nave").style.top = y+"%"; 
	} else { 
		stop();
		finalizarJuego();
	}	
}

//HACER QUE LOS DIVS IZQUIERDA Y DERECHA NO RECIBAN EVENTOS ONCLICK
function eventosOff() {
	document.getElementById("izquierda").style.pointerEvents='none';
	document.getElementById("derecha").style.pointerEvents='none';
}
//HACER QUE LOS DIVS IZQUIERDA Y DERECHA SI RECIBAN EVENTOS ONCLICK
function eventosOn() {
	document.getElementById("izquierda").style.pointerEvents='auto';
	document.getElementById("derecha").style.pointerEvents='auto';
}

//FUNCION PARA ACABAR EL JUEGO
function finalizarJuego() {
	if (v>5) {
		switch (modeloNave) {
			case 1:
			eventosOff();
			document.getElementById("imgNave").src="img/explosion.gif";
			document.getElementById("perdedor").style.display="block";
			document.getElementById("intentos").innerHTML=intentos;
			break;
			case 2:
			eventosOff();
			document.getElementById("imgNave").src="img/explosion.gif";
			document.getElementById("perdedor").style.display="block";
			document.getElementById("intentos").innerHTML=intentos;
			break;
			}
		} else {
			document.getElementById("ganador").style.display="block";
			eventosOff();	
		}
}

//FUNCION QUE ACTUA EN CUANTO SE ENCIENDE EL MOTOR
function encenderMotor() {
	a=-g;
	document.getElementById("Fuel").innerHTML=porcentajeGasolina();
	document.getElementById("Fuel").style.color="rgb("+0+(100-porcentajeGasolina())+"%, 0%, 0%)";
	document.getElementById("imgMotor").style.display="block";
	if (timerFuel==null) { 
			timerFuel=setInterval(function(){ actualizarGasolina(); }, 100);
			}
	if (gasolina<=0) {
			apagarMotor();
			document.getElementById("Fuel").innerHTML=0;
		}
}

//CALCULO EL PORCENTAJE DE GASOLINA QUE QUEDA
function porcentajeGasolina() {
  var result= gasolina * 100 / gasolinaTotal;
  return result.toFixed(0);
}


//FUNCION QUE ACTUALIZA EL MARCADOR DE FUEL
function actualizarGasolina(){
	gasolina-=1;
	document.getElementById("Fuel").innerHTML=porcentajeGasolina();
	document.getElementById("Fuel").style.color="rgb("+0+(100-porcentajeGasolina())+"%, 0%, 0%)";
	if (gasolina<=0) {
		apagarMotor();
		document.getElementById("Fuel").innerHTML=0;
	}
}
//FUNCION QUE RESPONDE AL MOMENTO DE APAGAR EL MOTOR DE LA NAVE
function apagarMotor() {
	a=g;
	document.getElementById("imgMotor").style.display="none";
	clearInterval(timerFuel);
	timerFuel=null;
}

function mostrarAjustes() {
	pausar();
	eventosOff();
	document.getElementById("modalidad").style.display="block";
}
function ocultarAjustes() {
	document.getElementById("modalidad").style.display="none";
	eventosOn();
}

function mostrarInstrucciones() {
	pausar();
	eventosOff();
	document.getElementById("menuInstrucciones").style.display="block";
}

function ocultarInstrucciones() {
    document.getElementById("menuInstrucciones").style.display="none";
    eventosOn();
}

function restart(){
	stop();
	y = 5; // altura inicial y0=10%, debe leerse al iniciar si queremos que tenga alturas diferentes dependiendo del dispositivo
	v = 0;
	g = 1.622;
	a = g;
	dt = 0.016683;
	gasolina=gasolinaTotal;
	document.getElementById("Fuel").innerHTML=porcentajeGasolina();
	document.getElementById("Fuel").style.color="black";
}
//OJO COMPORTAMIENTO ESCRITORIO
function reiniciarJuego() {
	stop();
	document.getElementById("reanudar").style.display="none";
	document.getElementById("pausa").style.display="inline-block";
	intentos++;
	y = 5; // altura inicial y0=10%, debe leerse al iniciar si queremos que tenga alturas diferentes dependiendo del dispositivo
	v = 0;
	g = 1.622;
	a = g;
	dt = 0.016683;
	gasolina=gasolinaTotal;
	document.getElementById("Fuel").innerHTML=porcentajeGasolina();
	document.getElementById("Fuel").style.color="black";
	reanudar();
	clearInterval(timer);
	start();
	eventosOn();
	document.getElementById("intentos").innerHTML=intentos;
	document.getElementById("perdedor").style.display="none";
	document.getElementById("ganador").style.display="none";
	if (modeloNave==1) {
		document.getElementById("imgNave").src="img/nave.png";
	} else {
		document.getElementById("imgNave").src="img/nave2.png";
	}
}

function reanudar() {
	stop();
	start();
	document.getElementById("reanudar").style.display="none";
	document.getElementById("pausa").style.display="inline-block";
}
function pausar() {
	stop();
	document.getElementById("pausa").style.display="none";
	document.getElementById("reanudar").style.display="inline-block";
}

//OJO COMPORTAMIENTO SMARTPHONE
function reanudarSmartphone() {
	start();
	document.getElementById("reanudarSmartphone").style.display="none";
	document.getElementById("pausarSmartphone").style.display="inline-block";
	document.getElementById("reiniciarSmartphone").style.display="none";
	document.getElementById("ayudaSmartphone").style.display="none";
	document.getElementById("botonAjustesSmartphone").style.display="none";
	document.getElementById('izquierda').style.display="inline-block";
	document.getElementById('nave').style.display="inline-block";
	document.getElementById('aterrizaje').style.display="inline-block";
	document.getElementById('derechaSmartphone').style.backgroundImage='url(img/saturno.png)';
	document.getElementById('derechaSmartphone').style.backgroundSize='60%';
	document.getElementById('derechaSmartphone').style.backgroundRepeat='no-repeat';
	document.getElementById('derechaSmartphone').style.width='35%';
}

function pausarSmartphone() {
	stop();
	document.getElementById("pausarSmartphone").style.display="none";
	document.getElementById("reanudarSmartphone").style.display="inline-block";
	document.getElementById("reiniciarSmartphone").style.display="inline-block";
	document.getElementById("ayudaSmartphone").style.display="inline-block";
	document.getElementById("botonAjustesSmartphone").style.display="inline-block";
	document.getElementById('derechaSmartphone').style.backgroundImage='url(img/interfaz1.png)';
	document.getElementById('derechaSmartphone').style.backgroundSize='auto';
	document.getElementById('derechaSmartphone').style.backgroundRepeat='repeat';
	document.getElementById('derechaSmartphone').style.width='100%'; 	
}

function reiniciarJuegoSmartphone() {
	stop();
	intentos++;
	y = 5; // altura inicial y 0=10%, debe leerse al iniciar si queremos que tenga alturas diferentes dependiendo del dispositivo
	v = 0;
	g = 1.622;
	a = g;
	dt = 0.016683;
	gasolina=gasolinaTotal;
	document.getElementById("Fuel").innerHTML=porcentajeGasolina();
	document.getElementById("Fuel").style.color="black";
	reanudarSmartphone();
	clearInterval(timer);
	start();
	eventosOn();
	document.getElementById("intentos").innerHTML=intentos;
	document.getElementById("perdedor").style.display="none";
	document.getElementById("ganador").style.display="none";
	if (modeloNave==1) {
		document.getElementById("imgNave").src="img/nave.png";
	} else {
		document.getElementById("imgNave").src="img/nave2.png";
	}
}

function mostrarAjustesSmartphone() {
	pausarSmartphone();
	document.getElementById("modalidad").style.display="block";
}

function mostrarInstruccionesSmartphone() {
	pausarSmartphone();
	document.getElementById("menuInstrucciones").style.display="block";
}

