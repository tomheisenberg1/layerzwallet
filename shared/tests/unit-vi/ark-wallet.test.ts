import { ArkWallet } from '../../class/wallets/ark-wallet';
import assert from 'assert';
import { test } from 'vitest';

test('ArkWallet', async () => {
  const w = new ArkWallet();
  w.setSecret('abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about');
  // acc number 0
  w.init();

  const receive0 = w.getOffchainReceiveAddress();
  assert.ok(receive0);

  w.setAccountNumber(1);
  w.init();
  assert.ok(w.getOffchainReceiveAddress());
  assert.ok(receive0 !== w.getOffchainReceiveAddress());

  w.setAccountNumber(0);
  w.init();

  assert.ok(receive0 === w.getOffchainReceiveAddress());
});
