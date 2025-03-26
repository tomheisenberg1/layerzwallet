import assert from 'assert';
import { afterAll, beforeAll, describe, it } from 'vitest';
import * as BlueElectrum from '../../blue_modules/BlueElectrum';
import { HDSegwitBech32Wallet } from '../../class/wallets/hd-segwit-bech32-wallet';
import { WatchOnlyWallet } from '../../class/wallets/watch-only-wallet';

afterAll(() => {
  // after all tests we close socket so the test suite can actually terminate
  BlueElectrum.forceDisconnect();
});

beforeAll(async () => {
  // waiting for Electrum to be connected
  try {
    await BlueElectrum.connectMain();
    await BlueElectrum.waitTillConnected();
    console.log('...connected!');
  } catch (err) {
    console.log('failed to connect to Electrum:', err);
    process.exit(1);
  }
});

describe('bitcoin wallet', () => {
  it('can fetch', async () => {
    let w: any = new HDSegwitBech32Wallet();
    w.setSecret('abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about');
    assert.ok(w.validateMnemonic());
    const xpub = w.getXpub();
    await w.fetchBalance();
    await w.fetchTransactions();
    assert.ok(w.getTransactions().length > 0, 'could not fetch transactions');

    w = new WatchOnlyWallet();
    w.setSecret(xpub);
    await w.fetchBalance();
    await w.fetchTransactions();
    assert.ok(w.getTransactions().length > 0, 'could not fetch transactions');
  });
});
