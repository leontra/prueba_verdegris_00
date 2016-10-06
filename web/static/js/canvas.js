//
//
//
// JS Aire de Otoño
// Verde / Gris
//

var JUEGO = JUEGO || {};

JUEGO.canvas = null;
JUEGO.interfaz = null;
JUEGO.senial = null;
JUEGO.deltaTime = 0.0;
JUEGO.prevTime = Date.now();
JUEGO.deAquiSalioLaFigura = false;

function Initialize()
{
	JUEGO.canvas = new Lienzo(512, 512);
	JUEGO.canvas.iniciarLienzo();

	JUEGO.interfaz = new Interfaz();
	JUEGO.interfaz.iniciarBotones();

	JUEGO.senial = new Senial();
	JUEGO.senial.prepararNueva();
};

function Lienzo(w, h)
{
	this.lienzo = null;
	this.color = "#";
	this.width = w;
	this.height = h;
	this.context = null;
	this.tickInterval = null;
	this.listaLineas = [[], []];
	this.nodos = [];
	this.nodosRecibidos = [];
	this.nodoClick = null;
	this.seApretoNodo = false;
	this.seMando = false;
	this.listaLineasNodos = [];
	this.yaHayNodoParaConectar = false;
}

Lienzo.prototype.iniciarLienzo = function()
{
    this.getCanvas();
    this.iniciarGrid(32, 25);
    this.iniciarJuego();
};

Lienzo.prototype.getCanvas = function()
{
	this.lienzo = document.createElement("canvas");
	this.lienzo.width = this.width;
	this.lienzo.height = this.height;
	this.context = this.lienzo.getContext("2d");
  this.lienzo.addEventListener("mousedown", JUEGO.ClickCanvas);
	document.getElementById("canvasContainer").appendChild(this.lienzo);
};

Lienzo.prototype.iniciarGrid = function(numHor, numVert)
{
	var ancho = this.lienzo.width / numHor;
	var alto = this.lienzo.height / numVert;
	this.iniciarGridHorizontal(ancho, numHor);
	this.iniciarGridVertical(alto, numVert);
};

Lienzo.prototype.iniciarGridHorizontal = function(ancho, numero)
{
	for(var i = 0; i < numero; ++i)
	{
		var posX = ancho + (ancho * i);
		var linea = new Linea(posX, 0, posX, this.lienzo.height);
		this.listaLineas[0].push(linea);
	}
};

Lienzo.prototype.iniciarGridVertical = function(alto, numero)
{
	for(var i = 0; i < numero; ++i)
	{
		var posY = alto + (alto * i);
		var linea = new Linea(0, posY, this.lienzo.width, posY);
		this.listaLineas[1].push(linea);
	}
};

function Linea(x1, y1, x2, y2)
{
	this.x1 = x1;
	this.y1 = y1;

	this.x2 = x2;
	this.y2 = y2;
}

Lienzo.prototype.probarDibujado = function()
{
	this.context.beginPath();
	this.context.rect(this.x, 40, 50, 50);
	this.context.fillStyle = "#F33";
	this.context.fill();
	this.context.closePath();
};

Lienzo.prototype.iniciarJuego = function()
{
	this.tickInterval = setInterval(JUEGO.tick, 1000/10);
};

Lienzo.prototype.agregarFiguraRecibida = function(datos)
{
	console.log(datos);
	for(var i = 0; i < datos.length; ++i)
	{
		let nodo = datos[i];
		let punto = new Nodo(nodo.x, nodo.y)
		punto.color = '#3FE';
		this.nodosRecibidos.push(punto);
	};
}

Lienzo.prototype.limpiarPantalla = function()
{
	this.context.clearRect(0, 0, this.lienzo.width, this.lienzo.height);
};

Lienzo.prototype.dibujarMandadoSuccess = function()
{
	if(!this.seMando) return;

	this.context.beginPath();
	this.context.rect(0, 0, this.lienzo.width, this.lienzo.height);
	this.context.fillStyle = "#333";
	this.context.fill();
	this.context.closePath();

	this.seMando = false;
};

Lienzo.prototype.dibujar = function(deltaTime)
{
	this.limpiarPantalla();
	this.dibujarGrid();
	this.dibujarMandadoSuccess();
	this.dibujarLineasEntreNodos();
	this.dibujarNodos();
	this.dibujarFiguraRecibida();
};

Lienzo.prototype.dibujarGrid = function()
{
	this.dibujarLineasHorizontales();
	this.dibujarLineasVerticales();
};

Lienzo.prototype.dibujarLineasHorizontales = function()
{
	for(var i = 0; i < this.listaLineas[1].length; ++i)
	{
		var linea = this.listaLineas[1][i];
		this.dibujarLinea(linea);
	}
};

Lienzo.prototype.dibujarLineasVerticales = function()
{
	for(var i = 0; i < this.listaLineas[0].length; ++i)
	{
		var linea = this.listaLineas[0][i];
		this.dibujarLinea(linea);
	}
};

Lienzo.prototype.dibujarLinea = function(linea)
{
	this.context.beginPath();
	this.context.moveTo(linea.x1, linea.y1);
	this.context.lineTo(linea.x2, linea.y2);
	this.context.strokeStyle = "#555";
	this.context.lineWidth = .4;
	this.context.stroke();
	this.context.closePath();
};

Lienzo.prototype.dibujarNodos = function()
{
	for(var i = 0; i < this.nodos.length; ++i)
		this.nodos[i].dibujar(this.context);
};

Lienzo.prototype.dibujarLineasEntreNodos = function()
{
	for(var i = 0; i < this.listaLineasNodos.length; ++i)
		this.dibujarArista(this.listaLineasNodos[i]);
};

Lienzo.prototype.dibujarArista = function(linea)
{
	this.context.beginPath();
	this.context.moveTo(linea.x1, linea.y1);
	this.context.lineTo(linea.x2, linea.y2);
	this.context.strokeStyle = "#CA3";
	this.context.lineWidth=5;
	this.context.stroke();
	this.context.closePath();
};

Lienzo.prototype.dibujarFiguraRecibida = function()
{
	for(var i = 0; i < this.nodosRecibidos.length; ++i)
		this.nodosRecibidos[i].dibujar(this.context);
}

JUEGO.ClickCanvas = event =>
{
  console.log('Click');
	JUEGO.canvas.OnMouseDown(event);
};

Lienzo.prototype.OnMouseDown = function(event)
{
	if(!this.estaHaciendoClickEnNodo(event.layerX, event.layerY))
		this.crearNodoNuevo(event.layerX, event.layerY);
};

Lienzo.prototype.crearNodoNuevo = function(x, y)
{
	var nodo = new Nodo(x, y);
	this.nodos.push(nodo);
	this.revisarSiHayNodoParaConectar();
};

Lienzo.prototype.revisarSiHayNodoParaConectar = function()
{
	if(this.yaHayNodoParaConectar)
		this.hacerConexionEntreNodos();
	else
		this.yaHayNodoParaConectar = true;
};

Lienzo.prototype.hacerConexionEntreNodos = function()
{
	if(this.nodos.length < 2) return;

	var nodoUno = this.nodos[this.nodos.length - 2];
	var nodoDos = this.nodos[this.nodos.length - 1];

	var lineaNueva = new Linea(nodoUno.x, nodoUno.y, nodoDos.x, nodoDos.y);
	this.listaLineasNodos.push(lineaNueva);
};

Lienzo.prototype.estaHaciendoClickEnNodo = function(x, y)
{
	if(this.nodos.length <= 0) return false;

	for(var i = 0; i < this.nodos.length; ++i)
	{
		if(this.estaElClickLoSuficientementeCerca(x, y, this.nodos[i]))
			return true;
	}

	return false;
};

Lienzo.prototype.estaElClickLoSuficientementeCerca = function(x, y, nodo)
{
	var distancia = this.obtenerDistanciaEntrePuntos(x, y, nodo.x, nodo.y);

	if(distancia <= nodo.radio)
		return this.elClickEstaDentroDelNodo(nodo);

	return false;
};

Lienzo.prototype.obtenerDistanciaEntrePuntos = function(x1, y1, x2, y2)
{
	var x = x2 - x1;
	x = (x * x);

	var y = y2 - y1;
	y = (y * y);

	var d = Math.sqrt(x + y);

	return d;
};

Lienzo.prototype.elClickEstaDentroDelNodo = function(nodo)
{
	//if(this.seApretoNodo)
	this.agregarLineaEntreNodos(nodo);

	return true;
};

Lienzo.prototype.agregarLineaEntreNodos = function(nodo)
{
	var nodoDos = this.nodos[this.nodos.length - 1];
	var linea = new Linea(nodoDos.x, nodoDos.y, nodo.x, nodo.y);
	this.listaLineasNodos.push(linea);
	//this.nodoClick.resetearColor();
	this.seApretoNodo = false;
	this.yaHayNodoParaConectar = false;
	console.log("Terminar figura");
};

Lienzo.prototype.agregarNodoAEspera = function(nodo)
{
	nodo.color = "#F31";
	this.nodoClick = nodo;
	this.seApretoNodo = true;
};

Lienzo.prototype.borrarNodosYLineasEntreEllas = function()
{
	this.nodos = [];
	this.listaLineasNodos = [];
};

function Nodo(x, y)
{
	this.x = x;
	this.y = y;
	this.radio = 6;
	this.color = "#E73";
	this.normalColor = "#E73";
};

Nodo.prototype.dibujar = function(context)
{
	context.beginPath();
	context.arc(this.x, this.y , this.radio, 0, 2 * Math.PI);
	context.lineWidth=1;
	context.strokeStyle = this.color;
	context.stroke();
	context.fillStyle = this.color;
  context.fill();
	context.closePath();
};

Nodo.prototype.resetearColor = function()
{
	this.color = this.normalColor;
};

JUEGO.tick = function()
{
	JUEGO.clock();
	JUEGO.canvas.dibujar(JUEGO.deltaTime);
	JUEGO.senial.dibujar(JUEGO.canvas.context, JUEGO.deltaTime);
};

JUEGO.clock = function()
{
	var now = Date.now();
  	JUEGO.deltaTime = (now - this.prevTime) / 1000;
  	JUEGO.prevTime = now;
};

function Interfaz()
{
	this.mandarButton = null;
	this.borrarButton = null;

	this.cantidad = 0;
	this.cantidadASumar = 1000.0;
}

Interfaz.prototype.iniciarBotones = function()
{
	this.iniciarMandarButton();
	this.iniciarBorrarButton();
};

Interfaz.prototype.iniciarMandarButton = function()
{
	this.mandarButton = document.createElement("BUTTON");
	var texto = document.createTextNode("MANDAR");
	this.mandarButton.appendChild(texto);
	this.mandarButton.id = "mandarButton";
	//this.mandarButton.addEventListener("click", JUEGO.interfaz.mandarButtonClick);
	document.getElementById("interfaz").appendChild(this.mandarButton);
};

Interfaz.prototype.iniciarBorrarButton = function()
{
	this.borrarButton = document.createElement("BUTTON");
	var texto = document.createTextNode("BORRAR");
	this.borrarButton.appendChild(texto);
	this.borrarButton.addEventListener("click", JUEGO.interfaz.borrarButtonClick);
	document.getElementById("interfaz").appendChild(this.borrarButton);
};

Interfaz.prototype.mandarButtonClick = function()
{
	console.log("mandar figura");
	JUEGO.canvas.seMando = true;
	JUEGO.interfaz.revisarSiSeCompletoFigura();
	JUEGO.senial.prepararNueva();
	JUEGO.canvas.borrarNodosYLineasEntreEllas();
};

Interfaz.prototype.revisarSiSeCompletoFigura = function()
{
	var numNodos = JUEGO.canvas.nodos.length;
	var numLineas = JUEGO.canvas.listaLineasNodos.length;

	if(numNodos > 0 && numNodos == numLineas)
		JUEGO.interfaz.sumarCantidad();
};

Interfaz.prototype.borrarButtonClick = function()
{
	JUEGO.canvas.borrarNodosYLineasEntreEllas();
};

Interfaz.prototype.sumarCantidad = function()
{
	var score = document.getElementById("score");
	this.cantidad += this.cantidadASumar;
	score.innerHTML = this.cantidad;
};

function Rectangulo(x, y, w, h)
{
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;

	this.numPuntoADibujar = -1;
	this.puntos = [];
}

Rectangulo.prototype.Init = function()
{
	for(var i = 0; i < 4; ++i)
		this.sumarNuevoPunto();
};

Rectangulo.prototype.sumarNuevoPunto = function()
{
	var punto = new Nodo(0, 0);
	punto.color = this.color;
	this.puntos.push(punto);
};

Rectangulo.prototype.actualizarPuntos = function()
{
	for(var i = 0; i < this.puntos.length; ++i)
		this.actualizarElPunto(this.puntos[i], i);
};

Rectangulo.prototype.actualizarElPunto = function(punto, index)
{
	if(index == 0)
	{
		punto.x = this.x;
		punto.y = this.y;
	}
	if(index == 1)
	{
		punto.x = this.x + this.w;
		punto.y = this.y;
	}
	if(index == 2)
	{
		punto.x = this.x + this.w;
		punto.y = this.y + this.h;
	}
	if(index == 3)
	{
		punto.x = this.x;
		punto.y = this.y + this.h;
	}
};

Rectangulo.prototype.resetearValores = function()
{
	this.numPuntoADibujar = -1;
};

Rectangulo.prototype.dibujar = function(context)
{
	context.beginPath();
	context.rect(this.x, this.y, this.w, this.h);
    context.fill();
	context.closePath();
};

Rectangulo.prototype.marcarNuevoPunto = function()
{
	++this.numPuntoADibujar;
	if(this.numPuntoADibujar >= this.puntos.length)
		this.numPuntoADibujar = 0;
};

Rectangulo.prototype.dibujarSiguientePunto = function(context)
{
	var punto = this.puntos[this.numPuntoADibujar];
	punto.dibujar(context);
};

function Senial()
{
	this.color = "#1AF";

	this.rect = new Rectangulo(0, 0, 0, 0);
	this.rect.Init();

	this.laSenialEstaEnEspera = false;
	this.sePuedeDibujar = false;
	this.seEstaDibujandoUnPunto = false;

	this.time = 0;
	this.timeADibujarPunto = 0;
}

Senial.prototype.prepararNueva = function()
{
	this.resetearValores();
	setTimeout(RANDOM.NuevaSenial, 1000);
};

Senial.prototype.resetearValores = function()
{
	this.sePuedeDibujar = false;
	this.laSenialEstaEnEspera = false;
	this.seEstaDibujandoUnPunto = false;

	this.time = 0;
	this.timeADibujarPunto = 0;

	this.rect.resetearValores();
};

Senial.prototype.nuevaSenial = function()
{
	this.rect.w = RANDOM.obtenerNuevo(350, 50);
	this.rect.h = RANDOM.obtenerNuevo(350, 50);

	this.rect.x = RANDOM.obtenerNuevo((JUEGO.canvas.width - this.rect.w), 1);
	this.rect.y = RANDOM.obtenerNuevo((JUEGO.canvas.height - this.rect.h), 1);

	this.rect.actualizarPuntos();

	this.laSenialEstaEnEspera = true;
	this.sePuedeDibujar = true;
	this.time = 0;
};

Senial.prototype.dibujar = function(context, deltaTime)
{
	if(!this.sePuedeDibujar) return;

	if(this.seEstaDibujandoUnPunto)
		this.dibujarSiguientePuntoDelRectangulo(context, deltaTime);
	else
		this.time += deltaTime;

	if(!this.seEstaDibujandoUnPunto && this.time >= 0.5)
		this.iniciarDibujoDePunto();
};

Senial.prototype.iniciarDibujoDePunto = function()
{
	this.seEstaDibujandoUnPunto = true;
	this.rect.marcarNuevoPunto();
};

Senial.prototype.dibujarSiguientePuntoDelRectangulo = function(context, deltaTime)
{
	context.fillStyle = this.color;
	this.rect.dibujarSiguientePunto(context);

	if(this.timeADibujarPunto > 0.3)
		this.terminarDeDibujarPunto();

	this.timeADibujarPunto += deltaTime;
};

Senial.prototype.terminarDeDibujarPunto = function()
{
	this.seEstaDibujandoUnPunto = false;
	this.timeADibujarPunto = 0;
	this.time = 0;
};

var RANDOM = RANDOM || {};

RANDOM.NuevaSenial = function()
{
	JUEGO.senial.nuevaSenial();
};

RANDOM.obtenerNuevo = function(inicio, final)
{
	return Math.floor((Math.random() * inicio) + final);
};

function probarFiguraRecibida(data)
{
	if(JUEGO.deAquiSalioLaFigura)
	{
		JUEGO.deAquiSalioLaFigura = false
		return
	}

	JUEGO.canvas.agregarFiguraRecibida(data);
}

var Canvas = {

  Init: evento =>
  {
    let canvas = new Lienzo(512, 512)
    Initialize()
  },
	mandarFigura: evento =>
	{
		JUEGO.interfaz.mandarButtonClick()
		JUEGO.deAquiSalioLaFigura = true
	},
	obtenerNodosAMandar: evento =>
	{
		return JUEGO.canvas.nodos
	},
	figuraRecibida: datos =>
	{
		probarFiguraRecibida(datos)
	}


};

module.exports = {
  canvas: Canvas
};
