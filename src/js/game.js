const sceneEl = document.querySelector("a-scene");
const limonEL = document.querySelector("#limon-model");
const scoreEl = document.querySelector("#score-element");
const cameraEl = document.querySelector("#camera-element");
const posicionesRandomEl = document.querySelector("#posicionesRandom");
const cambiandoNivelComponent = document.querySelector("#cambiandoNivel");

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

    //obtenemos el componente de mensaje cambiando nivel
    const componenteCambiandoNivel =
      cambiandoNivelComponent.components["nivel-cambiado"];

    //cambia el score
    function displayScore() {
      scoreEl.setAttribute("value", `Score: ${score}`);
    }

    //crear limones al azar
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
        clone.setAttribute("scale", "0.03 0.03 0.03");
      });

      sceneEl.appendChild(clone);
    }

    for (let i = 0; i < 15; i++) {
      createLemon();
    }

    // Al encontrar n limones, se cambiara a un siguiente ambiente (Nivel)
    function cambiarEntorno() {
      if (score === 4) {
        componenteCambiandoNivel.enviarMensajeCreandoNivel();
      }
    }
    displayScore();
  },
});

AFRAME.registerComponent("nivel-cambiado", {
  init: function () {
    this.enviarMensajeCreandoNivel = function () {
      // Mostrar el mensaje "Cambiando nivel"
      debugger;
      const mensaje = document.createElement("a-text");
      mensaje.setAttribute("value", "Cambiando nivel...");
      mensaje.setAttribute("position", posicionMsnCambiandoNivel());
      mensaje.setAttribute("color", "#FFF");
      mensaje.setAttribute("width", "3");
      cameraEl.appendChild(mensaje);

      // Deshabilitar el movimiento del usuario
      const usuario = document.querySelector("a-camera");
      usuario.setAttribute("wasd-controls", "enabled", false);
      usuario.setAttribute("look-controls", "enabled", false);

      // Esperar dos segundos antes de cambiar el entorno
      setTimeout(() => {
        // Cambiar el entorno
        sceneEl.setAttribute("environment", "preset", "moon");

        // Ocultar el mensaje
        mensaje.setAttribute("visible", "false");

        // Habilitar el movimiento del usuario
        usuario.setAttribute("wasd-controls", "enabled", true);
        usuario.setAttribute("look-controls", "enabled", true);
      }, 2000);

      //obtener posicion del mensaje cambiando nivel
      function posicionMsnCambiandoNivel() {
        return {
          x: -0.5,
          y: 0.1,
          z: -0.8,
        };
      }
    };
  },
});
