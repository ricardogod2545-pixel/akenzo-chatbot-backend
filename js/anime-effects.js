
"use strict";

(() => {
  function iniciarFlores() {
    const layer = document.getElementById("sakura-layer");
    if (!layer) {
      console.error("AKENZO: no se encontró #sakura-layer");
      return;
    }

    // Limpiar pétalos anteriores para evitar duplicados.
    layer.replaceChildren();

    const cantidad = window.innerWidth < 700 ? 18 : 35;
    const simbolos = ["✿", "❀", "✾", "✽"];

    for (let i = 0; i < cantidad; i++) {
      const flor = document.createElement("span");
      flor.className = "sakura-petal";
      flor.textContent = simbolos[i % simbolos.length];

      flor.style.left = Math.random() * 100 + "%";
      flor.style.animationDuration = 8 + Math.random() * 12 + "s";
      flor.style.animationDelay = -(Math.random() * 20) + "s";
      flor.style.setProperty("--deriva", -100 + Math.random() * 200 + "px");
      flor.style.setProperty("--giro", Math.random() * 720 + "deg");
      flor.style.setProperty("--tamano", 16 + Math.random() * 14 + "px");

      layer.appendChild(flor);
    }

    console.log("AKENZO: flores activadas", layer.children.length);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciarFlores, { once: true });
  } else {
    iniciarFlores();
  }
})();
