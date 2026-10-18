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
    weeklyExports: 100,
    videoSeconds: 15,
    description: "Para compartir lo que sabés, al ritmo que necesitás.",
  },
] as const;
export const basePlan = plans[0];
