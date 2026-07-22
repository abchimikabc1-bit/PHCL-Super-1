// --- TYPES OF CURRENCIES & PAYMENT METHODS ---

export type CurrencyCode = 'USD' | 'TZS' | 'nTZS' | 'PI';

export interface CurrencyConfig {
  code: CurrencyCode;
  name: string;
  symbol: string;
  rateToUSD: number; // Thamani ya USD 1 kwa sarafu husika
  decimals: number;
}

export type PaymentCategory = 'BANK' | 'CARD' | 'MOBILE_MONEY' | 'CRYPTO';

export interface PaymentMethod {
  id: string;
  name: string;
  category: PaymentCategory;
  provider: 'BENK' | 'VISA' | 'AIRTELMONEY' | 'YAS' | 'MPESA' | 'HALOPESA' | 'PI_NETWORK';
  iconName: string;
  accountDetailsHint: string;
  supportedCurrencies: CurrencyCode[];
}

// --- CURRENCY CONFIGURATIONS & RATES ---

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  USD: {
    code: 'USD',
    name: 'US Dollar',
    symbol: '$',
    rateToUSD: 1.0,
    decimals: 2,
  },
  TZS: {
    code: 'TZS',
    name: 'Shilingi ya Tanzania',
    symbol: 'TSh',
    rateToUSD: 2700, // Exchange rate ya mfano: 1 USD = 2700 TZS
    decimals: 0,
  },
  nTZS: {
    code: 'nTZS',
    name: 'New TZS (Digital)',
    symbol: 'nTSh',
    rateToUSD: 2700,
    decimals: 2,
  },
  PI: {
    code: 'PI',
    name: 'Pi Network Token',
    symbol: 'π',
    rateToUSD: 0.032, // 1 PI = ~0.032 USD (inaweza kubadilika dynamic)
    decimals: 4,
  },
};

// --- PAYMENT METHODS CONFIGURATION ---

export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'pay-bank',
    name: 'Kutuma Benki (Bank Transfer)',
    category: 'BANK',
    provider: 'BENK',
    iconName: 'BuildingLibraryIcon',
    accountDetailsHint: 'Weka Namba ya Akaunti ya Benki',
    supportedCurrencies: ['TZS', 'USD', 'nTZS'],
  },
  {
    id: 'pay-visa',
    name: 'Visa / Mastercard',
    category: 'CARD',
    provider: 'VISA',
    iconName: 'CreditCardIcon',
    accountDetailsHint: 'Weka Namba ya Kadi (16 digits)',
    supportedCurrencies: ['USD', 'TZS', 'nTZS'],
  },
  {
    id: 'pay-mpesa',
    name: 'M-Pesa (Vodacom)',
    category: 'MOBILE_MONEY',
    provider: 'MPESA',
    iconName: 'PhoneIcon',
    accountDetailsHint: 'Namba ya Simu (Mfano: 0754xxxxxx)',
    supportedCurrencies: ['TZS', 'nTZS'],
  },
  {
    id: 'pay-yas',
    name: 'YAS / Tigo Pesa (MixbyYAS)',
    category: 'MOBILE_MONEY',
    provider: 'YAS',
    iconName: 'PhoneIcon',
    accountDetailsHint: 'Namba ya Simu (Mfano: 0713xxxxxx)',
    supportedCurrencies: ['TZS', 'nTZS'],
  },
  {
    id: 'pay-airtel',
    name: 'Airtel Money',
    category: 'MOBILE_MONEY',
    provider: 'AIRTELMONEY',
    iconName: 'PhoneIcon',
    accountDetailsHint: 'Namba ya Simu (Mfano: 0784xxxxxx)',
    supportedCurrencies: ['TZS', 'nTZS'],
  },
  {
    id: 'pay-halopesa',
    name: 'HaloPesa (Halotel)',
    category: 'MOBILE_MONEY',
    provider: 'HALOPESA',
    iconName: 'PhoneIcon',
    accountDetailsHint: 'Namba ya Simu (Mfano: 0620xxxxxx)',
    supportedCurrencies: ['TZS', 'nTZS'],
  },
  {
    id: 'pay-pi',
    name: 'Pi Network Wallet',
    category: 'CRYPTO',
    provider: 'PI_NETWORK',
    iconName: 'CurrencyDollarIcon',
    accountDetailsHint: 'Weka Anwani ya Pi Wallet (Public Key)',
    supportedCurrencies: ['PI'],
  },
];

// --- HELPER FUNCTIONS FOR CONVERSION & FORMATTING ---

/**
 * Inabadilisha kiasi kutoka sarafu moja kwenda nyingine
 */
export function convertCurrency(
  amount: number,
  from: CurrencyCode,
  to: CurrencyCode
): number {
  if (from === to) return amount;

  // Convert kwenda USD kwanza (Base Currency)
  const amountInUSD = from === 'USD' ? amount : amount / CURRENCIES[from].rateToUSD;

  // Convert kutoka USD kwenda sarafu inayotakiwa (Target)
  if (to === 'USD') return amountInUSD;
  return amountInUSD * CURRENCIES[to].rateToUSD;
}

/**
 * Inaweka format nzuri ya namba na alama ya sarafu (Mfano: "$1,200.00" au "TSh 3,240,000")
 */
export function formatCurrency(
  amount: number,
  currency: CurrencyCode = 'USD'
): string {
  const config = CURRENCIES[currency] || CURRENCIES.USD;
  const formattedNumber = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: config.decimals,
    maximumFractionDigits: config.decimals,
  }).format(amount);

  return `${config.symbol} ${formattedNumber}`;
}