import { Eip1193CustomEventCallback, Eip1193CustomEventResponse } from '@shared/types/eip1193-custom-event';

/**
 * Simple wrapper around few methods that shoot events. Mostly related to EIP-1193 and integrationwith EVM Dapps.
 */
export const Messenger = {
  async sendResponseToActiveTabsFromPopupToContentScript(message: Eip1193CustomEventResponse) {},

  async sendEventCallbackFromPopupToContentScript(message: Eip1193CustomEventCallback) {},

  async sendResponseFromContentScriptToContentScript(message: Eip1193CustomEventResponse) {},

  async sendGenericMessageToBackground(message: any): Promise<any> {},
};
