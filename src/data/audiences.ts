// Audience-page copy that is unique per page (ES + EN). Facts only: no testimonials or invented results.
type Faq = { question: string; answer: string };
type AudienceCopy = {
  metaTitle: string;
  metaDescription: string;
  problemTitle: string;
  problem: string;
  ideaDetails: [string, string, string];
  plan: "Founder" | "Pyme" | "Marca Personal";
  planReason: string;
  faqs: Faq[];
};

export const audiences: Record<string, { es: AudienceCopy; en: AudienceCopy }> =
  {
    startups: {
      es: {
        metaTitle: "Edición de videos verticales para startups | Hooksage",
        metaDescription:
          "Convierte demos, lanzamientos y videos del founder en Reels, TikTok y Shorts con IA: cortes, encuadre y subtítulos. Prueba gratis tu primera edición.",
        problemTitle:
          "Tu producto cambia cada semana. Tus videos no deberían quedarse atrás.",
        problem:
          "En una startup, quien graba suele ser el mismo que programa, vende y responde soporte. El material existe: una demo grabada en la pantalla, una llamada con un cliente, el founder explicando por qué construyó el producto. Lo que falta es tiempo para cortarlo, encuadrarlo en vertical y subtitularlo. Hooksage hace ese primer corte con IA a partir de tu grabación, para que publicar un lanzamiento no dependa de que alguien del equipo aprenda a editar.",
        ideaDetails: [
          "Graba al founder explicando el problema en menos de un minuto. Es el formato que mejor resume qué hace tu producto para quien todavía no lo conoce.",
          "Una grabación de pantalla corta, con la voz explicando el cambio. Los subtítulos y el encuadre vertical la hacen legible en el celular, sin sonido.",
          "Una opinión, un aprendizaje o una decisión del equipo, dicha a cámara. Sirve para LinkedIn, Reels y Shorts con el mismo archivo.",
        ],
        plan: "Founder",
        planReason:
          "Diez videos por semana alcanzan para dos publicaciones por día hábil: suficiente para acompañar lanzamientos y contenido del founder sin contratar un editor.",
        faqs: [
          {
            question: "¿Sirve para videos de producto y demos de software?",
            answer:
              "Sí. Puedes partir de una grabación de pantalla o de una cámara. Hooksage hace los cortes, adapta el formato a vertical 9:16 y agrega subtítulos para que la demo se entienda sin sonido. La salida es un MP4 de 720 × 1280 a 30 fps.",
          },
          {
            question: "¿Puedo partir de una idea si todavía no grabé nada?",
            answer:
              "Sí. En la aplicación puedes cargar información de tu startup y Hooksage propone hooks, guiones y listas de tomas. También puedes partir de un guion con voz en off y sumar hasta dos clips o imágenes de apoyo.",
          },
          {
            question:
              "¿En qué se diferencia de contratar a un editor freelance?",
            answer:
              "Un editor freelance trabaja por pieza y por coordinación: envías el material, esperas la entrega y pides cambios. Con Hooksage el primer corte lo haces tú en la aplicación, revisas el resultado y pides otra versión sin perder la anterior. Para piezas muy producidas, un editor sigue siendo una buena opción.",
          },
        ],
      },
      en: {
        metaTitle: "AI short-form video editing for startups | Hooksage",
        metaDescription:
          "Turn product demos, launches and founder videos into Reels, TikTok and Shorts with AI cuts, reframing and captions. Try your first edit free.",
        problemTitle:
          "Your product ships every week. Your videos shouldn't fall behind.",
        problem:
          "At a startup, the person filming is usually the same one coding, selling and answering support. The footage is already there: a screen recording of a demo, a customer call, the founder explaining why they built the product. What's missing is time to cut it, reframe it vertically and caption it. Hooksage makes that first cut with AI from your recording, so shipping a launch video doesn't depend on someone learning to edit.",
        ideaDetails: [
          "Film the founder explaining the problem in under a minute. It's the clearest way to show what your product does to someone who hasn't heard of it.",
          "A short screen recording with a voice explaining the change. Captions and vertical framing make it readable on a phone with the sound off.",
          "An opinion, a lesson or a team decision, said to camera. One file works for LinkedIn, Reels and Shorts.",
        ],
        plan: "Founder",
        planReason:
          "Ten videos a week cover two posts per working day: enough to support launches and founder content without hiring an editor.",
        faqs: [
          {
            question: "Does it work for product videos and software demos?",
            answer:
              "Yes. Start from a screen recording or a camera clip. Hooksage makes the cuts, adapts the format to vertical 9:16 and adds captions so the demo makes sense with the sound off. Output is an MP4 at 720 × 1280 and 30 fps.",
          },
          {
            question:
              "Can I start from an idea if I haven't filmed anything yet?",
            answer:
              "Yes. Add information about your startup in the app and Hooksage suggests hooks, scripts and shot lists. You can also start from a script with a voiceover and add up to two supporting clips or images.",
          },
          {
            question: "How is it different from hiring a freelance editor?",
            answer:
              "A freelance editor works per piece and per back-and-forth: you send footage, wait for delivery and request changes. With Hooksage you make the first cut yourself in the app, review it and ask for another version without losing the previous one. For highly produced pieces, an editor is still a good option.",
          },
        ],
      },
    },
    pymes: {
      es: {
        metaTitle: "Edición de reels y videos verticales para pymes | Hooksage",
        metaDescription:
          "Edición de videos con IA para pymes: convierte lo que grabas con el celular en Reels y TikTok con cortes y subtítulos. Primera edición gratis.",
        problemTitle:
          "Ya grabas tu trabajo. El problema es encontrar tiempo para editarlo.",
        problem:
          "La mayoría de los negocios chicos tiene videos en el celular que nunca se publican: el producto en uso, el equipo trabajando, la respuesta a una pregunta que llega todos los días por WhatsApp. Publicar con constancia en Instagram o TikTok exige editar cada pieza, y eso compite con atender clientes. Hooksage convierte esas grabaciones en videos verticales listos para publicar, con cortes, encuadre y subtítulos, sin que nadie del negocio tenga que aprender a editar.",
        ideaDetails: [
          'Muestra el producto o el servicio en uso, de principio a fin. Es el contenido que responde la pregunta "¿cómo funciona?" antes de que el cliente la haga.',
          "Elige la pregunta que más se repite en mensajes o en el mostrador y respóndela a cámara. Un video así trabaja como atención al cliente las 24 horas.",
          "La preparación, el armado o el detrás de escena. Mostrar cómo se hace transmite cuidado y diferencia tu negocio de la competencia.",
        ],
        plan: "Pyme",
        planReason:
          "Treinta videos por semana permiten publicar a diario en varias redes, o separar contenido para productos, servicios y equipo sin quedarte sin cupo.",
        faqs: [
          {
            question: "¿Puedo editar videos grabados con el celular?",
            answer:
              "Sí. Hooksage está pensado para material grabado con el celular. Admite archivos MP4 y MOV compatibles y entrega un MP4 vertical de 720 × 1280 a 30 fps, el formato de Reels, TikTok y Shorts. Conviene grabar con buena luz y que la voz se escuche clara.",
          },
          {
            question: "¿Cuánto cuesta editar un reel para mi negocio?",
            answer:
              "Depende de la cantidad. Hay suscripciones con un cupo semanal de videos y packs de pago único de 10, 30 u 80 videos, con precios en dólares en la sección de precios. Tu primera edición es gratis, coordinada por email.",
          },
          {
            question: "¿Es mejor que editarlo yo con una app gratuita?",
            answer:
              "Las apps de edición gratuitas funcionan si tienes tiempo para aprender y editar cada pieza a mano. Hooksage automatiza los cortes, el encuadre y los subtítulos a partir de tu material, y tú solo revisas el resultado antes de exportar.",
          },
        ],
      },
      en: {
        metaTitle: "Short video editing for small businesses | Hooksage",
        metaDescription:
          "AI video editing for small businesses: turn what you film on your phone into Reels and TikToks with cuts and captions. Your first edit is free.",
        problemTitle:
          "You already film your work. Finding time to edit it is the hard part.",
        problem:
          "Most small businesses have videos on their phone that never get posted: the product in use, the team at work, the answer to a question customers ask every day. Posting consistently on Instagram or TikTok means editing every piece, and that competes with serving customers. Hooksage turns those recordings into vertical videos ready to post, with cuts, reframing and captions, without anyone on your team learning to edit.",
        ideaDetails: [
          'Show your product or service in use, start to finish. It answers "how does it work?" before a customer has to ask.',
          "Pick the question you hear most often and answer it on camera. A video like that works as customer support around the clock.",
          "The preparation, the build or the behind the scenes. Showing how it's made signals care and sets your business apart.",
        ],
        plan: "Pyme",
        planReason:
          "Thirty videos a week let you post daily across several channels, or split content between products, services and team without running out.",
        faqs: [
          {
            question: "Can I edit videos filmed on my phone?",
            answer:
              "Yes. Hooksage is built for phone footage. It accepts compatible MP4 and MOV files and exports a vertical MP4 at 720 × 1280 and 30 fps, the format for Reels, TikTok and Shorts. Good light and a clear voice help.",
          },
          {
            question: "How much does it cost to edit a reel for my business?",
            answer:
              "It depends on volume. There are subscriptions with a weekly video allowance and one-off packs of 10, 30 or 80 videos, priced in US dollars in the pricing section. Your first edit is free, arranged by email.",
          },
          {
            question: "Is it better than editing myself with a free app?",
            answer:
              "Free editing apps work if you have time to learn them and edit every piece by hand. Hooksage automates cuts, reframing and captions from your footage, and you only review the result before exporting.",
          },
        ],
      },
    },
    "marca-personal": {
      es: {
        metaTitle: "Edición de videos para marca personal | Hooksage",
        metaDescription:
          "Convierte tus explicaciones, clases y consejos en videos cortos con subtítulos para Reels, TikTok y Shorts. Edición con IA para marca personal.",
        problemTitle: "Sabes qué decir. Editar cada video es lo que te frena.",
        problem:
          "Coaches, consultores, docentes y profesionales independientes tienen algo que la mayoría de las marcas no tiene: conocimiento propio para compartir. El cuello de botella suele estar después de grabar, en las horas de cortar silencios, ajustar el encuadre y poner subtítulos. Hooksage hace ese trabajo con IA a partir de tu grabación a cámara, para que tu energía vaya a la idea y no a la línea de tiempo.",
        ideaDetails: [
          "Un consejo de tu especialidad que alguien pueda aplicar hoy. Los videos cortos con una sola idea son los que más se guardan y se comparten.",
          "Las preguntas que te hacen en consultas, clases o mensajes son temas probados: si una persona preguntó, muchas más tienen la misma duda.",
          "Un fragmento de tu curso, taller o charla, editado como pieza independiente. Es una forma de mostrar cómo enseñas antes de que te contraten.",
        ],
        plan: "Founder",
        planReason:
          "Si estás empezando, el plan Founder (10 videos por semana) alcanza para publicar a diario. El plan Marca Personal, de 80 videos por semana, está pensado para quien recorta clases o cursos completos en muchas piezas.",
        faqs: [
          {
            question:
              "¿Puedo convertir una clase o un video largo en varios cortos?",
            answer:
              "Puedes subir tu grabación e indicar el mensaje de cada pieza. Hooksage edita a partir de ese material: corta, encuadra en vertical y agrega subtítulos. Para varios cortos, crea un trabajo por cada idea que quieras publicar.",
          },
          {
            question: "¿Los subtítulos se generan solos?",
            answer:
              "Sí. Hooksage agrega subtítulos a tu video, algo clave porque mucha gente mira los videos sin sonido. Revisa el resultado antes de exportar, sobre todo nombres propios y términos técnicos.",
          },
          {
            question: "¿Hooksage publica por mí en mis redes?",
            answer:
              "No. Hooksage edita y exporta el video en MP4 vertical; la publicación la haces tú en Instagram, TikTok, YouTube o LinkedIn. Así mantienes el control de cuándo y dónde sale cada pieza.",
          },
        ],
      },
      en: {
        metaTitle: "Video editing for personal brands and creators | Hooksage",
        metaDescription:
          "Turn your explanations, classes and tips into captioned short videos for Reels, TikTok and Shorts. AI video editing for personal brands.",
        problemTitle:
          "You know what to say. Editing every video is what slows you down.",
        problem:
          "Coaches, consultants, teachers and independent professionals have something most brands don't: their own expertise to share. The bottleneck usually comes after filming, in the hours spent cutting silences, adjusting framing and adding captions. Hooksage does that work with AI from your talking-head recording, so your energy goes into the idea, not the timeline.",
        ideaDetails: [
          "A tip from your field someone can apply today. Short videos with a single idea are the ones people save and share most.",
          "Questions from sessions, classes or messages are proven topics: if one person asked, many more have the same doubt.",
          "A segment of your course, workshop or talk, edited as a standalone piece. It shows how you teach before someone hires you.",
        ],
        plan: "Founder",
        planReason:
          "If you're starting out, the Founder plan (10 videos a week) is enough to post daily. The Personal Brand plan, with 80 videos a week, is designed for people who cut full classes or courses into many pieces.",
        faqs: [
          {
            question: "Can I turn a class or a long video into several shorts?",
            answer:
              "Upload your recording and describe the message of each piece. Hooksage edits from that footage: it cuts, reframes vertically and adds captions. For several shorts, create one job for each idea you want to post.",
          },
          {
            question: "Are captions generated automatically?",
            answer:
              "Yes. Hooksage adds captions to your video, which matters because many people watch with the sound off. Review the result before exporting, especially names and technical terms.",
          },
          {
            question: "Does Hooksage post to my social media for me?",
            answer:
              "No. Hooksage edits and exports a vertical MP4; you post it on Instagram, TikTok, YouTube or LinkedIn. That way you control when and where each piece goes out.",
          },
        ],
      },
    },
    "equipos-de-marketing": {
      es: {
        metaTitle:
          "Edición de video corto para equipos de marketing | Hooksage",
        metaDescription:
          "Más videos verticales para Reels, TikTok, Shorts y LinkedIn sin sumar editores. Edición con IA, versiones y entrega en MP4 para equipos de marketing.",
        problemTitle:
          "El calendario de contenido crece. El equipo de edición, no.",
        problem:
          "Los equipos de marketing y growth publican en varios canales a la vez, y el video corto es el formato que más piezas exige. Cuando no hay un editor dedicado, cada video termina en la cola de un diseñador o de un freelance, y el calendario se atrasa. Hooksage resuelve el primer corte con IA a partir del material del equipo o de un guion con voz en off, y guarda cada versión para que revisar y aprobar no implique empezar de cero.",
        ideaDetails: [
          "Un lanzamiento, una función o un evento, editado una vez y publicado en Reels, TikTok, Shorts y LinkedIn con el mismo formato vertical.",
          "Variantes de una misma pieza de campaña con distinto hook o acabado, para probar qué funciona mejor sin rehacer la edición desde cero.",
          "Alguien del equipo responde una duda frecuente a cámara. Es contenido barato de producir, creíble y fácil de sostener cada semana.",
        ],
        plan: "Pyme",
        planReason:
          "Treinta videos por semana cubren un calendario diario en varios canales. Si el equipo produce variantes para pruebas A/B o muchas campañas a la vez, el plan Marca Personal ofrece 80 videos por semana.",
        faqs: [
          {
            question: "¿Puedo mantener el estilo de nuestra marca?",
            answer:
              "En la aplicación creas un perfil de marca editable, o lo importas desde un texto o PDF. Hooksage usa ese contexto para proponer hooks y guiones, y puedes elegir entre los acabados Natural, Dinámico e Impacto. También puedes subir un video de referencia para orientar el ritmo y la dirección visual.",
          },
          {
            question: "¿Qué pasa si hay que pedir cambios después de revisar?",
            answer:
              "Cada revisión crea un trabajo nuevo y conserva la versión anterior en la biblioteca. Puedes comparar versiones y retomar la que prefieras, sin perder el trabajo ya aprobado.",
          },
          {
            question: "¿En qué formato se entregan los videos?",
            answer:
              "En MP4 vertical de 720 × 1280 a 30 fps, listo para Reels, TikTok, Shorts y feeds verticales de LinkedIn. La entrega es digital: descargas el archivo desde la aplicación.",
          },
        ],
      },
      en: {
        metaTitle: "Short-form video editing for marketing teams | Hooksage",
        metaDescription:
          "More vertical videos for Reels, TikTok, Shorts and LinkedIn without adding editors. AI editing, version history and MP4 delivery for marketing teams.",
        problemTitle:
          "The content calendar keeps growing. The editing team doesn't.",
        problem:
          "Marketing and growth teams post across several channels at once, and short-form video is the format that demands the most pieces. Without a dedicated editor, every video ends up in a designer's or freelancer's queue and the calendar slips. Hooksage handles the first cut with AI from your team's footage or a voiceover script, and keeps every version so reviews and approvals don't mean starting over.",
        ideaDetails: [
          "A launch, a feature or an event, edited once and posted to Reels, TikTok, Shorts and LinkedIn in the same vertical format.",
          "Variants of one campaign piece with a different hook or finish, to test what works without redoing the edit from scratch.",
          "Someone on the team answers a common question on camera. It's cheap to produce, credible and easy to keep up every week.",
        ],
        plan: "Pyme",
        planReason:
          "Thirty videos a week cover a daily calendar across several channels. If your team produces A/B variants or many campaigns at once, the Personal Brand plan offers 80 videos a week.",
        faqs: [
          {
            question: "Can we keep our brand's style?",
            answer:
              "In the app you create an editable brand profile, or import one from text or a PDF. Hooksage uses that context to suggest hooks and scripts, and you can choose between the Natural, Dynamic and Impact finishes. You can also upload a reference video to guide pacing and visual direction.",
          },
          {
            question: "What happens if we need changes after review?",
            answer:
              "Each revision creates a new job and keeps the previous version in the library. You can compare versions and go back to the one you prefer, without losing approved work.",
          },
          {
            question: "What format are the videos delivered in?",
            answer:
              "Vertical MP4 at 720 × 1280 and 30 fps, ready for Reels, TikTok, Shorts and LinkedIn's vertical feed. Delivery is digital: you download the file from the app.",
          },
        ],
      },
    },
  };
