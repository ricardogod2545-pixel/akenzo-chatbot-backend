
"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const intro = document.getElementById("intro-video");
  const video = document.getElementById("akenzo-intro");
  const skipButton = document.getElementById("skip-intro");

  if (!intro || !video || !skipButton) {
    return;
  }

  let finished = false;
  let closeTimer;

  function closeIntro() {
    if (finished) return;

    finished = true;

    if (closeTimer) {
      window.clearTimeout(closeTimer);
    }

    intro.classList.add("is-leaving");
    video.pause();

    closeTimer = window.setTimeout(() => {
      intro.remove();
    }, 850);
  }

  // Permite entrar a la página sin esperar al final del video.
  skipButton.addEventListener("click", closeIntro);

  // Cierra la introducción cuando el video termina.
  video.addEventListener("ended", closeIntro);

  // Evita dejar la pantalla bloqueada si el video falla.
  video.addEventListener("error", () => {
    console.error(
      "No se pudo cargar el video. Revisa videos/intro-akenzo.mp4."
    );

    closeIntro();
  });

  // Reproduce el video sin sonido.
  video.play().catch((error) => {
    console.warn(
      "No se pudo iniciar automáticamente el video:",
      error
    );
  });
});
