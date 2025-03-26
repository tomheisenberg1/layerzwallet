import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BackgroundCaller } from '../../modules/background-caller';
import { Button, TextArea } from './DesignSystem';

export default function OnboardingImport() {
  const [value, setValue] = useState<string>('');
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    console.log(event.target.value);
    setValue(event.target.value);
  };

  const handleSaveMnemonicSeed = async () => {
    const response = await BackgroundCaller.saveMnemonic(value);

    if (!response.success) {
      setError('Invalid mnemonic seed');
      return;
    } else {
      navigate('/onboarding-create-password');
    }
  };

  return (
    <>
      <div>
        <h1>Import your wallet</h1>
        <p>Enter your secret recovery phrase or private key to import your wallet.</p>

        <div>
          <TextArea name="textValue" onChange={handleChange} value={value} rows={6} placeholder="Type your secret recovery phrase" />
        </div>
      </div>

      <br />
      {error ? (
        <span>
          {error}
          <br />
          <br />
        </span>
      ) : null}

      <Button onClick={handleSaveMnemonicSeed}>Import</Button>
    </>
  );
}
