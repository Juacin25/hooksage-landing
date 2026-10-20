import { translator, type Language } from "../lib/i18n";
// Monthly billing; export allowances renew weekly.
export const plans = [
  {
    name: "Founder",
    monthlyPriceUSD: "14,99",
    weeklyExports: 5,
    description: "Para sacar las primeras piezas sin hacer todo vos.",
  },
  {
    name: "Pyme",
    monthlyPriceUSD: "34,99",
    weeklyExports: 15,
    description: "Para sostener el contenido de tu negocio y tu equipo.",
  },
  {
    name: "Marca Personal",
    monthlyPriceUSD: "59,99",
    weeklyExports: 40,
    description: "Para compartir lo que sabés, al ritmo que necesitás.",
  },
] as const;
export const basePlan = plans[0];

export function plansFor(language: Language) {
  const t = translator(language);
  return plans.map((plan) => ({
    ...plan,
    name:
      language === "en"
        ? {
            Founder: "Founder",
            Pyme: "Small Business",
            "Marca Personal": "Personal Brand",
          }[plan.name]
        : plan.name,
    description: t(plan.description),
    monthlyPriceUSD:
      language === "en"
        ? plan.monthlyPriceUSD.replace(",", ".")
        : plan.monthlyPriceUSD,
  }));
}

// One-off packs do not renew automatically.
export const packs = [
  {
    name: "Pack 5",
    exports: 5,
    priceUSD: "5,99",
    description: "Para una tanda de contenido.",
  },
  {
    name: "Pack 15",
    exports: 15,
    priceUSD: "14,99",
    description: "Para una campaña o un lanzamiento.",
  },
  {
    name: "Pack 40",
    exports: 40,
    priceUSD: "34,99",
    description: "Para producir más de una vez.",
  },
] as const;
export function packsFor(language: Language) {
  const t = translator(language);
  return packs.map((pack) => ({
    ...pack,
    description: t(pack.description),
    priceUSD:
      language === "en" ? pack.priceUSD.replace(",", ".") : pack.priceUSD,
  }));
}
