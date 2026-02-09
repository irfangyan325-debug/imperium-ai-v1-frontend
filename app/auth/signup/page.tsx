'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import toast from 'react-hot-toast';

export default function SignupPage() {
  const router = useRouter();
  const { register, isAuth, loading: authLoading } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && isAuth) {
      router.push('/selection-hall');
    }
  }, [isAuth, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    
    // Redirect to mentor selection - we'll set mentor there
    router.push(`/selection-hall?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`);
    
    setLoading(false);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-dark">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-radial from-imperial-darkGray to-imperial-black opacity-50"></div>
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-imperial-gold opacity-5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-imperial-gold opacity-5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo/Title */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl font-serif text-gradient-gold mb-2">
            IMPERIUM AI
          </h1>
          <p className="text-imperial-cream opacity-70">
            Begin Your Ascent
          </p>
        </motion.div>

        {/* Signup Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card variant="gold">
            <h2 className="text-2xl font-serif text-imperial-gold mb-6 text-center">
              Create Account
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
                  className="input"
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
                  className="input"
                  placeholder="••••••••"
                  autoComplete="new-password"
                />
                <p className="text-xs text-imperial-cream opacity-60 mt-1">
                  Must be at least 6 characters
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-imperial-cream mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input"
                  placeholder="••••••••"
                  autoComplete="new-password"
                />
              </div>

              <Button
                type="submit"
                loading={loading}
                disabled={loading}
                fullWidth
              >
                Continue to Mentor Selection
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-imperial-cream opacity-70">
                Already have an account?{' '}
                <button
                  onClick={() => router.push('/auth/login')}
                  className="text-imperial-gold hover:text-imperial-lightGold font-semibold"
                >
                  Sign In
                </button>
              </p>
            </div>
          </Card>
        </motion.div>

        {/* Footer Quote */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 text-center text-sm text-imperial-cream opacity-60 italic"
        >
          "The greatest danger for most of us is not that our aim is too high and we miss it, but that it is too low and we reach it."
          <br />— Michelangelo
        </motion.p>
      </div>
    </div>
  );
}