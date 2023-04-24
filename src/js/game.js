const sceneEl = document.querySelector("a-scene");
const limonEL = document.querySelector("#limon-model");
const scoreEl = document.querySelector("#score-element");
const posicionesRandomEl = document.querySelector("#posicionesRandom");

AFRAME.registerComponent("posiciones-random", {
  init: function () {
    //Posiciones random de los limones
    this.randomPosition = function () {
      return {
        x: (Math.random() - 0.5) * 200,
        y: 1.5,
        z: (Math.random() - 0.5) * 200,
      };
    };
  },
});

AFRAME.registerComponent("cambiar-entorno", {
  init: function () {
    let score = 0;

    //obtenemos el componente de posiciones
    const componentePR = posicionesRandomEl.components["posiciones-random"];

    //set and show new score
    function displayScore() {
      scoreEl.setAttribute("value", `Score: ${score}`);
    }

    function createLemon() {
      const clone = limonEL.cloneNode();
      clone.setAttribute("position", componentePR.randomPosition());
      clone.addEventListener("mousedown", () => {
        score++;
        clone.dispatchEvent(new Event("collected"));
        displayScore();
        cambiarEntorno();
      });
      clone.addEventListener("animationcomplete", () => {
        clone.setAttribute("position", componentePR.randomPosition());
        clone.setAttribute("scale", "0.05 0.05 0.05");
      });

      sceneEl.appendChild(clone);
    }

    for (let i = 0; i < 15; i++) {
      createLemon();
    }

    // Obtener la escena de A-Frame
    const escena = sceneEl;
    // Al encontrar n limones, se cambiara a un siguiente ambiente (Nivel)
    function cambiarEntorno() {
      if (score === 2) {
        escena.setAttribute("environment", "preset: egypt");
      }
    }
    displayScore();
  },
});
