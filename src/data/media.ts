// Reference photography and a product screenshot supplied by Drivo. No customer endorsements.
export const referenceMedia: Record<
  string,
  {
    alt: string;
    width: number;
    height: number;
    position: string;
    label: string;
    kind: "photo" | "product";
  }
> = {
  "founder-interview": {
    width: 1080,
    height: 1620,
    alt: "Una persona participando de una entrevista con micrófono; foto de referencia.",
    position: "58% center",
    label: "Foto de referencia",
    kind: "photo",
  },
  "drivo-product": {
    width: 739,
    height: 1600,
    alt: "Captura real de Drivo: ficha de una Ford EcoSport en la plataforma de subastas.",
    position: "center",
    label: "Captura de Drivo",
    kind: "product",
  },
  "product-campaign": {
    width: 1080,
    height: 1575,
    alt: "Fotografía de producto de una zapatilla sobre fondo amarillo para una referencia de campaña.",
    position: "center",
    label: "Foto de referencia",
    kind: "photo",
  },
  "creator-podcast": {
    width: 1080,
    height: 1620,
    alt: "Una persona hablando frente a un micrófono; foto de referencia.",
    position: "45% center",
    label: "Foto de referencia",
    kind: "photo",
  },
  "startup-talk": {
    width: 1080,
    height: 1620,
    alt: "Una cámara grabando una explicación a cámara; foto de referencia.",
    position: "center",
    label: "Foto de referencia",
    kind: "photo",
  },
  "business-story": {
    width: 1080,
    height: 1620,
    alt: "Una persona presentando ideas a sus colegas; foto de referencia.",
    position: "center",
    label: "Foto de referencia",
    kind: "photo",
  },
  "personal-story": {
    width: 1080,
    height: 1620,
    alt: "Una presentación en un espacio de trabajo; foto de referencia.",
    position: "center",
    label: "Foto de referencia",
    kind: "photo",
  },
  "team-collaboration": {
    width: 1080,
    height: 720,
    alt: "Un equipo trabajando con computadoras y notas alrededor de una mesa; foto de referencia.",
    position: "center",
    label: "Foto de referencia",
    kind: "photo",
  },
  "team-workspace": {
    width: 1080,
    height: 720,
    alt: "Un equipo pequeño trabajando en sus productos con laptops; foto de referencia.",
    position: "center",
    label: "Foto de referencia",
    kind: "photo",
  },
};

export function mediaSizes(media: { width: number; height: number }) {
  // A landscape photo fills the height of a portrait card; request enough pixels for that crop.
  return media.width > media.height
    ? "(max-width: 650px) 720px, 840px"
    : "(max-width: 650px) 224px, 280px";
}
