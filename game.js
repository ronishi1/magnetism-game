c = document.getElementById("game");
ctx = c.getContext("2d");
var controls = document.getElementById('controls')
var showUI = (show) => {
  if (show) {
    controls.style.display = 'block'
  } else {
    controls.style.display = 'none'
  }
}

showUI(false)


var particleSign,velocity,mField;

var signs = ["positive","negative"];
var directions = ["down"];
var fields = ["out","in"]
var setup = function() {
  // initialize state of game here
  ctx.clearRect(0, 0, 600, 600);
  var chosenSign = signs[Math.floor(Math.random() * signs.length)]
  var chosenField = fields[Math.floor(Math.random() * fields.length)]
  var chosenDirection = directions[Math.floor(Math.random() * directions.length)]
  console.log(chosenSign, chosenDirection, chosenField)
  createCanvas(chosenSign, chosenDirection, chosenField)
}

var [xCor, yCor] = [275, 0];
var [xVel, yVel] = [0, 0];
var speed = 6;
var particle;
var fieldlines;

var createCanvas = function (sign, direction, field) {
  particle = new Image();   // Create new img element
  console.log(direction)
  switch (direction) {
    case 'down':
      xVel = 0
      yVel = 1
      break;
    case 'up':
      xVel = 0
      yVel = -1
      break;
    case 'left':
      xVel = -1
      yVel = 0
      break;
    case 'right':
      xVel = 1
      yVel = 0
      break;
    default:
      xVel = 0
      yVel = 0
      break;
  }

  if (sign == 'negative') {
    particle.src = 'images/electron.png'; // Set source path
  }
  else if (sign == 'positive') {
    particle.src = 'images/proton.png'; // Set source path
  }
  particle.onload = function(){
    drawParticle(xCor, yCor + 200, false)
  }

  fieldlines = new Image();
  if (field == 'in') {
    fieldlines.src = 'images/infield.png';
  }
  else if (field == 'out'){
    fieldlines.src = 'images/outfield.png';
  }
}

var id = -1;

var stopAnimation = (e) => {
	if (id > 0) {
		window.cancelAnimationFrame(id);
		id = -1;
	}
}


var drawParticle = (stopX, stopY, setupOnComplete) => {;
	ctx.clearRect(0, 0, 600, 600);
	ctx.beginPath();
  ctx.drawImage(fieldlines,0,0);
	ctx.drawImage(particle, xCor, yCor, 50, 50);

  var distance = (xCor - stopX) ** 2 + (yCor - stopY) ** 2
  // console.log(distance)
  if (distance < 10) {
    showUI(true);
    stopAnimation();
    if (setupOnComplete) setup()
  } else {
    xCor += speed * xVel;
    yCor += speed * yVel;
    id = window.requestAnimationFrame(() => {drawParticle(stopX, stopY)});
  }
}

setup();

// Controls
var leftButton = document.getElementById('left')
var rightButton = document.getElementById('right')
var upButton = document.getElementById('up')
var downButton = document.getElementById('down')

leftButton.addEventListener ('click', () => {
  xVel = -1;
  yVel = 0;
  showUI(false);
  drawParticle(xCor - 400, yCor, true)
})

rightButton.addEventListener ('click', () => {
  xVel = 1;
  yVel = 0;
  showUI(false);
  drawParticle(xCor + 400, yCor, true)
})

upButton.addEventListener ('click', () => {
  xVel = 0;
  yVel = -1;
  showUI(false);
  drawParticle(xCor, yCor - 400, true)
})

downButton.addEventListener ('click', () => {
  xVel = 0;
  yVel = 1;
  showUI(false);
  drawParticle(xCor, yCor + 400, true)
})
