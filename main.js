let canvas = document.querySelector("#canvas");
let ctx = canvas.getContext("2d");

let tumae = setInterval(() => {
  main();
}, 3);
class Rect {
  constructor(x, y, py, n, color) {
    this.x = x;
    this.y = y;
    this.py = py;
    this.n = n;
    this.color = color;
  }
}

// let dist= window.screen.width;
let x1 = 0,
  y1 = 0,
  x2 = 400,
  y2 = 400,
  grisx = 0,
  pressed;
let filas = 10,
  colums = 8,
  separa,
  vel = 1,
  velSubida = 2;
let rectangulos = [];

//pintar
let pif = (canvas.width - separa * colums) / 2,
  pic = (canvas.height - separa * filas) / 2; //posicion inicial en fila y en col
let px = 0,
  select = false,
  posSelect,
  a = 0;
let generarRan = false,
  score = 0,
  espera = 0,
  subiendo = false,
  contSubiendo = 0,
  lineasSubir = 1,
  fin = false;

let sonidosLinea = [
  "./sonidos/juego/burbuja.mp3",
  "./sonidos/juego/pajarito.mp3",
  "./sonidos/juego/best-low.mp3",
];
let sonidosGameOver = [
  "./sonidos/game-over/brin.mp3",
  "./sonidos/game-over/mario-bros-die.mp3",
  "./sonidos/game-over/mario-bros-game-over.mp3",
  "./sonidos/game-over/pacman-dies.mp3",
];
let pianos = [
  "./sonidos/fondo/Acepta.mp3",
  "./sonidos/fondo/inundanos.mp3",
  "./sonidos/fondo/TanjiroNoUta.mp3",
  "./sonidos/fondo/Yeshua.mp3",
];
// let resume= confirm("start game");
let SonidoFondo = new Audio();
// window.onload= ()=>{
//     SonidoFondo= document.querySelector("#sonidoFondo");

//     SonidoFondo.onloadedmetadata= ()=>{

//         return false;
//     };
// };

// rectangulos.push(new Rect(0,6,pic+6*separa,3,"black"));
// rectangulos.push(new Rect(0,6,pic+6*separa,2,"blue"));
// rectangulos.push(new Rect(4,6,pic+6*separa,3,"yellow"));  error
// rectangulos.push(new Rect(5,6,pic+6*separa,2,"green"));
function empezarGame() {
  window.volume = 0.3;
  canvas.style.display = "initial";
  document.querySelector("#boton").style.display = "none";

  SonidoFondo.src = pianos[parseInt(random(0, pianos.length-1))];
  SonidoFondo.volume = 0.5;
  SonidoFondo.play();
  
  canvas.width = window.innerWidth - 10;
  canvas.height = window.innerHeight - 10;
  if (canvas.width < canvas.height) separa = canvas.width / (colums + 1);
  else separa = canvas.height / (filas + 2);
  (pif = (canvas.width - separa * colums) / 2),
    (pic = (canvas.height - separa * filas) / 2);
  generarRects(3);
}

function main() {
  canvas.width = canvas.width;

  pintarTexto(
    canvas.width / 2 - 30,
    (canvas.height - separa * filas) / 4 + 10,
    "score: " + score
  );

  pintarLineasH();
  pintarLineasV();
  for (let i = 0; i < rectangulos.length; i++) {
    if (
      pressed &&
      x1 > pif + rectangulos[i].x * separa &&
      x1 < pif + rectangulos[i].x * separa + rectangulos[i].n * separa &&
      y1 > pic + rectangulos[i].y * separa &&
      y1 < pic + rectangulos[i].y * separa + separa
    ) {
      px = x2 - (x1 - (pif + rectangulos[i].x * separa));
      let pxMin = pif,
        pxMax = pif + colums * separa;

      for (let k = 0; k < rectangulos.length; k++) {
        if (
          rectangulos[k].y == rectangulos[i].y &&
          rectangulos[k].x < rectangulos[i].x &&
          pif + (rectangulos[k].x + rectangulos[k].n) * separa > pxMin
        )
          pxMin = pif + (rectangulos[k].x + rectangulos[k].n) * separa;
      }
      if (px < pxMin) px = pxMin;

      for (let k = 0; k < rectangulos.length; k++) {
        if (
          rectangulos[k].y == rectangulos[i].y &&
          rectangulos[k].x > rectangulos[i].x &&
          pif + rectangulos[k].x * separa < pxMax
        )
          pxMax = pif + rectangulos[k].x * separa;
      }
      if (px + rectangulos[i].n * separa > pxMax)
        px = pxMax - rectangulos[i].n * separa;

      for (let j = 0; j < colums; j++) {
        if (px < pif + j * separa + separa / 2) {
          grisx = pif + j * separa + 8;
          if (px < pxMin) grisx = pxMin;
          ctx.fillStyle = "rgba(135,119,119,0.27)";
          ctx.fillRect(
            grisx,
            pic - 8,
            rectangulos[i].n * separa,
            filas * separa
          );
          break;
        }
      }
    }
  }
  // pintarJuego();
  // console.log(bajando)
  if (subiendo == true) {
    a = 0;
    contSubiendo += velSubida;
    for (let i = 0; i < rectangulos.length; i++) rectangulos[i].py -= velSubida;
    if (contSubiendo >= separa * lineasSubir) {
      contSubiendo = 0;
      subiendo = false;
      generarRects(lineasSubir);
      generarRan = false;
    }
  } else {
    if (fin && !esperando(100)) {
      alert("score: " + score);
      rectangulos.splice(0, rectangulos.length);
      (generarRan = false), (score = 0);
      generarRects(3);
      fin = false;
    }
    bajarRectangulos();
    if (bajandoRects() == false && fin == false) {
      if (puedeBorrar()) {
        if (!esperando(100)) {
          borrar();
          let sonidoLinea = new Audio();
          sonidoLinea.src = sonidosLinea[a];
          sonidoLinea.play();
          sonidoLinea.volume = 0.6;
          a++;
        }
      } else {
        fin = gameOver();
        if (!esperando(100)) {
          if (generarRan == true) {
            subiendo = true;
            if (lineasVivas() == 0) {
              lineasSubir = 3;
            } else if (lineasVivas() == 1) {
              lineasSubir = 2;
            } else {
              lineasSubir = 1;
            }
            for (let i = 0; i < rectangulos.length; i++) {
              rectangulos[i].y -= lineasSubir;
            }
          }
        }
      }
    }
  }
  pintarJuego();
  if (SonidoFondo.ended == true) {
    SonidoFondo.src = pianos[parseInt(random(0, 6))];
    SonidoFondo.play();
  }
}
///////////////////////////////////////
function bajandoRects() {
  let b = false;
  for (let i = 0; i < rectangulos.length; i++)
    if (rectangulos[i].py <= pic + rectangulos[i].y * separa) {
      rectangulos[i].py += vel;
      b = true;
    }
  return b;
}
function esperando(a) {
  if (espera < a) {
    espera++;
    return true;
  } else {
    espera = 0;
    return false;
  }
}
function generarRects(auxYanterior) {
  let auxX,
    auxN,
    maxN,
    auxY = filas - 1;
  let contSpace = 0,
    contRects = 0;
  while (auxY >= filas - auxYanterior) {
    (auxX = 0), (maxN = 4), (contSpace = 0), (contRects = 0);
    while (auxX < colums) {
      while (random(1, 3) == 2) auxX++, contSpace++;
      if (auxX < colums) {
        if (auxX > colums - maxN) maxN = colums - auxX;
        auxN = random(1, maxN);

        contRects++;
        rectangulos.push(
          new Rect(
            auxX,
            auxY,
            pic + auxY * separa,
            auxN,
            "rgb(" +
              random(50, 230) +
              "," +
              random(50, 230) +
              "," +
              random(50, 230) +
              ")"
          )
        );
        auxX += auxN;
      }
    }

    if (contSpace == colums && contRects == 0) {
      console.log("entra: " + auxY);
      auxY++;
    } else if (contSpace == 0) {
      console.log("entra2: " + auxY);
      auxY++, rectangulos.splice(rectangulos.length - contRects, contRects + 1);
    }
    auxY--;
  }
}
function gameOver() {
  for (let i = 0; i < rectangulos.length; i++)
    if (rectangulos[i].y == -1) {
      new Audio(sonidosGameOver[parseInt(random(0, 1))]).play();
      return true;
    }
  return false;
}
//pintarJuego()
function pintarJuego() {
  for (let j = filas - 1; j >= 0; j--) {
    for (let cont = 0; cont < colums; cont++) {
      for (let i = 0; i < rectangulos.length; i++) {
        if (rectangulos[i].y == j && rectangulos[i].x == cont) {
          if (
            pressed &&
            x1 > pif + rectangulos[i].x * separa &&
            x1 < pif + rectangulos[i].x * separa + rectangulos[i].n * separa &&
            y1 > pic + rectangulos[i].y * separa &&
            y1 < pic + rectangulos[i].y * separa + separa
          ) {
            // if(x2-(x1-(pif+rectangulos[i].x*separa)) < ) mover gris de atras
            select = true;
            posSelect = i;

            pintarFigura(
              [
                px,
                rectangulos[i].py,
                px + 8,
                rectangulos[i].py - 8,
                px + 8,
                rectangulos[i].py,
              ],
              rectangulos[i].color
            );
            pintarFigura(
              [
                px + rectangulos[i].n * separa,
                rectangulos[i].py + separa,
                px + 8 + rectangulos[i].n * separa,
                rectangulos[i].py - 8 + separa,
                px + rectangulos[i].n * separa,
                rectangulos[i].py + separa - 8,
              ],
              rectangulos[i].color
            );
            ctx.lineWidth = 3;
            ctx.strokeStyle = "black";

            ctx.fillStyle = rectangulos[i].color;
            ctx.fillRect(
              px + 8,
              rectangulos[i].py - 8,
              rectangulos[i].n * separa,
              separa
            );

            ctx.fillRect(
              px,
              rectangulos[i].py,
              rectangulos[i].n * separa,
              separa
            );
            ctx.strokeRect(
              px,
              rectangulos[i].py,
              rectangulos[i].n * separa,
              separa
            );

            // ctx.strokeRect(px+1, rectangulos[i].py+8, rectangulos[i].n*separa-8, separa-8);
            pintarLinea(
              px,
              rectangulos[i].py,
              px + 8,
              rectangulos[i].py - 8,
              "black",
              3
            );
            pintarLinea(
              px + 8 + rectangulos[i].n * separa,
              rectangulos[i].py - 8,
              px + 8,
              rectangulos[i].py - 8,
              "black",
              3
            );
            pintarLinea(
              px + 8 + rectangulos[i].n * separa,
              rectangulos[i].py - 8,
              px + 8 + rectangulos[i].n * separa,
              rectangulos[i].py - 8 + separa,
              "black",
              3
            );
            pintarLinea(
              px + 8 + rectangulos[i].n * separa - 8,
              rectangulos[i].py + separa,
              px + 8 + rectangulos[i].n * separa,
              rectangulos[i].py - 8 + separa,
              "black",
              3
            );
            pintarLinea(
              px + rectangulos[i].n * separa,
              rectangulos[i].py,
              px + rectangulos[i].n * separa + 8,
              rectangulos[i].py - 8,
              "black",
              3
            );
          } else {
            pintar3d(rectangulos[i]);
          }
        }
      }
    }
  }
  for (let j = filas - 1; j >= 0; j--) {
    for (let cont = 0; cont < colums; cont++) {
      for (let i = 0; i < rectangulos.length; i++) {
        if (rectangulos[i].y == j && rectangulos[i].x == cont) {
          if (
            pressed &&
            x1 > pif + rectangulos[i].x * separa &&
            x1 < pif + rectangulos[i].x * separa + rectangulos[i].n * separa &&
            y1 > pic + rectangulos[i].y * separa &&
            y1 < pic + rectangulos[i].y * separa + separa
          ) {
            // if(x2-(x1-(pif+rectangulos[i].x*separa)) < ) mover gris de atras
            select = true;
            posSelect = i;

            pintarFigura(
              [
                px,
                rectangulos[i].py,
                px + 8,
                rectangulos[i].py - 8,
                px + 8,
                rectangulos[i].py,
              ],
              rectangulos[i].color
            );
            pintarFigura(
              [
                px + rectangulos[i].n * separa,
                rectangulos[i].py + separa,
                px + 8 + rectangulos[i].n * separa,
                rectangulos[i].py - 8 + separa,
                px + rectangulos[i].n * separa,
                rectangulos[i].py + separa - 8,
              ],
              rectangulos[i].color
            );
            ctx.lineWidth = 3;
            ctx.strokeStyle = "black";

            ctx.fillStyle = rectangulos[i].color;
            ctx.fillRect(
              px + 8,
              rectangulos[i].py - 8,
              rectangulos[i].n * separa,
              separa
            );

            ctx.fillRect(
              px,
              rectangulos[i].py,
              rectangulos[i].n * separa,
              separa
            );
            ctx.strokeRect(
              px,
              rectangulos[i].py,
              rectangulos[i].n * separa,
              separa
            );

            // ctx.strokeRect(px+1, rectangulos[i].py+8, rectangulos[i].n*separa-8, separa-8);
            pintarLinea(
              px,
              rectangulos[i].py,
              px + 8,
              rectangulos[i].py - 8,
              "black",
              3
            );
            pintarLinea(
              px + 8 + rectangulos[i].n * separa,
              rectangulos[i].py - 8,
              px + 8,
              rectangulos[i].py - 8,
              "black",
              3
            );
            pintarLinea(
              px + 8 + rectangulos[i].n * separa,
              rectangulos[i].py - 8,
              px + 8 + rectangulos[i].n * separa,
              rectangulos[i].py - 8 + separa,
              "black",
              3
            );
            pintarLinea(
              px + 8 + rectangulos[i].n * separa - 8,
              rectangulos[i].py + separa,
              px + 8 + rectangulos[i].n * separa,
              rectangulos[i].py - 8 + separa,
              "black",
              3
            );
            pintarLinea(
              px + rectangulos[i].n * separa,
              rectangulos[i].py,
              px + rectangulos[i].n * separa + 8,
              rectangulos[i].py - 8,
              "black",
              3
            );
          } else {
            pintarRect(rectangulos[i]);
          }
        }
      }
    }
  }
}

//funcion rectangulos
function puedeBorrar() {
  let cont = 0;
  for (let j = filas - 1; j >= 0; j--) {
    cont = 0;
    for (let i = 0; i < rectangulos.length; i++) {
      if (rectangulos[i].y == j) cont += rectangulos[i].n;
    }
    if (cont == colums) {
      return true;
    }
  }
  return false;
}
function borrar() {
  let cont = 0,
    b = false;
  for (let j = filas - 1; j >= 0; j--) {
    cont = 0;
    for (let i = 0; i < rectangulos.length; i++) {
      if (rectangulos[i].y == j) cont += rectangulos[i].n;
    }
    if (cont == colums) {
      borrarLinea(j);
      score += 30;
      b = true;
      generarRan = true;
    }
  }
}
function lineasVivas() {
  let cont = 0;
  for (let j = filas - 1; j >= 0; j--) {
    for (let i = 0; i < rectangulos.length; i++) {
      if (rectangulos[i].y == j) {
        cont++;
        break;
      }
    }
  }
  return cont;
}
function borrarLinea(b) {
  for (let i = 0; i < rectangulos.length; i++) {
    if (rectangulos[i].y == b) {
      rectangulos.splice(i--, 1);
    }
  }
}
function bajarRectangulos() {
  let b = false;
  for (let j = filas - 2; j >= 0; j--) {
    for (let i = 0; i < rectangulos.length; i++) {
      if (rectangulos[i].y == j && puedeBajar(j + 1, i)) {
        rectangulos[i].y++;
        // if(rectangulos[i].py >= pic+(rectangulos[i].y)*separa)
        // else
        b = true;
      }
    }
  }
  return b;
}
function puedeBajar(b, pos) {
  for (let i = 0; i < rectangulos.length; i++) {
    if (
      rectangulos[i].y == b &&
      ((rectangulos[pos].x < rectangulos[i].x + rectangulos[i].n &&
        rectangulos[pos].x >= rectangulos[i].x) ||
        (rectangulos[pos].x + rectangulos[pos].n > rectangulos[i].x &&
          rectangulos[pos].x + rectangulos[i].n <=
            rectangulos[i].x + rectangulos[i].n))
    )
      return false;
  }
  return true;
}

//pintar
function pintarLineasH() {
  for (let i = 0; i <= filas; i++) {
    pintarLinea(
      pif + 8,
      pic + i * separa - 8,
      pif + colums * separa + 8,
      pic + i * separa - 8,
      "#BAB6B6",
      2
    );
  }
}
function pintarLineasV() {
  for (let i = 0; i <= colums; i++) {
    pintarLinea(
      pif + i * separa + 8,
      pic - 8,
      pif + i * separa + 8,
      pic + filas * separa - 8,
      "#BAB6B6",
      2
    );
  }
}
function pintarRect(rectangulo) {
  ctx.beginPath();
  ctx.lineWidth = 3;
  ctx.strokeStyle = "black";
  ctx.fillStyle = rectangulo.color;

  ctx.fillRect(
    pif + rectangulo.x * separa,
    rectangulo.py,
    rectangulo.n * separa,
    separa
  );
  ctx.strokeRect(
    pif + rectangulo.x * separa,
    rectangulo.py,
    rectangulo.n * separa,
    separa
  );
}
function pintar3d(rectangulo) {
  ctx.beginPath();
  pintarFigura(
    [
      pif + rectangulo.x * separa,
      rectangulo.py,
      pif + rectangulo.x * separa + 8,
      rectangulo.py - 8,
      pif + rectangulo.x * separa + 8,
      rectangulo.py,
    ],
    rectangulo.color
  );
  pintarFigura(
    [
      pif + rectangulo.x * separa + rectangulo.n * separa,
      rectangulo.py + separa,
      pif + rectangulo.x * separa + 8 + rectangulo.n * separa,
      rectangulo.py - 8 + separa,
      pif + rectangulo.x * separa + rectangulo.n * separa,
      rectangulo.py + separa - 8,
    ],
    rectangulo.color
  );
  ctx.lineWidth = 3;
  ctx.strokeStyle = "black";

  ctx.fillStyle = rectangulo.color;
  ctx.fillRect(
    pif + rectangulo.x * separa + 8,
    rectangulo.py - 8,
    rectangulo.n * separa,
    separa
  );
  // ctx.strokeRect(pif+rectangulo.x*separa+1, rectangulo.py+8, rectangulo.n*separa-8, separa-8);
  pintarLinea(
    pif + rectangulo.x * separa,
    rectangulo.py,
    pif + rectangulo.x * separa + 8,
    rectangulo.py - 8,
    "black",
    3
  );
  pintarLinea(
    pif + rectangulo.x * separa + 8 + rectangulo.n * separa,
    rectangulo.py - 8,
    pif + rectangulo.x * separa + 8,
    rectangulo.py - 8,
    "black",
    3
  );
  pintarLinea(
    pif + rectangulo.x * separa + 8 + rectangulo.n * separa,
    rectangulo.py - 8,
    pif + rectangulo.x * separa + 8 + rectangulo.n * separa,
    rectangulo.py - 8 + separa,
    "black",
    3
  );
  pintarLinea(
    pif + rectangulo.x * separa + 8 + rectangulo.n * separa - 8,
    rectangulo.py + separa,
    pif + rectangulo.x * separa + 8 + rectangulo.n * separa,
    rectangulo.py - 8 + separa,
    "black",
    3
  );
  pintarLinea(
    pif + rectangulo.x * separa + rectangulo.n * separa,
    rectangulo.py,
    pif + rectangulo.x * separa + rectangulo.n * separa + 8,
    rectangulo.py - 8,
    "black",
    3
  );
}
function pintarFigura(v = [], c) {
  ctx.beginPath();
  // ctx.lineWidth = 3;
  // ctx.strokeStyle = c;
  ctx.fillStyle = c;

  ctx.moveTo(v[0], v[1]);
  for (let i = 2; i < v.length; i += 2) {
    ctx.lineTo(v[i], v[i + 1]);
  }
  ctx.closePath();
  // ctx.stroke();
  ctx.fill();
}
function pintarLinea(x1, y1, x2, y2, c, line) {
  ctx.beginPath();
  ctx.lineWidth = line; // grosor de la linea
  ctx.strokeStyle = c;

  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.closePath();
}

function pintarTexto(x, y, cad) {
  ctx.beginPath(); //iniciar ruta
  ctx.strokeStyle = "blue"; //color externo
  // ctx.fillStyle="red"; //color de relleno
  ctx.font = "bold 20px arial"; //estilo de texto
  ctx.strokeText(cad, x, y); //cad con método stroke
  // ctx.fillText(cad,10,80); //cad con método fill
  // ctx.strokeText(cad,10,140); //cad con los dos métodos
  // ctx.fillText(cad,10,140);
}

// EVENTO MOUSEDOWN -----------------------------
canvas.addEventListener(
  "mousedown",
  (evt) => {
    x1 = evt.layerX;
    y1 = evt.layerY;
    x2 = x1;
    y2 = y1;
    //console.log("empezo a dibujar");

    pressed = true;
  },
  false
);

// EVENTO MOUSEMOVE ----------------------------
canvas.addEventListener(
  "mousemove",
  (evt) => {
    x2 = evt.layerX;
    y2 = evt.layerY;
  },
  false
);

// EVENTO MOUSEUP ------------------------------
canvas.addEventListener(
  "mouseup",
  (evt) => {
    x2 = evt.layerX;
    y2 = evt.layerY;
    //console.log("dejo de dibujar");
    //rectangulos[i].x= grisx;
    if (
      select == true &&
      rectangulos[posSelect].x != (grisx - pif - 8) / separa
    ) {
      rectangulos[posSelect].x = parseInt((grisx - pif) / separa);
      generarRan = true;
    }
    pressed = select = false;
  },
  false
);

canvas.addEventListener(
  "touchstart",
  (evt) => {
    console.log(event);
    x1 = evt.touches[0].pageX;
    y1 = evt.touches[0].pageY - separa;
    x2 = x1;
    y2 = y1;
    //console.log("empezo a dibujar");

    pressed = true;
  },
  false
);
//////////////////////////mobiles///////////////////////////
canvas.addEventListener(
  "touchend",
  (evt) => {
    // console.log(event)
    // x2 = evt.pageX;
    // y2 = evt.pageY;
    //console.log("dejo de dibujar");
    //rectangulos[i].x= grisx;
    if (select == true && rectangulos[posSelect].x != (grisx - pif) / separa) {
      rectangulos[posSelect].x = parseInt((grisx - pif) / separa);
      generarRan = true;
    }
    pressed = select = false;
  },
  false
);
canvas.addEventListener(
  "touchmove",
  (evt) => {
    //console.log(event)
    x2 = evt.touches[0].pageX;
    y2 = evt.touches[0].pageY;
  },
  false
);

// CONVERTIR pendiente a grados
function pendtoGrado(m) {
  return (Math.atan(m) * 180) / Math.PI;
}

function ToAngulo(rad) {
  return (rad * 180) / Math.PI;
}

// Retorna un número aleatorio entre min (incluido) y max (incluido)
function random(min, max) {
  // return Math.random() * (max - min) + min + 1;
  return Math.round(Math.random() * (max - min) + min);
}

function ToRad(angulo) {
  return (angulo * Math.PI) / 180;
}

function valorAbs(x) {
  if (x < 0) return -x;
  return x;
}

function planoC(y) {
  return HEIGHT - y;
}
