import BigNumber from 'bignumber.js';
import useSWR from 'swr';

import { NETWORK_ARKMUTINYNET, NETWORK_BITCOIN, NETWORK_LIQUID, NETWORK_LIQUIDTESTNET, NETWORK_SPARK, Networks } from '../types/networks';
import { StringNumber } from '../types/string-number';
import { IBackgroundCaller } from '../types/IBackgroundCaller';
import { getRpcProvider } from '../models/network-getters';
import { ArkWallet } from '../class/wallets/ark-wallet';
import { BreezWallet } from '../class/wallets/breez-wallet';
import { SparkWallet } from '@shared/class/wallets/spark-wallet';

interface balanceFetcherArg {
  cacheKey: string;
  accountNumber: number;
  network: Networks;
  backgroundCaller: IBackgroundCaller;
}

export const balanceFetcher = async (arg: balanceFetcherArg): Promise<StringNumber | undefined> => {
  const { accountNumber, network, backgroundCaller } = arg;
  if (typeof accountNumber === 'undefined' || !network) return undefined;

  /**
   * EVM chains can get the balance on the spot (inside context of a Popup) since its a single api call
   * for a single address. For Bitcoin, we pass the call to a background script (and we ignore address argument)
   */
  if (network === NETWORK_BITCOIN) {
    const balance = await backgroundCaller.getBtcBalance(accountNumber);
    return (balance.confirmed + balance.unconfirmed).toString(10);
  }

  if (network === NETWORK_LIQUID || network === NETWORK_LIQUIDTESTNET) {
    const mnemonic = await backgroundCaller.getSubMnemonic(accountNumber);
    const bNetwork = network === NETWORK_LIQUID ? 'mainnet' : 'testnet';
    const bw = new BreezWallet(mnemonic, bNetwork);
    const balance = await bw.getBalance();
    return balance.toString(10);
  }

  if (network === NETWORK_SPARK) {
    const sw = new SparkWallet();
    const submnemonic = await backgroundCaller.getSubMnemonic(accountNumber);
    sw.setSecret(submnemonic);
    await sw.init();
    const virtualBalance = await sw.getOffchainBalance();
    return virtualBalance.toString(10);
  }

  if (network === NETWORK_ARKMUTINYNET) {
    const address = await backgroundCaller.getAddress(network, accountNumber);
    const aw = new ArkWallet();
    const virtualBalance = await aw.getOffchainBalanceForAddress(address);
    return virtualBalance.toString(10);
  }

  const address = await backgroundCaller.getAddress(network, accountNumber);
  const rpc = getRpcProvider(network);

  const res = await rpc.send('eth_getBalance', [String(address), 'latest']);
  const bn = new BigNumber(res);
  return bn.toString(10);
};

export function useBalance(network: Networks, accountNumber: number, backgroundCaller: IBackgroundCaller) {
  let refreshInterval = 12_000; // ETH block time

  switch (network) {
    case NETWORK_SPARK:
    case NETWORK_ARKMUTINYNET:
      refreshInterval = 3_000; // transfers are just server interactions, should be fast
      break;

    case NETWORK_BITCOIN:
      refreshInterval = 60_000; // 1 min for btc
  }
  const { data, error, isLoading } = useSWR({ cacheKey: 'balanceFetcher', accountNumber, network, backgroundCaller } as balanceFetcherArg, balanceFetcher, {
    refreshInterval,
    refreshWhenHidden: false,
    keepPreviousData: true,
  });

  return {
    balance: data,
    isLoading,
    error,
  };
}
