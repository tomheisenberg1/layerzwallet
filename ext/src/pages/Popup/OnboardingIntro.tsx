import React from 'react';
import { useNavigate } from 'react-router';
import { Button } from './DesignSystem';
import { ThemedText } from '../../components/ThemedText';

const OnboardingIntro: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div>
      <ThemedText type="headline">onboarding-intro</ThemedText>

      <Button
        onClick={() => {
          navigate('/onboarding-import-wallet');
        }}
      >
        <ThemedText>Import wallet</ThemedText>
      </Button>
      <span> </span>
      <Button
        onClick={() => {
          navigate('/onboarding-create-wallet');
        }}
      >
        <ThemedText>Create wallet</ThemedText>
      </Button>
    </div>
  );
};

export default OnboardingIntro;
