'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import ProgressBar from '@/components/common/ProgressBar';
import Modal from '@/components/common/Modal';
import { getTrialProgress, getStoredTasks } from '@/lib/storage';
import { MENTORS } from '@/utils/constants';
import { formatNumber, calculateXPProgress, getRankFromXP } from '@/utils/helpers';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout, loading: authLoading } = useAuth();
  
  const [trialsCompleted, setTrialsCompleted] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
      return;
    }

    if (user) {
      loadProgress();
    }
  }, [user, authLoading, router]);

  const loadProgress = () => {
    const progress = getTrialProgress();
    const completed = Object.values(progress).filter(p => p.status === 'completed').length;
    setTrialsCompleted(completed);
    setLoading(false);
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    await logout();
  };

  if (authLoading || loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  const mentor = user.primary_mentor ? MENTORS[user.primary_mentor] : null;
  const xpProgress = calculateXPProgress(user.influence_xp);
  const rank = getRankFromXP(user.influence_xp);

  return (
    <div className="min-h-screen pb-20 bg-gradient-dark">
      {/* Header Section */}
      <header className="bg-imperial-darkGray border-b border-imperial-gray">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div>
            <h1 className="text-3xl font-serif text-gradient-gold">Profile</h1>
            <p className="text-imperial-cream opacity-70 text-sm">
              Your journey and achievements
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* User Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card variant="gold">
            <div className="flex items-center gap-6">
              {mentor && (
                <div className="w-24 h-24 rounded-full bg-imperial-darkGray border-4 border-imperial-gold flex items-center justify-center text-5xl shadow-gold flex-shrink-0">
                  {mentor.icon}
                </div>
              )}
              <div className="flex-1">
                <h2 className="text-2xl font-serif text-imperial-gold mb-1">
                  {user.email.split('@')[0]}
                </h2>
                <p className="text-imperial-cream opacity-80 mb-2">
                  {user.email}
                </p>
                <div className="flex items-center gap-4 text-sm">
                  <span className="badge bg-imperial-gold text-imperial-black">
                    {rank.icon} {user.current_rank}
                  </span>
                  {mentor && (
                    <span className="text-imperial-cream opacity-70">
                      Mentored by {mentor.name}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid md:grid-cols-3 gap-6"
        >
          <Card>
            <div className="text-center">
              <div className="text-4xl mb-2">🔥</div>
              <div className="text-3xl font-bold text-imperial-gold mb-1">
                {user.streak_days}
              </div>
              <div className="text-sm text-imperial-cream opacity-70">
                Day Streak
              </div>
            </div>
          </Card>

          <Card>
            <div className="text-center">
              <div className="text-4xl mb-2">⚡</div>
              <div className="text-3xl font-bold text-imperial-gold mb-1">
                {formatNumber(user.influence_xp)}
              </div>
              <div className="text-sm text-imperial-cream opacity-70">
                Total XP
              </div>
            </div>
          </Card>

          <Card>
            <div className="text-center">
              <div className="text-4xl mb-2">📚</div>
              <div className="text-3xl font-bold text-imperial-gold mb-1">
                {trialsCompleted}
              </div>
              <div className="text-sm text-imperial-cream opacity-70">
                Trials Complete
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Rank Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <h3 className="text-xl font-serif text-imperial-gold mb-4">
              Rank Progress
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-imperial-cream opacity-80">
                  Current Rank: {user.current_rank}
                </span>
                <span className="text-imperial-gold font-semibold">
                  {formatNumber(user.influence_xp)} XP
                </span>
              </div>
              <ProgressBar 
                value={xpProgress.progress}
                max={100}
                label="Progress to Next Rank"
              />
              <p className="text-sm text-imperial-cream opacity-60">
                {xpProgress.remaining} XP remaining
              </p>
            </div>
          </Card>
        </motion.div>

        {/* Mentor Info */}
        {mentor && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <h3 className="text-xl font-serif text-imperial-gold mb-4">
                Your Mentor
              </h3>
              <div className="bg-imperial-darkGray p-4 rounded-lg border border-imperial-gray">
                <h4 className="text-lg font-serif text-imperial-gold mb-2">
                  {mentor.name} • {mentor.title}
                </h4>
                <p className="text-imperial-cream opacity-80 mb-3">
                  {mentor.description}
                </p>
                <p className="text-sm italic text-imperial-gold">
                  "{mentor.quote}"
                </p>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Account Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <h3 className="text-xl font-serif text-imperial-gold mb-4">
              Account Settings
            </h3>
            <div className="space-y-3">
              <Button
                variant="danger"
                onClick={() => setShowLogoutModal(true)}
                fullWidth
              >
                Logout
              </Button>
            </div>
          </Card>
        </motion.div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-imperial-darkGray border-t border-imperial-gray">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-around py-3">
            <button
              onClick={() => router.push('/hall')}
              className="flex flex-col items-center gap-1 text-imperial-cream opacity-60 hover:opacity-100"
            >
              <span className="text-2xl">🏛️</span>
              <span className="text-xs">Hall</span>
            </button>
            <button
              onClick={() => router.push('/path')}
              className="flex flex-col items-center gap-1 text-imperial-cream opacity-60 hover:opacity-100"
            >
              <span className="text-2xl">🗺️</span>
              <span className="text-xs">Path</span>
            </button>
            <button
              onClick={() => router.push('/profile')}
              className="flex flex-col items-center gap-1 text-imperial-gold"
            >
              <span className="text-2xl">👤</span>
              <span className="text-xs">Profile</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Logout Confirmation Modal */}
      <Modal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        title="Confirm Logout"
      >
        <div className="space-y-4">
          <p className="text-imperial-cream opacity-80">
            Are you sure you want to logout?
          </p>
          <div className="flex gap-4">
            <Button
              variant="ghost"
              onClick={() => setShowLogoutModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleLogout}
              loading={loggingOut}
              disabled={loggingOut}
              className="flex-1"
            >
              Logout
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}