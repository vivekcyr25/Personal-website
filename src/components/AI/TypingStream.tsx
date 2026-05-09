import React, { useState, useEffect } from 'react';

const TypingStream: React.FC<{ text: string; speed?: number; onComplete?: () => void }> = ({ 
  text, 
  speed = 15, 
  onComplete 
}) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(prev => prev + text.charAt(index));
        index++;
      } else {
        clearInterval(interval);
        onComplete?.();
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, onComplete]);

  return (
    <div className="relative">
      {displayedText}
      <span className="inline-block w-1.5 h-4 bg-neon-blue ml-1 animate-pulse" />
    </div>
  );
};

export default TypingStream;
