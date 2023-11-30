var textfield;
var fruits; // Declare fruits globally
var correctWord; // Declare correctWord globally

// Our object for the player/boss
class Person {
  constructor (name, hp, atk) {
    this.name = name;
    this.hp = hp;
    this.atk = atk
  }

  takeDMG(dmg) {
    this.hp -= dmg
  }

  getATK() {
    return this.atk
  }

  getHP() {
    return this.hp
  }

  getName() {
    return this.name
  }
}

// Set up our boss and player
const boss = new Person("Boss", 100, 10);
const player = new Person("Player", 100, 10);

function setup() {
  input = createInput();
  let canvas = createCanvas(800, 600);
  canvas.parent("canvasContainer");

  // This variable stores whatever the player types
  textfield = ""
  redrawBackground();

  // Load our fruit list and then get the first fruit
  loadFruits().then(() => {
    correctWord = getFruit();
    // console.log(correctWord);
    // console.log(fruits);
  });

}

// Redraw the background
function redrawBackground() {
  clear();
  background(220);
}

// Function to fetch and load the JSON file
function loadFruits() {
  return fetch('fruits.json')
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      fruits = data.fruits;})
    .catch(error => {
      console.error('Error loading fruits.json:', error);
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
  
  textSize(16)
  text(correctWord, 50,50);
  reset = false
  
  // Check if the player typed the wrong word
  if (wrongLetter(correctWord)) {
    text("ur fucked", 120, 120);
    reset = true

    player.takeDMG(boss.getATK())
  }

  // Check if the player finished typing
  if (textfield == correctWord) {
    text("Correct!", 100, 150);
    reset = true

    // Do dmg to the boss
    boss.takeDMG(player.getATK());
  }

  if (reset) {
    // Redraw the canvas
    redrawBackground();

    // Start to reset our words
    textfield = "";  // reset our textfield
    correctWord = getFruit();  // get our new word
  }

  // Check if won
  if (boss.getHP() <= 0) {
    // TODO: change this
    redrawBackground();
    text("You Won", 50, 50);
  }

  // Check if lost
  if (player.getHP() <= 0) {
    // TODO: change this
    redrawBackground();
    text("You Lose", 50, 50)
  }

  // Draw healthbar
  // TODO: change this
  text("Player HP: " + player.getHP(), 10, 10)
  text("Boss HP: " + boss.getHP(), 10, 30)

  // rect(50,50,65,5)
  // Fill(red)
  // rect(50,50,60,5)
}


// When the player type anything, it will be added to textfield
function keyTyped() {
  textfield += key;
}

// This function should check if the player is in the process of typing the correctWord
function wrongLetter(correctWord) { 
  for (let i = 0; i < textfield.length; i++) {
    if (textfield[i] != correctWord[i]) {
      return true
    }
  }

  return false
}