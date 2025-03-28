import React, { useState, useEffect } from 'react';

export default function ReglaFalse() {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length < 3 ? prev + '.' : ''));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h2>En desarrollo{dots}</h2>
    </div>
  );
}
