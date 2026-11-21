// Traducciones. El español vive en el HTML; aquí solo está el inglés
// y los textos que se generan desde JavaScript.
(function () {
  const EN = {
    "meta.title": "Laurent Andrés Fernandez | Software engineer",
    "meta.description": "Portfolio of Laurent Andrés Fernandez, software engineer at NyGsoft S.A.S.",
    "skip": "Skip to content",
    "nav.label": "Main",
    "nav.about": "About",
    "nav.projects": "Projects",
    "nav.contact": "Contact",
    "lang.switch": "Switch to Spanish",
    "hero.role": "Software engineer",
    "hero.photoAlt": "Photo of Laurent Andrés Fernandez",
    "about.title": "About me",
    "about.lead": "I'm a software engineer at NyGsoft S.A.S., a Colombian custom software company. Before that I worked as a .NET developer and as a QA analyst. I take part in projects from requirements gathering through development.",
    "about.analysis.t": "Analysis",
    "about.analysis.d": "Requirements gathering and analysis, modeling and solution documentation.",
    "about.dev.t": "Development",
    "about.dev.d": "Building and maintaining web applications.",
    "about.qa.t": "Quality",
    "about.qa.d": "Software testing and quality assurance and control (QA/QC).",
    "edu.title": "Education",
    "edu.degree": "Degree",
    "edu.course": "Course",
    "edu.ongoing": "In progress",
    "edu.sena.t": "Technologist in Software Analysis and Development",
    "edu.python.t": "Python Development Fundamentals",
    "edu.cisco.t": "Cybersecurity Resources Specialist",
    "edu.slim.t": "Cybersecurity Management",
    "edu.slim.place": "Carlos Slim Foundation",
    "edu.uniminuto.date": "2026 – present",
    "edu.uniminuto.t": "Software Engineering",
    "tech.title": "Technologies",
    "tech.intro": "Languages, frameworks and tools I work with.",
    "projects.title": "Projects",
    "projects.intro": "Systems I've worked on at NyGsoft, my degree project, and the site where I started.",
    "projects.note": "Kurabi, GPSIntegra and Kas are systems owned by NyGsoft S.A.S. and its clients. Here I describe my role in them.",
    "label.role": "My role",
    "label.context": "Context",
    "label.tech": "Technologies",
    "role.both": "Analysis and development",
    "role.analysis": "Analysis",
    "context.nyg": "NyGsoft S.A.S. project",
    "kurabi.type": "Healthcare management system",
    "gps.type": "GPS tracking system",
    "kas.type": "Web-based logistics and freight system",
    "sipsg.type": "Inventory and point-of-sale system",
    "sipsg.role": "Adaptation and development",
    "sipsg.context": "Degree project, SENA technologist program",
    "sipsg.text": "I started from an open source inventory system built with Laravel, then adapted and modified it for my degree project.",
    "sipsg.original": "Original project",
    "transmark.type": "Practice website",
    "transmark.context": "One of my first projects, in 2023",
    "link.code": "View code",
    "link.site": "View site",
    "contact.title": "Let's talk",
    "contact.text": "I'm open to job offers and freelance projects.",
    "contact.write": "Email me",
    "contact.copy": "Copy email",
    "contact.cv": "Download résumé",
    "contact.cvFile": "cv/Laurent-Fernandez-CV-EN.pdf",
    "contact.copied": "Email copied",
    "contact.copyFailed": "Couldn't copy. Select the address and copy it manually."
  };

  // Textos que no están en el HTML porque se generan desde JavaScript
  const ES_DINAMICO = {
    "contact.copied": "Correo copiado",
    "contact.copyFailed": "No se pudo copiar. Selecciona el correo y cópialo a mano."
  };

  const CLAVE_GUARDADA = "idioma";
  const descripcion = document.querySelector('meta[name="description"]');
  const original = {
    title: document.title,
    description: descripcion.content
  };
  let actual = "es";

  function traducir(clave) {
    if (actual === "en") return EN[clave];
    return ES_DINAMICO[clave];
  }

  function aplicar(idioma) {
    actual = idioma;
    const enIngles = idioma === "en";

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      if (el.dataset.es === undefined) el.dataset.es = el.textContent;
      el.textContent = enIngles ? EN[el.dataset.i18n] : el.dataset.es;
    });

    document.querySelectorAll("[data-i18n-attr]").forEach((el) => {
      const [atributo, clave] = el.dataset.i18nAttr.split(":");
      if (el.dataset.esAttr === undefined) el.dataset.esAttr = el.getAttribute(atributo);
      el.setAttribute(atributo, enIngles ? EN[clave] : el.dataset.esAttr);
    });

    document.documentElement.lang = idioma;
    document.title = enIngles ? EN["meta.title"] : original.title;
    descripcion.content = enIngles ? EN["meta.description"] : original.description;

    document.dispatchEvent(new CustomEvent("idiomacambiado", { detail: idioma }));
  }

  function idiomaInicial() {
    try {
      const guardado = localStorage.getItem(CLAVE_GUARDADA);
      if (guardado === "es" || guardado === "en") return guardado;
    } catch (e) {
      // Sin acceso a localStorage: se usa el idioma del navegador
    }
    return navigator.language.toLowerCase().startsWith("es") ? "es" : "en";
  }

  document.querySelector(".idioma").addEventListener("click", () => {
    const nuevo = actual === "es" ? "en" : "es";
    aplicar(nuevo);
    try {
      localStorage.setItem(CLAVE_GUARDADA, nuevo);
    } catch (e) {
      // Si no se puede guardar, el cambio sigue funcionando en esta visita
    }
  });

  const inicial = idiomaInicial();
  if (inicial !== "es") aplicar(inicial);

  window.i18n = { traducir };
})();
