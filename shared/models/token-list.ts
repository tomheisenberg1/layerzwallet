import { Networks } from '../types/networks';
import { TokenInfo } from '../types/token-info';
import { getChainIdByNetwork } from './network-getters';
import { hexToDec } from '../modules/string-utils';

// kept as a separate json just because in evm world token list is standard by itself and
// json files can be shared, imported etc
const list: TokenInfo[] = require('./tokenlist.json');

export function getTokenList(network: Networks): TokenInfo[] {
  let ret: TokenInfo[] = [];

  for (const token of list) {
    if (token.chainId === hexToDec(getChainIdByNetwork(network))) {
      ret.push(token);
    }
  }

  return ret;
}
