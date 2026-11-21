document.getElementById("anio").textContent = new Date().getFullYear();

const form = document.getElementById("form-contacto");
const estado = document.getElementById("form-estado");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  // TODO: conectar con un servicio de envío (Formspree, EmailJS, backend propio, etc.)
  estado.textContent = "¡Gracias! Tu mensaje fue recibido.";
  estado.hidden = false;
  form.reset();
});
