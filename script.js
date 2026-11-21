(function () {
  const raiz = document.documentElement;
  const mascaras = document.querySelectorAll(".inicio__mascara");

  // Proporciones de Big Shoulders Display para apilar las líneas del nombre
  const ALTURA_MAYUSCULA = 0.8;
  const SEPARACION = 0.3;
  const ANCHO_UTIL = 0.92;

  document.getElementById("anio").textContent = new Date().getFullYear();

  // ---------- Correo (se arma aquí para dificultar que lo recojan bots) ----------
  function prepararCorreo() {
    const correo = ["aaaandres2011", "gmail.com"].join("@");
    const enlace = document.getElementById("enlace-correo");
    const texto = document.getElementById("texto-correo");
    const copiar = document.getElementById("copiar-correo");
    const estado = document.getElementById("estado-copia");

    enlace.href = `mailto:${correo}`;
    texto.textContent = correo;
    texto.hidden = false;
    copiar.hidden = false;

    copiar.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(correo);
        estado.textContent = window.i18n.traducir("contact.copied");
      } catch (e) {
        estado.textContent = window.i18n.traducir("contact.copyFailed");
      }
    });
  }

  // ---------- Nombre del inicio: cada línea ocupa todo el ancho ----------
  function medirLinea(svg, linea) {
    const prueba = linea.cloneNode(true);
    prueba.setAttribute("font-size", "100");
    prueba.setAttribute("visibility", "hidden");
    svg.appendChild(prueba);
    const largo = prueba.getComputedTextLength();
    prueba.remove();
    return largo;
  }

  // El SVG usa "slice": según la pantalla se recorta por los lados o por arriba y abajo.
  // Se calcula qué parte del viewBox queda visible para que el nombre nunca se corte.
  function areaVisible(svg) {
    const caja = svg.viewBox.baseVal;
    const proporcion = svg.clientWidth / svg.clientHeight;
    return {
      ancho: Math.min(caja.width, caja.height * proporcion),
      alto: Math.min(caja.height, caja.width / proporcion),
      altoTotal: caja.height
    };
  }

  function ajustarNombre(svg) {
    if (!svg.clientWidth) return; // SVG oculto por la orientación; se ajusta cuando aparezca

    const lineas = [...svg.querySelectorAll(".inicio__linea")];
    const visible = areaVisible(svg);
    let tamanos = lineas.map((linea) => (100 * visible.ancho * ANCHO_UTIL) / medirLinea(svg, linea));

    const medirAlto = () =>
      tamanos.reduce((total, tamano, i) => total + tamano * ALTURA_MAYUSCULA + (i ? tamano * SEPARACION : 0), 0);

    const altoMaximo = visible.alto * ANCHO_UTIL * 0.85;
    if (medirAlto() > altoMaximo) {
      const factor = altoMaximo / medirAlto();
      tamanos = tamanos.map((tamano) => tamano * factor);
    }

    const recortadoVertical = visible.alto < visible.altoTotal;
    const centro = recortadoVertical ? visible.altoTotal / 2 : Number(svg.dataset.centro);
    let y = centro - medirAlto() / 2;

    lineas.forEach((linea, i) => {
      const tamano = tamanos[i];
      if (i) y += tamano * SEPARACION;
      y += tamano * ALTURA_MAYUSCULA;
      linea.setAttribute("font-size", tamano.toFixed(1));
      linea.setAttribute("y", y.toFixed(1));
    });
  }

  function ajustarNombres() {
    mascaras.forEach(ajustarNombre);
  }

  function refrescarAnimaciones() {
    if (window.ScrollTrigger) window.ScrollTrigger.refresh();
  }

  // ---------- Animaciones con GSAP ----------
  function centroDe(svg) {
    return `${svg.viewBox.baseVal.width / 2} ${svg.dataset.centro}`;
  }

  function animarInicio() {
    // Las letras crecen y se desvanecen mientras aparece la foto en su marco
    const linea = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: ".inicio",
        start: "top top",
        end: "+=110%",
        scrub: 0.6,
        pin: true
      }
    });

    mascaras.forEach((svg) => {
      linea.to(svg.querySelector(".inicio__letras"), { scale: 1.3, svgOrigin: centroDe(svg), duration: 1, ease: "power1.in" }, 0);
    });

    linea
      .to(".inicio__mascara", { opacity: 0, duration: 0.45 }, 0.3)
      .fromTo(
        ".inicio__retrato",
        { opacity: 0, scale: 0.8, yPercent: 8 },
        { opacity: 1, scale: 1, yPercent: 0, duration: 0.6, ease: "power2.out" },
        0.4
      )
      .fromTo(".inicio__titulo", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, 0.5);
  }

  function animarColores() {
    const leerColor = (nombre) => getComputedStyle(raiz).getPropertyValue(`--${nombre}`).trim();

    document.querySelectorAll("[data-fondo]").forEach((seccion) => {
      ScrollTrigger.create({
        trigger: seccion,
        start: "top 55%",
        end: "bottom 55%",
        onToggle: (self) => {
          if (!self.isActive) return;
          gsap.to(document.body, {
            "--fondo": leerColor(seccion.dataset.fondo),
            "--texto": leerColor(seccion.dataset.texto),
            duration: 0.7,
            ease: "power2.out",
            overwrite: "auto"
          });
        }
      });
    });
  }

  // La ruta termina en la última parada (el botón de contacto) y su punta
  // sigue el centro de la pantalla mientras se baja.
  function animarRuta() {
    const recorrido = document.querySelector(".recorrido");
    const ruta = document.querySelector(".ruta");
    const paradas = [...document.querySelectorAll(".parada")];
    let posiciones = [];
    let largo = 0;

    const medirParadas = () => {
      const arriba = recorrido.getBoundingClientRect().top;
      posiciones = paradas.map((p) => {
        const caja = p.getBoundingClientRect();
        return caja.top - arriba + caja.height / 2;
      });
      largo = posiciones[posiciones.length - 1];
      ruta.style.height = `${largo}px`;
    };

    const inicioRuta = () => {
      medirParadas();
      return recorrido.getBoundingClientRect().top + window.scrollY - window.innerHeight / 2;
    };

    gsap.fromTo(
      ".ruta__trazo",
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: "none",
        scrollTrigger: {
          trigger: recorrido,
          start: inicioRuta,
          end: (self) => Math.min(self.start + largo, ScrollTrigger.maxScroll(window)),
          scrub: true,
          onUpdate: (self) => {
            const punta = self.progress * largo;
            paradas.forEach((p, i) => p.classList.toggle("parada--alcanzada", posiciones[i] <= punta + 1));
          }
        }
      }
    );

    return () => {
      ruta.style.removeProperty("height");
      paradas.forEach((p) => p.classList.remove("parada--alcanzada"));
    };
  }

  function animarEscenas() {
    document.querySelectorAll(".escena").forEach((escena) => {
      gsap.fromTo(
        escena.querySelector(".escena__nombre"),
        { yPercent: 105 },
        {
          yPercent: 0,
          ease: "power3.out",
          scrollTrigger: { trigger: escena, start: "top 80%", end: "top 30%", scrub: 0.5 }
        }
      );

      gsap.fromTo(
        escena.querySelector(".escena__titulo"),
        { xPercent: 4 },
        {
          xPercent: -4,
          ease: "none",
          scrollTrigger: { trigger: escena, start: "top bottom", end: "bottom top", scrub: true }
        }
      );

      // El mundo de cada proyecto se abre en círculo desde la parada de la ruta
      const mundo = escena.querySelector(".escena__mundo");
      if (mundo) {
        gsap.fromTo(
          mundo,
          { clipPath: "circle(0% at 3% 55%)" },
          {
            clipPath: "circle(150% at 3% 55%)",
            ease: "power2.in",
            scrollTrigger: { trigger: escena, start: "top 90%", end: "top 10%", scrub: true }
          }
        );
      }

      const trazos = escena.querySelectorAll(".motivo > *");
      if (!trazos.length) return;
      gsap.to(trazos, {
        strokeDashoffset: 0,
        ease: "none",
        stagger: 0.15,
        scrollTrigger: { trigger: escena, start: "top 55%", end: "center 35%", scrub: true }
      });
    });
  }

  function iniciarMovimiento() {
    if (!window.gsap || !window.ScrollTrigger) return; // Sin GSAP la página queda estática y completa
    gsap.registerPlugin(ScrollTrigger);

    gsap.matchMedia().add("(prefers-reduced-motion: no-preference)", () => {
      raiz.classList.add("con-movimiento");
      animarInicio();
      animarColores();
      const limpiarRuta = animarRuta();
      animarEscenas();

      return () => {
        limpiarRuta();
        raiz.classList.remove("con-movimiento");
      };
    });
  }

  // ---------- Arranque ----------
  prepararCorreo();
  ajustarNombres();
  iniciarMovimiento();

  // La fuente se pide explícitamente: el navegador no la descarga hasta que la usa,
  // y sin ella las medidas del nombre salen con la fuente de respaldo.
  document.fonts
    .load('900 100px "Big Shoulders Display"', "LAURENTÁÉ")
    .catch(() => {})
    .then(() => {
      ajustarNombres();
      refrescarAnimaciones();
    });

  let ajustePendiente = false;
  window.addEventListener("resize", () => {
    if (ajustePendiente) return;
    ajustePendiente = true;
    requestAnimationFrame(() => {
      ajustePendiente = false;
      ajustarNombres();
    });
  });

  document.addEventListener("idiomacambiado", refrescarAnimaciones);
})();
