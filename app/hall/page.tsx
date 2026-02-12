'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useAuth } from '@/app/contexts/AuthContext';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import ProgressBar from '@/components/common/ProgressBar';
import { getStoredTasks, getTrialProgress } from '@/lib/storage';
import { MENTORS } from '@/utils/constants';
import { CURRICULUM_DATA } from '@/lib/staticData';
import { formatNumber, calculateXPProgress, getRankFromXP } from '@/utils/helpers';
import type { Task, Trial } from '@/types';


export default function HallPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  
  const [todayTasks, setTodayTasks] = useState<Task[]>([]);
  const [currentTrial, setCurrentTrial] = useState<Trial | null>(null);
  const [loading, setLoading] = useState(true);
  const [trialsCompleted, setTrialsCompleted] = useState(0);
  const [tasksCompleted, setTasksCompleted] = useState(0);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
      return;
    }

    if (user && !user.primary_mentor) {
      router.push('/selection-hall');
      return;
    }

    if (user) {
      loadDashboardData();
    }
  }, [user, authLoading, router]);

  const loadDashboardData = () => {
    // Get today's tasks
    const allTasks = getStoredTasks();
    const today = new Date().toISOString().split('T')[0];
    const tasksToday = allTasks.filter(t => 
      t.created_at.split('T')[0] === today || t.due_date === today
    );
    setTodayTasks(tasksToday);
    
    // Get completed tasks count
    const completed = allTasks.filter(t => t.status === 'done').length;
    setTasksCompleted(completed);
    
    // Get trial progress
    const progress = getTrialProgress();
    const completedTrials = Object.values(progress).filter(p => p.status === 'completed').length;
    setTrialsCompleted(completedTrials);
    
    // Find current trial
    let foundCurrentTrial: Trial | null = null;
    for (const module of CURRICULUM_DATA) {
      for (const unit of module.units || []) {
        const trial = unit.trials?.find(t => t.user_status === 'current');
        if (trial) {
          foundCurrentTrial = trial;
          break;
        }
      }
      if (foundCurrentTrial) break;
    }
    setCurrentTrial(foundCurrentTrial);
    
    setLoading(false);
  };

  const handleCompleteTask = (taskId: number) => {
    router.push('/tasks');
  };

  if (authLoading || loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-imperial-black to-imperial-darkGray">
        <div className="w-12 h-12 border-4 border-imperial-gold border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const mentor = user.primary_mentor ? MENTORS[user.primary_mentor] : null;
  const xpProgress = calculateXPProgress(user.influence_xp);
  const todoPendingTasks = todayTasks.filter(t => t.status === 'todo');
  
  return (
    <div className="min-h-screen pb-20 bg-gradient-to-b from-imperial-black to-imperial-darkGray">
      <header className="bg-imperial-darkGray border-b border-imperial-gray sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-serif bg-gradient-to-r from-imperial-gold to-imperial-lightGold bg-clip-text text-transparent">Command Hall</h1>
              <p className="text-imperial-cream opacity-70 text-sm">
                Welcome back, {user.email.split('@')[0]}
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

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Mentor Section */}
        {mentor && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card variant="gold">
              <div className="flex items-center gap-6">
                {/* Mentor Image */}
                <div className="relative w-24 h-24 flex-shrink-0">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-imperial-gold to-imperial-darkGold opacity-20 blur-xl"></div>
                  <div className="relative w-full h-full rounded-full border-4 border-imperial-gold shadow-gold overflow-hidden bg-imperial-darkGray">
                    <Image
                      src={mentor.imageUrl}
                      alt={mentor.name}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                </div>
                
                {/* Mentor Info */}
                <div className="flex-1">
                  <h2 className="text-2xl font-serif text-imperial-gold mb-1">
                    {mentor.name}
                  </h2>
                  <p className="text-imperial-cream opacity-80 mb-2">
                    {mentor.title} • Your Guide
                  </p>
                  <p className="text-sm italic text-imperial-cream opacity-70">
                    &quot;{mentor.quote}&quot;
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid md:grid-cols-3 gap-6"
        >
          {/* Rank Progress */}
          <Card>
            <div className="text-center">
              <div className="text-4xl mb-2">{getRankFromXP(user.influence_xp).icon}</div>
              <h3 className="text-xl font-serif text-imperial-gold mb-2">
                {user.current_rank}
              </h3>
              <p className="text-sm text-imperial-cream opacity-80 mb-4">
                {formatNumber(user.influence_xp)} XP
              </p>
              <ProgressBar 
                value={xpProgress.progress}
                max={100}
                size="sm"
                showLabel={false}
              />
              <p className="text-xs text-imperial-cream opacity-60 mt-2">
                {xpProgress.remaining} XP to next rank
              </p>
            </div>
          </Card>

          {/* Trials Completed */}
          <Card>
            <div className="text-center">
              <div className="text-4xl mb-2">📚</div>
              <h3 className="text-3xl font-bold text-imperial-gold mb-2">
                {trialsCompleted}
              </h3>
              <p className="text-sm text-imperial-cream opacity-80">
                Trials Completed
              </p>
            </div>
          </Card>

          {/* Tasks Completed */}
          <Card>
            <div className="text-center">
              <div className="text-4xl mb-2">✅</div>
              <h3 className="text-3xl font-bold text-imperial-gold mb-2">
                {tasksCompleted}
              </h3>
              <p className="text-sm text-imperial-cream opacity-80">
                Tasks Completed
              </p>
            </div>
          </Card>
        </motion.div>

        {/* Action Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-2 gap-6"
        >
          {/* Continue Path Card */}
          <button onClick={() => router.push(currentTrial ? `/trial/${currentTrial.id}` : '/path')}>
            <Card hover className="group">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-lg bg-gradient-to-r from-imperial-gold to-imperial-lightGold flex items-center justify-center text-3xl flex-shrink-0 group-hover:scale-110 transition-transform">
                  🗺️
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-xl font-serif text-imperial-gold mb-1">
                    Continue Path
                  </h3>
                  {currentTrial ? (
                    <p className="text-sm text-imperial-cream opacity-80">
                      {currentTrial.title}
                    </p>
                  ) : (
                    <p className="text-sm text-imperial-cream opacity-80">
                      View your curriculum
                    </p>
                  )}
                </div>
              </div>
            </Card>
          </button>

          {/* Summon Council Card */}
          <button onClick={() => router.push('/council')}>
            <Card hover className="group">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-lg bg-gradient-to-r from-imperial-gold to-imperial-lightGold flex items-center justify-center text-3xl flex-shrink-0 group-hover:scale-110 transition-transform">
                  👥
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-xl font-serif text-imperial-gold mb-1">
                    Summon Council
                  </h3>
                  <p className="text-sm text-imperial-cream opacity-80">
                    Seek wisdom from all three masters
                  </p>
                </div>
              </div>
            </Card>
          </button>
        </motion.div>

        {/* Daily Tasks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-serif text-imperial-gold">Today&apos;s Tasks</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/tasks')}
            >
              View All
            </Button>
          </div>

          {todoPendingTasks.length > 0 ? (
            <div className="space-y-3">
              {todoPendingTasks.slice(0, 5).map((task) => (
                <Card key={task.id}>
                  <div className="flex items-start gap-4">
                    <button
                      onClick={() => handleCompleteTask(task.id)}
                      className="w-6 h-6 rounded border-2 border-imperial-gold flex items-center justify-center hover:bg-imperial-gold transition-colors flex-shrink-0 mt-1"
                    >
                      {task.status === 'done' && <span className="text-imperial-black">✓</span>}
                    </button>
                    <div className="flex-1">
                      <h3 className="font-semibold text-imperial-cream mb-1">{task.title}</h3>
                      {task.description && (
                        <p className="text-sm text-imperial-cream opacity-70">{task.description}</p>
                      )}
                      {task.source_name && (
                        <p className="text-xs text-imperial-gold mt-1">From: {task.source_name}</p>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <div className="text-center py-8">
                <p className="text-2xl mb-2">🎉</p>
                <p className="text-imperial-cream opacity-80">
                  No pending tasks. Your discipline is commendable.
                </p>
              </div>
            </Card>
          )}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <Button variant="outline" onClick={() => router.push('/journal')} className="h-auto py-4">
            <div className="flex flex-col items-center gap-2">
              <span className="text-2xl">📖</span>
              <span className="text-sm">Journal</span>
            </div>
          </Button>
          
          <Button variant="outline" onClick={() => router.push('/tasks')} className="h-auto py-4">
            <div className="flex flex-col items-center gap-2">
              <span className="text-2xl">✓</span>
              <span className="text-sm">Tasks</span>
            </div>
          </Button>
          
          <Button variant="outline" onClick={() => router.push('/path')} className="h-auto py-4">
            <div className="flex flex-col items-center gap-2">
              <span className="text-2xl">🗺️</span>
              <span className="text-sm">Path</span>
            </div>
          </Button>
          
          <Button variant="outline" onClick={() => router.push('/profile')} className="h-auto py-4">
            <div className="flex flex-col items-center gap-2">
              <span className="text-2xl">⚙️</span>
              <span className="text-sm">Settings</span>
            </div>
          </Button>
        </motion.div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-imperial-darkGray border-t border-imperial-gray">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-around py-3">
            <button
              onClick={() => router.push('/hall')}
              className="flex flex-col items-center gap-1 text-imperial-gold"
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