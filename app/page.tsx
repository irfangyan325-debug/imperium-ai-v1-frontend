'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from './contexts/AuthContext';

export default function Home() {
  const router = useRouter();
  const { isAuth, loading } = useAuth();

  useEffect(() => {
    if (!loading && isAuth) {
      router.push('/hall');
    }
  }, [isAuth, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden bg-gradient-dark">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-radial from-imperial-darkGray to-imperial-black opacity-50"></div>
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-imperial-gold opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-imperial-gold opacity-5 rounded-full blur-3xl"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl">
        {/* Logo/Title */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-7xl md:text-9xl font-serif text-gradient-gold mb-4 tracking-tight">
            IMPERIUM AI
          </h1>
          <div className="h-1 w-64 mx-auto bg-gradient-gold mb-8"></div>
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-2xl md:text-3xl text-imperial-cream mb-4 font-serif"
        >
          Master the Art of Power
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-lg text-imperial-cream opacity-80 mb-12 max-w-2xl mx-auto"
        >
          Learn from history's greatest strategists. Machiavelli teaches pragmatism.
          Napoleon commands action. Marcus Aurelius guides wisdom.
        </motion.p>

        {/* Mentor Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="flex justify-center gap-8 mb-12"
        >
          {['⚔️', '⚡', '🏛️'].map((icon, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="w-20 h-20 rounded-full bg-imperial-darkGray border-2 border-imperial-gold flex items-center justify-center text-4xl shadow-gold"
            >
              {icon}
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <button
            onClick={() => router.push('/auth/signup')}
            className="btn-primary text-xl"
          >
            Begin Your Ascent
          </button>
          
          <button
            onClick={() => router.push('/auth/login')}
            className="px-6 py-3 text-imperial-gold border-2 border-imperial-gold font-semibold rounded-lg hover:bg-imperial-gold hover:text-imperial-black transition-all duration-300 text-xl"
          >
            Return to Power
          </button>
        </motion.div>

        {/* Footer Text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.8 }}
          className="mt-16 text-sm text-imperial-cream opacity-60 italic"
        >
          "The supreme art of war is to subdue the enemy without fighting." — Sun Tzu
        </motion.p>
      </div>
    </main>
  );
}


