/**
 * PORTED FROM  https://github.com/BlueWallet/BlueWallet/
 * LICENSE: MIT
 */
/**
 * @fileOverview creates an rng module that will bring all calls to 'crypto'
 * into one place to try and prevent mistakes when touching the crypto code.
 */

import { ICsprng } from '@shared/types/ICsprng';
import crypto from 'crypto';
// uses `crypto` module under nodejs/cli and shim under RN
// @see blue_modules/crypto.js

export const Csprng: ICsprng = {
  async randomBytes(size: number): Promise<Uint8Array> {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(size, (err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    });
  },
};
