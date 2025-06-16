import React, { useContext, useEffect, useState } from 'react';

import { AccountNumberContext } from '@shared/hooks/AccountNumberContext';
import { NetworkContext } from '@shared/hooks/NetworkContext';
import { useBalance } from '@shared/hooks/useBalance';
import { getDecimalsByNetwork, getTickerByNetwork } from '@shared/models/network-getters';
import { getSwapPairs, getSwapProvidersList } from '@shared/models/swap-providers-list';
import { capitalizeFirstLetter } from '@shared/modules/string-utils';
import { Networks } from '@shared/types/networks';
import { SwapPair, SwapPlatform } from '@shared/types/swap';
import assert from 'assert';
import BigNumber from 'bignumber.js';
import { Loader2 } from 'lucide-react';
import { BackgroundCaller } from '../../../modules/background-caller';
import { Button, Input } from '../DesignSystem';

const SwapInterfaceView: React.FC = () => {
  const [amount, setAmount] = useState<string>('');
  const [targetNetwork, setTargetNetwork] = useState<Networks>();
  const { network, setNetwork } = useContext(NetworkContext);
  const { accountNumber } = useContext(AccountNumberContext);
  const { balance } = useBalance(network, accountNumber, BackgroundCaller);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [swapPairs, setSwapPairs] = useState<SwapPair[]>([]);

  useEffect(() => {
    setSwapPairs(getSwapPairs(network, SwapPlatform.EXT));
  }, [network]);

  const handleSwap = async (): Promise<string> => {
    setError('');
    assert(balance, 'internal error: balance not loaded');
    assert(targetNetwork, 'internal error: target network not selected');
    const amt = parseFloat(amount);
    assert(!isNaN(amt), 'Invalid amount');
    assert(amt > 0, 'Amount should be > 0');
    const satValueBN = new BigNumber(amt);
    const satValue = satValueBN.multipliedBy(new BigNumber(10).pow(getDecimalsByNetwork(network))).toString(10);
    assert(new BigNumber(balance).gte(satValue), 'Not enough balance');

    const swapProviders = getSwapProvidersList(network);
    const provider = swapProviders.find((p) => p.getSupportedPairs().some((pair) => pair.from === network && pair.to === targetNetwork));

    assert(provider, 'No provider found for the selected networks');

    if (!amount || isNaN(parseFloat(amount))) {
      throw new Error('Invalid amount');
    }

    const destinationAddress = await BackgroundCaller.getAddress(targetNetwork, accountNumber);
    assert(destinationAddress, 'internal error: no destination address');

    return provider.swap(network, setNetwork, targetNetwork, parseInt(satValue), destinationAddress);
  };

  return (
    <div>
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <span>Swap</span>
        <Input type="number" data-testid="swap-amount-input" style={{ width: '25%' }} placeholder="0.000" onChange={(event) => setAmount(event.target.value)} value={amount} />
        <div style={{ flex: 1 }}>
          <span style={{ fontSize: '0.8em' }}>
            <b>{getTickerByNetwork(network)}</b>
          </span>
        </div>

        <span>to</span>

        <div style={{ flex: 1 }}>
          <select
            value={targetNetwork}
            onChange={(e) => setTargetNetwork(e.target.value as Networks)}
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ccc',
            }}
          >
            <option value="">Select target network</option>
            {swapPairs
              .map((pair) => pair.to)
              .map((network) => (
                <option key={`to-${network}`} value={network}>
                  {capitalizeFirstLetter(network)}
                </option>
              ))}
          </select>
        </div>

        {targetNetwork && !isLoading && (
          <Button
            onClick={() => {
              setIsLoading(true);
              handleSwap()
                .then((url) => window.open(url, '_blank'))
                .catch((e) => setError(e.message))
                .finally(() => setIsLoading(false));
            }}
          >
            Go
          </Button>
        )}

        {isLoading && <Loader2 className="animate-spin" size={24} />}
      </div>

      {error && <div style={{ color: 'red' }}>{error}</div>}
    </div>
  );
};

export default SwapInterfaceView;
