'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/app/contexts/AuthContext';
import Card from '@/components/common/Card';
import { CURRICULUM_DATA } from '@/lib/staticData';
import { getTrialProgress } from '@/lib/storage';
import { getTrialStatusColor, formatNumber } from '@/utils/helpers';
import toast from 'react-hot-toast';
import type { Module } from '@/types';

export default function PathPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedModule, setExpandedModule] = useState<number | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
      return;
    }

    if (user) {
      loadCurriculum();
    }
  }, [user, authLoading, router]);

  const loadCurriculum = () => {
    const progress = getTrialProgress();
    
    // Update trial statuses based on progress
    const updatedModules = CURRICULUM_DATA.map(module => ({
      ...module,
      units: module.units?.map(unit => ({
        ...unit,
        trials: unit.trials?.map(trial => {
          const trialProgress = progress[trial.id];
          return {
            ...trial,
            user_status: trialProgress?.status || trial.user_status,
            user_score: trialProgress?.score,
          };
        }),
      })),
    }));
    
    setModules(updatedModules )
    
    // Auto-expand first incomplete module
    const firstIncomplete = updatedModules.find(
      m => (m.completed_trials || 0) < (m.total_trials || 0)
    );
    if (firstIncomplete) {
      setExpandedModule(firstIncomplete.id);
    }
    
    setLoading(false);
  };

  const handleTrialClick = (trialId: number, status?: string) => {
    if (status === 'locked') {
      toast.error('Complete the previous trial first');
      return;
    }
    router.push(`/trial/${trialId}`);
  };

  if (authLoading || loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 bg-gradient-dark">
      {/* Header Section */}
      <header className="bg-imperial-darkGray border-b border-imperial-gray sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-serif text-gradient-gold">Your Path</h1>
              <p className="text-imperial-cream opacity-70 text-sm">
                Progress through structured trials to master the art of power
              </p>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="text-center">
                <div className="text-imperial-gold font-bold">{user.current_rank}</div>
                <div className="text-imperial-cream opacity-60">Rank</div>
              </div>
              <div className="text-center">
                <div className="text-imperial-gold font-bold">{formatNumber(user.influence_xp)}</div>
                <div className="text-imperial-cream opacity-60">XP</div>
              </div>
              <div className="text-center">
                <div className="text-imperial-gold font-bold">{user.streak_days}</div>
                <div className="text-imperial-cream opacity-60">Streak</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        {modules.map((module, moduleIndex) => {
          const isExpanded = expandedModule === module.id;
          const completionPercent = module.total_trials 
            ? Math.round(((module.completed_trials || 0) / module.total_trials) * 100)
            : 0;

          return (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: moduleIndex * 0.1 }}
            >
              <Card>
                {/* Module Header */}
                <button
                  onClick={() => setExpandedModule(isExpanded ? null : module.id)}
                  className="w-full text-left"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 rounded-lg bg-gradient-gold flex items-center justify-center text-2xl flex-shrink-0">
                          📚
                        </div>
                        <div>
                          <h2 className="text-2xl font-serif text-imperial-gold">
                            {module.title}
                          </h2>
                          <p className="text-sm text-imperial-cream opacity-70">
                            {module.description}
                          </p>
                        </div>
                      </div>
                    </div>
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="text-imperial-gold text-2xl"
                    >
                      ▼
                    </motion.div>
                  </div>

                  {/* Module Progress */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-imperial-cream opacity-80 mb-2">
                      <span>Progress</span>
                      <span>{completionPercent}% Complete</span>
                    </div>
                    <div className="progress-bar">
                      <div
                        className="progress-bar-fill"
                        style={{ width: `${completionPercent}%` }}
                      />
                    </div>
                    <p className="text-xs text-imperial-cream opacity-60 mt-1">
                      {module.completed_trials || 0} of {module.total_trials || 0} trials completed
                    </p>
                  </div>
                </button>

                {/* Units and Trials */}
                {isExpanded && module.units && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-6 pt-4 border-t border-imperial-gray"
                  >
                    {module.units.map((unit) => (
                      <div key={unit.id}>
                        <h3 className="text-lg font-serif text-imperial-gold mb-3">
                          {unit.title}
                        </h3>
                        <p className="text-sm text-imperial-cream opacity-70 mb-4">
                          {unit.description}
                        </p>

                        {/* Trials List */}
                        <div className="space-y-2">
                          {unit.trials?.map((trial) => {
                            const status = trial.user_status || 'locked';
                            const isLocked = status === 'locked';
                            const isCompleted = status === 'completed';
                            const isCurrent = status === 'current';

                            return (
                              <button
                                key={trial.id}
                                onClick={() => handleTrialClick(trial.id, status)}
                                disabled={isLocked}
                                className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-300 ${
                                  isLocked
                                    ? 'border-imperial-gray opacity-50 cursor-not-allowed'
                                    : isCurrent
                                    ? 'border-imperial-gold bg-imperial-gray shadow-gold hover:shadow-gold-lg'
                                    : isCompleted
                                    ? 'border-green-600 hover:border-green-500'
                                    : 'border-imperial-gray hover:border-imperial-gold'
                                }`}
                              >
                                <div className="flex items-center gap-4">
                                  {/* Trial Icon */}
                                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl flex-shrink-0 ${
                                    isCompleted
                                      ? 'bg-green-600'
                                      : isCurrent
                                      ? 'bg-gradient-gold'
                                      : 'bg-imperial-darkGray'
                                  }`}>
                                    {isCompleted ? '✓' : isLocked ? '🔒' : '📖'}
                                  </div>

                                  {/* Trial Info */}
                                  <div className="flex-1">
                                    <h4 className="font-semibold text-imperial-cream mb-1">
                                      {trial.title}
                                    </h4>
                                    <div className="flex items-center gap-3 text-xs">
                                      <span className={`badge ${getTrialStatusColor(status)}`}>
                                        {status === 'locked' ? 'Locked' : status === 'current' ? 'Available' : 'Completed'}
                                      </span>
                                      <span className="text-imperial-gold">
                                        +{trial.xp_reward} XP
                                      </span>
                                      {trial.user_score !== undefined && (
                                        <span className="text-imperial-cream opacity-70">
                                          Score: {trial.user_score}%
                                        </span>
                                      )}
                                    </div>
                                  </div>

                                  {/* Arrow for available trials */}
                                  {!isLocked && (
                                    <div className="text-imperial-gold text-xl">
                                      →
                                    </div>
                                  )}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </Card>
            </motion.div>
          );
        })}

        {/* Coming Soon */}
        {modules.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: modules.length * 0.1 }}
          >
            <Card>
              <div className="text-center py-8">
                <div className="text-5xl mb-4">🚀</div>
                <h3 className="text-xl font-serif text-imperial-gold mb-2">
                  More Content Coming Soon
                </h3>
                <p className="text-imperial-cream opacity-70">
                  Additional modules and trials are being prepared for your journey.
                </p>
              </div>
            </Card>
          </motion.div>
        )}
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
              className="flex flex-col items-center gap-1 text-imperial-gold"
            >
              <span className="text-2xl">🗺️</span>
              <span className="text-xs">Path</span>
            </button>
            <button
              onClick={() => router.push('/profile')}
              className="flex flex-col items-center gap-1 text-imperial-cream opacity-60 hover:opacity-100"
            >
              <span className="text-2xl">👤</span>
              <span className="text-xs">Profile</span>
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
}