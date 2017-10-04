"use strict"
var canvas = document.getElementById('snake');
var ctx = canvas.getContext('2d');
var options = {
  bg: "#888",
  scolor: "lightgreen",
  acolor: "red",
  ocolor: "#212121",
  wall: true,
  poison: false,
  powerup: true,
  map: 1,
  dark: false
}
var fps = 15;
var tilewidth = canvas.width/ 50;
var gameover = false;
var score = 0;
var pause = true;

// Food
var ax,ay,vx,vy,px,py;

//Eating poison means DEATH
var apple = [[ax,ay]];
var poison = [];
var powerups = [];

var play = false;
var twoplayer = false;

var player = new Player(tilewidth,0,tilewidth,0,0,0,[ [this.x,this.y] , [this.x - tilewidth,this.y] ],false,0);
var player2 = new Player(canvas.width - 2 * tilewidth,canvas.height - tilewidth,0,0,0,tilewidth,[ [this.x,this.y] , [this.x - tilewidth,this.y] ],false,0);

function Player(x,y,md,ms,mw,ma,snake,double) {
  this.x = x;
  this.y = y;
  this.md = md;
  this.ms = ms;
  this.mw = mw;
  this.ma = ma;
  this.snake = snake;
  this.double = double;
  this.stop = stop;
}

window.onload = function () {
  //width INITIALIZER
  for (var t = 50; (t < window.innerWidth * 0.8) && ( t < window.innerHeight * 0.8); t += 50) {
    canvas.width = t;
  }
  canvas.height = canvas.width;
  tilewidth = canvas.width/50;
  reset();

  //UPDATE CANVAS
  setInterval( function() {
    if(options.wall === true) {canvas.style.border = "2px dashed lightgreen"}
    else if (options.wall === false) {canvas.style.border = "2px solid #666"}
    if (twoplayer) {
      move(player);
      move(player2);
      draw(player,player2);
      // if (player.double === true) {move(player);}
      // if (player2.double === true) {move(player2);}
    }
    else if (!twoplayer) {
      move(player);
      draw(player);
      // if (!player.double === false) {move(player);}
    }
		menu();
  },1000/fps);
}

window.onresize = function() {
  if (!play) {
    for (var t = 50; (t < window.innerWidth * 0.8) && ( t < window.innerHeight * 0.8); t += 50) {
      canvas.width = t;
    }
    canvas.height = canvas.width;
    tilewidth = canvas.width/50;
    reset();
  }
}

function reset() {
  score = 0;
  poison = [];
  options.scolor = "lightgreen";
  options.wall = true;
  options.poison = false;
  options.dark = false;
  poison = [];
  apple = [[Math.floor(Math.random() * canvas.width / tilewidth) * tilewidth,Math.floor(Math.random() * canvas.height / tilewidth) * tilewidth]];
  powerups = [];

  player.x = tilewidth;
  player.y = 0;
  player.snake = [ [tilewidth,0] , [0,0] ];
  player.ms = 0;
  player.mw = 0;
  player.ma = 0;
  player.md = tilewidth;
  player.double = false;

  if (twoplayer) {
    debugger;
    player2.x = canvas.width - 2 * tilewidth;
    player2.y = canvas.height - tilewidth;
    player2.md = 0;
    player2.ms = 0;
    player2.mw = 0;
    player2.ma= tilewidth;
    player2.snake = [ [canvas.width - 2 * tilewidth, canvas.height - tilewidth] , [canvas.width - 2 * tilewidth + tilewidth, canvas.height - tilewidth]];
    player2.double = false;
  }

  gameover = false;
}

function menu() {
  if (play) {return;}
  else if (!play) {
	 ctx.fillStyle = options.bg;
   ctx.fillRect(0,0,canvas.width,canvas.height);
	 ctx.fillStyle = "black";
	 ctx.textBaseline="middle";
	 ctx.textAlign = "center";
	 ctx.font= "30px Calibri";
   ctx.fillStyle = options.scolor;
	 ctx.fillText("SNAKE", canvas.width/2, canvas.height/2);
   ctx.font = "12px Arial";
   ctx.fillStyle = 'black';
	 ctx.fillText("Singleplayer = E", canvas.width/2, canvas.height/2 + 24);
	 ctx.fillText("Twoplayer = Z", canvas.width/2, canvas.height/2 + 38);
   ctx.fillText("Powerups on/off = P", canvas.width/2, canvas.height - 24);
   if (options.powerup === true) {
     ctx.fillText("Powerups on!", canvas.width/2, canvas.height - 12);
   }
   else if (options.powerup === false) {
     ctx.fillText("Powerups off.", canvas.width/2, canvas.height - 12);
   }
  }
}

// KEYBORDMAPPING
window.addEventListener("keydown", function(evt) {
  if (evt.keyCode == 69 && !play) {
    evt.preventDefault();
    play = true;
    console.log("click!");
  }

  if (evt.keyCode == 90 && !play) {
    evt.preventDefault();
    play = true;
    twoplayer = true;
    reset();
    console.log("click!");
  }

  if (evt.keyCode == 80 && !play) {
    evt.preventDefault();
    // if (options.powerup === true) {options.powerup = false;}
    // else if (options.powerup === false) {options.powerup = true;}
    options.powerup = !options.powerup;
    console.log("click!");
  }

  if (evt.keyCode == 32 && play) {
    evt.preventDefault();
    pause= !pause;

  }

  if (evt.keyCode == 32 && gameover) {
    evt.preventDefault();
    reset();
  }


  if (evt.keyCode == 77 && gameover) {
    evt.preventDefault();
    reset();
    play = false;
  }


  if (evt.keyCode == 38) {
    evt.preventDefault();
    if (player.ms > 0) {return;}
    else {
      player.mw = tilewidth;
      player.md = 0;
      player.ma = 0;
    }
  }

  else if (evt.keyCode == 40) {
    evt.preventDefault();
    if (player.mw > 0) {return;}
    else {
      player.ms = tilewidth;
      player.md = 0;
      player.ma = 0;
    }
  }

  else if (evt.keyCode == 39) {
    evt.preventDefault();
    if (player.ma > 0) {return;}
    else {
      player.md = tilewidth;
      player.mw = 0;
      player.ms = 0;
    }
  }

  else if (evt.keyCode == 37) {
    evt.preventDefault();
    if (player.md > 0) {return;}
    else {
      player.ma = tilewidth;
      player.mw = 0;
      player.ms = 0;
    }
  }

  //TWOPLAYER
  if (twoplayer) {
    if (evt.keyCode == 87) {
      evt.preventDefault();
      if (player2.ms > 0) {return;}
      else {
        player2.mw = tilewidth;
        player2.md = 0;
        player2.ma = 0;
      }
    }

    else if (evt.keyCode == 83) {
      evt.preventDefault();
      if (player2.mw > 0) {return;}
      else {
        player2.ms = tilewidth;
        player2.md = 0;
        player2.ma = 0;
      }
    }

    else if (evt.keyCode == 68) {
      evt.preventDefault();
      if (player2.ma > 0) {return;}
      else {
        player2.md = tilewidth;
        player2.mw = 0;
        player2.ms = 0;
      }
    }

    else if (evt.keyCode == 65) {
      evt.preventDefault();
      if (player2.md > 0) {return;}
      else {
        player2.ma = tilewidth;
        player2.mw = 0;
        player2.ms = 0;
      }
    }
  }
})

//add food position to snake
function snakegrow(figure,apple) {
  figure.snake.push([apple[0],apple[1]]);
}

function move(figure) {
 if (play == false || figure.stop > 0 || pause) {return;}
 else if (play) {

   //positionchange
   figure.x += figure.md;
   figure.x -= figure.ma;
   figure.y += figure.ms;
   figure.y -= figure.mw;

   //colisionhandling

    if (options.wall === true) {
      if (figure.x < 0 || figure.x > canvas.width - tilewidth || figure.y < 0 || figure.y > canvas.height - tilewidth) {
        gameover = true;
        return;
      }
    }

    else if (options.wall === false) {
      if (figure.x < 0) {figure.x = canvas.width - tilewidth;}
      if (figure.x > canvas.width - tilewidth) {figure.x = 0;}

      if (figure.y < 0) {figure.y = canvas.height - tilewidth;}
      if (figure.y > canvas.height - tilewidth) {figure.y = 0;}

    }


   // Move figure.snake: shift all bodypart positions to the position off the previous bodypart
    for (var i = figure.snake.length - 1; i > 0; i--) {
      figure.snake[i][0] = figure.snake[i-1][0];
      figure.snake[i][1] = figure.snake[i-1][1];
   }
   // Set the position of the head to x and y
    figure.snake[0][1] = figure.y;
    figure.snake[0][0] = figure.x;

   // Check if snake ate itself
    for (var f = 4; f < figure.snake.length; f++) {
       if (figure.snake[0][0] == figure.snake[f][0] && figure.snake[0][1] == figure.snake[f][1]) {
          gameover = true;
       }
    }

   //if the snake "eats" the apple get a new random position for the food and let the snake grow
   for (var a = 0; a < apple.length; a++) {
     if (figure.x == apple[a][0] && figure.y == apple[a][1]) {
        score += 1;
        for (var t = 0; t < 100; t++) {
          snakegrow(figure,apple[a]);
        }
        // calculatepos(ax,ay);
        ax = Math.floor(Math.random() * canvas.width / tilewidth) * tilewidth;
        ay = Math.floor(Math.random() * canvas.height/ tilewidth) * tilewidth;
        apple[a] = [];
        apple[0][0] = ax;
        apple[0][1] = ay;

        if (options.poison === true) {
          vx = Math.floor(Math.random() * canvas.width / tilewidth) * tilewidth;
          vy = Math.floor(Math.random() * canvas.height/ tilewidth) * tilewidth;
          poison.push([vx,vy]);
        }

        if (options.powerup === true){
          if (Math.random() > 0.5) {
            px = Math.floor(Math.random() * canvas.width / tilewidth) * tilewidth;
            py = Math.floor(Math.random() * canvas.height/ tilewidth) * tilewidth;
            powerups = [];
            powerups[0] = [px,py,Math.floor((Math.random()*8) + 1)];
            // powerups[0] = [px,py,2];
            if (powerups[0][2] == 8) {powerups[1] = [canvas.width - px - tilewidth,canvas.height - py - tilewidth,8];}
          }
        }
      }
    }

    if (options.poison === true) {
      for (var h = 0; h < poison.length; h++) {
        if (figure.x == poison[h][0] && figure.y == poison[h][1]) {gameover = true;}
      }
    }

    if (options.powerup === true) {
      for (var h = 0; h < powerups.length; h++) {
        if (figure.x == powerups[h][0] && figure.y == powerups[h][1]) {
          power(powerups[h][2],figure);
          return;
        }
      }
    }
	}
}

function power(index,figure) {
  if (index == 1) {
    var r = Math.floor(Math.random()*255 + 1);
    var g = Math.floor(Math.random()*255 + 1);
    var b = Math.floor(Math.random()*255 + 1);
    options.scolor = "rgb(" + r + "," + g + "," + b + ")";
  }
  else if (index == 2) {
    // if (figure.double === true) {figure.double = false; return;}
    // if (figure.double === false) {figure.double = true; return;}
    if (options.dark === true) {options.dark = false; return;}
    if (options.dark === false) {options.dark = true; return;}
  }
  else if (index == 3) {
    if (options.wall === true) {options.wall = false; return;}
    if (options.wall === false) {options.wall = true; return;}
  }
  else if (index == 4) {
    if (figure == player) {player2.stop = fps*2;}
    if (figure == player2) {player.stop = fps*2;}
  }
  else if (index == 5) {
    if (options.poison === true) {options.poison = false; return;}
    if (options.poison === false) {options.poison = true; return;}
  }
  else if (index == 6) {
    if (figure.md > 0 || figure.ma > 0) {figure.mw = tilewidth;}
    else if (figure.mw > 0 || figure.ms > 0) {figure.ma = tilewidth;}
  }
  else if (index == 7) {
    powerups = [];
    for (var t = 0; t < figure.snake.length; t++){
      apple.push([figure.snake[t][0],figure.snake[t][1]]);
    }
  }
  else if (index == 8) {
    if (figure.x == powerups[1][0] && figure.y == powerups[1][1]) {
      figure.x = powerups[0][0];
      figure.y = powerups[0][1];
      return;}
    else if (figure.x == powerups[0][0] && figure.y == powerups[0][1]) {
      figure.x = powerups[1][0];
      figure.y = powerups[1][1];
      return;}
  }
  else if (index == 9) {
    // canvas.width += 100;
    // canvas.height += 100;

  }
}

// function calculatepos(x,y) {
//   x = Math.floor(Math.random() * canvas.width / tilewidth) * tilewidth;
//   y = Math.floor(Math.random() * canvas.height/ tilewidth) * tilewidth;
// }

function draw() {
  ctx.fillStyle = options.bg;
  ctx.fillRect(0,0,canvas.width,canvas.height);
  if (options.map == 2) {
    ctx.fillStyle = options.ocolor;
    ctx.fillRect(5*tilewidth,5*tilewidth,canvas.width-10*tilewidth,tilewidth);
  }

  document.getElementById('score').innerHTML = score;
  if (gameover) {
    ctx.fillStyle = "black";
    ctx.textBaseline="middle";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER!", canvas.width/2, canvas.height/2);
    ctx.fillText("You have reached following score: " + score, canvas.width/2, canvas.height/2 + 12);
    ctx.fillText("Press the spacebar to play again.", canvas.width/2, canvas.height - 12);
    ctx.fillText("Press M to get back to the menu.", canvas.width/2, canvas.height - 24);
  }

  else if (!gameover){

    ctx.fillStyle = options.acolor;
    for (var a = 0; a < apple.length; a++) {
      ctx.fillRect(apple[a][0],apple[a][1],tilewidth,tilewidth)
    }

    if (options.poison === true) {
      ctx.fillStyle = "purple";
      for (var h = 0; h < poison.length; h++) {
        ctx.fillRect(poison[h][0],poison[h][1],tilewidth,tilewidth);
      }
    }

    if (options.powerup === true) {
      for (var h = 0; h < powerups.length; h++) {
        switch (powerups[h][2]) {
          case 1:  ctx.fillStyle = "orange";
          break;
          case 2: ctx.fillStyle = "blue";
          break;
          case 3: ctx.fillStyle = "pink";
          break;
          case 4: ctx.fillStyle = "lime";
          break;
          case 5: ctx.fillStyle = "black";
          break;
          case 6: ctx.fillStyle = "magenta";
          break;
          case 7: ctx.fillStyle = "yellow";
          break;
          case 8: ctx.fillStyle = "green";
          break;
          case 9: ctx.fillStyle = "white";
        }
        ctx.fillRect(powerups[h][0],powerups[h][1],tilewidth,tilewidth);
      }
    }

    if (options.dark === true && play) {
      var radius = 5;
      // WORKS FOR ONE PLAYER
      ctx.beginPath();
      ctx.fillStyle = "black";
      ctx.rect(0,0,canvas.width,canvas.height);
      ctx.moveTo(arguments[0].snake[0][0] - radius * tilewidth,arguments[0].snake[0][1] - radius * tilewidth);
      ctx.rect(arguments[0].snake[0][0] - radius * tilewidth,arguments[0].snake[0][1] - radius * tilewidth, ((2* radius)+1) * tilewidth, ((2 * radius) + 1) * tilewidth);
      ctx.moveTo(0,0);
      if (twoplayer) {
       ctx.moveTo(arguments[1].snake[0][0] - radius * tilewidth,arguments[1].snake[0][1] - radius * tilewidth);
       ctx.rect(arguments[1].snake[0][0] - radius * tilewidth,arguments[1].snake[0][1] - radius * tilewidth, ((2* radius)+1) * tilewidth, ((2* radius)+1) * tilewidth);
      }
    }

    ctx.fill('evenodd');
    ctx.fillStyle = options.scolor;
    for (var k = 0; k < arguments.length; k++) {
      for (var i = 0; i < arguments[k].snake.length; i++) {
        ctx.fillRect(arguments[k].snake[i][0],arguments[k].snake[i][1],tilewidth,tilewidth);
      }
      if (arguments[k].stop > 0) {(arguments[k].stop)--;}
    }
  }
}

//   ctx.fillStyle = "black";
//   if (arguments.length == 1) {
//     ctx.fillRect(0,0,arguments[0].snake[0][0] - radius *tilewidth,canvas.height);
//     ctx.fillRect(arguments[0].snake[0][0] + (radius + 1) *tilewidth,0,canvas.width,canvas.height);
//     ctx.fillRect(0,0,canvas.width,arguments[0].snake[0][1] - radius *tilewidth);
//     ctx.fillRect(0,arguments[0].snake[0][1] + (radius + 1) *tilewidth,canvas.width,canvas.height);
//     // ctx.clearRect(arguments[k].snake[0][0] - 2 *tilewidth,arguments[k].snake[0][1] - 2 * tilewidth,5*tilewidth,5*tilewidth)
//   }
//   else if (arguments.length == 2) {
//     var top,down;
//     if (arguments[0].snake[0][1] < arguments[1].snake[0][1]) {top = 0; down = 1;}
//     else {top = 1; down = 0;}
//
//     ctx.fillRect(0,0,canvas.width,arguments[top].snake[0][1] - radius *tilewidth);
//     if ((arguments[down].snake[0][1] - radius *tilewidth) - (arguments[top].snake[0][1] + radius *tilewidth) > 0) {
//       ctx.fillRect(0,arguments[top].snake[0][1] + radius *tilewidth,canvas.width,(arguments[down].snake[0][1] - radius *tilewidth) - (arguments[top].snake[0][1] + radius *tilewidth))
//     }
//     ctx.fillRect(0,arguments[down].snake[0][1] + radius *tilewidth,canvas.width,canvas.height);
//
//     var right,left;
//     if (arguments[0].snake[0][0] < arguments[1].snake[0][0]) {right = 0; left = 1}
//     else {right = 1; left = 0;}
//
//     ctx.fillRect(0,0,arguments[right].snake[0][0] - radius *tilewidth,canvas.height);
//     if ((arguments[left].snake[0][0] - radius *tilewidth) - (arguments[right].snake[0][0] + radius *tilewidth) > 0) {
//       ctx.fillRect(arguments[right].snake[0][0] + radius *tilewidth,0,(arguments[left].snake[0][0] - radius *tilewidth) - (arguments[right].snake[0][0] + radius *tilewidth),canvas.height)
//     }
//     ctx.fillRect(arguments[left].snake[0][0] + radius *tilewidth,0,canvas.width,canvas.height);
//   }
//  }
