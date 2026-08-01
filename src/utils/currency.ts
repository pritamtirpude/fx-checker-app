import type { Currency } from '@/types'

// Maps currency ISO 4217 code → ISO 3166-1 alpha-2 country code for flag lookup.
// Only currencies whose flag exists under /assets/images/flags/ are included.
const CURRENCY_FLAG_MAP: Record<string, string> = {
  AED: 'ae',
  ARS: 'ar',
  AUD: 'au',
  BDT: 'bd',
  BGN: 'bg',
  BHD: 'bh',
  BRL: 'br',
  CAD: 'ca',
  CHF: 'ch',
  CLP: 'cl',
  CNY: 'cn',
  COP: 'co',
  CYP: 'cy',
  CZK: 'cz',
  DKK: 'dk',
  EGP: 'eg',
  EUR: 'eu',
  GBP: 'gb',
  HKD: 'hk',
  HRK: 'hr',
  HTG: 'ht',
  HUF: 'hu',
  IDR: 'id',
  INR: 'in',
  ISK: 'is',
  JOD: 'jo',
  JPY: 'jp',
  KES: 'ke',
  KRW: 'kr',
  KWD: 'kw',
  LBP: 'lb',
  LKR: 'lk',
  MAD: 'ma',
  MXN: 'mx',
  MYR: 'my',
  NGN: 'ng',
  NOK: 'no',
  NPR: 'np',
  NZD: 'nz',
  OMR: 'om',
  PEN: 'pe',
  PHP: 'ph',
  PKR: 'pk',
  PLN: 'pl',
  QAR: 'qa',
  RON: 'ro',
  RUB: 'ru',
  SAR: 'sa',
  SEK: 'se',
  SGD: 'sg',
  THB: 'th',
  TRY: 'tr',
  TWD: 'tw',
  UAH: 'ua',
  USD: 'us',
  VND: 'vn',
  ZAR: 'za',
}

export type CurrencyOption = {
  flag: string
  code: string
  name: string
}

export function getCurrencyOptions(currencies: Currency[]): CurrencyOption[] {
  return currencies
    .filter((c) => c.iso_code in CURRENCY_FLAG_MAP)
    .map((c) => ({
      flag: `/assets/images/flags/${CURRENCY_FLAG_MAP[c.iso_code]}.webp`,
      code: c.iso_code,
      name: c.name,
    }))
}
