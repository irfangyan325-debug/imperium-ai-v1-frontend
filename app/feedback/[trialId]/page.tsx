'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import { CURRICULUM_DATA } from '@/lib/staticData';
import { getStoredJournal, getTrialProgress } from '@/lib/storage';
import { MENTORS } from '@/utils/constants';
import type { Trial } from '@/types';

export default function FeedbackPage() {
  const router = useRouter();
  const params = useParams();
  const { user, loading: authLoading } = useAuth();
  
  const [trial, setTrial] = useState<Trial | null>(null);
  const [feedback, setFeedback] = useState<string>('');
  const [score, setScore] = useState<number>(0);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
      return;
    }

    loadFeedback();
  }, [user, authLoading, params.trialId]);

  const loadFeedback = () => {
    const trialId = parseInt(params.trialId as string);
    
    // Find trial
    let foundTrial: Trial | null = null;
    for (const module of CURRICULUM_DATA) {
      for (const unit of module.units || []) {
        const t = unit.trials?.find(t => t.id === trialId);
        if (t) {
          foundTrial = t;
          break;
        }
      }
      if (foundTrial) break;
    }
    
    if (!foundTrial) {
      router.push('/path');
      return;
    }
    
    setTrial(foundTrial);
    
    // Get progress
    const progress = getTrialProgress();
    const trialProgress = progress[trialId];
    if (trialProgress) {
      setScore(trialProgress.score || 0);
    }
    
    // Get feedback from journal
    const journal = getStoredJournal();
    const feedbackEntry = journal.find(
      e => e.entry_type === 'mentor_feedback' && e.title.includes(foundTrial.title)
    );
    
    if (feedbackEntry) {
      setFeedback(feedbackEntry.content);
    }
  };

  if (authLoading || !user || !trial) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  const mentor = user.primary_mentor ? MENTORS[user.primary_mentor] : MENTORS.machiavelli;
  const passed = score >= (trial.passing_score || 70);

  return (
    <div className="min-h-screen pb-20 bg-gradient-dark">
      {/* Header */}
      <header className="bg-imperial-darkGray border-b border-imperial-gray">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div>
            <h1 className="text-3xl font-serif text-gradient-gold">Trial Complete</h1>
            <p className="text-imperial-cream opacity-70 text-sm">
              {mentor.name}'s feedback on your performance
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Score Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Card variant="gold" className="text-center">
            <div className="mb-4">
              <div className="text-6xl mb-4">
                {passed ? '🎉' : '📚'}
              </div>
              <h2 className="text-3xl font-serif text-imperial-gold mb-2">
                {passed ? 'Trial Passed!' : 'Keep Practicing'}
              </h2>
              <p className="text-5xl font-bold text-imperial-gold mb-4">
                {score}%
              </p>
              {passed && (
                <div className="inline-flex items-center gap-2 bg-imperial-darkGray px-6 py-3 rounded-lg">
                  <span className="text-2xl">⚡</span>
                  <span className="text-xl font-bold text-imperial-gold">
                    +{trial.xp_reward} XP
                  </span>
                </div>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Mentor Avatar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 rounded-full bg-imperial-darkGray border-4 border-imperial-gold flex items-center justify-center text-4xl shadow-gold">
                {mentor.id === 'machiavelli' ? '⚔️' : mentor.id === 'napoleon' ? '⚡' : '🏛️'}
              </div>
              <div>
                <h3 className="text-2xl font-serif text-imperial-gold">
                  {mentor.name}
                </h3>
                <p className="text-imperial-cream opacity-80">
                  {mentor.title}
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Feedback Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <div 
              className="prose prose-invert max-w-none"
              dangerouslySetInnerHTML={{ 
                __html: feedback
                  .replace(/\*\*(.*?)\*\*/g, '<strong class="text-imperial-gold">$1</strong>')
                  .replace(/\n/g, '<br/>')
              }}
            />
          </Card>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex gap-4"
        >
          <Button variant="outline" onClick={() => router.push('/journal')} className="flex-1">
            📖 View in Journal
          </Button>
          <Button onClick={() => router.push('/path')} className="flex-1">
            Continue Path →
          </Button>
        </motion.div>

        {/* Quote */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <Card className="bg-imperial-darkGray border-l-4 border-l-imperial-gold">
            <p className="text-sm italic text-imperial-gold">
              "{mentor.quote}"
            </p>
            <p className="text-xs text-imperial-cream opacity-60 mt-2">
              — {mentor.name}
            </p>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}