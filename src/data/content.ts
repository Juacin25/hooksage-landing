import { plans } from "./plan";
export const faqs = [
  {
    question: "¿Para quién está pensado Hooksage?",
    answer:
      "Para startups y empresas chicas de Uruguay y Argentina que ya graban contenido, pero no tienen un editor full time. También para founders, equipos de marketing y personas con marca personal que venden servicios, cursos o infoproductos.",
  },
  {
    question: "¿Qué hace con el material que le paso?",
    answer:
      "Estamos desarrollando un flujo que toma tu video sin editar y lo convierte en una pieza vertical de 15 segundos. El foco está en elegir los cortes, ajustar el ritmo, hacer zooms con criterio y colocar subtítulos legibles y bien sincronizados.",
  },
  {
    question:
      "¿En qué se diferencia de editar con una herramienta de IA genérica?",
    answer:
      "El objetivo es resolver la edición de principio a fin, con decisiones pensadas para video corto. Queremos que puedas dedicarte al mensaje y recibir una pieza coherente, sin tener que armar instrucciones y corregir cada corte por separado. Esa calidad es lo que vamos a validar en las primeras pruebas.",
  },
  {
    question: "¿Para qué canales van a servir los videos?",
    answer:
      "El formato de salida será vertical 9:16 y de 15 segundos, pensado para Instagram Reels, TikTok y YouTube Shorts. Podés usarlo también en otros canales que admitan ese formato. Publicar sigue estando en tus manos; no estamos prometiendo publicación automática.",
  },
  {
    question: "¿Cuándo lo puedo probar y cuánto cuesta?",
    answer: `Estamos preparando las primeras pruebas y todavía no hay una fecha confirmada. Sumarte a la lista no tiene costo ni requiere tarjeta. Al registrarte quedás en la lista para tu primer video gratis. ${plans.map((plan) => `${plan.name}: US$${plan.monthlyPriceUSD} al mes y ${plan.weeklyExports} videos exportados por semana`).join(". ")}. Las exportaciones se renuevan cada semana.`,
  },
  {
    question: "¿Qué pasa cuando completo el formulario?",
    answer:
      "Guardamos tus datos y te avisamos por email cuando puedas probar Hooksage. No hace falta que subas videos ahora y no se activa ninguna suscripción. WhatsApp es opcional; podés dejarnos tu número con código de país si preferís que también te contactemos por ahí.",
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
    sample: "Tu producto, en 15 segundos.",
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
    poster: "business-story",
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
    sample: "Una idea clara. Quince segundos.",
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
export const tones = [
  {
    name: "A cámara",
    title: "Una idea que se entiende.",
    description:
      "Cortes sobre la voz, pausas limpias y subtítulos que acompañan lo que decís.",
    icon: "users",
    poster: "founder-interview",
  },
  {
    name: "Demo de producto",
    title: "Mostrá lo que hace tu producto.",
    description:
      "El detalle importante en primer plano y zooms que guían la atención.",
    icon: "bulb",
    poster: "drivo-product",
  },
  {
    name: "Educativo",
    title: "De una explicación a una pieza corta.",
    description:
      "Una idea por video, palabras clave destacadas y un cierre concreto.",
    icon: "bulb",
    poster: "creator-podcast",
  },
  {
    name: "Campaña",
    title: "Tu mensaje, con un ritmo claro.",
    description:
      "La propuesta al frente, texto legible y una llamada a la acción.",
    icon: "tag",
    poster: "product-campaign",
  },
  {
    name: "Equipo",
    title: "Las personas detrás de tu empresa.",
    description:
      "Voces reales y una edición que respeta la forma de comunicar de tu equipo.",
    icon: "users",
    poster: "team-collaboration",
  },
];
