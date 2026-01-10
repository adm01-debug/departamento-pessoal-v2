// V14-060: locales.ts
export const locales = {
  "pt-BR": {
    code: "pt-BR",
    name: "Português (Brasil)",
    dateFormat: "dd/MM/yyyy",
    timeFormat: "HH:mm",
    currency: "BRL",
    currencySymbol: "R$",
    decimalSeparator: ",",
    thousandsSeparator: ".",
  },
  "en-US": {
    code: "en-US",
    name: "English (US)",
    dateFormat: "MM/dd/yyyy",
    timeFormat: "hh:mm a",
    currency: "USD",
    currencySymbol: "$",
    decimalSeparator: ".",
    thousandsSeparator: ",",
  },
  "es-ES": {
    code: "es-ES",
    name: "Español",
    dateFormat: "dd/MM/yyyy",
    timeFormat: "HH:mm",
    currency: "EUR",
    currencySymbol: "€",
    decimalSeparator: ",",
    thousandsSeparator: ".",
  },
} as const;

export type LocaleCode = keyof typeof locales;
export type Locale = typeof locales[LocaleCode];

export const defaultLocale: LocaleCode = "pt-BR";

export const getLocale = (code: LocaleCode): Locale => locales[code] || locales[defaultLocale];

