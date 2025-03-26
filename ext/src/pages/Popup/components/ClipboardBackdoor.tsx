import React, { useState } from 'react';

interface ClipboardBackdoorProps {
  text: string;
}

const ClipboardBackdoor: React.FC<ClipboardBackdoorProps> = ({ text }) => {
  const [, setClickCount] = useState(0);

  const handleClick = () => {
    setClickCount((clickCount) => {
      const newCount = clickCount + 1;

      if (newCount >= 3) {
        navigator.clipboard.writeText(text);
        return 0;
      }

      return newCount;
    });
  };

  return (
    <div
      onClick={handleClick}
      data-testid="clipboard-backdoor"
      style={{
        width: '1px',
        height: '1px',
        backgroundColor: 'transparent',
        cursor: 'default',
      }}
    />
  );
};

export default ClipboardBackdoor;
