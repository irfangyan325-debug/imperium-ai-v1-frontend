'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { getRandomBackground } from '@/utils/constants';

export default function PageBackground() {
  const [bgImage, setBgImage] = useState<string>('');

  useEffect(() => {
    // Set random background on mount
    setBgImage(getRandomBackground());
  }, []);

  if (!bgImage) return null;

  return (
    <div className="fixed inset-0 -z-10">
      <Image
        src={bgImage}
        alt="Background"
        fill
        className="object-cover opacity-50"
        priority
        quality={85}
      />
      {/* Overlay gradient for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-imperial-black/60 via-imperial-black/50 to-imperial-black/60" />
    </div>
  );
}