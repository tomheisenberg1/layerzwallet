import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BackgroundCaller } from '../../modules/background-caller';
import { Bubble, Button } from './DesignSystem';

const OnboardingCreateWallet: React.FC = () => {
  const navigate = useNavigate();
  const [recoveryPhrase, setRecoveryPhrase] = useState<string>('');

  const handleNext = async () => {
    navigate('/onboarding-create-password');
  };

  useEffect(() => {
    (async () => {
      const hasMnemonic = await BackgroundCaller.hasMnemonic();

      if (!hasMnemonic) {
        const response = await BackgroundCaller.createMnemonic();
        setRecoveryPhrase(response.mnemonic);
      }
    })();
  }, []);

  const words = recoveryPhrase ? recoveryPhrase.split(' ') : [];

  return (
    <>
      <div>
        <h1>Your secret recovery phrase</h1>
        <p>Write down these 12 words in numerical order and keep them in a secure place. Never share them with anyone.</p>
        <div>
          {words.map((word, index) => (
            <span>
              <Bubble>
                {index + 1}. {word}
              </Bubble>
            </span>
          ))}
        </div>
      </div>

      <br />
      <Button onClick={handleNext} disabled={!recoveryPhrase}>
        Next
      </Button>
    </>
  );
};

export default OnboardingCreateWallet;
