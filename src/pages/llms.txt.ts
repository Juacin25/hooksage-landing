import { getPosts, postUrl } from "../lib/blog";
import { contactEmail } from "../lib/config";

// Generated so new blog posts are listed without editing this file.
export async function GET() {
  const posts = await getPosts();
  const text = `# Hooksage

> Hooksage es un editor de video con IA para equipos chicos de Hispanoamérica: convierte grabaciones hechas con el celular o la cámara en videos verticales para Instagram Reels, TikTok y YouTube Shorts, con cortes, encuadre y subtítulos. Exporta MP4 de 720 × 1280 a 30 fps. La primera edición es gratis.

Hooksage is an AI video editor for small teams. It turns raw recordings into vertical shorts with cuts, reframing and captions. English version: https://hooksage.com/en/

- Producto: edición automática con IA a partir de tus grabaciones o de un guion con voz en off; perfil de marca para proponer hooks, guiones y listas de tomas; acabados Natural, Dinámico e Impacto; historial de versiones.
- Precios (USD): planes mensuales o anuales con un cupo semanal de videos y packs de pago único de 10, 30 u 80 videos. Detalle vigente en https://hooksage.com/#precio
- Empresa: CANARY CODE SAS, Montevideo, Uruguay. Contacto: ${contactEmail}

## Páginas principales

- [Inicio (español)](https://hooksage.com/): qué es Hooksage, ejemplos de antes y después, precios y preguntas frecuentes.
- [Videos para startups](https://hooksage.com/videos-para-startups/)
- [Videos para pymes](https://hooksage.com/videos-para-pymes/)
- [Videos para marca personal](https://hooksage.com/videos-para-marca-personal/)
- [Videos para equipos de marketing](https://hooksage.com/videos-para-equipos-de-marketing/)
- [Home (English)](https://hooksage.com/en/)

## Blog: guías de video corto

${posts.map((post) => `- [${post.data.title}](${postUrl(post)}): ${post.data.description}`).join("\n")}

## Legal

- [Términos y condiciones](https://hooksage.com/terminos/)
- [Política de privacidad](https://hooksage.com/privacidad/)
`;
  return new Response(text, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
