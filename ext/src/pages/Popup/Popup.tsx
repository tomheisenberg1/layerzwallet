import React from 'react';
import { HashRouter as Router, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { SWRConfig } from 'swr';
import { SettingsIcon } from 'lucide-react';
import './Popup.css';
import TestPage from './TestPage';
import OnboardingCreateWallet from './OnboardingCreateWallet';
import SettingsPage from './SettingsPage';
import OnboardingIntro from './OnboardingIntro';
import OnboardingImportWallet from './OnboardingImportWallet';
import Home from './components/Home';
import OnboardingCreatePassword from './OnboardingCreatePassword';
import OnboardingTos from './OnboardingTos';
import { NetworkContextProvider } from '@shared/hooks/NetworkContext';
import { AccountNumberContextProvider } from '@shared/hooks/AccountNumberContext';
import { AskPasswordContextProvider } from '../../hooks/AskPasswordContext';
import { Card } from './DesignSystem';
import { SwrCacheProvider } from '../../class/swr-cache-provider';
import Receive from './Receive';
import SendEvm from './SendEvm';
import TransactionSuccessEvm from './TransactionSuccessEvm';
import Action from './Action';
import SendTokenEvm from './SendTokenEvm';
import SendArk from './SendArk';
import SendBtc from './SendBtc';
import { ScanQrContextProvider } from '../../hooks/ScanQrContext';
import { Hello } from '@shared/class/hello';
import { LayerzStorage } from '../../class/layerz-storage';
import { BackgroundCaller } from '../../modules/background-caller';

const AppContent: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="App">
      <header className="App-header">
        <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 onClick={() => navigate('/')} style={{ margin: 0 }}>
            LZ Bitcoin Wallet
          </h1>
          <SettingsIcon onClick={() => navigate('/settings')} data-testid="settings-button" />
        </div>
        <div style={{ color: 'gray', textAlign: 'left', width: '100%', marginBottom: '15px' }}>
          <b style={{ fontSize: 18 }}>Developer preview release {Hello.world()}</b>
        </div>

        <Card>
          <Routes>
            <Route path="/test" element={<TestPage />} />
            <Route path="/home" element={<Home />} />
            <Route path="/receive" element={<Receive />} />
            <Route path="/send-evm" element={<SendEvm />} />
            <Route path="/send-ark" element={<SendArk />} />
            <Route path="/send-token-evm" element={<SendTokenEvm />} />
            <Route path="/send-btc" element={<SendBtc />} />
            <Route path="/onboarding-create-wallet" element={<OnboardingCreateWallet />} />
            <Route path="/onboarding-import-wallet" element={<OnboardingImportWallet />} />
            <Route path="/onboarding-intro" element={<OnboardingIntro />} />
            <Route path="/onboarding-create-password" element={<OnboardingCreatePassword />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/transaction-success" element={<TransactionSuccessEvm />} />
            <Route path="/onboarding-tos" element={<OnboardingTos />} />
            <Route path="/action" element={<Action />} />
            <Route path="/" element={<Navigate to="/home" replace />} />
          </Routes>
        </Card>
      </header>
    </div>
  );
};

const Popup: React.FC = () => {
  return (
    <Router>
      <SWRConfig value={{ provider: () => new SwrCacheProvider() }}>
        <AskPasswordContextProvider>
          <ScanQrContextProvider>
            <AccountNumberContextProvider storage={LayerzStorage} backgroundCaller={BackgroundCaller}>
              <NetworkContextProvider storage={LayerzStorage} backgroundCaller={BackgroundCaller}>
                <AppContent />
              </NetworkContextProvider>
            </AccountNumberContextProvider>
          </ScanQrContextProvider>
        </AskPasswordContextProvider>
      </SWRConfig>
    </Router>
  );
};

export default Popup;
