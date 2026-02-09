'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/app/contexts/AuthContext';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import Modal from '@/components/common/Modal';
import { getStoredJournal, addJournalEntry, deleteJournalEntry } from '@/lib/storage';
import { formatDate } from '@/utils/helpers';
import toast from 'react-hot-toast';
import type { JournalEntry, JournalEntryType } from '@/types';

export default function JournalPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | JournalEntryType>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newEntry, setNewEntry] = useState({ title: '', content: '' });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
      return;
    }

    if (user) {
      loadEntries();
    }
  }, [user, authLoading, router, filter]);

  const loadEntries = () => {
    let allEntries = getStoredJournal();
    
    if (filter !== 'all') {
      allEntries = allEntries.filter(e => e.entry_type === filter);
    }
    
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      allEntries = allEntries.filter(e => 
        e.title.toLowerCase().includes(term) || 
        e.content.toLowerCase().includes(term)
      );
    }
    
    setEntries(allEntries);
    setLoading(false);
  };

  const handleSearch = () => {
    loadEntries();
  };

  const handleCreateEntry = async () => {
    if (!newEntry.title.trim() || !newEntry.content.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    setCreating(true);
    
    addJournalEntry({
      entry_type: 'saved_insight',
      title: newEntry.title,
      content: newEntry.content,
    });

    toast.success('Entry saved!');
    setShowCreateModal(false);
    setNewEntry({ title: '', content: '' });
    loadEntries();
    setCreating(false);
  };

  const handleDeleteEntry = (entryId: number) => {
    const entry = entries.find(e => e.id === entryId);
    
    if (entry && entry.entry_type !== 'saved_insight') {
      toast.error('You can only delete custom insights');
      return;
    }

    if (!confirm('Delete this entry?')) return;

    deleteJournalEntry(entryId);
    toast.success('Entry deleted');
    setSelectedEntry(null);
    loadEntries();
  };

  const getEntryIcon = (type: string) => {
    switch (type) {
      case 'mentor_feedback': return '🎓';
      case 'council_verdict': return '⚖️';
      case 'saved_insight': return '💡';
      default: return '📝';
    }
  };

  const getEntryTypeLabel = (type: string) => {
    switch (type) {
      case 'mentor_feedback': return 'Mentor Feedback';
      case 'council_verdict': return 'Council Verdict';
      case 'saved_insight': return 'Personal Insight';
      default: return 'Entry';
    }
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
              <h1 className="text-3xl font-serif text-gradient-gold">Your Journal</h1>
              <p className="text-imperial-cream opacity-70 text-sm">
                A library of wisdom and insights
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
        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Search */}
          <div className="flex gap-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="input flex-1"
              placeholder="Search your journal..."
            />
            <Button onClick={handleSearch}>Search</Button>
            <Button onClick={() => setShowCreateModal(true)}>
              + New Entry
            </Button>
          </div>

          {/* Filters */}
          <div className="flex gap-2 overflow-x-auto">
            {['all', 'mentor_feedback', 'council_verdict', 'saved_insight'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f as any)}
                className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-all ${
                  filter === f
                    ? 'bg-gradient-gold text-imperial-black'
                    : 'bg-imperial-darkGray text-imperial-cream hover:bg-imperial-gray'
                }`}
              >
                {f === 'all' ? 'All' :
                 f === 'mentor_feedback' ? 'Feedback' :
                 f === 'council_verdict' ? 'Verdicts' :
                 'Insights'}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Entries List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-3"
        >
          {entries.length > 0 ? (
            entries.map((entry, index) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <button onClick={() => setSelectedEntry(entry)} className="w-full">
                  <Card hover className="cursor-pointer text-left">
                    <div className="flex items-start gap-4">
                      <div className="text-3xl">{getEntryIcon(entry.entry_type)}</div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-imperial-gold mb-1">
                          {entry.title}
                        </h3>
                        <p className="text-sm text-imperial-cream opacity-70 line-clamp-2 mb-2">
                          {entry.content.substring(0, 150)}...
                        </p>
                        <div className="flex items-center gap-3 text-xs">
                          <span className="badge bg-imperial-gray text-imperial-cream">
                            {getEntryTypeLabel(entry.entry_type)}
                          </span>
                          <span className="text-imperial-cream opacity-60">
                            {formatDate(entry.created_at)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </button>
              </motion.div>
            ))
          ) : (
            <Card>
              <div className="text-center py-12">
                <div className="text-5xl mb-4">📖</div>
                <p className="text-imperial-cream opacity-80">
                  {searchTerm ? 'No entries found matching your search.' : 'Your journal is empty. Start adding entries!'}
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

      {/* View Entry Modal */}
      <Modal
        isOpen={!!selectedEntry}
        onClose={() => setSelectedEntry(null)}
        title={selectedEntry?.title || ''}
        size="lg"
      >
        {selectedEntry && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-sm">
              <span className="badge bg-imperial-gray text-imperial-cream">
                {getEntryIcon(selectedEntry.entry_type)} {getEntryTypeLabel(selectedEntry.entry_type)}
              </span>
              <span className="text-imperial-cream opacity-70">
                {formatDate(selectedEntry.created_at)}
              </span>
            </div>

            <div className="bg-imperial-darkGray p-4 rounded-lg max-h-96 overflow-y-auto">
              <div 
                className="text-imperial-cream whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ 
                  __html: selectedEntry.content
                    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-imperial-gold">$1</strong>')
                    .replace(/\n/g, '<br/>')
                }}
              />
            </div>

            {selectedEntry.entry_type === 'saved_insight' && (
              <Button
                variant="danger"
                onClick={() => handleDeleteEntry(selectedEntry.id)}
                fullWidth
              >
                Delete Entry
              </Button>
            )}
          </div>
        )}
      </Modal>

      {/* Create Entry Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="New Insight"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-imperial-cream mb-2">
              Title
            </label>
            <input
              type="text"
              value={newEntry.title}
              onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })}
              className="input"
              placeholder="What did you learn?"
              maxLength={255}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-imperial-cream mb-2">
              Content
            </label>
            <textarea
              value={newEntry.content}
              onChange={(e) => setNewEntry({ ...newEntry, content: e.target.value })}
              className="input min-h-[200px] resize-y"
              placeholder="Capture your insights..."
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
              onClick={handleCreateEntry}
              loading={creating}
              disabled={creating || !newEntry.title.trim() || !newEntry.content.trim()}
              className="flex-1"
            >
              Save Entry
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}