const sceneEl = document.querySelector("a-scene");
const limonEL = document.querySelector("#limon-model");
const scoreEl = document.querySelector("#score-element");
const cameraEl = document.querySelector("#camera-element");
const posicionesRandomEl = document.querySelector("#posicionesRandom");
const cambiandoNivelComponent = document.querySelector("#cambiandoNivel");
const cambianUniversoBtn = document.querySelector("#botonSaltarUniverso");

let score = 0;

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
    //obtenemos el componente de posiciones
    const componentePR = posicionesRandomEl.components["posiciones-random"];

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

    displayScore();
  },
});

AFRAME.registerComponent("nivel-cambiado", {
  init: function () {
    cambianUniversoBtn.addEventListener("click", function () {
      // Al encontrar 5 limones, se cambiara a un siguiente ambiente (Nivel)
      if (score > 4) {
        // Cambiar a un nuevo environment al hacer clic
        enviarMensajeCreandoNivel("Cambiando nivel...", true);
      } else {
        enviarMensajeCreandoNivel("Te faltan mas limones.", false);
      }
    });

    function enviarMensajeCreandoNivel(mostrarTexto, cambiar) {
      // Mostrar el mensaje "Cambiando nivel"
      const mensaje = document.createElement("a-text");
      mensaje.setAttribute("value", mostrarTexto);
      mensaje.setAttribute("position", posicionMsnCambiandoNivel());
      if (cambiar == true) {
        mensaje.setAttribute("color", "#FFF");
      } else {
        mensaje.setAttribute("color", "#FF0000");
      }

      mensaje.setAttribute("width", "3");
      cameraEl.appendChild(mensaje);

      // Deshabilitar el movimiento del usuario
      const usuario = document.querySelector("a-camera");
      usuario.setAttribute("wasd-controls", "enabled", false);
      usuario.setAttribute("look-controls", "enabled", false);

      // Esperar dos segundos antes de cambiar el entorno
      setTimeout(() => {
        // Cambiar el entorno
        if (cambiar === true) {
          sceneEl.setAttribute("environment", "preset", "moon");
        }

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
    }
  },
});
