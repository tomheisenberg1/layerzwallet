/**
 * PORTED FROM  https://github.com/BlueWallet/BlueWallet/
 * LICENSE: MIT
 */
export const BitcoinUnit = {
  BTC: 'BTC',
  SATS: 'sats',
  LOCAL_CURRENCY: 'local_currency',
  MAX: 'MAX',
} as const;
export type TBitcoinUnit = (typeof BitcoinUnit)[keyof typeof BitcoinUnit];

export const Chain = {
  ONCHAIN: 'ONCHAIN',
  OFFCHAIN: 'OFFCHAIN',
} as const;
export type TChain = (typeof Chain)[keyof typeof Chain];
