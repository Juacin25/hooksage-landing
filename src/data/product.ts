import type { Language } from "../lib/i18n";
export function productFor(language: Language) {
  const text = (es: string, en: string) => (language === "en" ? en : es);
  return {
    brand: {
      eyebrow: text("Marca e ideas", "Brand & ideas"),
      title: text("Primero, qué contar.", "First, something worth saying."),
      intro: text(
        "Tu marca le da contexto a las propuestas. Contá qué hacés, a quién le hablás y cómo querés comunicar. Podés editar el perfil o partir de un texto o PDF.",
        "Your brand gives the suggestions context. Describe what you do, who you want to reach and how you want to sound. Edit your profile or start from text or a PDF.",
      ),
      ideas: text(
        "Recibí propuestas con un hook, un guion y una lista de tomas. También podés explorar referencias de Shorts por categoría, orientadas al perfil de tu marca.",
        "Get suggestions with a hook, a script and a shot list. You can also explore Shorts references by category, with suggestions based on your brand profile.",
      ),
      exampleLabel: text(
        "Ejemplo ilustrativo · agenda online",
        "Illustrative example · online booking",
      ),
      profileLabel: text("Perfil de marca", "Brand profile"),
      fields: [
        {
          name: text("Qué hace", "What it does"),
          value: text(
            "Reservas online para pequeños negocios.",
            "Online booking for small businesses.",
          ),
        },
        {
          name: text("Para quién", "Who it's for"),
          value: text(
            "Equipos que coordinan turnos por mensajes.",
            "Teams arranging appointments through messages.",
          ),
        },
        {
          name: text("Cómo habla", "How it sounds"),
          value: text(
            "Cercana, clara y sin tecnicismos.",
            "Friendly, clear and free of jargon.",
          ),
        },
      ],
      proposalLabel: text(
        "Una propuesta para ese perfil",
        "A suggestion for that profile",
      ),
      proposal: [
        {
          name: "Hook",
          value: text(
            "¿Cuántas reservas se te pierden entre mensajes?",
            "How many bookings get lost in your messages?",
          ),
        },
        {
          name: text("Guion", "Script"),
          value: text(
            "Mostrá cómo un cliente elige un horario y confirma sin tener que escribirte.",
            "Show a customer choosing a time and confirming without messaging you.",
          ),
        },
        {
          name: text("Tomas", "Shots"),
          value: text(
            "Tu pantalla → elegir horario → reserva confirmada.",
            "Your screen → choose a time → booking confirmed.",
          ),
        },
      ],
      note: text(
        "Referencias por categoría, orientadas al perfil de tu marca.",
        "References by category, guided by your brand profile.",
      ),
    },
    workflow: {
      eyebrow: text("Cómo funciona el piloto", "How the pilot works"),
      title: text(
        "Vos grabás. Nosotros hacemos el primer corte.",
        "You film. We make the first edit.",
      ),
      intro: text(
        "Una idea a cámara, una demo o algo que pasó en tu negocio. Traé ese material y contanos qué querés decir.",
        "A thought to camera, a demo or something happening at your business. Bring that footage and tell us what you want to say.",
      ),
      caption: text(
        "Tu mensaje, con una revisión antes de publicar.",
        "Your message, reviewed before you post.",
      ),
      steps: [
        {
          title: text(
            "Pasá la grabación que ya tenés.",
            "Bring the recording you already have.",
          ),
          text: text(
            "Podemos trabajar con tu voz original. Si partís de una idea, también hay una opción con voz en off, un video principal y hasta dos clips o imágenes de apoyo.",
            "We can work with your original voice. If you start with an idea, there is also a voiceover option with one main video and up to two supporting clips or images.",
          ),
        },
        {
          title: text(
            "Mostranos cómo querés contarlo.",
            "Show us how you want to tell it.",
          ),
          text: text(
            "Natural, Dinámico o Impacto. Podés sumar un video de referencia para orientar el ritmo, los textos y el sonido.",
            "Choose Natural, Dynamic or Impact. Add a reference video to show the pacing, text and sound you have in mind.",
          ),
        },
        {
          title: text(
            "Mirá el corte. Pedí los ajustes.",
            "Watch the edit. Ask for changes.",
          ),
          text: text(
            "Revisá los subtítulos, los cortes y el encuadre. Después exportás el MP4 vertical. La biblioteca conserva cada versión y la duración depende de lo que haya que contar.",
            "Check the captions, cuts and framing. Then export a vertical MP4. The library keeps each version, and the length depends on what you need to say.",
          ),
        },
      ],
    },
    finishes: {
      eyebrow: text("Tres acabados", "Three finishes"),
      title: text(
        "El ritmo también es una decisión.",
        "Pacing is a choice, too.",
      ),
      intro: text(
        "Elegí una dirección para la edición y ajustá sus controles. El acabado orienta el ritmo, el texto, los gráficos y el sonido.",
        "Choose a direction for the edit and adjust the controls. The finish guides pacing, text, graphics and sound.",
      ),
      items: [
        {
          name: "Natural",
          title: text(
            "Que la voz lleve el mensaje.",
            "Let the voice carry the message.",
          ),
          description: text(
            "Una dirección sobria para explicaciones, conversaciones y contenido que necesita sentirse cercano.",
            "A restrained direction for explanations, conversations and content that should feel personal.",
          ),
          detail: text(
            "Para una idea que se entiende sin pedir atención a los efectos.",
            "For an idea that comes through without drawing attention to the effects.",
          ),
        },
        {
          name: text("Dinámico", "Dynamic"),
          title: text(
            "Que la pieza mantenga el ritmo.",
            "Keep the video moving.",
          ),
          description: text(
            "Una dirección con más movimiento y énfasis para acompañar lo que decís y sostener la atención.",
            "More movement and emphasis to support what you're saying and hold attention.",
          ),
          detail: text(
            "Para demos, novedades y mensajes con varios puntos para mostrar.",
            "For demos, updates and messages with several points to show.",
          ),
        },
        {
          name: text("Impacto", "Impact"),
          title: text(
            "Que lo importante se note.",
            "Make the key point stand out.",
          ),
          description: text(
            "Una dirección de mayor énfasis visual y sonoro para titulares, cifras y llamados a la acción.",
            "Stronger visual and sound emphasis for headlines, numbers and calls to action.",
          ),
          detail: text(
            "Para una propuesta o anuncio que necesita ir al punto.",
            "For an offer or ad that needs to get to the point.",
          ),
        },
      ],
      note: text(
        "Son direcciones de edición, no resultados idénticos. Los recursos se eligen según tu contenido y el material disponible.",
        "These guide the edit rather than produce identical results. Resources are chosen to suit your content and available footage.",
      ),
    },
    tools: {
      eyebrow: text("Texto, movimiento y sonido", "Text, motion and sound"),
      title: text(
        "Una edición que acompaña el mensaje.",
        "An edit that serves the message.",
      ),
      items: [
        {
          title: text(
            "Voz que se escucha bien.",
            "A voice you can hear clearly.",
          ),
          description: text(
            "Limpieza y nivelado de voz, sonidos guardados que podés reutilizar y generación opcional de voces y efectos de sonido.",
            "Voice cleanup and levelling, saved sounds you can reuse, and optional voice and sound-effect generation.",
          ),
        },
        {
          title: text("Recursos para dar énfasis.", "Tools for emphasis."),
          description: text(
            "Subtítulos, titulares, contadores, barras, iconos y logos. También video dentro del video (PiP), zooms, flashes y cuadros de impacto con acentos sonoros.",
            "Captions, headlines, counters, bars, icons and logos. Plus picture-in-picture (PiP), zooms, flashes and impact frames with sound accents.",
          ),
        },
        {
          title: text(
            "Una referencia para la dirección.",
            "A reference for the direction.",
          ),
          description: text(
            "Subí un video de referencia para orientar el ritmo y el lenguaje visual. Se analiza por separado de tu propio metraje.",
            "Upload a reference video to guide pacing and visual style. It's analysed separately from your own footage.",
          ),
        },
        {
          title: text(
            "Originales y versiones a mano.",
            "Originals and versions kept together.",
          ),
          description: text(
            "La biblioteca guarda automáticamente tus originales y resultados. Cada pedido de ajuste crea una versión y conserva la edición anterior.",
            "The library automatically saves originals and results. Each revision creates a version while keeping the previous edit.",
          ),
        },
      ],
      output: text(
        "MP4 vertical · 720 × 1280 · 30 fps",
        "Vertical MP4 · 720 × 1280 · 30 fps",
      ),
      note: text(
        "La duración depende del montaje y la voz. Revisá cada exportación antes de publicarla.",
        "Length depends on the edit and the voice. Review each export before posting.",
      ),
    },
  };
}
