/**
 * PORTED FROM  https://github.com/BlueWallet/BlueWallet/
 * LICENSE: MIT
 */
import * as bitcoin from 'bitcoinjs-lib';
import { CoinSelectTarget } from 'coinselect';
import { ECPairFactory } from 'ecpair';

import ecc from '@bitcoinerlab/secp256k1';
import { LegacyWallet } from './legacy-wallet';
import { CreateTransactionResult, CreateTransactionUtxo } from './types';

const ECPair = ECPairFactory(ecc);

/**
 * Creates Segwit P2SH Bitcoin address
 * @param pubkey
 * @param network
 * @returns {String}
 */
function pubkeyToP2shSegwitAddress(pubkey: Buffer): string | false {
  const { address } = bitcoin.payments.p2sh({
    redeem: bitcoin.payments.p2wpkh({ pubkey }),
  });
  return address ?? false;
}

export class SegwitP2SHWallet extends LegacyWallet {
  static readonly type = 'segwitP2SH';
  static readonly typeReadable = 'SegWit (P2SH)';
  // @ts-ignore: override
  public readonly type = SegwitP2SHWallet.type;
  // @ts-ignore: override
  public readonly typeReadable = SegwitP2SHWallet.typeReadable;
  public readonly segwitType = 'p2sh(p2wpkh)';

  static witnessToAddress(witness: string): string | false {
    try {
      const pubKey = Buffer.from(witness, 'hex');
      return pubkeyToP2shSegwitAddress(pubKey);
    } catch (_) {
      return false;
    }
  }

  /**
   * Converts script pub key to p2sh address if it can. Returns FALSE if it cant.
   *
   * @param scriptPubKey
   * @returns {boolean|string} Either p2sh address or false
   */
  static scriptPubKeyToAddress(scriptPubKey: string): string | false {
    try {
      const scriptPubKey2 = Buffer.from(scriptPubKey, 'hex');
      return (
        bitcoin.payments.p2sh({
          output: scriptPubKey2,
          network: bitcoin.networks.bitcoin,
        }).address ?? false
      );
    } catch (_) {
      return false;
    }
  }

  getAddress(): string | false {
    if (this._address) return this._address;
    let address;
    try {
      const keyPair = ECPair.fromWIF(this.secret);
      const pubKey = keyPair.publicKey;
      if (!keyPair.compressed) {
        console.warn('only compressed public keys are good for segwit');
        return false;
      }
      address = pubkeyToP2shSegwitAddress(pubKey);
    } catch (err) {
      return false;
    }
    this._address = address;

    return this._address;
  }

  /**
   *
   * @param utxos {Array.<{vout: Number, value: Number, txid: String, address: String, txhex: String, }>} List of spendable utxos
   * @param targets {Array.<{value: Number, address: String}>} Where coins are going. If theres only 1 target and that target has no value - this will send MAX to that address (respecting fee rate)
   * @param feeRate {Number} satoshi per byte
   * @param changeAddress {String} Excessive coins will go back to that address
   * @param sequence {Number} Used in RBF
   * @param skipSigning {boolean} Whether we should skip signing, use returned `psbt` in that case
   * @param masterFingerprint {number} Decimal number of wallet's master fingerprint
   * @returns {{outputs: Array, tx: Transaction, inputs: Array, fee: Number, psbt: Psbt}}
   */
  createTransaction(
    utxos: CreateTransactionUtxo[],
    targets: CoinSelectTarget[],
    feeRate: number,
    changeAddress: string,
    sequence: number,
    skipSigning = false,
    masterFingerprint: number
  ): CreateTransactionResult {
    if (targets.length === 0) throw new Error('No destination provided');
    // compensating for coinselect inability to deal with segwit inputs, and overriding script length for proper vbytes calculation
    for (const u of utxos) {
      u.script = { length: 50 };
    }
    const { inputs, outputs, fee } = this.coinselect(utxos, targets, feeRate);
    sequence = sequence || 0xffffffff; // disable RBF by default
    const psbt = new bitcoin.Psbt();
    let c = 0;
    const values: Record<number, number> = {};
    const keyPair = ECPair.fromWIF(this.secret);

    inputs.forEach((input) => {
      values[c] = input.value;
      c++;

      const pubkey = keyPair.publicKey;
      const p2wpkh = bitcoin.payments.p2wpkh({ pubkey });
      const p2sh = bitcoin.payments.p2sh({ redeem: p2wpkh });
      if (!p2sh.output) {
        throw new Error('Internal error: no p2sh.output during createTransaction()');
      }

      psbt.addInput({
        hash: input.txid,
        index: input.vout,
        sequence,
        witnessUtxo: {
          script: p2sh.output,
          value: input.value,
        },
        redeemScript: p2wpkh.output,
      });
    });

    outputs.forEach((output) => {
      // if output has no address - this is change output
      if (!output.address) {
        output.address = changeAddress;
      }

      const outputData = {
        address: output.address,
        value: output.value,
      };

      psbt.addOutput(outputData);
    });

    if (!skipSigning) {
      // skiping signing related stuff
      for (let cc = 0; cc < c; cc++) {
        psbt.signInput(cc, keyPair);
      }
    }

    let tx;
    if (!skipSigning) {
      tx = psbt.finalizeAllInputs().extractTransaction();
    }
    return { tx, inputs, outputs, fee, psbt };
  }

  allowSendMax() {
    return true;
  }

  isSegwit() {
    return true;
  }

  allowSignVerifyMessage() {
    return true;
  }
}
