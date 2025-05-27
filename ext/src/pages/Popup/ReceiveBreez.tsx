import { NetworkContext } from '@shared/hooks/NetworkContext';
import React, { useContext } from 'react';
import { useNavigate } from 'react-router';
import { WideButton } from './DesignSystem';
import { ThemedText } from '../../components/ThemedText';

const ReceiveBreez: React.FC = () => {
  const navigate = useNavigate();
  const { network } = useContext(NetworkContext);

  return (
    <div style={{ padding: 20, textAlign: 'center' }}>
      <h2>Receive</h2>
      <div style={{ marginBottom: 20 }}>
        <ThemedText style={{ background: '#FF9500', color: 'white', borderRadius: 20, padding: '8px 16px', fontWeight: 'bold' }}>{network?.toUpperCase()}</ThemedText>
      </div>
      <div style={{ marginBottom: 30 }}>
        <ThemedText style={{ fontSize: 18 }}>Choose receive method</ThemedText>
      </div>
      <WideButton onClick={() => navigate('/receive-lightning')} style={{ marginBottom: 20 }}>
        <ThemedText>⚡ Lightning</ThemedText>
      </WideButton>
      <WideButton onClick={() => navigate('/receive')} style={{ background: '#3498db' }}>
        <ThemedText>💧 Liquid</ThemedText>
      </WideButton>
    </div>
  );
};

export default ReceiveBreez;
