
"use strict";

// ============================================
// AKENZO — CATÁLOGO DE SERVICIOS
// Consultoría, marketing, tecnología y formación
// ============================================

const serviciosAkenzo = [
  {
    id: "consultoria",
    nombre: "Consultoría empresarial",
    descripcion:
      "Identificación de oportunidades, análisis de necesidades y orientación para mejorar la gestión empresarial.",
    debilidades: [
      "planeacion",
      "procesos",
      "gestion",
      "crecimiento",
      "organizacion"
    ],
    recomendacion:
      "Realizar una evaluación empresarial y definir un plan de mejora con objetivos y prioridades."
  },
  {
    id: "marketing",
    nombre: "Marketing y estrategia comercial",
    descripcion:
      "Orientación para mejorar la presencia de marca, atraer clientes y fortalecer las estrategias comerciales.",
    debilidades: [
      "marketing",
      "ventas",
      "clientes",
      "redes",
      "marca",
      "publicidad"
    ],
    recomendacion:
      "Revisar los canales de adquisición de clientes, la propuesta de valor y la estrategia de marketing."
  },
  {
    id: "tecnologia",
    nombre: "Tecnología y soluciones digitales",
    descripcion:
      "Soluciones digitales para fortalecer la presencia en internet y mejorar procesos que puedan beneficiarse de la tecnología.",
    debilidades: [
      "tecnologia",
      "digitalizacion",
      "automatizacion",
      "pagina web",
      "herramientas",
      "inteligencia artificial"
    ],
    recomendacion:
      "Identificar tareas manuales y necesidades digitales para seleccionar herramientas apropiadas."
  },
  {
    id: "capacitacion-marketing",
    nombre: "Capacitación en marketing",
    descripcion:
      "Formación para que los equipos comprendan y apliquen mejores prácticas de marketing y comunicación comercial.",
    debilidades: [
      "conocimientos marketing",
      "capacitacion marketing",
      "habilidades comerciales",
      "estrategia comercial"
    ],
    recomendacion:
      "Diseñar una capacitación práctica según el nivel de conocimientos y los objetivos del equipo."
  },
  {
    id: "capacitacion-ia",
    nombre: "Capacitación en inteligencia artificial",
    descripcion:
      "Formación para conocer usos prácticos de la IA en tareas empresariales, productividad y generación de ideas.",
    debilidades: [
      "inteligencia artificial",
      "capacitacion ia",
      "productividad",
      "tareas manuales",
      "conocimientos tecnologicos"
    ],
    recomendacion:
      "Identificar casos de uso y formar al equipo para aprovechar la IA de forma responsable."
  }
];

// Devuelve todos los servicios disponibles.
function obtenerServiciosAkenzo() {
  return serviciosAkenzo;
}

// Busca un servicio por su identificador.
function buscarServicioAkenzo(id) {
  return serviciosAkenzo.find(servicio => servicio.id === id) || null;
}

// Relaciona palabras clave con posibles servicios.
// Es una orientación inicial, no un diagnóstico definitivo.
function recomendarServiciosAkenzo(areas) {
  const texto = Array.isArray(areas)
    ? areas.join(" ").toLowerCase()
    : String(areas || "").toLowerCase();

  const normalizado = texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  const palabrasPorServicio = {
    consultoria: [
      "planeacion", "procesos", "gestion",
      "crecimiento", "organizacion", "estrategia"
    ],
    marketing: [
      "marketing", "ventas", "clientes",
      "redes", "marca", "publicidad"
    ],
    tecnologia: [
      "tecnologia", "digitalizacion", "automatizacion",
      "pagina web", "herramientas", "inteligencia artificial"
    ],
    "capacitacion-marketing": [
      "conocimientos marketing", "capacitacion marketing",
      "habilidades comerciales"
    ],
    "capacitacion-ia": [
      "inteligencia artificial", "capacitacion ia",
      "productividad", "tareas manuales"
    ]
  };

  return serviciosAkenzo.filter(servicio => {
    const palabras = palabrasPorServicio[servicio.id] || [];

    return palabras.some(palabra => {
      const palabraNormalizada = palabra
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

      return normalizado.includes(palabraNormalizada);
    });
  });
}
