import { translator, type Language } from "../lib/i18n";

// Billing changes the payment period, not the weekly video allowance.
export const plans = [
  {
    name: "Founder",
    monthlyPriceUSD: "14,99",
    annualPriceUSD: "119,90",
    weeklyExports: 10,
    description: "Para sacar las primeras piezas sin hacer todo vos.",
  },
  {
    name: "Pyme",
    monthlyPriceUSD: "34,99",
    annualPriceUSD: "272,92",
    weeklyExports: 30,
    description: "Para sostener el contenido de tu negocio y tu equipo.",
  },
  {
    name: "Marca Personal",
    monthlyPriceUSD: "59,99",
    annualPriceUSD: "431,93",
    weeklyExports: 80,
    description: "Para compartir lo que sabés, al ritmo que necesitás.",
  },
] as const;
export const basePlan = plans[0];
export type BillingPeriod = "monthly" | "annual";

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
    annualPriceUSD:
      language === "en"
        ? plan.annualPriceUSD.replace(",", ".")
        : plan.annualPriceUSD,
  }));
}

export const packs = [
  {
    name: "Pack 10",
    exports: 10,
    priceUSD: "5,99",
    description: "Para una tanda de contenido.",
  },
  {
    name: "Pack 30",
    exports: 30,
    priceUSD: "14,99",
    description: "Para una campaña o un lanzamiento.",
  },
  {
    name: "Pack 80",
    exports: 80,
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

const cents = (price: string) =>
  Math.round(Number(price.replace(",", ".")) * 100);
const formatCents = (value: number, language: Language) =>
  (Math.round(value) / 100)
    .toFixed(2)
    .replace(".", language === "en" ? "." : ",");

export function unitPriceFor(
  price: string,
  quantity: number,
  language: Language,
) {
  return formatCents(cents(price) / quantity, language);
}

export function pricingFor(
  plan: {
    monthlyPriceUSD: string;
    annualPriceUSD: string;
    weeklyExports: number;
  },
  period: BillingPeriod,
  language: Language,
) {
  const monthly = cents(plan.monthlyPriceUSD);
  const annual = cents(plan.annualPriceUSD);
  const twelveMonths = monthly * 12;
  const saving = twelveMonths - annual;
  const quantity = (plan.weeklyExports * 52) / (period === "annual" ? 1 : 12);
  return {
    priceUSD: period === "annual" ? plan.annualPriceUSD : plan.monthlyPriceUSD,
    monthlyEquivalentUSD: formatCents(annual / 12, language),
    unitPriceUSD: formatCents(
      (period === "annual" ? annual : monthly) / quantity,
      language,
    ),
    annualSavingUSD: formatCents(saving, language),
    annualSavingPercent: ((saving / twelveMonths) * 100)
      .toFixed(1)
      .replace(/\.0$/, "")
      .replace(".", language === "en" ? "." : ","),
  };
}
