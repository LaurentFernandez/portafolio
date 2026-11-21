# Portafolio de Laurent Andrés Fernandez

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

## Hoja de vida

El CV vive en `cv/` en español e inglés (`cv-es.html`, `cv-en.html`, estilos en `cv.css`). Después de editarlo, vuelve a generar los PDF:

```powershell
$chrome = 'C:\Program Files\Google\Chrome\Application\chrome.exe'
foreach ($l in 'es','en') {
  & $chrome --headless=new --no-pdf-header-footer --virtual-time-budget=8000 "--print-to-pdf=$PWD\cv\Laurent-Fernandez-CV-$($l.ToUpper()).pdf" "file:///$PWD/cv/cv-$l.html"
}
```

También puedes abrir el HTML en el navegador y usar Imprimir → Guardar como PDF (tamaño A4, sin encabezados).

## Agregar o editar un proyecto

1. Copia un bloque `<article class="escena">` en `index.html` y cambia el texto.
2. Elige su color con `data-fondo` (`lima`, `papel` o `tinta`). Para darle el estilo propio de un sitio, sigue el patrón de `escena--kurabi`, `escena--gps` y `escena--kas` en `styles.css`: un `div.escena__mundo` para el fondo y variables `--acento`, `--tarjeta`, `--borde-tarjeta` y `--mundo`.
3. Agrega las traducciones de sus claves `data-i18n` en `i18n.js`.
