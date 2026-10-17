// Product terms confirmed by the user. Billing is monthly; export allowance is weekly.
export const basePlan = {
  name: "Plan Base",
  monthlyPriceMXN: "299", // IVA incluido
  weeklyExports: 15,
  videoSeconds: 15,
} as const;
