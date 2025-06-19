// Demo mode helpers for LayerzWallet Expo app
// Use these to check and retrieve demo data

export function isDemoMode() {
  // Check if we're in demo mode based on environment or configuration
  // For now, disable demo mode to use real wallet functionality
  return false;
}

export function getDemoMnemonic() {
  return 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about';
}

export function getDemoWallets() {
  return [
    {
      type: 'bitcoin',
      label: 'Demo BTC Wallet',
      xpub: 'xpub6CUGRUonZSQ4TWtTMmzXdrXDtypWKiKp6GH2h3Qyq5b6Q1Q1Q1Q1Q1Q1Q1Q1Q1Q1Q1Q1Q1Q1Q1Q1Q1Q1Q1Q1Q1Q1Q1Q1Q1Q1Q1Q1Q1Q1',
      balance: 123.4567,
      transactions: [
        {
          txid: 'demo-txid-1',
          amount: 0.5,
          date: '2025-06-01T12:00:00Z',
          confirmed: true,
        },
        {
          txid: 'demo-txid-2',
          amount: 0.7345,
          date: '2025-06-10T15:00:00Z',
          confirmed: true,
        },
      ],
    },
    {
      type: 'evm',
      label: 'Demo EVM Wallet',
      address: '0x000000000000000000000000000000000000dEaD',
      balance: 42000.0,
      transactions: [
        {
          txid: 'demo-evm-txid-1',
          amount: 10,
          date: '2025-06-05T10:00:00Z',
          confirmed: true,
        },
        {
          txid: 'demo-evm-txid-2',
          amount: 32,
          date: '2025-06-12T18:00:00Z',
          confirmed: true,
        },
      ],
    },
    {
      type: 'liquid',
      label: 'Demo Liquid Wallet',
      address: 'VTp1Qw2k3e4r5t6y7u8i9o0p',
      balance: 10050.5,
      transactions: [],
    },
    {
      type: 'lightning',
      label: 'Demo Lightning Wallet',
      address: 'lnbc1pvjluez...',
      balance: 25.0,
      transactions: [],
    },
  ];
}

export function getDemoBalances() {
  return {
    BTC: 123.4567,
    ETH: 42000.0,
    LIQUID: 10050.5,
    LIGHTNING: 25.0,
  };
}

export function getDemoContacts() {
  return [
    { name: 'Alice', address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh' },
    { name: 'Bob', address: '0x000000000000000000000000000000000000dEaD' },
  ];
}
