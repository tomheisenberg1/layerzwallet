import useSWR from 'swr';
import { useEffect, useState } from 'react';
import { Networks } from '../types/networks';
import { TransactionReceiptParams } from 'ethers';
import { getRpcProvider } from '../models/network-getters';

interface transactionReceiptFetcherArg {
  cacheKey: string;
  transactionId: string;
  network: Networks;
}

export const transactionReceiptFetcher = async (arg: transactionReceiptFetcherArg): Promise<any | undefined> => {
  const { transactionId, network } = arg;
  if (!transactionId || !network) return undefined;

  const rpc = getRpcProvider(network);
  const receipt = await rpc.send('eth_getTransactionReceipt', [transactionId]);
  console.log(receipt);
  return receipt as TransactionReceiptParams | null;
};

export function useTransactionReceipt(network: Networks, transactionId: string) {
  const [refreshInterval, setRefreshInterval] = useState(2_000);

  const { data, error, isLoading } = useSWR({ cacheKey: 'transactionReceiptFetcher', transactionId, network } as transactionReceiptFetcherArg, transactionReceiptFetcher, {
    refreshInterval,
    refreshWhenHidden: false,
  });

  useEffect(() => {
    if (data && refreshInterval !== 15_000) {
      setRefreshInterval(15_000);
    }
  }, [data, refreshInterval]);

  return {
    receipt: data as TransactionReceiptParams | null,
    isLoading,
    error,
  };
}
