import { describe, it } from 'vitest';
import { ICsprng } from '../../types/ICsprng';
import { decrypt, encrypt } from '../../modules/encryption';
const assert = require('assert');

describe('unit - encryption', function () {
  it('encrypts and decrypts', async function () {
    const rng: ICsprng = {
      randomBytes: async (length: number) => new Uint8Array(length).fill(0)
    };
    const data2encrypt = 'really long data string bla bla really long data string bla bla really long data string bla bla';
    const crypted = await encrypt(rng, data2encrypt, 'password', '53B63311-D2D5-4C62-9F7F-28F25447B825');
    const decrypted = await decrypt(crypted, 'password', '53B63311-D2D5-4C62-9F7F-28F25447B825');

    assert.ok(crypted);
    assert.ok(decrypted);
    assert.strictEqual(decrypted, data2encrypt);
    assert.notStrictEqual(crypted, data2encrypt);

    let decryptedWithBadPassword;
    try {
      decryptedWithBadPassword = await decrypt(crypted, 'passwordBad', '53B63311-D2D5-4C62-9F7F-28F25447B825');
    } catch (e) {}
    assert.ok(!decryptedWithBadPassword);
  });
});
