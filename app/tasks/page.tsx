'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/app/contexts/AuthContext';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import Modal from '@/components/common/Modal';
import { getStoredTasks, addTask, updateTask, deleteTask, updateUserStreak } from '@/lib/storage';
import { getTaskStatusColor, formatDate } from '@/utils/helpers';
import toast from 'react-hot-toast';
import type { Task, TaskStatus } from '@/types';

export default function TasksPage() {
  const router = useRouter();
  const { user, loading: authLoading, refreshUser } = useAuth();
  
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | TaskStatus>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
      return;
    }

    if (user) {
      loadTasks();
    }
  }, [user, authLoading, router]);

  const loadTasks = () => {
    const allTasks = getStoredTasks();
    setTasks(allTasks);
    setLoading(false);
  };

  const handleCreateTask = async () => {
    if (!newTask.title.trim()) {
      toast.error('Please enter a task title');
      return;
    }

    setCreating(true);
    
    try {
      addTask({
        user_id: user!.id,
        title: newTask.title,
        description: newTask.description || undefined,
        source_type: 'manual',
        status: 'todo',
      });

      toast.success('Task created!');
      setShowCreateModal(false);
      setNewTask({ title: '', description: '' });
      loadTasks();
    } catch (_error) {
      toast.error('Failed to create task');
    } finally {
      setCreating(false);
    }
  };

  const handleCompleteTask = async (taskId: number) => {
    try {
      updateTask(taskId, {
        status: 'done',
        completed_at: new Date().toISOString(),
      });
      
      updateUserStreak();
      refreshUser();
      
      toast.success('Task completed! 🎉');
      loadTasks();
    } catch (_error) {
      toast.error('Failed to complete task');
    }
  };

  const handleSkipTask = async (taskId: number) => {
    try {
      updateTask(taskId, { status: 'skipped' });
      toast.success('Task skipped');
      loadTasks();
    } catch (_error) {
      toast.error('Failed to skip task');
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    if (!confirm('Delete this task?')) return;

    try {
      deleteTask(taskId);
      toast.success('Task deleted');
      loadTasks();
    } catch (_error) {
      toast.error('Failed to delete task');
    }
  };

  if (authLoading || loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-imperial-black to-imperial-darkGray">
        <div className="w-12 h-12 border-4 border-imperial-gold border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const filteredTasks = filter === 'all' 
    ? tasks 
    : tasks.filter(t => t.status === filter);

  const todoCount = tasks.filter(t => t.status === 'todo').length;
  const doneCount = tasks.filter(t => t.status === 'done').length;
  const skippedCount = tasks.filter(t => t.status === 'skipped').length;

  return (
    <div className="min-h-screen pb-20 bg-gradient-to-b from-imperial-black to-imperial-darkGray">
      {/* Header Section */}
      <header className="bg-imperial-darkGray border-b border-imperial-gray sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-serif bg-gradient-to-r from-imperial-gold to-imperial-lightGold bg-clip-text text-transparent">Your Tasks</h1>
              <p className="text-imperial-cream opacity-70 text-sm">
                Track your daily actions and maintain your streak
              </p>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="text-center">
                <div className="text-imperial-gold font-bold">{user.current_rank}</div>
                <div className="text-imperial-cream opacity-60">Rank</div>
              </div>
              <div className="text-center">
                <div className="text-imperial-gold font-bold">{user.influence_xp}</div>
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
        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid md:grid-cols-3 gap-4"
        >
          <Card>
            <div className="text-center">
              <div className="text-3xl mb-2">📝</div>
              <div className="text-2xl font-bold text-imperial-gold">{todoCount}</div>
              <div className="text-sm text-imperial-cream opacity-70">To Do</div>
            </div>
          </Card>

          <Card>
            <div className="text-center">
              <div className="text-3xl mb-2">✅</div>
              <div className="text-2xl font-bold text-green-500">{doneCount}</div>
              <div className="text-sm text-imperial-cream opacity-70">Completed</div>
            </div>
          </Card>

          <Card>
            <div className="text-center">
              <div className="text-3xl mb-2">⏭️</div>
              <div className="text-2xl font-bold text-imperial-cream opacity-60">{skippedCount}</div>
              <div className="text-sm text-imperial-cream opacity-70">Skipped</div>
            </div>
          </Card>
        </motion.div>

        {/* Filters and Create Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center justify-between gap-4 flex-wrap"
        >
          <div className="flex gap-2">
            {['all', 'todo', 'done', 'skipped'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f as typeof filter)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  filter === f
                    ? 'bg-gradient-to-r from-imperial-gold to-imperial-lightGold text-imperial-black'
                    : 'bg-imperial-darkGray text-imperial-cream hover:bg-imperial-gray'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          <Button onClick={() => setShowCreateModal(true)}>
            + New Task
          </Button>
        </motion.div>

        {/* Tasks List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-3"
        >
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className={task.status === 'done' ? 'opacity-60' : ''}>
                  <div className="flex items-start gap-4">
                    {/* Checkbox */}
                    <button
                      onClick={() => task.status === 'todo' && handleCompleteTask(task.id)}
                      disabled={task.status !== 'todo'}
                      className={`w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0 mt-1 transition-all ${
                        task.status === 'done'
                          ? 'bg-green-600 border-green-600'
                          : task.status === 'skipped'
                          ? 'bg-imperial-gray border-imperial-gray'
                          : 'border-imperial-gold hover:bg-imperial-gold'
                      }`}
                    >
                      {task.status === 'done' && <span className="text-white">✓</span>}
                      {task.status === 'skipped' && <span className="text-imperial-cream">⏭</span>}
                    </button>

                    {/* Task Info */}
                    <div className="flex-1">
                      <h3 className={`font-semibold mb-1 ${
                        task.status === 'done' ? 'line-through text-imperial-cream opacity-60' : 'text-imperial-cream'
                      }`}>
                        {task.title}
                      </h3>

                      {task.description && (
                        <p className="text-sm text-imperial-cream opacity-70 mb-2">
                          {task.description}
                        </p>
                      )}

                      <div className="flex items-center gap-3 text-xs flex-wrap">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getTaskStatusColor(task.status)}`}>
                          {task.status}
                        </span>

                        {task.source_type && (
                          <span className="text-imperial-cream opacity-60">
                            Source: {task.source_type}
                          </span>
                        )}

                        {task.completed_at && (
                          <span className="text-green-500">
                            ✓ {formatDate(task.completed_at)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    {task.status === 'todo' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSkipTask(task.id)}
                          className="text-imperial-cream opacity-60 hover:opacity-100 text-sm"
                          title="Skip task"
                        >
                          ⏭️
                        </button>
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="text-red-500 hover:text-red-400 text-sm"
                          title="Delete task"
                        >
                          🗑️
                        </button>
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))
          ) : (
            <Card>
              <div className="text-center py-12">
                <div className="text-5xl mb-4">📋</div>
                <p className="text-imperial-cream opacity-80">
                  {filter === 'all' 
                    ? 'No tasks yet. Create your first task!' 
                    : `No ${filter} tasks.`}
                </p>
              </div>
            </Card>
          )}
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
              className="flex flex-col items-center gap-1 text-imperial-cream opacity-60 hover:opacity-100"
            >
              <span className="text-2xl">👤</span>
              <span className="text-xs">Profile</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Create Task Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="New Task"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-imperial-cream mb-2">
              Task Title
            </label>
            <input
              type="text"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
              className="w-full px-4 py-3 bg-imperial-darkGray border-2 border-imperial-gray rounded-lg text-imperial-cream placeholder-imperial-cream placeholder:opacity-40 focus:border-imperial-gold focus:outline-none transition-colors"
              placeholder="What needs to be done?"
              maxLength={255}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-imperial-cream mb-2">
              Description (Optional)
            </label>
            <textarea
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
              className="w-full px-4 py-3 bg-imperial-darkGray border-2 border-imperial-gray rounded-lg text-imperial-cream placeholder-imperial-cream placeholder:opacity-40 focus:border-imperial-gold focus:outline-none transition-colors min-h-[100px] resize-y"
              placeholder="Add more details..."
              maxLength={1000}
            />
          </div>

          <div className="flex gap-4">
            <Button
              variant="ghost"
              onClick={() => setShowCreateModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateTask}
              loading={creating}
              disabled={creating || !newTask.title.trim()}
              className="flex-1"
            >
              Create Task
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}