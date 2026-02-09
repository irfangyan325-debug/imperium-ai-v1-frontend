'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/app/contexts/AuthContext';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import { MENTORS } from '@/utils/constants';
import toast from 'react-hot-toast';

export default function SelectionHallPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, register, updateUser, loading: authLoading } = useAuth();
  
  const [selectedMentor, setSelectedMentor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && user && user.primary_mentor) {
      router.push('/hall');
    }
  }, [user, authLoading, router]);

  const handleSelectMentor = async () => {
    if (!selectedMentor) {
      toast.error('Please select a mentor');
      return;
    }

    setLoading(true);

    // Check if coming from signup
    const email = searchParams.get('email');
    const password = searchParams.get('password');

    if (email && password) {
      // Complete registration
      const result = await register(email, password, selectedMentor);
      if (!result.success) {
        toast.error(result.error || 'Registration failed');
        setLoading(false);
        return;
      }
    } else if (user) {
      // Update existing user
      updateUser({ primary_mentor: selectedMentor as any });
      toast.success('Mentor selected!');
      router.push('/hall');
    } else {
      toast.error('Please sign up or log in first');
      router.push('/auth/signup');
    }

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
    <div className="min-h-screen px-4 py-8 bg-gradient-dark">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-radial from-imperial-darkGray to-imperial-black opacity-50"></div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-serif text-gradient-gold mb-4">
            The Selection Hall
          </h1>
          <p className="text-xl text-imperial-cream opacity-80 max-w-2xl mx-auto">
            Choose your mentor wisely. Their teachings will shape your path to power.
          </p>
        </motion.div>

        {/* Mentor Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {Object.values(MENTORS).map((mentor, index) => (
            <motion.div
              key={mentor.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
            >
              <button
                onClick={() => setSelectedMentor(mentor.id)}
                className="w-full"
              >
                <Card
                  variant={selectedMentor === mentor.id ? 'gold' : 'default'}
                  hover
                  className={`h-full transition-all duration-300 ${
                    selectedMentor === mentor.id ? 'scale-105' : ''
                  }`}
                >
                  {/* Mentor Icon */}
                  <div className="text-center mb-6">
                    <div className="w-24 h-24 mx-auto rounded-full bg-imperial-darkGray border-4 border-imperial-gold flex items-center justify-center text-5xl shadow-gold mb-4">
                      {mentor.icon}
                    </div>
                    <h2 className="text-2xl font-serif text-imperial-gold mb-1">
                      {mentor.name}
                    </h2>
                    <p className="text-imperial-cream opacity-70 text-sm">
                      {mentor.title}
                    </p>
                  </div>

                  {/* Description */}
                  <div className="space-y-4 text-left">
                    <p className="text-sm text-imperial-cream opacity-80">
                      {mentor.description}
                    </p>

                    {/* Teaching Style */}
                    <div>
                      <h4 className="text-xs font-semibold text-imperial-gold mb-2">
                        Teaching Style:
                      </h4>
                      <p className="text-xs text-imperial-cream opacity-70">
                        {mentor.style}
                      </p>
                    </div>

                    {/* Quote */}
                    <div className="pt-4 border-t border-imperial-gray">
                      <p className="text-xs italic text-imperial-gold">
                        "{mentor.quote}"
                      </p>
                    </div>
                  </div>

                  {/* Selection Indicator */}
                  {selectedMentor === mentor.id && (
                    <div className="mt-4 text-center">
                      <span className="inline-flex items-center gap-2 bg-gradient-gold text-imperial-black px-4 py-2 rounded-lg font-semibold">
                        <span>✓</span>
                        Selected
                      </span>
                    </div>
                  )}
                </Card>
              </button>
            </motion.div>
          ))}
        </div>

        {/* Confirm Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-center"
        >
          <Button
            onClick={handleSelectMentor}
            loading={loading}
            disabled={!selectedMentor || loading}
            size="lg"
          >
            {selectedMentor ? `Begin with ${MENTORS[selectedMentor as keyof typeof MENTORS].name}` : 'Select a Mentor'}
          </Button>

          <p className="mt-4 text-sm text-imperial-cream opacity-60">
            Your choice is permanent and will define your learning style.
          </p>
        </motion.div>
      </div>
    </div>
  );
}