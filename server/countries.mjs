// Single source for the form, validation, phone normalization and notifications.
// dial: calling code without "+"; example: WhatsApp placeholder.
export const countries = [
  {
    code: "AR",
    es: "Argentina",
    en: "Argentina",
    dial: "54",
    example: "+54 9 11 1234 5678",
  },
  {
    code: "BO",
    es: "Bolivia",
    en: "Bolivia",
    dial: "591",
    example: "+591 7 123 4567",
  },
  {
    code: "CL",
    es: "Chile",
    en: "Chile",
    dial: "56",
    example: "+56 9 1234 5678",
  },
  {
    code: "CO",
    es: "Colombia",
    en: "Colombia",
    dial: "57",
    example: "+57 300 123 4567",
  },
  {
    code: "CR",
    es: "Costa Rica",
    en: "Costa Rica",
    dial: "506",
    example: "+506 8312 3456",
  },
  { code: "CU", es: "Cuba", en: "Cuba", dial: "53", example: "+53 5 123 4567" },
  {
    code: "EC",
    es: "Ecuador",
    en: "Ecuador",
    dial: "593",
    example: "+593 99 123 4567",
  },
  {
    code: "SV",
    es: "El Salvador",
    en: "El Salvador",
    dial: "503",
    example: "+503 7012 3456",
  },
  {
    code: "GT",
    es: "Guatemala",
    en: "Guatemala",
    dial: "502",
    example: "+502 5123 4567",
  },
  {
    code: "HN",
    es: "Honduras",
    en: "Honduras",
    dial: "504",
    example: "+504 9123 4567",
  },
  {
    code: "MX",
    es: "México",
    en: "Mexico",
    dial: "52",
    example: "+52 55 1234 5678",
  },
  {
    code: "NI",
    es: "Nicaragua",
    en: "Nicaragua",
    dial: "505",
    example: "+505 8123 4567",
  },
  {
    code: "PA",
    es: "Panamá",
    en: "Panama",
    dial: "507",
    example: "+507 6123 4567",
  },
  {
    code: "PY",
    es: "Paraguay",
    en: "Paraguay",
    dial: "595",
    example: "+595 981 123 456",
  },
  {
    code: "PE",
    es: "Perú",
    en: "Peru",
    dial: "51",
    example: "+51 912 345 678",
  },
  {
    code: "PR",
    es: "Puerto Rico",
    en: "Puerto Rico",
    dial: "1",
    example: "+1 787 555 0123",
  },
  {
    code: "DO",
    es: "República Dominicana",
    en: "Dominican Republic",
    dial: "1",
    example: "+1 809 555 0123",
  },
  {
    code: "UY",
    es: "Uruguay",
    en: "Uruguay",
    dial: "598",
    example: "+598 99 123 456",
  },
  {
    code: "VE",
    es: "Venezuela",
    en: "Venezuela",
    dial: "58",
    example: "+58 412 123 4567",
  },
  {
    code: "US",
    es: "Estados Unidos",
    en: "United States",
    dial: "1",
    example: "+1 202 555 0123",
  },
  {
    code: "GB",
    es: "Reino Unido",
    en: "United Kingdom",
    dial: "44",
    example: "+44 7700 900123",
  },
];

export const countryCodes = countries.map((country) => country.code);

export function countryName(code, language = "es") {
  return countries.find((country) => country.code === code)?.[language] ?? code;
}
