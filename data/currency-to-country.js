// Currency code -> ISO 3166-1 alpha-2 country code (lowercased it is the flag file name on flagcdn.com) and country name.
// Shared currencies point at the main issuing country or union (EUR -> EU).
export const currencyToCountry = {
  AED: 'AE', AFN: 'AF', ALL: 'AL', AMD: 'AM', ANG: 'CW', AOA: 'AO', ARS: 'AR', AUD: 'AU', AWG: 'AW', AZN: 'AZ',
  BAM: 'BA', BBD: 'BB', BDT: 'BD', BGN: 'BG', BHD: 'BH', BIF: 'BI', BMD: 'BM', BND: 'BN', BOB: 'BO', BRL: 'BR',
  BSD: 'BS', BTN: 'BT', BWP: 'BW', BYN: 'BY', BZD: 'BZ', CAD: 'CA', CDF: 'CD', CHF: 'CH', CLP: 'CL', CNY: 'CN',
  COP: 'CO', CRC: 'CR', CUP: 'CU', CVE: 'CV', CZK: 'CZ', DJF: 'DJ', DKK: 'DK', DOP: 'DO', DZD: 'DZ', EGP: 'EG',
  ERN: 'ER', ETB: 'ET', EUR: 'EU', FJD: 'FJ', FKP: 'FK', FOK: 'FO', GBP: 'GB', GEL: 'GE', GGP: 'GG', GHS: 'GH',
  GIP: 'GI', GMD: 'GM', GNF: 'GN', GTQ: 'GT', GYD: 'GY', HKD: 'HK', HNL: 'HN', HRK: 'HR', HTG: 'HT', HUF: 'HU',
  IDR: 'ID', ILS: 'IL', IMP: 'IM', INR: 'IN', IQD: 'IQ', IRR: 'IR', ISK: 'IS', JEP: 'JE', JMD: 'JM', JOD: 'JO',
  JPY: 'JP', KES: 'KE', KGS: 'KG', KHR: 'KH', KID: 'KI', KMF: 'KM', KRW: 'KR', KWD: 'KW', KYD: 'KY', KZT: 'KZ',
  LAK: 'LA', LBP: 'LB', LKR: 'LK', LRD: 'LR', LSL: 'LS', LYD: 'LY', MAD: 'MA', MDL: 'MD', MGA: 'MG', MKD: 'MK',
  MMK: 'MM', MNT: 'MN', MOP: 'MO', MRU: 'MR', MUR: 'MU', MVR: 'MV', MWK: 'MW', MXN: 'MX', MYR: 'MY', MZN: 'MZ',
  NAD: 'NA', NGN: 'NG', NIO: 'NI', NOK: 'NO', NPR: 'NP', NZD: 'NZ', OMR: 'OM', PAB: 'PA', PEN: 'PE', PGK: 'PG',
  PHP: 'PH', PKR: 'PK', PLN: 'PL', PYG: 'PY', QAR: 'QA', RON: 'RO', RSD: 'RS', RUB: 'RU', RWF: 'RW', SAR: 'SA',
  SBD: 'SB', SCR: 'SC', SDG: 'SD', SEK: 'SE', SGD: 'SG', SHP: 'SH', SLE: 'SL', SLL: 'SL', SOS: 'SO', SRD: 'SR',
  SSP: 'SS', STN: 'ST', SYP: 'SY', SZL: 'SZ', THB: 'TH', TJS: 'TJ', TMT: 'TM', TND: 'TN', TOP: 'TO', TRY: 'TR',
  TTD: 'TT', TVD: 'TV', TWD: 'TW', TZS: 'TZ', UAH: 'UA', UGX: 'UG', USD: 'US', UYU: 'UY', UZS: 'UZ', VES: 'VE',
  VND: 'VN', VUV: 'VU', WST: 'WS', XCD: 'AG', XOF: 'SN', XAF: 'CM', XPF: 'PF', YER: 'YE', ZAR: 'ZA', ZMW: 'ZM',
  ZWL: 'ZW',
};

// Country (or union) names for the codes above; keys are the values of currencyToCountry.
export const countryNames = {
  AE: 'United Arab Emirates', AF: 'Afghanistan', AL: 'Albania', AM: 'Armenia', AO: 'Angola', AR: 'Argentina',
  AU: 'Australia', AW: 'Aruba', AZ: 'Azerbaijan', BA: 'Bosnia and Herzegovina', BB: 'Barbados', BD: 'Bangladesh',
  BG: 'Bulgaria', BH: 'Bahrain', BI: 'Burundi', BM: 'Bermuda', BN: 'Brunei', BO: 'Bolivia', BR: 'Brazil',
  BS: 'Bahamas', BT: 'Bhutan', BW: 'Botswana', BY: 'Belarus', BZ: 'Belize', CA: 'Canada',
  CD: 'DR Congo', CH: 'Switzerland', CL: 'Chile', CN: 'China', CO: 'Colombia', CR: 'Costa Rica', CU: 'Cuba',
  CV: 'Cape Verde', CW: 'Curaçao', CZ: 'Czechia', DJ: 'Djibouti', DK: 'Denmark', DO: 'Dominican Republic',
  DZ: 'Algeria', EG: 'Egypt', ER: 'Eritrea', ET: 'Ethiopia', EU: 'European Union', FJ: 'Fiji',
  FK: 'Falkland Islands', FO: 'Faroe Islands', GB: 'United Kingdom', GE: 'Georgia', GG: 'Guernsey', GH: 'Ghana',
  GI: 'Gibraltar', GM: 'Gambia', GN: 'Guinea', GT: 'Guatemala', GY: 'Guyana', HK: 'Hong Kong', HN: 'Honduras',
  HR: 'Croatia', HT: 'Haiti', HU: 'Hungary', ID: 'Indonesia', IL: 'Israel', IM: 'Isle of Man', IN: 'India',
  IQ: 'Iraq', IR: 'Iran', IS: 'Iceland', JE: 'Jersey', JM: 'Jamaica', JO: 'Jordan', JP: 'Japan', KE: 'Kenya',
  KG: 'Kyrgyzstan', KH: 'Cambodia', KI: 'Kiribati', KM: 'Comoros', KR: 'South Korea', KW: 'Kuwait',
  KY: 'Cayman Islands', KZ: 'Kazakhstan', LA: 'Laos', LB: 'Lebanon', LK: 'Sri Lanka', LR: 'Liberia',
  LS: 'Lesotho', LY: 'Libya', MA: 'Morocco', MD: 'Moldova', MG: 'Madagascar', MK: 'North Macedonia',
  MM: 'Myanmar', MN: 'Mongolia', MO: 'Macau', MR: 'Mauritania', MU: 'Mauritius', MV: 'Maldives', MW: 'Malawi',
  MX: 'Mexico', MY: 'Malaysia', MZ: 'Mozambique', NA: 'Namibia', NG: 'Nigeria', NI: 'Nicaragua', NO: 'Norway',
  NP: 'Nepal', NZ: 'New Zealand', OM: 'Oman', PA: 'Panama', PE: 'Peru', PG: 'Papua New Guinea',
  PH: 'Philippines', PK: 'Pakistan', PL: 'Poland', PY: 'Paraguay', QA: 'Qatar', RO: 'Romania', RS: 'Serbia',
  RU: 'Russia', RW: 'Rwanda', SA: 'Saudi Arabia', SB: 'Solomon Islands', SC: 'Seychelles', SD: 'Sudan',
  SE: 'Sweden', SG: 'Singapore', SH: 'Saint Helena', SL: 'Sierra Leone', SO: 'Somalia', SR: 'Suriname',
  SS: 'South Sudan', ST: 'São Tomé and Príncipe', SY: 'Syria', SZ: 'Eswatini', TH: 'Thailand',
  TJ: 'Tajikistan', TM: 'Turkmenistan', TN: 'Tunisia', TO: 'Tonga', TR: 'Türkiye', TT: 'Trinidad and Tobago',
  TV: 'Tuvalu', TW: 'Taiwan', TZ: 'Tanzania', UA: 'Ukraine', UG: 'Uganda', US: 'United States', UY: 'Uruguay',
  UZ: 'Uzbekistan', VE: 'Venezuela', VN: 'Vietnam', VU: 'Vanuatu', WS: 'Samoa', AG: 'Eastern Caribbean',
  SN: 'West Africa (CFA)', CM: 'Central Africa (CFA)', PF: 'French Pacific Territories', YE: 'Yemen',
  ZA: 'South Africa', ZM: 'Zambia', ZW: 'Zimbabwe',
};

// ISO country code for a currency, or '' when unknown
export function getCountryCode(currency) {
  return currencyToCountry[currency] || '';
}

// Country name for a currency, or '' when unknown
export function getCountryName(currency) {
  return countryNames[getCountryCode(currency)] || '';
}

// Flag image url for a currency, or '' when we have no country for it (better no flag than a wrong one)
export function getFlagUrl(currency) {
  const code = getCountryCode(currency);
  return code ? `https://flagcdn.com/24x18/${code.toLowerCase()}.png` : '';
}
