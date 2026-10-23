import { englishFaqs, englishBusinesses } from "./content.en";
import { plans, packs } from "./plan";
import { paidPlansAvailable } from "../lib/config";
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
      "En la aplicación creás un perfil editable o importás información desde un texto o PDF. Con ese contexto, Hooksage propone hooks, guiones y listas de tomas. También podés explorar referencias de Shorts por categoría y afinidad aproximada con tu marca. Las sugerencias no garantizan ventas ni viralidad.",
  },
  {
    question: "¿Tengo que llegar con un video grabado?",
    answer:
      "Podés editar una grabación y conservar tu voz original, o partir de un guion y una voz en off. Ese segundo camino admite un video principal y hasta dos clips o imágenes de apoyo. La generación de voz y sonidos es opcional; revisá su disponibilidad y las condiciones de tu compra en la aplicación.",
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
    question: "¿Cómo contrato Hooksage y cuánto cuesta?",
    answer:
      (paidPlansAvailable
        ? "El registro y la contratación se realizan en la aplicación de Hooksage. Antes de confirmar un pago se informa el importe total y sus condiciones. Estos son los planes: "
        : "Podés crear una cuenta gratis en la aplicación de Hooksage. Los pagos de planes y packs todavía no están habilitados; el registro no activa cobros ni suscripciones. La oferta comercial publicada es la siguiente: ") +
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
      "Recibimos tu solicitud y una persona del equipo te escribe por email para coordinar una primera edición gratis. Podés compartir un enlace al clip y contarnos qué tuviste que rehacer en tu última edición; ambos son opcionales, al igual que WhatsApp. Completar este formulario no crea una cuenta en la aplicación, no realiza una compra ni activa una suscripción.",
  },
  {
    question: "¿Cómo funciona la edición y la entrega?",
    answer:
      "Hooksage es una plataforma de edición automática con inteligencia artificial. En la aplicación cargás tu material, indicás el mensaje y el acabado, revisás el resultado y descargás el MP4. El servicio y la entrega son digitales; los planes y packs corresponden al uso de la plataforma. La primera prueba gratuita de este sitio se coordina por email.",
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
      "Edición automática de videos cortos para startups. Cortes, zooms y subtítulos con tu material. Solicitá una primera edición gratis, coordinada por email.",
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
      "Edición automática de videos cortos para pymes. Cortes, zooms y subtítulos con tu material. Solicitá una primera edición gratis, coordinada por email.",
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
      "Edición automática de videos cortos para marca personal. Cortes, zooms y subtítulos con tu material. Solicitá una primera edición gratis por email.",
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
      "Edición automática de videos cortos para equipos de marketing. Cortes, zooms y subtítulos con tu material. Solicitá una primera edición gratis por email.",
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
