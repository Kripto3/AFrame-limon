const sceneEl = document.querySelector("a-scene");
const limonEL = document.querySelector("#limon-model");
const scoreEl = document.querySelector("#score-element");

let score = 0;

//set and show new score
function displayScore() {
  scoreEl.setAttribute("value", `Score: ${score}`);
}

//random position of lemon
function randomPosition() {
  return {
    x: (Math.random() - 0.5) * 20,
    y: 1.5,
    z: (Math.random() - 0.5) * 20,
  };
}

function createHeart() {
  const clone = limonEL.cloneNode();
  clone.setAttribute("position", randomPosition());
  clone.addEventListener("mousedown", () => {
    score++;
    clone.dispatchEvent(new Event("collected"));
    displayScore();
  });
  clone.addEventListener("animationcomplete", () => {
    clone.setAttribute("position", randomPosition());
    clone.setAttribute("scale", "0.75 0.75 0.75");
  });
  sceneEl.appendChild(clone);
}

for (let i = 0; i < 15; i++) {
  createHeart();
}

displayScore();
