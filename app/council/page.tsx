'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/app/contexts/AuthContext';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import PageBackground from '@/components/common/PageBackground';
import Modal from '@/components/common/Modal';
import { MENTORS } from '@/utils/constants';
import { 
  canSummonCouncil, 
  recordCouncilSummon, 
  getStoredCouncilCases,
  setStoredCouncilCases,
  addTask,
  addJournalEntry 
} from '@/lib/storage';
import toast from 'react-hot-toast';
import type { CouncilCase } from '@/types';

export default function CouncilPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  
  const [dilemma, setDilemma] = useState('');
  const [loading, setLoading] = useState(false);
  const [canSummon, setCanSummon] = useState(true);
  const [showResults, setShowResults] = useState(false);
  const [currentCase, setCurrentCase] = useState<CouncilCase | null>(null);
  const [recentCases, setRecentCases] = useState<CouncilCase[]>([]);
  const [viewCase, setViewCase] = useState<CouncilCase | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
      return;
    }

    if (user) {
      loadCouncilData();
    }
  }, [user, authLoading, router]);

  const loadCouncilData = () => {
    const canSummonToday = canSummonCouncil();
    setCanSummon(canSummonToday);
    
    const cases = getStoredCouncilCases();
    setRecentCases(cases.slice(0, 5));
  };

  const generateMentorResponse = (_mentor: string, _dilemmaText: string): string => {
    // Mock AI responses for each mentor
    const responses = {
      machiavelli: `Your situation requires pragmatic analysis. Consider these points:

1. **Assess the Power Dynamics**: Who holds leverage? Identify their motivations and weaknesses.

2. **Calculate the Risks**: What are the potential costs of action versus inaction? Choose the path that preserves your position.

3. **Maintain Appearances**: Whether you act decisively or diplomatically, ensure your reputation remains intact. Perception shapes reality.

The question is not what is right, but what is effective. Act accordingly.`,
      
      napoleon: `This calls for decisive action. Here's my counsel:

1. **Speed is Essential**: Delay breeds doubt. Once you've chosen your course, execute with conviction.

2. **Concentrate Your Forces**: Don't dilute your efforts. Focus all resources on the critical point of decision.

3. **Lead from the Front**: Your commitment will inspire others. Show no hesitation in your resolve.

Fortune favors the bold, but only when boldness is backed by preparation. Strike now.`,
      
      aurelius: `Before acting, examine your principles:

1. **What is Within Your Control?**: Focus only on your choices and responses, not on external circumstances.

2. **Is This Aligned with Virtue?**: Will your action demonstrate wisdom, justice, courage, and temperance?

3. **What Would the Best Version of Yourself Do?**: Rise above immediate reactions and choose the path of integrity.

Remember: we cannot control what happens to us, only how we respond. Choose wisely.`
    };

    return responses[_mentor as keyof typeof responses];
  };

  const handleSummonCouncil = async () => {
    if (!user) return;
    
    if (!canSummon) {
      toast.error('Council can only be summoned once per day');
      return;
    }

    if (dilemma.length < 10) {
      toast.error('Please describe your dilemma in more detail');
      return;
    }

    setLoading(true);

    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Generate responses from each mentor
    const mentorViews = {
      machiavelli: generateMentorResponse('machiavelli', dilemma),
      napoleon: generateMentorResponse('napoleon', dilemma),
      aurelius: generateMentorResponse('aurelius', dilemma),
    };

    // Generate unified verdict
    const verdict = `The council has deliberated on your dilemma. While each master offers a unique perspective, they converge on these key principles:

**Immediate Actions:**
1. Document all relevant facts and stakeholder positions
2. Identify your sources of leverage and constraints
3. Prepare multiple scenarios based on different outcomes

**Strategic Principles:**
- Build your foundation carefully (Aurelius)
- Position yourself advantageously (Machiavelli)
- Execute decisively when ready (Napoleon)

The path forward requires both wisdom and action. Reflect on these perspectives, then choose with conviction.`;

    // Create council case
    const newCase: CouncilCase = {
      id: Date.now(),
      user_id: user.id,
      dilemma_text: dilemma,
      mentor_views: mentorViews,
      verdict,
      verdict_tasks: [
        'Document all relevant facts',
        'Identify key stakeholders',
        'Develop three action plans',
      ],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Save to storage
    const cases = getStoredCouncilCases();
    cases.unshift(newCase);
    setStoredCouncilCases(cases);

    // Record summon
    recordCouncilSummon();

    setCurrentCase(newCase);
    setShowResults(true);
    setCanSummon(false);
    setLoading(false);
    
    toast.success('The council has spoken!');
  };

  const handleCreateTasks = () => {
    if (!currentCase || !user) return;

    currentCase.verdict_tasks?.forEach(task => {
      addTask({
        user_id: user.id,
        title: task,
        source_type: 'council',
        source_name: 'Council Verdict',
        status: 'todo',
      });
    });

    toast.success(`${currentCase.verdict_tasks?.length || 0} tasks created!`);
    router.push('/tasks');
  };

  const handleSaveToJournal = () => {
    if (!currentCase) return;

    const journalContent = `**Your Dilemma:**
${currentCase.dilemma_text}

**Council's Verdict:**
${currentCase.verdict}

**Machiavelli's Perspective:**
${currentCase.mentor_views.machiavelli}

**Napoleon's Perspective:**
${currentCase.mentor_views.napoleon}

**Marcus Aurelius's Perspective:**
${currentCase.mentor_views.aurelius}`;

    addJournalEntry({
      entry_type: 'council_verdict',
      title: 'Council Verdict: ' + new Date().toLocaleDateString(),
      content: journalContent,
    });

    toast.success('Saved to journal!');
  };

  const handleNewDilemma = () => {
    setShowResults(false);
    setCurrentCase(null);
    setDilemma('');
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <PageBackground />
        <div className="w-12 h-12 border-4 border-imperial-gold border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      <PageBackground />

      {/* Header */}
      <header className="bg-imperial-darkGray/80 backdrop-blur-sm border-b border-imperial-gray sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-serif bg-gradient-to-r from-imperial-gold to-imperial-lightGold bg-clip-text text-transparent">Council Chamber</h1>
              <p className="text-imperial-cream opacity-70 text-sm">
                Seek wisdom from the three masters
              </p>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="text-center">
                <div className="text-imperial-gold font-bold">{user.current_rank}</div>
                <div className="text-imperial-cream opacity-60">Rank</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        {!showResults ? (
          <>
            {/* Three Mentors Display */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card variant="gold">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-serif text-imperial-gold mb-2">
                    The Council of Three
                  </h2>
                  <p className="text-imperial-cream opacity-80">
                    Present your dilemma to receive wisdom from all three masters
                  </p>
                </div>

                <div className="flex justify-center gap-8 mb-6">
                  {Object.values(MENTORS).map((mentor) => (
                    <div key={mentor.id} className="text-center">
                      <div className="w-20 h-20 mx-auto rounded-full bg-imperial-darkGray border-4 border-imperial-gold flex items-center justify-center text-4xl shadow-gold mb-2">
                        {mentor.icon}
                      </div>
                      <p className="text-xs text-imperial-gold font-semibold">{mentor.name.split(' ')[0]}</p>
                    </div>
                  ))}
                </div>

                {!canSummon && (
                  <div className="mb-4 p-4 bg-imperial-darkGray rounded-lg border border-imperial-gold">
                    <p className="text-sm text-imperial-cream text-center">
                      ⏳ The council can only be summoned once per day. Return tomorrow for new wisdom.
                    </p>
                  </div>
                )}
              </Card>
            </motion.div>

            {/* Dilemma Input */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <h3 className="text-xl font-serif text-imperial-gold mb-4">Your Dilemma</h3>
                
                <textarea
                  value={dilemma}
                  onChange={(e) => setDilemma(e.target.value)}
                  className="w-full px-4 py-3 bg-imperial-darkGray border-2 border-imperial-gray rounded-lg text-imperial-cream placeholder-imperial-cream placeholder:opacity-40 focus:border-imperial-gold focus:outline-none transition-colors min-h-[200px] resize-y"
                  placeholder="Describe your situation, challenge, or decision you face..."
                  maxLength={2000}
                  disabled={!canSummon}
                />
                
                <div className="flex justify-between items-center mt-4">
                  <span className="text-xs text-imperial-cream opacity-60">
                    {dilemma.length} / 2000 characters
                  </span>
                  
                  <Button
                    onClick={handleSummonCouncil}
                    loading={loading}
                    disabled={!canSummon || loading || dilemma.length < 10}
                  >
                    Summon the Council
                  </Button>
                </div>
              </Card>
            </motion.div>

            {/* Recent Cases */}
            {recentCases.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h3 className="text-xl font-serif text-imperial-gold mb-4">Recent Cases</h3>
                <div className="space-y-3">
                  {recentCases.map((caseItem) => (
                    <Card key={caseItem.id} hover>
                      <button
                        onClick={() => setViewCase(caseItem)}
                        className="w-full text-left"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="text-imperial-cream line-clamp-2 mb-2">
                              {caseItem.dilemma_text}
                            </p>
                            <p className="text-xs text-imperial-gold">
                              {new Date(caseItem.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <span className="text-imperial-gold ml-4">→</span>
                        </div>
                      </button>
                    </Card>
                  ))}
                </div>
              </motion.div>
            )}
          </>
        ) : (
          /* Results View */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Your Dilemma */}
            <Card variant="gold">
              <h3 className="text-xl font-serif text-imperial-gold mb-4">Your Dilemma</h3>
              <p className="text-imperial-cream opacity-90 leading-relaxed">
                {currentCase?.dilemma_text}
              </p>
            </Card>

            {/* Mentor Responses */}
            {Object.entries(MENTORS).map(([mentorId, mentor]) => (
              <Card key={mentorId}>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-imperial-darkGray border-4 border-imperial-gold flex items-center justify-center text-3xl shadow-gold flex-shrink-0">
                    {mentor.icon}
                  </div>
                  <div>
                    <h4 className="text-xl font-serif text-imperial-gold">{mentor.name}</h4>
                    <p className="text-sm text-imperial-cream opacity-70">{mentor.title}</p>
                  </div>
                </div>
                <div className="prose prose-invert max-w-none">
                  <p className="text-imperial-cream opacity-90 leading-relaxed whitespace-pre-line">
                    {currentCase?.mentor_views[mentorId as keyof typeof currentCase.mentor_views]}
                  </p>
                </div>
              </Card>
            ))}

            {/* Unified Verdict */}
            <Card variant="gold">
              <h3 className="text-2xl font-serif text-imperial-gold mb-4">The Council's Verdict</h3>
              <div className="prose prose-invert max-w-none">
                <p className="text-imperial-cream opacity-90 leading-relaxed whitespace-pre-line">
                  {currentCase?.verdict}
                </p>
              </div>
            </Card>

            {/* Actions */}
            <div className="flex gap-4">
              <Button onClick={handleCreateTasks} variant="primary">
                Create Tasks from Verdict
              </Button>
              <Button onClick={handleSaveToJournal} variant="outline">
                Save to Journal
              </Button>
              <Button onClick={handleNewDilemma} variant="ghost">
                New Dilemma
              </Button>
            </div>
          </motion.div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-imperial-darkGray/90 backdrop-blur-sm border-t border-imperial-gray">
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

      {/* View Case Modal */}
      {viewCase && (
        <Modal
          isOpen={!!viewCase}
          onClose={() => setViewCase(null)}
          title="Council Case"
        >
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold text-imperial-gold mb-2">Your Dilemma:</h4>
              <p className="text-sm text-imperial-cream opacity-90">{viewCase.dilemma_text}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-imperial-gold mb-2">Verdict:</h4>
              <p className="text-sm text-imperial-cream opacity-90 whitespace-pre-line">{viewCase.verdict}</p>
            </div>
            
            <div className="text-xs text-imperial-cream opacity-60">
              {new Date(viewCase.created_at).toLocaleString()}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}