import assert from 'assert';
import { vi, afterEach, test, expect } from 'vitest';

import { BackgroundCaller } from '../../modules/background-caller';
import { MessageType, ProcessRPCRequest, SaveMnemonicRequest, SaveMnemonicResponse } from '@shared/types/IBackgroundCaller';
import { handleMessage } from '../../modules/background-message-controller';
import CreateData = chrome.windows.CreateData;

vi.spyOn(console, 'log').mockImplementation(() => {});

afterEach(() => {
  vi.clearAllMocks();
});

test('BackgroundMessageController can handle messages SAVE_MNEMONIC', async () => {
  let staticCache: Record<string, any> = {};
  const getMockedMethod = vi.spyOn(chrome.storage.local, 'get').mockImplementation((key: any, callback: any) => {
    callback(staticCache);
  });
  const setMockedMethod2 = vi.spyOn(chrome.storage.local, 'set').mockImplementation((data: Record<any, any>) => {
    for (const key of Object.keys(data)) {
      staticCache[key] = data[key];
    }
  });

  // now, saving mnemonics

  const response2 = handleMessage(
    {
      type: MessageType.SAVE_MNEMONIC,
      mnemonic: 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about',
    } as SaveMnemonicRequest,
    {},
    (response: SaveMnemonicResponse) => {
      assert.strictEqual(response.success, true);
    }
  );

  await new Promise((resolve) => setTimeout(resolve, 100)); // sleep to allow callback to fire

  assert.deepStrictEqual(staticCache, {
    STORAGE_KEY_ARK_ADDRESS0: 'tark1630ud8207869eward2csxunpsc7r5jwyjy9urqawjafywdvfyzmygkx7p6u8rupsz83dry3hg65s0wtdgxgp8l09x7jq2am0fp9dxdgn0l4tq',
    STORAGE_KEY_ARK_ADDRESS1: 'tark1630ud8207869eward2csxunpsc7r5jwyjy9urqawjafywdvfyzm8cuuczkmmdcuptglazwxud5n86cgnv6s003qex2jnqcjjeptf27gw7mddm',
    STORAGE_KEY_ARK_ADDRESS2: 'tark1630ud8207869eward2csxunpsc7r5jwyjy9urqawjafywdvfyzmv6mfraxqn7s55tns6ln56hhtqkk0d46z6dvwp5l7s8xpn7zgtysg4nddf6',
    STORAGE_KEY_ARK_ADDRESS3: 'tark1630ud8207869eward2csxunpsc7r5jwyjy9urqawjafywdvfyzmg9g5u355vpslrs4256lsnldujs9xh879d7e0gxvufxq2mpne9muqkdcxur',
    STORAGE_KEY_ARK_ADDRESS4: 'tark1630ud8207869eward2csxunpsc7r5jwyjy9urqawjafywdvfyzmfdklwhhm9gky7fv7yzc2dtcvqje5lx8pwl3euk7ej9ltmtjkplgq7t0u2m',
    STORAGE_KEY_ARK_ADDRESS5: 'tark1630ud8207869eward2csxunpsc7r5jwyjy9urqawjafywdvfyzmxs8cm68ketsh7due3k6suwp6ek0u0favrlyx2hektm8cjngs37gsz9vhz9',
    STORAGE_KEY_BTC_XPUB0: 'zpub6rFR7y4Q2AijBEqTUquhVz398htDFrtymD9xYYfG1m4wAcvPhXNfE3EfH1r1ADqtfSdVCToUG868RvUUkgDKf31mGDtKsAYz2oz2AGutZYs',
    STORAGE_KEY_BTC_XPUB1: 'zpub6rFR7y4Q2AijF6Gk1bofHLs1d66hKFamhXWdWBup1Em25wfabZqkDqvaieV63fDQFaYmaatCG7jVNUpUiM2hAMo6SAVHcrUpSnHDpNzucB7',
    STORAGE_KEY_BTC_XPUB2: 'zpub6rFR7y4Q2AijHxf5H8YD9SZ1S1hrLi3PmbR9iJeVVZSJmK8R86EPCwBhyTaycoeXEVqLigViktQUy2tt3yLnvcZ7BcXz9QxHrLjaTeJn3xL',
    STORAGE_KEY_BTC_XPUB3: 'zpub6rFR7y4Q2AijKtJ66XKz29oDCtvXLTHgJ71fjNCS5kWGi97AcTfHkPPxL9GNPzR2TaqfcJx2WrcfQEHCjx7LcJz3jwwvQm4D1fcW7aiGxfT',
    STORAGE_KEY_BTC_XPUB4: 'zpub6rFR7y4Q2AijM8GBWicX3FmPEK8juiGC1TueN7qQzGFLTKQbFrQsgBwrco3DgKidS4DwYUC12UULUux5XvPtgzmy1HoDpDhGABnnEyBQzsL',
    STORAGE_KEY_BTC_XPUB5: 'zpub6rFR7y4Q2AijQjSx77gqZXw7AaQbpFuyD1YAZVjGDyWv4cPPMDQL5S2VbzHXp6wC5jLgawPtSMg5cRoC6UncmteTRF6PxeUemGdRm9fxuQM',
    STORAGE_KEY_EVM_XPUB: 'xpub6EF8jXqFeFEW5bwMU7RpQtHkzE4KJxcqJtvkCjJumzW8CPpacXkb92ek4WzLQXjL93HycJwTPUAcuNxCqFPKKU5m5Z2Vq4nCyh5CyPeBFFr',
    STORAGE_KEY_MNEMONIC: 'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about',
  });
  assert.strictEqual(response2, true);

  // checking that it was saved:

  await new Promise((resolve) => setTimeout(resolve, 100)); // sleep to allow callback to fire
  expect(setMockedMethod2).toHaveBeenCalledTimes(14);
  expect(getMockedMethod).toHaveBeenCalledTimes(0);

  // confirm mnemonic not encrypted though present
  const encrypted = await BackgroundCaller.hasEncryptedMnemonic();
  assert.strictEqual(encrypted, false);

  // "encrypt" it
  staticCache.STORAGE_KEY_MNEMONIC = 'encrypted://';

  const encrypted2 = await BackgroundCaller.hasEncryptedMnemonic();
  assert.strictEqual(encrypted2, true);

  expect(getMockedMethod).toHaveBeenCalledTimes(2); // `hasEncryptedMnemonic()` had to read storage, thus triggering `get`mock
});

test('BackgroundMessageController can handle message OPEN_POPUP', async () => {
  const openMockedMethod = vi.spyOn(chrome.windows, 'create').mockImplementation((createData: CreateData) => {
    assert.deepStrictEqual(createData, {
      url: 'popup.html#/action?method=personal_sign&id=111&params=%5B%220x4578616d706c652060706572736f6e616c5f7369676e60206d657373616765%22%2C%220xF5e61719675B46848572249b65DC6d9D83E7180A%22%2C%22Example%20password%22%5D&from=metamask.github.io',
      type: 'popup',
      focused: true,
      width: 600,
      height: 800,
      left: 200,
      top: 100,
    });
  });

  let callbackCalled = false;

  handleMessage(
    {
      type: MessageType.OPEN_POPUP,
      method: 'personal_sign',
      params: ['0x4578616d706c652060706572736f6e616c5f7369676e60206d657373616765', '0xF5e61719675B46848572249b65DC6d9D83E7180A', 'Example password'],
      id: 111,
      from: 'metamask.github.io',
    } as ProcessRPCRequest,
    // @ts-ignore not implementing full `Tab` type spec, need only `id`
    { tab: { id: 666 } },
    (response) => {
      callbackCalled = true;
    }
  );

  await new Promise((resolve) => setTimeout(resolve, 100)); // sleep to allow callback to fire
  assert.ok(!callbackCalled); // not called because popup returns result waaay later, via async messaging

  expect(openMockedMethod).toHaveBeenCalled();
});
