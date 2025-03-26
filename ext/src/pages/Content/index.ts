/**
 * @fileoverview This is the INNER content script that gets injected into webpages by the loader script. For security reasons,
 * this script can only communicate with the OUTER content script through message passing.
 */
import { Provider } from '@shared/class/provider';
import { EIP6963ProviderDetail, EIP6963ProviderInfo } from '@shared/types/eip6963';

/**
 * @deprecated Legacy injection method. Can be removed since modern dapps use EIP-6963 provider discovery
 */ // @ts-ignore
window.ethereum = new Provider();

// strictly speaking, we are not required to use CSPRNG here, we just need a unique uuid to identify our wallet
const STATIC_UUID = '6c617965-727a-7761-6C6C-657400000000';

/**
 * Implements EIP-6963 provider discovery by wrapping our Provider instance
 *
 * @see https://eip6963.org
 * @see https://eips.ethereum.org/EIPS/eip-6963
 */
function onPageLoad() {
  const provider = new Provider();
  // @ts-ignore wtf, not in spec, is expected on https://metamask.github.io/test-dapp/ when doing Wallet Connect
  provider.signer = { uri: STATIC_UUID };

  function announceProvider() {
    console.log('announceProvider()');
    const info: EIP6963ProviderInfo = {
      uuid: STATIC_UUID,
      name: 'Layerz Wallet',
      // eslint-disable-next-line max-len
      icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEyOCIgaGVpZ2h0PSIxMjgiIGZpbGw9IiM3Nzc3Nzc3IiAvPjwvc3ZnPg==',
      rdns: 'com.layerzwallet.layerzwallet',
    };
    window.dispatchEvent(
      new CustomEvent('eip6963:announceProvider', {
        detail: Object.freeze({ info, provider } as EIP6963ProviderDetail),
      })
    );
  }

  window.addEventListener('eip6963:requestProvider', (event) => {
    console.log('Received EIP-6963 provider request');
    announceProvider();
  });

  announceProvider();
}

window.addEventListener('load', onPageLoad);

export {};
