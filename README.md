# Portafolio de Laurent Andrés Fernández

Sitio personal en HTML, CSS y JavaScript, sin proceso de build. Las transiciones al hacer scroll usan [GSAP](https://gsap.com/) con ScrollTrigger (copia local en `assets/vendor/`).

## Cómo verlo

Abre `index.html` en el navegador o usa la extensión **Live Server** de VS Code.

## Estructura

- `index.html`: contenido (inicio, sobre mí, proyectos, contacto). El texto en español vive aquí.
- `styles.css`: estilos. Colores, tipografías y espacios están definidos como variables en `:root`.
- `i18n.js`: traducción al inglés y botón ES/EN. El idioma elegido se recuerda en el navegador.
- `script.js`: ajuste del nombre del inicio, correo de contacto y animaciones.
- `assets/img/`: foto.
- `assets/vendor/`: GSAP 3.13.0 y ScrollTrigger.

## Accesibilidad

Si el sistema del visitante tiene activado "reducir movimiento", o si GSAP no carga, la página se muestra completa y sin animaciones.

## Agregar o editar un proyecto

1. Copia un bloque `<article class="escena">` en `index.html` y cambia el texto.
2. Elige su color con `data-fondo` (`coral`, `senal`, `ambar`, `lima`, `papel` o `tinta`).
3. Agrega las traducciones de sus claves `data-i18n` en `i18n.js`.
