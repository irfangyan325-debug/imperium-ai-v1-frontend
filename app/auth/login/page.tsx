'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/app/contexts/AuthContext';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import PageBackground from '@/components/common/PageBackground';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuth, loading: authLoading } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && isAuth) {
      router.push('/selection-hall');
    }
  }, [isAuth, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    const result = await login(email, password);
    
    if (!result.success) {
      toast.error(result.error || 'Login failed');
    }
    
    setLoading(false);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <PageBackground />
        <div className="w-12 h-12 border-4 border-imperial-gold border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">
      <PageBackground />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo/Title */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl md:text-6xl text-imperial-darkGold font-serif mb-2 bg-gradient-to-r from-imperial-darkGold to-imperial-lightGold bg-clip-text text-transparent">
            IMPERIUM AI
          </h1>
          <p className="text-imperial-cream opacity-80 text-lg">
            Return to Power
          </p>
        </motion.div>

        {/* Login Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card variant="gold">
            <h2 className="text-2xl font-serif text-imperial-darkGold mb-6 text-center">
              Welcome Back
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-imperial-cream mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-imperial-darkGray border-2 border-imperial-gray rounded-lg text-imperial-cream placeholder-imperial-cream placeholder:opacity-40 focus:border-imperial-gold focus:outline-none transition-colors"
                  placeholder="your@email.com"
                  autoComplete="email"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-imperial-cream mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-imperial-darkGray border-2 border-imperial-gray rounded-lg text-imperial-cream placeholder-imperial-cream placeholder:opacity-40 focus:border-imperial-gold focus:outline-none transition-colors"
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
              </div>

              <Button
                type="submit"
                loading={loading}
                disabled={loading}
                fullWidth
              >
                Enter the Hall
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-imperial-cream opacity-70">
                New to IMPERIUM?{' '}
                <button
                  onClick={() => router.push('/auth/signup')}
                  className="text-imperial-gold font-semibold hover:text-imperial-lightGold transition-colors"
                >
                  Begin Your Ascent
                </button>
              </p>
            </div>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-imperial-darkGray rounded-lg border border-imperial-gray">
              <p className="text-xs text-imperial-gold font-semibold mb-2">Demo Credentials:</p>
              <p className="text-xs text-imperial-cream opacity-70">
                Email: test@example.com<br />
                Password: password123
              </p>
            </div>
          </Card>
        </motion.div>

        {/* Footer Quote */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 text-center text-sm text-imperial-cream opacity-60 italic px-4"
        >
          &quot;The first method for estimating the intelligence of a ruler is to look at the men he has around him.&quot;
          <br />
          <span className="text-imperial-gold">— Niccolò Machiavelli</span>
        </motion.p>
      </div>
    </div>
  );
}