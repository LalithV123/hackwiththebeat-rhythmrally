let ball, paddle;
let score = 0;
let bpm = 90;
let interval;
let synth;
let gameStarted = false;

function setup() {
  let cnv = createCanvas(600, 400);
  cnv.parent("game"); // attach canvas to the HTML div
  textSize(20);
  fill(255);

  synth = new Tone.Synth().toDestination();
  Tone.Transport.bpm.value = bpm;
  interval = Tone.Time("4n").toSeconds();

  createStartButton();

  noLoop(); // pause game loop
}

function createStartButton() {
  const button = createButton("🎮 Start Game");
  button.position(250, 420); // below the canvas
  button.style("padding", "10px 20px");
  button.style("font-size", "16px");
  button.style("background", "#00ffcc");
  button.style("border", "none");
  button.style("border-radius", "8px");
  button.mousePressed(() => {
    Tone.start();
    startGame();
    button.hide();
  });
}

function startGame() {
  gameStarted = true;
  paddle = new Paddle();
  ball = new Ball();

  Tone.Transport.scheduleRepeat(playBeat, "4n");
  Tone.Transport.start();
  loop(); // start draw loop
}

function draw() {
  background(20);
  if (!gameStarted) return;

  text("Score: " + score, 10, 30);

  paddle.update();
  paddle.display();

  ball.update();
  ball.display();

  if (ball.hits(paddle)) {
    score += 1;
    ball.reset();
  }
}

function keyPressed() {
  if (keyCode === LEFT_ARROW) paddle.move(-10);
  if (keyCode === RIGHT_ARROW) paddle.move(10);
}

function playBeat(time) {
  synth.triggerAttackRelease("C4", "8n", time);
  if (ball) ball.trigger(time);
}

class Ball {
  constructor() {
    this.reset();
    this.radius = 15;
  }

  reset() {
    this.x = random(width);
    this.y = 0;
    this.speed = 5;
    this.moving = false;
  }

  trigger(time) {
    this.reset();
    this.moving = true;
  }

  update() {
    if (this.moving) {
      this.y += this.speed;
    }
    if (this.y > height) {
      this.reset();
    }
  }

  hits(paddle) {
    return this.moving &&
           this.y + this.radius > paddle.y &&
           this.x > paddle.x &&
           this.x < paddle.x + paddle.width;
  }

  display() {
    ellipse(this.x, this.y, this.radius * 2);
  }
}

class Paddle {
  constructor() {
    this.width = 80;
    this.height = 15;
    this.x = width / 2 - this.width / 2;
    this.y = height - 40;
  }

  move(amount) {
    this.x += amount;
    this.x = constrain(this.x, 0, width - this.width);
  }

  update() {}

  display() {
    rect(this.x, this.y, this.width, this.height);
  }
}
