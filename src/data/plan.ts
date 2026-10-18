import { translator, type Language } from "../lib/i18n";
// Monthly billing; export allowances renew weekly.
export const plans = [
  {
    name: "Founder",
    monthlyPriceUSD: "14,97",
    weeklyExports: 15,
    videoSeconds: 15,
    description: "Para sacar las primeras piezas sin hacer todo vos.",
  },
  {
    name: "Pyme",
    monthlyPriceUSD: "29,99",
    weeklyExports: 40,
    videoSeconds: 15,
    description: "Para sostener el contenido de tu negocio y tu equipo.",
  },
  {
    name: "Marca Personal",
    monthlyPriceUSD: "49,99",
    weeklyExports: 80,
    videoSeconds: 15,
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
