var textfield;
var fruits;
var correctWord;
var img;

img = loadImage('assets/bg.PNG');

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
  input = createInput();
  input.position(312.5);
  let canvas = createCanvas(800, 600);
  //canvas.parent("canvasContainer");
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
  background(220);

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

  textSize(32);
  text(correctWord, 10,550);
  reset = false;

  // Check if the player typed the wrong word
  if (wrongLetter(correctWord)) {
    text("ur wrong", 120, 120);
    reset = true;

    player.takeDMG(boss.getATK());
  }

  // Check if the player finished typing
  if (textfield == correctWord) {
    text("Correct!", 100, 150);
    reset = true;

    // Do dmg to the boss
    boss.takeDMG(player.getATK());
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
    // TODO: change this
    redrawBackground();
    textSize(64);
    text("You Won", 280, 325);
  }

  // Check if lost
  if (player.getHP() <= 0) {
    // TODO: change this
    redrawBackground();
    textSize(64);
    text("You Lose", 270, 325);
  }

  // Draw healthbar
  // TODO: change this
  textSize(20)
  text("Player HP: " + player.getHP(), 5, 30);
  text("Boss HP: " + boss.getHP(), 673, 30);

  drawHealthBars();
}

// When the player type anything, it will be added to textfield
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
