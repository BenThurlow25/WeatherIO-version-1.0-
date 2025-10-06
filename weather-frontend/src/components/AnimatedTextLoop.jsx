import { useState, useEffect } from 'react';
import BlurText from './BlurText';

const AnimatedTextLoop = ({ texts, interval = 3000, ...blurProps }) => {
  const [index, setIndex] = useState(0);
  const [currentText, setCurrentText] = useState(texts[0]);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex(prev => (prev + 1) % texts.length);
    }, interval);
    return () => clearInterval(id);
  }, [texts.length, interval]);

  useEffect(() => {
    setCurrentText(texts[index]);
  }, [index, texts]);

  return (
    <BlurText
      key={`blur-${index}-${currentText}`} // forces re-render for animation
      text={currentText}
      {...blurProps}
    />
  );
};

export default AnimatedTextLoop;

