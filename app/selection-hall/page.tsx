
'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useAuth } from '@/app/contexts/AuthContext';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import { MENTORS } from '@/utils/constants';
import toast from 'react-hot-toast';

function SelectionHallContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, register, updateUser, loading: authLoading } = useAuth();
  
  const [selectedMentor, setSelectedMentor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
      return;
    }

    // ✅ Set pre-selected mentor if user already has one
    if (user && user.primary_mentor) {
      setSelectedMentor(user.primary_mentor);
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
      // Update existing user (or confirm existing mentor)
      if (user.primary_mentor !== selectedMentor) {
        updateUser({ primary_mentor: selectedMentor as 'machiavelli' | 'napoleon' | 'aurelius' });
        toast.success('Mentor updated!');
      } else {
        toast.success('Mentor confirmed!');
      }
      router.push('/hall');
    } else {
      toast.error('Please sign up or log in first');
      router.push('/auth/signup');
    }

    setLoading(false);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-imperial-black to-imperial-darkGray">
        <div className="w-12 h-12 border-4 border-imperial-gold border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-8 bg-gradient-to-b from-imperial-black to-imperial-darkGray">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-imperial-gold opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-imperial-gold opacity-10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-serif bg-gradient-to-r from-imperial-gold to-imperial-lightGold bg-clip-text text-transparent mb-4">
            The Selection Hall
          </h1>
          <p className="text-xl text-imperial-cream opacity-80 max-w-2xl mx-auto">
            {user?.primary_mentor 
              ? 'Confirm your mentor or choose a new one.'
              : 'Choose your mentor wisely. Their teachings will shape your path to power.'}
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
                  {/* Mentor Image */}
                  <div className="text-center mb-6">
                    <div className="relative w-32 h-32 mx-auto mb-4">
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-imperial-gold to-imperial-darkGold opacity-20 blur-xl"></div>
                      <div className="relative w-full h-full rounded-full border-4 border-imperial-gold shadow-gold overflow-hidden bg-imperial-darkGray">
                        <Image
                          src={mentor.imageUrl}
                          alt={mentor.name}
                          fill
                          className="object-cover"
                          priority={index < 3}
                        />
                      </div>
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
                        &quot;{mentor.quote}&quot;
                      </p>
                    </div>
                  </div>

                  {/* Selection Indicator */}
                  {selectedMentor === mentor.id && (
                    <div className="mt-4 text-center">
                      <span className="inline-flex items-center gap-2 bg-gradient-to-r from-imperial-gold to-imperial-lightGold text-imperial-black px-4 py-2 rounded-lg font-semibold">
                        <span>✓</span>
                        Selected
                      </span>
                    </div>
                  )}
                  
                  {/* Current Mentor Badge */}
                  {user?.primary_mentor === mentor.id && (
                    <div className="mt-2 text-center">
                      <span className="text-xs text-imperial-gold">
                        Current Mentor
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
            {selectedMentor 
              ? user?.primary_mentor === selectedMentor
                ? 'Confirm & Continue'
                : `Begin with ${MENTORS[selectedMentor as keyof typeof MENTORS].name}`
              : 'Select a Mentor'}
          </Button>

          {!user?.primary_mentor && (
            <p className="mt-4 text-sm text-imperial-cream opacity-60">
              Your choice is permanent and will define your learning style.
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default function SelectionHallPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-imperial-black to-imperial-darkGray">
        <div className="w-12 h-12 border-4 border-imperial-gold border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <SelectionHallContent />
    </Suspense>
  );
}