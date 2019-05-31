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

var reset = (fullReset) => {
  if (fullReset) {
    [xCor, yCor] = [275, 0];
  }
  [xVel, yVel] = [0, 0];
  ctx.clearRect(0, 0, 600, 600);
  direction = "down"
  circles = [];
  showUI(false)
}

var correctAnswer = (direction,field,charge) => {
  if (charge == "positive"){
    if (field == "in"){
      switch(direction){
        case "down":
          return "right"
          break;
        case "up":
          return "left"
          break;
        case "left":
          return "down"
          break;
        default:
          return "up"
          break;
      }
    }
    else {
      switch(direction){
        case "down":
          return "left"
          break;
        case "up":
          return "right"
          break;
        case "left":
          return "up"
          break;
        default:
          return "down"
          break;
      }
    }
  }
  else {
    if (field == "in"){
      switch(direction){
      case "down":
        return "left"
        break;
      case "up":
        return "right"
        break;
      case "left":
        return "up"
        break;
      default:
        return "down"
        break;
      }
    }
    else {
      switch(direction){
        case "down":
          return "right"
          break;
        case "up":
          return "left"
          break;
        case "left":
          return "down"
          break;
        default:
          return "up"
          break;
      }
    }
  }
}
var particleSign,velocity,mField,answer;


var signs = ["positive","negative"];
var direction = "down"
var fields = ["out","in"]
var setup = function() {
  // initialize state of game here
  ctx.clearRect(0, 0, 600, 600);
  var chosenSign = signs[Math.floor(Math.random() * signs.length)];
  var chosenField = fields[Math.floor(Math.random() * fields.length)];
  var chosenDirection = direction
  console.log(chosenSign, chosenDirection, chosenField);
  answer = correctAnswer(chosenDirection,chosenField,chosenSign);
  console.log(answer);
  createCanvas(chosenSign, chosenDirection, chosenField);
}

var [xCor, yCor] = [275, 0];
var [xVel, yVel] = [0, 0];
var speed = 5;
var particle;
var fieldlines;

var createCanvas = function (sign, direction, field) {
  particle = new Image();   // Create new img element
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
    if (direction == 'down')
      drawParticle(xCor, yCor + 275, false)
    if (direction == 'up')
      drawParticle(xCor, yCor - 275, false)
    if (direction == 'left')
      drawParticle(xCor - 275, yCor, false)
    if (direction == 'right')
      drawParticle(xCor + 275, yCor, false)
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

var circles = []

var createCircle = (x, y) => {
  ctx.beginPath();
  ctx.arc(x+25, y+25, 6, 0, 2 * Math.PI);
  // ctx.lineWidth = 0;
  ctx.fillStyle = "#047c42";
  ctx.stroke();
  ctx.fill();
}

var drawCircle = false;
var circleFrames = 1
var drawParticle = (stopX, stopY, resetOnDone, dir) => {
	ctx.clearRect(0, 0, 600, 600);
	ctx.beginPath();
  ctx.drawImage(fieldlines,0,0);
	ctx.drawImage(particle, xCor, yCor, 50, 50);
  circles.forEach(circle => {
    createCircle(circle.xCor, circle.yCor)
  })
  var distance = (xCor - stopX) ** 2 + (yCor - stopY) ** 2
  // console.log(distance)
  if (distance < 10) {
    showUI(true);
    if (resetOnDone) {
      reset()
      direction = dir;
      if (direction == 'left') {
        xCor = 550
        yCor = 300
      }
      else if (direction == 'right') {
        xCor = 0
        yCor = 300
      }
      else if (direction == 'up') {
        xCor = 275
        yCor = 575
      }
      else if (direction == 'down') {
        xCor = 300
        yCor = 0
      }
      setup()
    }
    stopAnimation();
  }
  else {
    if (circleFrames % 10 == 0) {
      circles.push({xCor, yCor})
      //createCircle(xCor, yCor)
    }
    circleFrames++

    xCor += speed * xVel;
    yCor += speed * yVel;
    id = window.requestAnimationFrame(() => {drawParticle(stopX, stopY, resetOnDone, dir)});
  }
}

setup();

var resetGame = () => {
  alert('Your score was X. Press okay to restart game.')
  reset();
  setup();
}

// Controls
var leftButton = document.getElementById('left')
var rightButton = document.getElementById('right')
var upButton = document.getElementById('up')
var downButton = document.getElementById('down')

leftButton.addEventListener ('click', () => {
  xVel = -1;
  yVel = 0;
  showUI(false);
  if("left" == answer){
    drawParticle(xCor - 300, yCor, true, 'left')
  }
  else {
    resetGame(true)
  }
})

rightButton.addEventListener ('click', () => {
  xVel = 1;
  yVel = 0;
  showUI(false);
  if("right" == answer){
    drawParticle(xCor + 300, yCor, true, 'right')
  }
  else {
    resetGame(true)
  }
})

upButton.addEventListener ('click', () => {
  xVel = 0;
  yVel = -1;
  showUI(false);
  if("up" == answer){
    drawParticle(xCor, yCor - 300, true, 'up')
  }
  else {
    resetGame(true)
  }
})

downButton.addEventListener ('click', () => {
  xVel = 0;
  yVel = 1;
  showUI(false);
  if("down" == answer){
    drawParticle(xCor, yCor + 300, true, 'down')
  }
  else {
    resetGame(true)
  }
})

// document.body.onkeyup = function(e){
//     if(e.keyCode == 32){
//         stopAnimation()
//     }
// }
