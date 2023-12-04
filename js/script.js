var textfield;
var fruits;
var correctWord;
var img;
var img1;
var img2;
var img3;
var img4;
var img5;
var img6;
var img7;
var atksound;
var losesound;
var winsound;
var bossatk;
var song;
let timer = 60
let attack = -1;

function preload() {
  song = loadSound('assets/aqw song.mp3')
  atksound = loadSound('assets/atksound.mp3')
  losesound = loadSound('assets/losesound.mp3')
  winsound = loadSound('assets/winsound.mp3')
  bossatk =  loadSound('assets/bossatk.mp3')
  img = loadImage('assets/bg1.png');
  img1 = loadImage('assets/bocchi.png');
  img2 = loadImage('assets/bocchi3.png');
  img3 = loadImage('assets/boss.png');
  img4 = loadImage('assets/atk1.png')
  img5 = loadImage('assets/bocchi2.png')
  img6 = loadImage('assets/boss2.png')
  img7 = loadImage('assets/boss3.png');
}

// Our object for the player/boss
class Person {
  constructor(name, hp, atk) {
    this.name = name;
    this.hp = hp;
    this.atk = atk;
  }

  takeDMG(dmg) {
    this.hp -= dmg;
  }

  getATK() {
    return this.atk;
  }

  getHP() {
    return this.hp;
  }

  getName() {
    return this.name;
  }
}

// Set up our boss and player
const boss = new Person("Boss", 100, 10);
const player = new Person("Player", 100, 10);

function setup() {
  song.play();
  song.setVolume(0.5);
  input = createInput();
  input.size(400,40)
  input.position(600);
  let canvas = createCanvas(800, 600);
  background(img);
  canvas.parent("canvasContainer");

  // This variable stores whatever the player types
  textfield = "";
  redrawBackground();

  // Load our fruit list and then get the first fruit
  loadFruits().then(() => {
    correctWord = getFruit();
    console.log(correctWord);
    console.log(fruits);
  });
}

// Redraw the background
function redrawBackground() {
  clear();
  background(img);
}

// Function to fetch and load the JSON file
function loadFruits() {
  return fetch("fruits.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      fruits = data.fruits;
    })
    .catch((error) => {
      console.error("Error loading fruits.json:", error);
      throw error; // Re-throw the error for further handling
    });
}

// Call the function to load fruits when needed
function getFruit() {
  let index = floor(random(fruits.length));
  return fruits[index].toLowerCase();
}

function draw() {
  //text(textfield, 100, 100);  // For debugging
  drawPlayer();
  drawBoss();
  drawHealthBars();
  timing();
  fill(255);
  rect(0,500,800,200)
  fill(255,0,0);
  textSize(32);
  text(correctWord, 330,550);
  //TODO checkis there a way to make this center all the time

 
  reset = false;

  // Check if the player typed the wrong word
  if (wrongLetter(correctWord)) {
    text("ur wrong", 120, 120);
    reset = true;

    player.takeDMG(boss.getATK());
    bossatk.play();
  }

// Check if the player finished typing
if (textfield == correctWord) {
  //text("Correct!", 270, 150);

 // attk
  if (attack === -1) {
    attack = frameCount;
    console.log(frameCount);
    image(img4, 250, 200, 300, 350);
    atksound.play();
  }

  // frame for attacking
  if (frameCount - attack >= frameRate()) {
    boss.takeDMG(player.getATK());
    reset = true;

    // Reset attackFrame for the next attack
    attack = -1;
  }
  //TODO check
}

  if (reset) {
    // Redraw the canvas
    redrawBackground();

    // Start to reset our words
    textfield = ""; // reset our textfield
    correctWord = getFruit(); // get our new word
    input.value("");
  }

  // Check if won
  if (boss.getHP() <= 0) {
    song.stop();
    // TODO: change this
    redrawBackground();
    textSize(64);
    image(img5, 20, 120,260,230);
    image(img6, 320, 0,520,690);
    text("You Won", 280, 325);
    winsound.play();

    //TODO fatter text at the end and the sound sounds a bit cursed...
  }


  // Check if lost
  if (player.getHP() <= 0) {
    // TODO: change this
    redrawBackground();
    song.stop();
    textSize(64);
    image(img7, 520, 120,180,330);
    image(img2, 20, 130,300,300) 
    text("You Lose", 270, 325);
    losesound.play();
  
}
  
    //TODO fatter text at the end
  }


  // Draw healthbar
  // Draw the health bars, player, boss, and other elements


  text("Player HP: " + player.getHP(), 5, 30);
  text("Boss HP: " + boss.getHP(), 595, 30);

// When the player type anything, it will be added to textfield
function timing(){
  if (frameCount % 60 == 0 && timer > 0) {
    timer--;
  }
  
  textSize(72);
  text(timer, 365, 80);
  
  if (timer == 0) {
    text("GAME OVER", 200,325);

  }
  //TODO time overlapp
}
function keyTyped() {
  textfield += key;
}

// This function should check if the player is in the process of typing the correctWord
function wrongLetter(correctWord) {
  for (let i = 0; i < textfield.length; i++) {
    if (textfield[i] != correctWord[i]) {
      return true;
    }
  }

  return false;
}

function drawHealthBars() {
  let barWidth = 300;
  let barHeight = 40;

  fill(255);
  rect(0, 40, barWidth, barHeight);
  fill(255, 0, 0);
  rect(0, 40, map(player.getHP(), 0, 100, 0, barWidth), barHeight);
  fill(255);
  rect(800, 40, -barWidth, barHeight);
  fill(255, 0, 0);
  rect(800, 40, map(boss.getHP(), 0, -100, 0, barWidth), barHeight);
}
function drawPlayer(){
  image(img1, 50, 20, 250, 650);
}
function drawBoss(){
  image(img3, 540, 90,220,390);
}