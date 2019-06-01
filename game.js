c = document.getElementById("game");
ctx = c.getContext("2d");
let controls = document.getElementById('controls')
let uiVisible = false;
let lives = 3;
let livesElement = document.getElementById('lives')
let createLivesUI = () => {
  let html = ''
  for (let i = 0; i < lives; i++) {
    html += '<i class="fa fa-heart"></i> '
  }
  livesElement.innerHTML = html;
}
let showUI = (show) => {
  uiVisible = show;
  if (show) {
    controls.style.display = 'block'
  } else {
    controls.style.display = 'none'
  }
}

createLivesUI(lives);

let subtractLife = () => {
  if (lives > 1) {
    lives--;
    createLivesUI(lives);
    moveMethods[answer]();
  } else {
    // GameOver
    livesElement.innerHTML = '';
    resetGame(true);
  }
}
showUI(false)

// ******************************************************
// VARIABLE INIT
let particleSign,velocity,mField,answer,particle,fieldlines;
let signs = ["positive","negative"];
let direction = "down"
let fields = ["out","in"]
let [xCor, yCor] = [275, 0];
let [xVel, yVel] = [0, 0];
let speed = 5;
let id = -1;
let circles = []

// ******************************************************
// SETUP/STARTING SECTION
let reset = (fullReset) => {
  if (fullReset) {
    [xCor, yCor] = [275, 0];
  }
  [xVel, yVel] = [0, 0];
  ctx.clearRect(0, 0, 600, 600);
  direction = "down"
  circles = [];
  showUI(false)
}

let setup = function() {
  // initialize state of game here
  ctx.clearRect(0, 0, 600, 600);
  let chosenSign;
  if (particleSign) {
    chosenSign = particleSign;
  } else {
    chosenSign = signs[Math.floor(Math.random() * signs.length)];
    particleSign = chosenSign;
  }
  let chosenField = fields[Math.floor(Math.random() * fields.length)];
  let chosenDirection = direction
  console.log(chosenSign, chosenDirection, chosenField);
  answer = correctAnswer(chosenDirection,chosenField,chosenSign);
  console.log(answer);
  createCanvas(chosenSign, chosenDirection, chosenField);
}

let resetGame = (hardReset) => {
  alert('Your score was X. Press okay to restart game.')
  if (hardReset) {
    lives = 3;
    xCor = 275;
    yCor = 0;
    createLivesUI(lives);
  }
  reset();
  setup();
}

// ******************************************************
// GAME LOGIC FUNCTIONS

// calculates correct answer for a given field/charge/direction
let correctAnswer = (direction,field,charge) => {
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
// ******************************************************
// DRAWING FUNCTIONS
let createCanvas = function (sign, direction, field) {
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

let stopAnimation = (e) => {
	if (id > 0) {
		window.cancelAnimationFrame(id);
		id = -1;
	}
}

let createCircle = (x, y) => {
  ctx.beginPath();
  ctx.arc(x+25, y+25, 6, 0, 2 * Math.PI);
  // ctx.lineWidth = 0;
  ctx.fillStyle = "#047c42";
  ctx.stroke();
  ctx.fill();
}

let drawCircle = false;
let circleFrames = 1
let drawParticle = (stopX, stopY, resetOnDone, dir) => {
  // console.log(dir)
	ctx.clearRect(0, 0, 600, 600);
	ctx.beginPath();
  ctx.drawImage(fieldlines,0,0);
	ctx.drawImage(particle, xCor, yCor, 50, 50);
  circles.forEach(circle => {
    createCircle(circle.xCor, circle.yCor)
  })
  let distance = (xCor - stopX) ** 2 + (yCor - stopY) ** 2
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
// ******************************************************
// KEYBINDS/EVENT LISETENERS
let leftButton = document.getElementById('left')
let rightButton = document.getElementById('right')
let upButton = document.getElementById('up')
let downButton = document.getElementById('down')
let moveMethods = {
  left: () => {
    xVel = -1;
    yVel = 0;
    drawParticle(xCor - 300, yCor, true, 'left')
  },
  right: () => {
    xVel = 1;
    yVel = 0;
    drawParticle(xCor + 300, yCor, true, 'right')
  },
  up: () => {
    xVel = 0;
    yVel = -1;
    drawParticle(xCor, yCor - 300, true, 'up')
  },
  down: () => {
    xVel = 0;
    yVel = 1;
    drawParticle(xCor, yCor + 300, true, 'down')
  }
}
var left = () => {
  showUI(false);
  if("left" == answer){
    moveMethods.left();
  }
  else {
    subtractLife()
  }
}

leftButton.addEventListener ('click', () => {
  left();
})

var right = () => {
  showUI(false);
  if("right" == answer){
    moveMethods.right()
  }
  else {
    subtractLife()
  }
}

rightButton.addEventListener ('click', () => {
  right();
})

var up = () => {
  showUI(false);
  if("up" == answer){
    moveMethods.up();
  }
  else {
    subtractLife()
  }
}

upButton.addEventListener ('click', () => {
  up();
})

var down = () => {
  showUI(false);
  if("down" == answer){
    moveMethods.up();
  }
  else {
    subtractLife()
  }
}

downButton.addEventListener ('click', () => {
  down();
})

// left = 37
// up = 38
// right = 39
// down = 40
document.body.onkeyup = function(e){
    if (!uiVisible) return;
    if(e.keyCode == 37){
      left()
    } else if (e.keyCode == 38) {
      up()
    } else if (e.keyCode == 39) {
      right()
    } else if (e.keyCode == 40) {
      down();
    }
}

setup();
