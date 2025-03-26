import React, { useContext } from 'react';
import { DEFAULT_NETWORK } from '@shared/config';
import { NetworkContext } from '@shared/hooks/NetworkContext';
import { getTokenList } from '@shared/models/token-list';
import TokenRow from './TokenRow';

const TokensView: React.FC = () => {
  const { network } = useContext(NetworkContext);

  const tokenList = getTokenList(network ?? DEFAULT_NETWORK);

  return (
    <div>
      {tokenList.map((token, index) => (
        <TokenRow tokenAddress={token.address} />
      ))}
    </div>
  );
};

export default TokensView;
