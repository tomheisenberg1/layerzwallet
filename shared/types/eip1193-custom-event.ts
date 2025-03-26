import { RequestArguments } from './eip1193';

/**
 * represents at the same time the payload for ETH JSON-RPC, and some custom fields that help us pass this object
 * around between contentScript/backgroundScript/popup
 */
export interface Eip1193CustomEventRequest extends RequestArguments {
  /**
   * uniq id so when replying to a request we know to which exact request
   */
  id: number;

  /**
   * some kind of identifier of a Dapp so backend can allow it and auto-approve all consequent requests.
   * should be a domain name by default
   */
  from: string;

  /**
   * emitted events can be caught by the context where they were generated, so we use this to
   * filter them out and skip
   */
  for: 'contentScript';
}

/**
 * particular case when ETH RPC event got processed, and we need to respond
 */
export interface Eip1193CustomEventResponse {
  /**
   * uniq id so when replying to a request we know to which exact request
   */
  id: number;

  /**
   * emitted events can be caught by the context where they were generated, so we use this to
   * filter them out and skip
   */
  for: 'webpage';

  response?: any;
  error?: any;
}

export interface Eip1193CustomEventCallback {
  /**
   * actual event thats triggered
   */
  event: 'connect' | 'disconnect' | 'close' | 'chainChanged' | 'networkChanged' | 'accountsChanged' | 'message' | 'notification';

  /**
   * payload that is provided to a subscriber of the event
   */
  arg: any;

  /**
   * emitted events can be caught by the context where they were generated, so we use this to
   * filter them out and skip
   */
  for: 'webpage';

  type: 'eventCallback';
}
