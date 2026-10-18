import english from "../data/english.json";
export type Language = "es" | "en";
const translations: Record<string, string> = english;
export const segments: Record<string, string> = {
  startups: "startups",
  pymes: "small-businesses",
  "marca-personal": "personal-brands",
  "equipos-de-marketing": "marketing-teams",
};
export function localeFromPath(path: string): Language {
  return path === "/en" || path.startsWith("/en/") ? "en" : "es";
}
export function translator(language: Language) {
  return (source: string): string => {
    if (language === "es") return source;
    if (!(source in translations))
      throw new Error("Missing English translation: " + source);
    return translations[source];
  };
}
export function homePath(language: Language) {
  return language === "en" ? "/en/" : "/";
}
export function businessPath(slug: string, language: Language) {
  if (!Object.hasOwn(segments, slug)) throw new Error("Unknown audience");
  return language === "en"
    ? "/en/videos-for-" + segments[slug] + "/"
    : "/videos-para-" + slug + "/";
}
export function audienceFromPath(path: string) {
  return Object.keys(segments).find((slug) =>
    [businessPath(slug, "es"), businessPath(slug, "en")].includes(
      path.endsWith("/") ? path : path + "/",
    ),
  );
}
export function alternatePath(path: string, language: Language) {
  const slug = audienceFromPath(path);
  return slug ? businessPath(slug, language) : homePath(language);
}
export function waitlistHref(path: string) {
  const slug = audienceFromPath(path);
  return (
    homePath(localeFromPath(path)) +
    (slug ? "?rubro=" + encodeURIComponent(slug) : "") +
    "#empezar"
  );
}
