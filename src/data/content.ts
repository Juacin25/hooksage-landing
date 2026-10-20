import { englishFaqs, englishBusinesses } from "./content.en";
import { plans, packs } from "./plan";
const planSummary = plans
  .map(
    (plan) =>
      plan.name +
      ": US$" +
      plan.monthlyPriceUSD +
      " al mes y " +
      plan.weeklyExports +
      " videos exportados por semana",
  )
  .join(". ");
export const faqs = [
  {
    question: "¿Para quién está pensado Hooksage?",
    answer:
      "Para startups, negocios chicos, creadores y equipos de marketing sin editor dedicado. Podés partir de grabaciones propias o de una idea para comunicar tu producto, servicio o marca personal.",
  },
  {
    question: "¿Cómo usa mi marca para sugerir contenido?",
    answer:
      "Creás un perfil editable o importás información desde un texto o PDF. Con ese contexto, el piloto propone hooks, guiones y listas de tomas. También permite descubrir referencias de Shorts por categoría y afinidad aproximada con la marca; no garantiza ventas ni viralidad.",
  },
  {
    question: "¿Tengo que llegar con un video grabado?",
    answer:
      "Podés editar una grabación y conservar tu voz original, o crear una pieza con guion y voz en off. Ese segundo camino admite un video principal y hasta dos clips o imágenes de apoyo. La generación de voz y sonidos nuevos es opcional y depende de los servicios configurados en el piloto.",
  },
  {
    question: "¿Qué cambia entre Natural, Dinámico e Impacto?",
    answer:
      "Son tres direcciones de acabado. Orientan las decisiones de ritmo, texto, gráficos y sonido, con controles avanzados para ajustarlas. El montaje responde al contenido y a los recursos disponibles; no aplica todos los efectos en cada video.",
  },
  {
    question: "¿Puedo subir un video de referencia?",
    answer:
      "Sí. Una referencia puede orientar el ritmo y la dirección visual. Se analiza por separado del metraje que querés editar. Es un recurso distinto de las referencias de Shorts que podés explorar por categoría.",
  },
  {
    question: "¿Qué formato y duración tienen las exportaciones?",
    answer:
      "La salida actual es MP4 vertical de 720 × 1280 a 30 fps, para canales como Reels, TikTok y Shorts. La duración depende del montaje y la voz. La entrada admite archivos MP4/MOV compatibles.",
  },
  {
    question: "¿Puedo pedir cambios sin perder la edición anterior?",
    answer:
      "Sí. La biblioteca guarda originales y versiones automáticamente. Cada revisión crea un trabajo nuevo y conserva el resultado anterior, para poder retomarlo y compararlo. Revisá cada exportación antes de publicarla.",
  },
  {
    question: "¿Cuándo lo puedo probar y cuánto cuesta?",
    answer:
      "El piloto está en desarrollo y hoy funciona de forma local; el servicio público multiusuario todavía está en preparación. No hay una fecha de acceso confirmada. Sumarte a la lista es gratis y no requiere tarjeta. Al registrarte quedás en la lista para tu primer video gratis. " +
      planSummary +
      ". Los precios son mensuales en dólares y las exportaciones se renuevan cada semana. También hay packs de pago único: " +
      packs
        .map((pack) => pack.exports + " videos por US$" + pack.priceUSD)
        .join(", ") +
      ".",
  },
  {
    question: "¿Qué pasa cuando completo el formulario?",
    answer:
      "Guardamos tu solicitud. Podés compartir un enlace al clip y contarnos qué tuviste que rehacer en tu última edición; ambos son opcionales. Una persona del equipo te escribe por email para coordinar una primera edición gratis. El editor público sigue en desarrollo y completar el formulario no abre una cuenta ni activa una suscripción. WhatsApp es opcional.",
  },
  {
    question: "¿Puedo conectarlo con un asistente?",
    answer:
      "El piloto incluye un MCP local para consultar proyectos y solicitar trabajos a la misma API. El acceso MCP remoto público todavía está pendiente. Es una opción para quien configura el piloto local, no un servicio público activo desde esta landing.",
  },
];
export const businesses = [
  {
    slug: "startups",
    name: "Startups",
    singular: "Startup",
    icon: "bulb",
    tone: "A cámara",
    headline: "Explicá lo que estás construyendo.",
    description:
      "Una demo, una novedad o la historia detrás del producto. Transformá el material de tu equipo en videos cortos sin sumar un editor full time.",
    ideas: [
      "El problema que resuelve tu producto",
      "Una función nueva, mostrada en pantalla",
      "Una idea del founder a cámara",
    ],
    poster: "startup-talk",
    seo: "Videos para startups",
    sample: "Tu producto, bien explicado.",
    metaTitle: "Videos para startups | Hooksage",
    metaDescription:
      "Edición de videos cortos para startups. Cortes, zooms y subtítulos con tu material. Sumate al acceso anticipado en Uruguay y Argentina.",
  },
  {
    slug: "pymes",
    name: "Pymes",
    singular: "Pyme",
    icon: "users",
    tone: "Producto",
    headline: "Mostrá lo que hacés, sin pasar horas editando.",
    description:
      "Para empresas chicas que ya graban su trabajo y necesitan publicar con más constancia. Tu producto, tu servicio y tu equipo tienen algo para contar.",
    ideas: [
      "Cómo funciona tu producto o servicio",
      "Una respuesta a una duda frecuente",
      "El proceso detrás de tu trabajo",
    ],
    poster: "drivo-product",
    seo: "Videos para pymes",
    sample: "Lo que hacés, bien contado.",
    metaTitle: "Videos para pymes | Hooksage",
    metaDescription:
      "Edición de videos cortos para pymes. Cortes, zooms y subtítulos con tu material. Sumate al acceso anticipado en Uruguay y Argentina.",
  },
  {
    slug: "marca-personal",
    name: "Marca personal",
    singular: "Marca personal",
    icon: "users",
    tone: "Educativo",
    headline: "Tu experiencia merece salir del borrador.",
    description:
      "Si vendés cursos, servicios o infoproductos, la edición no debería frenar tus ideas. Convertí explicaciones y contenido educativo en piezas cortas para tus redes.",
    ideas: [
      "Un consejo concreto de tu especialidad",
      "Una pregunta que te hacen tus clientes",
      "Una idea de tu curso o taller",
    ],
    poster: "personal-story",
    seo: "Videos para marca personal",
    sample: "Una idea clara. Tu forma de contarla.",
    metaTitle: "Videos para marca personal | Hooksage",
    metaDescription:
      "Edición de videos cortos para marca personal. Cortes, zooms y subtítulos con tu material. Sumate al acceso anticipado en Uruguay y Argentina.",
  },
  {
    slug: "equipos-de-marketing",
    name: "Equipos de marketing",
    singular: "Equipo de marketing",
    icon: "clock",
    tone: "Equipo",
    headline: "La estrategia ya está. Falta resolver la edición.",
    description:
      "Para equipos de growth y marketing que publican seguido y no tienen un editor dedicado. Un flujo de edición para sostener el ritmo de contenido.",
    ideas: [
      "Una novedad para tus distintos canales",
      "Una pieza corta de tu campaña",
      "Una respuesta del equipo a cámara",
    ],
    poster: "team-collaboration",
    seo: "Videos para equipos de marketing",
    sample: "Seguí el ritmo de tu equipo.",
    metaTitle: "Videos para equipos de marketing | Hooksage",
    metaDescription:
      "Edición de videos cortos para equipos de marketing. Cortes, zooms y subtítulos con tu material. Sumate al acceso anticipado en Uruguay y Argentina.",
  },
];
export function contentFor(language: "es" | "en") {
  if (language === "es") return { faqs, businesses };
  return {
    faqs: englishFaqs,
    businesses: businesses.map((business) => ({
      ...business,
      ...englishBusinesses[business.slug],
    })),
  };
}
