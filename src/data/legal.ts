import type { Language } from "../lib/i18n";
import { contactEmail, contactUrl, paidPlansAvailable } from "../lib/config";
import { business } from "./business";
import { plansFor, packsFor } from "./plan";

export type LegalSection = {
  id: string;
  title: string;
  paragraphs?: string[];
  items?: string[];
  links?: { label: string; href: string }[];
};

type LegalDocument = {
  title: string;
  intro: string;
  updated: string;
  sections: LegalSection[];
};

// The update date identifies this version, not a retroactive effective date
// or evidence that these locally prepared texts have been deployed.
export function legalDocument(
  kind: "terms" | "privacy",
  lang: Language,
): LegalDocument {
  const en = lang === "en";
  const text = (es: string, english: string) => (en ? english : es);
  const identity = `${business.legalName}, RUT ${business.taxId}`;
  const emailLink = {
    label: contactEmail,
    href: contactUrl,
  };
  const privacyPath = en ? "/en/privacy/" : "/privacidad/";
  const termsPath = en ? "/en/terms/" : "/terminos/";
  const updated =
    kind === "terms"
      ? text("26 de octubre de 2026", "October 26, 2026")
      : text("23 de octubre de 2026", "October 23, 2026");

  if (kind === "terms") {
    return {
      title: text(
        "Términos y condiciones de Hooksage",
        "Hooksage terms and conditions",
      ),
      intro: text(
        "Estas condiciones explican el servicio de Hooksage, sus precios, el uso de los cupos y las opciones de cancelación y devolución. La fecha de actualización identifica esta versión y no modifica retroactivamente contrataciones anteriores.",
        "These terms explain the Hooksage service, its prices, video allowances, cancellations and refunds. The update date identifies this version and does not change earlier purchases retroactively.",
      ),
      updated,
      sections: [
        {
          id: "responsable",
          title: text(
            "1. Responsable y contacto",
            "1. Service provider and contact",
          ),
          paragraphs: [
            text(
              `Hooksage es un servicio de ${identity}, con domicilio constituido en ${business.legalAddress}. Para consultas, soporte, cancelaciones o devoluciones, escribí a ${contactEmail}.`,
              `Hooksage is provided by ${identity}, with its registered address at ${business.legalAddress}. For questions, support, cancellations or refunds, email ${contactEmail}.`,
            ),
          ],
          links: [emailLink],
        },
        {
          id: "servicio",
          title: text(
            "2. Qué incluye el servicio",
            "2. What the service includes",
          ),
          paragraphs: [
            text(
              "Hooksage es una plataforma de edición automática de videos con inteligencia artificial para creadores, profesionales y negocios. Procesa tus grabaciones e instrucciones para preparar piezas verticales para redes sociales. Según el contenido y las funciones contratadas, el resultado puede incluir cortes, subtítulos, cambios de encuadre, recursos gráficos y mejoras de audio. Las muestras ilustran posibilidades; cada video puede utilizar recursos diferentes.",
              "Hooksage is an automatic video editing platform powered by AI for creators, professionals and businesses. It processes your recordings and instructions to prepare vertical videos for social media. Depending on the footage and purchased features, results may include cuts, captions, reframing, graphics and audio improvements. Samples illustrate possibilities; each video may use different resources.",
            ),
            text(
              "Cada trabajo admite un archivo original de hasta cinco minutos y 250 MB. La entrega estándar es un MP4 vertical de 720 × 1280 píxeles a 30 fotogramas por segundo. Otros formatos, recursos o prestaciones deben estar expresamente incluidos en la opción elegida o acordarse antes de generar un cargo. Si una función no está habilitada, no se cobra por ella.",
              "Each job accepts an original file of up to five minutes and 250 MB. Standard delivery is a vertical MP4 at 720 × 1280 pixels and 30 frames per second. Any other format, resource or service must be expressly included in your selected option or agreed before a charge is made. You are not charged for a feature that is not enabled.",
            ),
          ],
        },
        {
          id: "contratacion",
          title: text(
            "3. Acceso, contratación y prueba gratuita",
            "3. Access, purchases and the free trial",
          ),
          paragraphs: [
            paidPlansAvailable
              ? text(
                  "El registro en la aplicación es gratuito y no contrata un plan ni genera un cobro. Las condiciones de pago se confirman antes de cualquier contratación. Solo se pueden realizar compras de pago cuando la aplicación ofrezca un proceso de contratación y pago.",
                  "App registration is free and does not purchase a plan or create a charge. Payment conditions are confirmed before any purchase. Paid purchases can only be made when the app provides a purchase and payment process.",
                )
              : text(
                  "El registro en la aplicación es gratuito. Los pagos de planes y packs todavía no están habilitados en la aplicación. Las condiciones comerciales publicadas aquí se aplicarán cuando se habilite un proceso de contratación y pago. Registrarte no contrata un plan, no activa una suscripción ni genera un cobro.",
                  "App registration is free. Payments for plans and packs are not yet enabled in the app. The commercial conditions published here will apply when a purchase and payment process is enabled. Registering does not purchase a plan, start a subscription or create a charge.",
                ),
            text(
              `La aplicación de Hooksage está separada de este sitio. Si no aparece una opción de contratación y pago, consultanos en ${contactEmail}. Este sitio informa sobre el producto y recibe solicitudes de prueba; su formulario no es un proceso de compra. No se cobra por funciones no habilitadas.`,
              `The Hooksage app is separate from this website. If no purchase and payment option appears, contact ${contactEmail}. This website describes the product and receives trial requests; its form is not a checkout. Features that are not enabled are not charged.`,
            ),
            text(
              "Cuando contrates, deberás proporcionar datos correctos, proteger tus credenciales y tener autorización para actuar en nombre de la empresa o marca que representes. Las condiciones de pago, incluida la opción elegida, el importe total, la moneda, los impuestos aplicables y cualquier renovación, se confirmarán antes de cualquier contratación. La contratación requerirá tu aceptación de esas condiciones y la confirmación del pago.",
              "When purchasing, you must provide accurate details, protect your credentials and be authorised to act for any business or brand you represent. Payment conditions, including the selected option, total amount, currency, applicable taxes and any renewal, will be confirmed before any purchase. A purchase will require your acceptance of those conditions and payment confirmation.",
            ),
            text(
              "La primera prueba solicitada desde este sitio es gratuita, una por persona o negocio, y se coordina por email. Antes de iniciarla confirmamos su alcance y el material necesario. Enviar el formulario no crea una cuenta en la aplicación, no realiza una compra ni activa una suscripción; no requiere tarjeta.",
              "The first trial requested through this website is free, limited to one per person or business, and arranged by email. We confirm its scope and required footage before starting. Submitting the form does not create an app account, make a purchase or start a subscription, and no card is required.",
            ),
          ],
        },
        {
          id: "entrega",
          title: text(
            "4. Procesamiento y entrega digital",
            "4. Processing and digital delivery",
          ),
          paragraphs: [
            text(
              "Los trabajos contratados se entregan digitalmente: al finalizar correctamente el procesamiento, el resultado queda disponible para revisión y descarga mediante la aplicación. La entrega de la prueba se coordina por correo. El tiempo depende de la duración y complejidad del material, la carga del sistema y los proveedores utilizados; no se promete un plazo fijo.",
              "Purchased jobs are delivered digitally: after successful processing, the result is made available for review and download through the app. Trial delivery is arranged by email. Processing time depends on the length and complexity of the footage, system demand and the providers involved; no fixed turnaround is promised.",
            ),
            text(
              `Si un trabajo falla o no se completa, escribí a ${contactEmail} para revisar el incidente. Un procesamiento fallido no consume cupo; si se descontó una unidad por error, se restituye al verificarlo.`,
              `If a job fails or does not complete, email ${contactEmail} so we can review it. Failed processing does not consume an allowance; a unit deducted in error is restored after verification.`,
            ),
          ],
        },
        {
          id: "packs",
          title: text("5. Packs de pago único", "5. One-off packs"),
          paragraphs: [
            text(
              "Los precios se expresan en dólares estadounidenses. Cada pack se paga una vez y no se renueva automáticamente:",
              "Prices are in US dollars. Each pack is purchased once and does not renew automatically:",
            ),
            text(
              "Las unidades del pack pueden utilizarse durante 90 días corridos desde la confirmación del pago. Podés consultar el saldo y el vencimiento en la aplicación, cuando esa consulta esté disponible, o solicitarlos por email. Las unidades sin utilizar vencen al terminar ese plazo, sin afectar los derechos de devolución previstos aquí o en la ley.",
              "Pack units can be used for 90 calendar days from payment confirmation. You can check the balance and expiry in the app when that view is available, or request them by email. Unused units expire at the end of that period, without affecting refund rights under these terms or applicable law.",
            ),
          ],
          items: packsFor(lang).map((pack) =>
            text(
              `${pack.name}: ${pack.exports} videos por US$${pack.priceUSD}, pago único.`,
              `${pack.name}: ${pack.exports} videos for US$${pack.priceUSD}, one-off payment.`,
            ),
          ),
        },
        {
          id: "suscripciones",
          title: text(
            "6. Suscripciones, cupos y renovación",
            "6. Subscriptions, allowances and renewal",
          ),
          paragraphs: [
            text(
              "Las suscripciones se cobran por mes. Mientras estén activas, su cupo se renueva cada siete días desde la activación. Las unidades no utilizadas durante un período de siete días no se acumulan para el siguiente. La fecha de reinicio y la del próximo cobro se informan al contratar o pueden consultarse por email.",
              "Subscriptions are billed monthly. While active, their allowance resets every seven days from activation. Units unused during a seven-day period do not carry over to the next. Reset and next-payment dates are provided when purchasing or can be requested by email.",
            ),
            text(
              "La renovación automática se aplica únicamente si se informa expresamente durante la compra y la aceptás antes de pagar. Cuando corresponda, el cargo se repite mensualmente hasta que canceles la renovación. Solicitar una prueba gratuita nunca activa una renovación ni una suscripción.",
              "Automatic renewal applies only if it is expressly disclosed at checkout and you accept it before paying. Where applicable, the charge repeats monthly until you cancel renewal. Requesting a free trial never starts a renewal or subscription.",
            ),
          ],
          items: plansFor(lang).map((plan) =>
            text(
              `${plan.name}: US$${plan.monthlyPriceUSD} por mes, con ${plan.weeklyExports} videos por período de siete días.`,
              `${plan.name}: US$${plan.monthlyPriceUSD} per month, with ${plan.weeklyExports} videos per seven-day period.`,
            ),
          ),
        },
        {
          id: "unidades",
          title: text(
            "7. Unidades, regeneraciones y ajustes",
            "7. Units, regenerations and adjustments",
          ),
          paragraphs: [
            text(
              "Una unidad corresponde a un video procesado correctamente y disponible para entrega. Cada trabajo incluye hasta dos regeneraciones con IA sobre el mismo material y objetivo, sin consumir unidades adicionales. Los ajustes manuales disponibles y las descargas de esa pieza tampoco consumen unidades adicionales.",
              "One unit covers one successfully processed video made available for delivery. Each job includes up to two AI regenerations using the same footage and objective, without consuming additional units. Available manual adjustments and downloads of that video do not consume additional units either.",
            ),
            text(
              "Un video nuevo, otro material principal o un objetivo diferente constituye otro trabajo y utiliza otra unidad. La aplicación muestra los controles habilitados. Si un pedido requiere una prestación o un consumo adicional, se informa antes de contratarlo o descontar otra unidad.",
              "A new video, different main footage or a different objective is a separate job and uses another unit. The app shows the enabled controls. If a request requires an additional service or allowance, this is disclosed before purchase or another unit is deducted.",
            ),
          ],
        },
        {
          id: "cancelacion",
          title: text("8. Cancelar una renovación", "8. Cancelling renewal"),
          paragraphs: [
            text(
              `Podés cancelar la renovación escribiendo a ${contactEmail} antes del próximo cargo, indicando el correo de tu cuenta y la contratación correspondiente. No hay penalidad por cancelar. Conservás el acceso y los cupos que correspondan hasta finalizar el período mensual ya pagado.`,
              `You can cancel renewal by emailing ${contactEmail} before the next charge, identifying your account email and purchase. There is no cancellation penalty. You keep access and the applicable allowances until the end of the monthly period already paid for.`,
            ),
            text(
              "La cancelación de la renovación no genera por sí sola una devolución del período en curso. Las solicitudes de devolución se rigen por la sección siguiente y por los derechos legales que correspondan.",
              "Cancelling renewal does not by itself refund the current period. Refund requests are governed by the following section and your applicable legal rights.",
            ),
          ],
          links: [emailLink],
        },
        {
          id: "devoluciones",
          title: text(
            "9. Devoluciones y problemas del servicio",
            "9. Refunds and service problems",
          ),
          paragraphs: [
            text(
              "Podés solicitar una devolución de la parte no utilizada durante los diez días corridos posteriores al pago. Si no hubo uso ni prestación, corresponde devolver el importe de esa contratación. Si el servicio se prestó parcialmente, calculamos una devolución proporcional de la parte no prestada y te informamos el cálculo. Esta política comercial se suma a tus derechos legales irrenunciables y no reduce un plazo legal mayor.",
              "You can request a refund of the unused portion within ten calendar days after payment. If there has been no use or service delivery, the purchase amount is refunded. If the service has been partly delivered, we calculate a proportional refund for the undelivered portion and explain the calculation. This commercial policy supplements your non-waivable legal rights and does not shorten any longer statutory period.",
            ),
            text(
              "Si un fallo del servicio impide completar una prestación contratada, ofrecemos resolverlo o devolver el importe de la parte no entregada. Los procesamientos fallidos no consumen unidades. Para solicitar una devolución, enviá el correo de tu cuenta y la referencia del pago, si la tenés, a nuestro email de contacto. Te comunicamos la resolución y el medio de devolución; la acreditación también depende del proveedor de pagos y de la entidad emisora.",
              "If a service failure prevents us from completing a purchased service, we offer to resolve it or refund the undelivered portion. Failed processing does not consume units. To request a refund, send your account email and payment reference, if available, to our contact email. We explain the decision and refund method; settlement also depends on the payment provider and card issuer or other financial institution.",
            ),
            text(
              "Cuando resulte aplicable la normativa uruguaya de consumo, se respetan el derecho legal de retracto y las reglas para prestaciones parcialmente ejecutadas. El carácter digital de la edición no se toma por sí solo como una renuncia o exclusión de esos derechos. Una excepción que requiera autorización expresa deberá informarse y aceptarse específicamente antes de aplicarse.",
              "Where Uruguayan consumer law applies, statutory withdrawal rights and rules for partly performed services are respected. Digital editing is not, by itself, treated as a waiver or exclusion of those rights. Any exception requiring express authorisation must be specifically disclosed and accepted before it is applied.",
            ),
          ],
          links: [emailLink],
        },
        {
          id: "material",
          title: text(
            "10. Tu material y su revisión",
            "10. Your footage and review responsibilities",
          ),
          paragraphs: [
            text(
              "Conservás los derechos que te correspondan sobre tus videos, textos, marcas y otros materiales. Al enviarlos, autorizás a CANARY CODE SAS y a los proveedores necesarios a acceder, copiar y transformar ese material únicamente en la medida necesaria para atender el trabajo y entregarte el resultado, según la Política de privacidad. No adquirimos tus derechos de propiedad por prestar el servicio.",
              "You keep your rights in your videos, text, brands and other materials. By submitting them, you authorise CANARY CODE SAS and the necessary providers to access, copy and transform those materials only as needed to perform the job and deliver the result, as described in the Privacy policy. Providing the service does not transfer your ownership rights to us.",
            ),
            text(
              "Debés contar con los derechos y autorizaciones necesarios para usar y compartir el contenido, incluida la imagen y voz de terceros. No uses el servicio para suplantar personas, vulnerar derechos o producir contenido ilícito. No envíes documentos de identidad, datos financieros, de salud u otra información sensible que no sea necesaria para la pieza. Las funciones de generación o modificación de voces requieren la autorización de su titular.",
              "You must have the rights and permissions needed to use and share the content, including other people's image and voice. Do not use the service for impersonation, infringement or unlawful content. Do not submit identity documents, financial or health details, or other sensitive information that is unnecessary for the video. Voice generation or modification requires the speaker's authorisation.",
            ),
            text(
              "Está prohibido subir, enviar o proporcionar materiales sexualmente explícitos, pornográficos o NSFW a las funciones de edición con IA y de generación o modificación de voz. Esta prohibición incluye videos, imágenes, audios, textos, guiones e instrucciones, también cuando se comparten mediante enlaces. También está prohibido usar estas funciones para generar contenido sexualmente explícito, pornográfico o NSFW.",
              "Uploading, submitting or providing sexually explicit, pornographic or NSFW materials to the AI editing and voice generation or modification features is prohibited. This includes videos, images, audio, text, scripts and prompts, including materials shared through links. Using these features to generate sexually explicit, pornographic or NSFW content is also prohibited.",
            ),
            text(
              "Antes de publicar, revisá nombres, cifras, subtítulos, afirmaciones y los derechos sobre los elementos incluidos. Las herramientas automáticas pueden cometer errores. Hooksage no promete visualizaciones, ventas, seguidores ni viralidad. Podemos detener un trabajo ante un problema de seguridad o de derechos y comunicaremos el motivo cuando sea posible; los importes de prestaciones no entregadas se tratan conforme a estas condiciones y la ley.",
              "Before publishing, review names, figures, captions, claims and rights in the included elements. Automated tools can make mistakes. Hooksage does not promise views, sales, followers or virality. We may stop a job for a security or rights issue and explain why when possible; payments for undelivered services are handled under these terms and applicable law.",
            ),
          ],
        },
        {
          id: "privacidad",
          title: text(
            "11. Privacidad y conservación",
            "11. Privacy and retention",
          ),
          paragraphs: [
            text(
              "La Política de privacidad explica los datos tratados, los proveedores y los plazos de conservación. Descargá los videos que quieras conservar: el servicio no es un archivo permanente. Compartir material para editarlo no autoriza a Hooksage a publicarlo en su portfolio, anuncios o redes; esos usos necesitan un permiso separado.",
              "The Privacy policy explains the data processed, providers and retention periods. Download videos you want to keep: this service is not permanent storage. Sharing footage for editing does not authorise Hooksage to publish it in a portfolio, advertising or social media; those uses require separate permission.",
            ),
          ],
          links: [
            {
              label: text("Política de privacidad", "Privacy policy"),
              href: privacyPath,
            },
          ],
        },
        {
          id: "cambios",
          title: text(
            "12. Cambios, responsabilidad y reclamos",
            "12. Changes, responsibility and complaints",
          ),
          paragraphs: [
            text(
              "Los cambios se publican con la fecha correspondiente. Un nuevo precio se comunica antes de la contratación o renovación a la que vaya a aplicarse, para que puedas decidir y cancelar una renovación antes del cargo. Las condiciones de packs ya adquiridos no se alteran retroactivamente.",
              "Changes are published with the relevant date. A new price is communicated before the purchase or renewal to which it will apply, so you can decide and cancel renewal before a charge. The conditions of packs already purchased are not changed retroactively.",
            ),
            text(
              "Respondemos por nuestras obligaciones conforme a la normativa aplicable. Ninguna disposición elimina derechos obligatorios del consumidor ni excluye responsabilidades que legalmente no puedan limitarse. Estas condiciones se interpretan conforme a la legislación uruguaya, sin restringir las protecciones obligatorias del lugar de residencia del consumidor ni su acceso a las autoridades o tribunales competentes.",
              "We remain responsible for our obligations under applicable law. No provision removes mandatory consumer rights or excludes liability that cannot legally be limited. These terms are interpreted under Uruguayan law without restricting mandatory protections in a consumer's place of residence or access to competent authorities or courts.",
            ),
            text(
              `Para consultas o reclamos, escribí a ${contactEmail}.`,
              `For questions or complaints, email ${contactEmail}.`,
            ),
          ],
          links: [emailLink],
        },
      ],
    };
  }

  return {
    title: text(
      "Política de privacidad de Hooksage",
      "Hooksage privacy policy",
    ),
    intro: text(
      "Esta política explica cómo tratamos la información de quienes visitan este sitio, solicitan una prueba o utilizan Hooksage. Describe el uso necesario para atender solicitudes y prestar el servicio, y las elecciones separadas para publicidad y otros usos opcionales.",
      "This policy explains how we process information about people who visit this website, request a trial or use Hooksage. It describes the processing needed to handle requests and provide the service, and the separate choices for advertising and other optional uses.",
    ),
    updated,
    sections: [
      {
        id: "responsable",
        title: text("1. Responsable y contacto", "1. Controller and contact"),
        paragraphs: [
          text(
            `${identity}, con domicilio constituido en ${business.legalAddress}, es responsable del tratamiento de datos personales para operar Hooksage. Para consultar por tus datos o ejercer tus derechos, escribí a ${contactEmail}.`,
            `${identity}, with its registered address at ${business.legalAddress}, is the controller of personal data processed to operate Hooksage. To ask about your information or exercise your rights, email ${contactEmail}.`,
          ),
        ],
        links: [emailLink],
      },
      {
        id: "formulario",
        title: text(
          "2. Datos de la solicitud de prueba",
          "2. Trial request information",
        ),
        paragraphs: [
          text(
            "El formulario solicita empresa o marca, tipo de equipo, nombre del contacto, correo electrónico, país y ciudad. Son obligatorios para enviar la solicitud por ese medio; podés escribirnos directamente por email si preferís no usarlo. WhatsApp, el enlace al video y la respuesta sobre tu experiencia de edición son opcionales.",
            "The form asks for your business or brand, team type, contact name, email, country and city. These are required to submit the form; you can email us directly if you prefer. WhatsApp, the video link and feedback about your editing experience are optional.",
          ),
          text(
            "También registramos idioma, página de origen, fecha, etiquetas de campaña asociadas al enlace de visita y versión del aviso de uso de datos. Se genera un identificador a partir de parte de la solicitud para evitar duplicados; ese identificador no vuelve anónimos los datos. El servidor y los proveedores de infraestructura pueden tratar dirección IP y datos técnicos de conexión para servir la página y prevenir abusos.",
            "We also record language, entry page, date, campaign tags associated with the visit link and the data-use notice version. An identifier based on part of the request helps prevent duplicates; it does not anonymise the information. The server and infrastructure providers may process IP addresses and technical connection details to serve the website and prevent abuse.",
          ),
          text(
            "Usamos esta información para responder a tu solicitud, coordinar la prueba y acceder al material que nos autorices a utilizar para la edición acordada. Enviar el formulario no crea una cuenta ni activa una compra o suscripción. Tampoco te inscribe por sí solo en campañas de marketing.",
            "We use this information to respond to your request, arrange the trial and access the material you authorise us to use for the agreed edit. Submitting the form does not create an account or activate a purchase or subscription. It does not, by itself, subscribe you to marketing campaigns.",
          ),
        ],
      },
      {
        id: "aplicacion",
        title: text(
          "3. Datos de la aplicación y las contrataciones",
          "3. App and purchase information",
        ),
        paragraphs: [
          text(
            "Cuando utilices una función habilitada de la aplicación o contrates el servicio, tratamos los datos necesarios para identificar tu cuenta, administrar el acceso, gestionar el plan o pack, registrar consumos y referencias de pago, prestar soporte y entregar resultados. Las grabaciones, instrucciones y resultados pueden contener imágenes, voces, textos, marcas y datos de otras personas.",
            "When you use an enabled app feature or purchase the service, we process the information needed to identify your account, manage access and your plan or pack, record usage and payment references, provide support and deliver results. Recordings, instructions and results may contain images, voices, text, brands and information about other people.",
          ),
          text(
            "El proveedor de pagos identificado durante la contratación trata los datos necesarios para procesar la operación conforme a sus propias condiciones. Hooksage conserva la información comercial y las referencias necesarias para gestionar el servicio, resolver incidencias y cumplir sus obligaciones. No envíes información de tarjetas por el formulario de prueba ni por email.",
            "The payment provider identified during purchase processes the information needed for the transaction under its own terms. Hooksage keeps the commercial information and references needed to manage the service, resolve issues and fulfil its obligations. Do not send card details through the trial form or by email.",
          ),
        ],
      },
      {
        id: "finalidades",
        title: text(
          "4. Para qué usamos los datos y con qué base",
          "4. Purposes and grounds for processing",
        ),
        paragraphs: [
          text(
            "Atender tu consulta y preparar una prueba responde a las gestiones previas al servicio que solicitás. Procesar material, entregar videos, administrar una contratación y dar soporte es necesario para prestar el servicio acordado. Los registros fiscales y la información exigida por autoridades se tratan para cumplir obligaciones legales.",
            "Answering your enquiry and preparing a trial supports the steps you request before a service. Processing footage, delivering videos, administering a purchase and providing support are necessary to perform the agreed service. Tax records and information required by authorities are processed to fulfil legal obligations.",
          ),
          text(
            "Los usos opcionales que lo requieran dependen de una autorización específica, como activar publicidad de Meta, recibir marketing adicional o permitir que una pieza aparezca en nuestro portfolio. La aceptación general de esta política no reemplaza esas elecciones. Podés retirar ese consentimiento sin afectar los tratamientos ya realizados ni los necesarios para atender el servicio o una obligación legal.",
            "Optional uses that require consent depend on a specific choice, such as enabling Meta advertising, receiving additional marketing or allowing a video in our portfolio. General acceptance of this policy does not replace those choices. You can withdraw that consent without affecting processing already carried out or processing needed for the service or a legal obligation.",
          ),
        ],
      },
      {
        id: "proveedores",
        title: text(
          "5. Personas y proveedores que intervienen",
          "5. People and providers involved",
        ),
        paragraphs: [
          text(
            "Pueden acceder a los datos las personas de CANARY CODE SAS que los necesiten para operar Hooksage, atender solicitudes y prestar soporte. Compartimos con cada proveedor la información necesaria para la función que realiza. Podemos comunicar datos a una autoridad cuando exista una obligación legal.",
            "People at CANARY CODE SAS may access data when needed to operate Hooksage, handle requests and provide support. We share with each provider the information needed for its function. We may disclose information to an authority where legally required.",
          ),
        ],
        items: [
          text(
            "Tenki: infraestructura y alojamiento del servicio.",
            "Tenki: service infrastructure and hosting.",
          ),
          text(
            "Cloudflare: entrega del sitio, conectividad y protección del tráfico.",
            "Cloudflare: website delivery, connectivity and traffic protection.",
          ),
          text(
            "Resend: envío de notificaciones de solicitudes cuando la integración está habilitada.",
            "Resend: request notification delivery when the integration is enabled.",
          ),
          text(
            "Gmail de Google: recepción y gestión de los mensajes de contacto y de las notificaciones recibidas por esa vía.",
            "Google Gmail: receiving and handling contact emails and notifications sent through that channel.",
          ),
          text(
            "OpenRouter y los proveedores de modelos a los que derive las solicitudes: procesamiento con inteligencia artificial de las instrucciones y del material necesario para la función utilizada.",
            "OpenRouter and the model providers to which it routes requests: AI processing of instructions and material needed for the feature used.",
          ),
          text(
            "AI33: generación de voz y efectos de sonido cuando se utilicen esas funciones.",
            "AI33: voice and sound-effect generation when those features are used.",
          ),
          text(
            "Proveedor de pagos informado antes de pagar: procesamiento y gestión de la operación.",
            "The payment provider identified before payment: transaction processing and administration.",
          ),
          text(
            "Meta: medición publicitaria solamente cuando aceptás activarla, según la sección de cookies.",
            "Meta: advertising measurement only when you opt in, as described in the cookies section.",
          ),
        ],
        links: [
          {
            label: text(
              "Privacidad de Cloudflare",
              "Cloudflare privacy policy",
            ),
            href: "https://www.cloudflare.com/privacypolicy/",
          },
          {
            label: text("Privacidad de Resend", "Resend privacy policy"),
            href: "https://resend.com/legal/privacy-policy",
          },
          {
            label: text("Privacidad de Google", "Google privacy policy"),
            href: "https://policies.google.com/privacy",
          },
          {
            label: text(
              "Privacidad de OpenRouter",
              "OpenRouter privacy policy",
            ),
            href: "https://openrouter.ai/privacy",
          },
          {
            label: text(
              "Retención y registros de proveedores de OpenRouter",
              "OpenRouter provider retention and logging",
            ),
            href: "https://openrouter.ai/docs/guides/privacy/provider-logging",
          },
          {
            label: text("Sitio de AI33", "AI33 website"),
            href: "https://ai33.pro",
          },
        ],
      },
      {
        id: "ia-transferencias",
        title: text(
          "6. Inteligencia artificial y transferencias internacionales",
          "6. AI and international transfers",
        ),
        paragraphs: [
          text(
            "Para ejecutar una función podemos enviar las instrucciones y los fragmentos de texto, audio, imagen o video que necesite a OpenRouter o AI33. OpenRouter deriva solicitudes a proveedores de modelos según la configuración y sus políticas. Las condiciones de registros, conservación y posible uso para mejorar modelos dependen del proveedor y del modelo seleccionado; no garantizamos retención cero ni una exclusión general de entrenamiento para todos los proveedores.",
            "To run a feature, we may send the instructions and necessary text, audio, image or video material to OpenRouter or AI33. OpenRouter routes requests to model providers according to configuration and their policies. Logging, retention and possible use for model improvement depend on the provider and selected model; we do not guarantee zero retention or a blanket training exclusion across all providers.",
          ),
          text(
            "El uso de infraestructura, correo, pagos y procesamiento de terceros puede implicar transferencias o acceso desde fuera de Uruguay, incluidos Estados Unidos u otros países según el proveedor y la configuración. No afirmamos que todo el tratamiento ocurra en un único país. Las transferencias deben realizarse conforme a los mecanismos y garantías exigidos por la normativa aplicable; podés pedirnos información sobre los proveedores usados en tu trabajo.",
            "Using third-party infrastructure, email, payments and processing may involve transfers or access outside Uruguay, including the United States or other countries depending on the provider and configuration. We do not state that all processing takes place in one country. Transfers must follow the mechanisms and safeguards required by applicable law; you can ask us about the providers used for your job.",
          ),
          text(
            "Si compartís un enlace de Drive, Dropbox u otro servicio, ese proveedor conserva el original bajo sus condiciones. Recibimos el enlace y podemos acceder al material que autorizaste a compartir. Los permisos y la conservación del archivo original en ese servicio siguen bajo tu control.",
            "If you share a Drive, Dropbox or other file-service link, that provider keeps the original under its own terms. We receive the link and may access the material you authorise us to use. Permissions and retention of the original with that service remain under your control.",
          ),
        ],
      },
      {
        id: "cookies",
        title: text(
          "7. Cookies, almacenamiento y publicidad",
          "7. Cookies, storage and advertising",
        ),
        paragraphs: [
          text(
            "Guardamos tu elección de publicidad en el almacenamiento local del navegador durante un máximo de 180 días para recordar si aceptaste o rechazaste. Solo si aceptás la medición guardamos etiquetas de campaña y página de origen en el almacenamiento de sesión, con una validez de 30 minutos, para asociar una solicitud con su visita. Al rechazar o retirar esa aceptación dejamos de usar esas etiquetas y eliminamos la atribución guardada en esa sesión.",
            "We store your advertising choice in browser local storage for up to 180 days to remember acceptance or rejection. Only if you accept measurement do we store campaign tags and the entry page in session storage, valid for 30 minutes, to associate a request with its visit. Rejecting or withdrawing that acceptance stops the use of those tags and removes the campaign attribution stored in that session.",
          ),
          text(
            "Meta Pixel solo se carga después de aceptar publicidad. Sin esa aceptación no se envían solicitudes a Meta desde el Pixel. Al aceptarlo, Meta puede recibir eventos de página o de solicitud confirmada, junto con dirección IP, datos del navegador, identificadores y la información que trate su tecnología. Rechazar publicidad permite seguir usando el sitio y enviar el formulario.",
            "Meta Pixel loads only after you accept advertising. Without that acceptance, the Pixel sends no requests to Meta. If you accept, Meta may receive page or confirmed-request events, along with IP address, browser details, identifiers and information processed by its technology. Rejecting advertising still allows you to use the website and submit the form.",
          ),
          text(
            "Podés revisar tu elección desde Ajustes de cookies en el pie del sitio. Respetamos la señal Global Privacy Control del navegador para mantener desactivada la publicidad. Cambiar tu elección detiene nuevos envíos del Pixel; no elimina la información que Meta ya haya recibido ni todas las cookies que pueda conservar ese tercero. También podés gestionar esas cookies desde el navegador.",
            "You can review your choice through Cookie settings in the footer. We respect the browser's Global Privacy Control signal by keeping advertising disabled. Changing your choice stops new Pixel transmissions; it does not erase information Meta has already received or all cookies that third party may retain. You can also manage cookies through your browser.",
          ),
        ],
        links: [
          {
            label: text("Privacidad de Meta", "Meta privacy policy"),
            href: "https://www.facebook.com/privacy/policy/",
          },
        ],
      },
      {
        id: "conservacion",
        title: text(
          "8. Conservación y eliminación",
          "8. Retention and deletion",
        ),
        paragraphs: [
          text(
            "La eliminación se gestiona mediante revisiones manuales; no prometemos un borrado automático al vencer el plazo. Podemos necesitar retirar información de varios sistemas. Las retenciones legales y los reclamos pueden exigir conservar determinados registros por más tiempo, con su uso limitado a esa obligación o defensa.",
            "Deletion is managed through manual reviews; we do not promise automatic deletion when a period ends. We may need to remove information from several systems. Legal retention requirements and disputes may require specific records to be kept longer, with use restricted to that obligation or claim.",
          ),
          text(
            "Las copias de seguridad propias pueden conservar versiones anteriores hasta 90 días adicionales después de la eliminación del sistema activo, con acceso limitado a recuperación. Si restauramos una copia, volvemos a aplicar las solicitudes de supresión que correspondan. Los proveedores tienen sus propios plazos; eliminar en Hooksage no elimina tu original en un servicio de archivos ni datos que un tercero deba conservar legalmente.",
            "Our own backups may retain earlier versions for up to 90 additional days after deletion from the active system, with access restricted to recovery. If a backup is restored, applicable deletion requests are reapplied. Providers have their own retention periods; deleting data in Hooksage does not remove your original from a file service or data a third party must legally keep.",
          ),
        ],
        items: [
          text(
            "Solicitudes de la landing y comunicaciones vinculadas: doce meses desde la última interacción relacionada con la solicitud.",
            "Website requests and related communications: twelve months from the last interaction about the request.",
          ),
          text(
            "Originales, proyectos y resultados de edición: treinta días desde la última actividad del proyecto. Descargá lo que quieras conservar; Hooksage no es un archivo permanente.",
            "Original footage, editing projects and results: thirty days from the project's last activity. Download anything you want to keep; Hooksage is not permanent storage.",
          ),
          text(
            "Documentación fiscal y datos necesarios para obligaciones legales: el plazo legal aplicable.",
            "Tax documentation and information needed for legal obligations: the applicable statutory period.",
          ),
        ],
      },
      {
        id: "derechos",
        title: text("9. Tus derechos", "9. Your rights"),
        paragraphs: [
          text(
            "Podés consultar cómo tratamos tus datos, acceder a ellos y solicitar su actualización, rectificación, inclusión o supresión cuando corresponda. También podés retirar el consentimiento para usos opcionales. Escribinos desde el correo asociado a tu solicitud o cuenta e indicá qué necesitás. Solo solicitaremos la información razonablemente necesaria para verificar tu identidad y localizar los registros.",
            "You can ask how we process your data, access it and request updates, rectification, inclusion or deletion where applicable. You can also withdraw consent for optional uses. Email us from the address associated with your request or account and explain what you need. We will ask only for information reasonably needed to verify your identity and locate the records.",
          ),
          text(
            "Respondemos a las solicitudes de acceso, actualización, rectificación o supresión dentro de los cinco días hábiles previstos por la normativa uruguaya, según corresponda, o informamos en ese plazo las razones por las que no proceda el pedido. Si no obtenés respuesta o considerás inadecuado el tratamiento, podés acudir a la Unidad Reguladora y de Control de Datos Personales de Uruguay.",
            "We respond to requests for access, updates, rectification or deletion within the five working days provided by Uruguayan law, as applicable, or explain within that period why a request cannot be granted. If you do not receive a response or consider the processing inappropriate, you can contact Uruguay's personal data protection authority, the URCDP.",
          ),
        ],
        links: [
          emailLink,
          {
            label: "URCDP",
            href: "https://www.gub.uy/unidad-reguladora-control-datos-personales",
          },
        ],
      },
      {
        id: "terceros",
        title: text(
          "10. Datos de terceros y usos adicionales",
          "10. Other people's data and additional uses",
        ),
        paragraphs: [
          text(
            "Compartí solo el material necesario y con una base válida para usar los datos de las personas que aparezcan, incluidas las autorizaciones de imagen y voz que correspondan. No envíes datos sensibles innecesarios por el formulario, las instrucciones o los archivos. Contanos si un material requiere un tratamiento especial antes de compartirlo.",
            "Share only necessary material and have a valid basis to use information about people appearing in it, including required image and voice permissions. Do not send unnecessary sensitive information through the form, instructions or files. Tell us before sharing material that needs special handling.",
          ),
          text(
            "Prestar el servicio no nos autoriza a publicar tu material como portfolio, publicidad o contenido para redes. Pediremos permiso separado para un contenido y uso concretos. La aceptación de esta política tampoco autoriza marketing adicional ni cualquier otro fin distinto que requiera un consentimiento específico.",
            "Providing the service does not authorise us to publish your material in a portfolio, advertising or social media. We ask for separate permission for specific content and uses. Accepting this policy also does not authorise additional marketing or another purpose requiring specific consent.",
          ),
        ],
      },
      {
        id: "actualizaciones",
        title: text(
          "11. Actualizaciones y contacto",
          "11. Updates and contact",
        ),
        paragraphs: [
          text(
            "Publicamos los cambios con su fecha de actualización. Si incorporamos un tratamiento que requiere una nueva autorización, informaremos su finalidad y pediremos esa autorización antes de realizarlo. Para consultas sobre esta política o los proveedores de un trabajo, podés escribir al contacto indicado.",
            "We publish changes with their update date. If we introduce processing that requires new authorisation, we explain its purpose and request that authorisation before carrying it out. For questions about this policy or the providers involved in a job, email the contact listed here.",
          ),
        ],
        links: [
          emailLink,
          {
            label: text("Términos y condiciones", "Terms and conditions"),
            href: termsPath,
          },
        ],
      },
    ],
  };
}
