import { useState, useEffect } from 'react';

export const useTypewriter = (phrases: string[], typingSpeed = 90, pauseAfterType = 280, pauseAfterDelete = 140) => {
  const [text, setText] = useState('');
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentPhrase = phrases[phraseIndex];

    const handleTyping = () => {
      if (!isDeleting) {
        if (charIndex < currentPhrase.length) {
          setText(currentPhrase.slice(0, charIndex + 1));
          setCharIndex(prev => prev + 1);
        } else {
          setTimeout(() => setIsDeleting(true), pauseAfterType);
        }
      } else {
        // Clear immediately as per original main.js logic
        setText('');
        setCharIndex(0);
        setIsDeleting(false);
        setPhraseIndex(prev => (prev + 1) % phrases.length);
      }
    };

    const timer = setTimeout(handleTyping, isDeleting ? pauseAfterDelete : typingSpeed);
    return () => clearTimeout(timer);
  }, [charIndex, isDeleting, phraseIndex, phrases, pauseAfterDelete, pauseAfterType, typingSpeed]);

  return text;
};
