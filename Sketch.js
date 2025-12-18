let handPose;
let video;
let hands = [];
let osc;
let col;

function preload() {
  handPose = ml5.handPose();
}

function setup() {
  createCanvas(640, 480);

  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();

  handPose.detectStart(video, gotHands);

  background(0);

  // Sonido armónico suave
  osc = new p5.Oscillator("sine");
  osc.freq(220);
  osc.start();
  osc.amp(0);

  col = color(255);
}

function draw() {
  drawInstructions();

  if (hands.length > 0) {
    let finger = hands[0].index_finger_tip;
    let thumb = hands[0].thumb_tip;

    //  Reflejo camara
    let fx = width - finger.x;
    let fy = finger.y;

    let tx = width - thumb.x;
    let ty = thumb.y;

    let pinch = dist(fx, fy, tx, ty);

    // PINCH → cambia color
    if (pinch < 40) {
      col = color(random(255), random(255), random(255));
    }

    // MANO ABIERTA → dibuja + sonido
    if (pinch > 70) {
      stroke(col);
      strokeWeight(4);
      point(fx, fy);
      osc.amp(0.05, 0.3);
    } else {
      osc.amp(0, 0.5);
    }
  } else {
    osc.amp(0, 0.5);
  }
}
// INSTRUCCIONES
function drawInstructions() {
  noStroke();
  fill(0, 180);
  rect(0, 0, width, 100);

  fill(255);
  textSize(14);
  textAlign(LEFT);
  text("Mano abierta: dibuja", 10, 20);
  text("Pinch (pulgar + índice): cambia color", 10, 40);
  text("Sin mano: pausa", 10, 60);
  text("ESC: borrar todo", 10, 80);
}

function gotHands(results) {
  hands = results;
}

// BORRAR CON ESC
function keyPressed() {
  if (keyCode === ESCAPE) {
    background(0);
  }
}

// Activar audio
function mousePressed() {
  userStartAudio();
}
