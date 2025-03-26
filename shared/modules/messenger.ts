import { Eip1193CustomEventCallback, Eip1193CustomEventResponse } from '../types/eip1193-custom-event';

/**
 * Simple wrapper around few methods that shoot events. Mostly related to EIP-1193 and integrationwith EVM Dapps.
 */
export const Messenger = {
  async sendResponseToActiveTabsFromPopupToContentScript(message: Eip1193CustomEventResponse) {
    chrome.tabs.query({ active: true }, function (tabs) {
      // Send message to all active tabs since the target dapp is likely among them
      tabs.map(
        (tab) =>
          typeof tab.id !== 'undefined' &&
          chrome.tabs.sendMessage(tab.id, message, function (_response: any) {
            // Response handling not needed
          })
      );
    });
  },

  async sendEventCallbackFromPopupToContentScript(message: Eip1193CustomEventCallback) {
    console.log('Broadcasting event to the Dapp:', message);
    chrome.tabs.query({ active: true }, function (tabs) {
      // Send message to all active tabs since the target dapp is likely among them
      tabs.map(
        (tab) =>
          typeof tab.id !== 'undefined' &&
          chrome.tabs.sendMessage(tab.id, message, function (response: any) {
            if (response) {
              console.debug('Response from content script:', response);
            }
          })
      );
    });
  },

  async sendResponseFromContentScriptToContentScript(message: Eip1193CustomEventResponse) {
    document.dispatchEvent(
      new CustomEvent('LayerzWalletExtension', {
        // Serialize message to JSON string to prevent Firefox security violations
        // when passing complex objects between content scripts
        detail: JSON.stringify(message),
      })
    );
  },

  async sendGenericMessageToBackground(message: any): Promise<any> {
    return new Promise((resolve, reject) => {
      try {
        chrome.runtime.sendMessage(message, async function (response) {
          if (response?.error) {
            reject(new Error(response.message));
          } else {
            resolve(response);
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  },
};
