import { basePlan } from "./plan";
export const faqs = [
  {
    question: "¿Qué es Hooksage y para qué restaurantes sirve?",
    answer:
      "Hooksage es una plataforma de videos para restaurantes. Está pensada para taquerías, hamburgueserías, heladerías y negocios de sushi de la Ciudad de México que quieren crear contenido para redes sociales con lo que graban en su celular.",
  },
  {
    question: "¿Necesito saber editar o comprar equipo?",
    answer:
      "No. Graba tu comida, la preparación o lo que pasa en tu local con tu celular. El editor de video con IA de Hooksage convertirá esos clips en un video vertical de 15 segundos; tú elegirás el tono.",
  },
  {
    question: "¿Puedo usar los videos en Instagram Reels y TikTok?",
    answer:
      "Sí. Los videos para restaurantes tendrán formato vertical 9:16, pensado para Instagram Reels, TikTok y YouTube Shorts. El material será el de tu negocio; las fotos de esta landing son referencias visuales.",
  },
  {
    question: "¿Qué pasa cuando completo el formulario?",
    answer:
      "Te apuntas a la lista de espera. Guardaremos los datos de tu negocio y te avisaremos por correo cuando puedas probar Hooksage. No necesitas enviar clips todavía y no se crea una suscripción de pago.",
  },
  {
    question: "¿Cuándo podré probarlo y cuánto costará?",
    answer: `Estamos preparando el lanzamiento y todavía no hay una fecha confirmada. Apuntarte es gratis y tu primer video también será gratis al abrir el acceso. El ${basePlan.name} está previsto en US$${basePlan.monthlyPriceUSD} al mes e incluye ${basePlan.weeklyExports} videos exportados por semana; no necesitas tarjeta para estar en la lista.`,
  },
  {
    question: "¿Qué datos tengo que dejar para entrar en la lista?",
    answer:
      "Nombre y tipo de negocio, nombre del contacto, correo, WhatsApp mexicano y ciudad. El barrio o colonia es opcional. Usaremos esos datos para avisarte del acceso a Hooksage.",
  },
];
export const businesses = [
  {
    slug: "taquerias",
    metaTitle: "Videos para taquerías en CDMX | Hooksage",
    metaDescription:
      "Del trompo a tus redes: convierte los clips de tu taquería en Reels y TikToks. Entra en la lista de Hooksage y te avisamos cuando puedas probarlo.",
    name: "Taquerías",
    singular: "Taquería",
    icon: "flame",
    tone: "Antojo",
    headline: "Ese taco merece un video.",
    description:
      "El marketing para taquerías empieza con lo que ya tienes frente a ti: el trompo, la salsa y la fila de la noche.",
    ideas: [
      "El trompo girando de cerca",
      "La salsa cayendo sobre el taco",
      "La fila de la noche",
    ],
    poster: "tacos-detail",
    seo: "Videos para taquerías",
    sample: "Del trompo a tu feed.",
  },
  {
    slug: "hamburgueserias",
    metaTitle: "Reels y videos para hamburgueserías | Hooksage",
    metaDescription:
      "Muestra la plancha, el queso y tu hamburguesa especial en videos cortos. Registra tu negocio en la lista de Hooksage para probarlo cuando abra el acceso.",
    name: "Hamburgueserías",
    singular: "Hamburguesería",
    icon: "burger",
    tone: "Detrás de la barra",
    headline: "Que el queso haga el trabajo.",
    description:
      "Los videos para hamburgueserías muestran el queso derritiéndose, la plancha y el primer corte para despertar el antojo.",
    ideas: [
      "El queso derritiéndose en la plancha",
      "El primer corte de la hamburguesa",
      "Cómo armas la especial de la casa",
    ],
    poster: "burger-detail",
    seo: "Videos para hamburgueserías",
    sample: "Recién salida de la plancha.",
  },
  {
    slug: "heladerias",
    metaTitle: "Videos para heladerías e Instagram Reels | Hooksage",
    metaDescription:
      "Comparte los sabores y la preparación de tus helados con videos de tu celular. Súmate a la lista y recibe el aviso para probar Hooksage en la CDMX.",
    name: "Heladerías",
    singular: "Heladería",
    icon: "icecream",
    tone: "Promo",
    headline: "Un antojo bien servido.",
    description:
      "Los videos para heladerías enseñan los sabores, los toppings y cómo sirves cada cono. Tú grabas y Hooksage lo deja listo para publicar.",
    ideas: [
      "Una bola de helado recién servida",
      "Los toppings cayendo sobre el cono",
      "Los sabores de la semana",
    ],
    poster: "icecream-detail",
    seo: "Videos para heladerías",
    sample: "Una cucharada de felicidad.",
  },
  {
    slug: "sushi",
    metaTitle: "Videos para restaurantes de sushi en CDMX | Hooksage",
    metaDescription:
      "Del corte del rollo al pedido terminado: contenido de tu sushi para TikTok y Reels. Deja tus datos y te avisamos cuando puedas probar Hooksage.",
    name: "Sushi",
    singular: "Sushi",
    icon: "fish",
    tone: "Nocturno",
    headline: "Del primer corte al primer pedido.",
    description:
      "Los videos para negocios de sushi acercan a tus clientes al corte del rollo, la preparación y la presentación de cada pedido.",
    ideas: [
      "El corte de un rollo de cerca",
      "La salsa sobre el sushi recién hecho",
      "El pedido completo antes de salir",
    ],
    poster: "sushi-detail",
    seo: "Videos para negocios de sushi",
    sample: "Tu próximo rollo favorito.",
  },
];
export const tones = [
  {
    name: "Antojo",
    title: "Que se les haga agua la boca.",
    description:
      "Planos cerrados, detalles de tu comida y un ritmo que despierta el antojo.",
    icon: "flame",
    poster: "tacos",
  },
  {
    name: "Promo",
    title: "Tu especial de hoy, en su feed.",
    description:
      "Tu oferta al frente, texto claro y un cierre que invita a pedir.",
    icon: "tag",
    poster: "icecream",
  },
  {
    name: "Detrás de la barra",
    title: "Así se hace en tu cocina.",
    description:
      "El proceso, las manos y el cuidado que hay detrás de cada plato.",
    icon: "chef",
    poster: "burger",
  },
  {
    name: "Familiar",
    title: "Aquí hay lugar para todos.",
    description:
      "Tu mesa, tus platillos para compartir y el ambiente de tu local.",
    icon: "users",
    poster: "tacos",
  },
  {
    name: "Nocturno",
    title: "La noche también se antoja.",
    description:
      "El ambiente de la noche, tus especiales y un ritmo con más energía.",
    icon: "moon",
    poster: "sushi",
  },
];
