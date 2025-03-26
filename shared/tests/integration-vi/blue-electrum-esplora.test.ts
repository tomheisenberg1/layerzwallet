import assert from 'assert';
import { afterEach, beforeEach, describe, it, vi as jest, expect } from 'vitest';
import * as BlueElectrum from '../../blue_modules/BlueElectrum';

beforeEach(async () => {
  // use esplora electrum server because it does not return errors if method does not exist
  BlueElectrum.hardcodedPeers[0].port = 443;
  BlueElectrum.hardcodedPeers[0].host = 'blockstream.info';
  BlueElectrum.hardcodedPeers[0].path = '/liquid/electrum-websocket/api';
  // waiting for Electrum to be connected
  try {
    await BlueElectrum.connectMain();
  } catch (err) {
    console.log('failed to connect to Electrum:', err);
    process.exit(1);
  }
});

afterEach(() => {
  // after all tests we close socket so the test suite can actually terminate
  BlueElectrum.forceDisconnect();
});

describe('BlueElectrum Timeout', () => {
  it('ElectrumClient can throw timeout error', async () => {
    jest.useFakeTimers(); // fake timers so we don't have to wait 10 seconds
    await assert.rejects(
      async () => {
        const promise = BlueElectrum.methodDoesNotExist();
        jest.runAllTimers(); // fast forward timers
        await promise;
      },
      (err: any) => {
        return err.message.includes('Electrum request timeout');
      }
    );
    jest.useRealTimers();
  });

  it('ElectrumClient can ping', async () => {
    const result = await BlueElectrum.ping();
    expect(result).toBe(true);
  });
});
