'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import { 
  canSummonCouncil, 
  recordCouncilSummon, 
  getStoredCouncilCases, 
  setStoredCouncilCases,
  addTask,
  addJournalEntry
} from '@/lib/storage';
import { MENTORS, COUNCIL } from '@/utils/constants';
import toast from 'hot-toast';
import type { CouncilCase } from '@/types';

export default function CouncilPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  
  const [dilemma, setDilemma] = useState('');
  const [canSummon, setCanSummon] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [currentCase, setCurrentCase] = useState<CouncilCase | null>(null);
  const [recentCases, setRecentCases] = useState<CouncilCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [showingRecent, setShowingRecent] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
      return;
    }

    if (user) {
      checkCouncilAvailability();
      loadRecentCases();
    }
  }, [user, authLoading, router]);

  const checkCouncilAvailability = () => {
    setCanSummon(canSummonCouncil());
    setLoading(false);
  };

  const loadRecentCases = () => {
    const cases = getStoredCouncilCases();
    setRecentCases(cases.slice(0, 5));
  };

  const generateMentorResponse = (dilemmaText: string, mentorId: string): string => {
    const mentor = MENTORS[mentorId as keyof typeof MENTORS];
    
    const responses = {
      machiavelli: `Direct confrontation reveals your hand too soon. First, gather evidence and build alliances. Position yourself strategically before making any move. Remember: it is better to appear weak while being strong than to appear strong while being weak. Act only when victory is certain.`,
      napoleon: `Bold action is required, but choose your moment wisely. Strike decisively when you strike, but ensure you have prepared the ground. Half-measures breed disaster. Commit fully to your course once decided, and execute with speed and precision.`,
      aurelius: `Focus on what is within your control. You cannot change others, but you can control your response and maintain your integrity. Ask yourself: what would virtue demand in this situation? Act accordingly, regardless of the outcome.`
    };
    
    return responses[mentorId as keyof typeof responses];
  };

  const generateVerdict = (dilemmaText: string): string => {
    return `The council agrees on a balanced approach:

**Immediate Actions:**
1. Document the situation thoroughly
2. Assess all stakeholders and their motivations
3. Identify your leverage points and constraints
4. Prepare multiple scenarios and responses

**Strategic Principles:**
- Never act from emotion alone (Aurelius)
- Position yourself advantageously before engaging (Machiavelli)
- When you act, do so decisively and completely (Napoleon)

The strongest position combines preparation, principle, and decisive action. Build your foundation carefully, then move with confidence when the moment is right.`;
  };

  const generateTasks = (dilemmaText: string): string[] => {
    return [
      'Document all relevant facts and evidence',
      'Identify key stakeholders and their interests',
      'Develop three potential courses of action',
      'Consult with a trusted advisor',
      'Set a deadline for your decision'
    ];
  };

  const handleSubmit = async () => {
    if (!dilemma.trim()) {
      toast.error('Please describe your dilemma');
      return;
    }

    if (dilemma.length < COUNCIL.MIN_DILEMMA_LENGTH) {
      toast.error(`Dilemma must be at least ${COUNCIL.MIN_DILEMMA_LENGTH} characters`);
      return;
    }

    setSubmitting(true);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    const cases = getStoredCouncilCases();
    const newCase: CouncilCase = {
      id: Math.max(0, ...cases.map(c => c.id)) + 1,
      user_id: user!.id,
      dilemma_text: dilemma,
      mentor_views: {
        machiavelli: generateMentorResponse(dilemma, 'machiavelli'),
        napoleon: generateMentorResponse(dilemma, 'napoleon'),
        aurelius: generateMentorResponse(dilemma, 'aurelius'),
      },
      verdict: generateVerdict(dilemma),
      verdict_tasks: generateTasks(dilemma),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    cases.unshift(newCase);
    setStoredCouncilCases(cases);
    recordCouncilSummon();
    
    setCurrentCase(newCase);
    setDilemma('');
    setCanSummon(false);
    setSubmitting(false);
    
    toast.success('The council has spoken!');
  };

  const handleCreateTasks = () => {
    if (!currentCase) return;

    currentCase.verdict_tasks?.forEach(taskTitle => {
      addTask({
        user_id: user!.id,
        title: taskTitle,
        source_type: 'council',
        source_name: `Council Case #${currentCase.id}`,
        status: 'todo',
      });
    });

    toast.success('Tasks created from verdict!');
    router.push('/tasks');
  };

  const handleSaveToJournal = () => {
    if (!currentCase) return;

    addJournalEntry({
      entry_type: 'council_verdict',
      title: `Council Verdict: ${currentCase.dilemma_text.substring(0, 50)}...`,
      content: `**Your Dilemma:**\n${currentCase.dilemma_text}\n\n**Council Verdict:**\n${currentCase.verdict}`,
    });

    toast.success('Saved to journal!');
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
      <header className="bg-imperial-darkGray border-b border-imperial-gray">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div>
            <h1 className="text-3xl font-serif text-gradient-gold">The Council Chamber</h1>
            <p className="text-imperial-cream opacity-70 text-sm">
              Seek wisdom from all three masters
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {!currentCase ? (
          <>
            {/* Council Introduction */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card variant="gold">
                <div className="text-center mb-6">
                  <div className="flex justify-center gap-8 mb-4">
                    {Object.values(MENTORS).map((mentor) => (
                      <div
                        key={mentor.id}
                        className="w-16 h-16 rounded-full bg-imperial-darkGray border-2 border-imperial-gold flex items-center justify-center text-3xl shadow-gold"
                      >
                        {mentor.icon}
                      </div>
                    ))}
                  </div>
                  <h2 className="text-2xl font-serif text-imperial-gold mb-2">
                    The Three Masters Await
                  </h2>
                  <p className="text-imperial-cream opacity-80">
                    Present your dilemma. Each master will offer their unique perspective,
                    then deliver a unified verdict.
                  </p>
                </div>

                {!canSummon && (
                  <div className="bg-imperial-darkGray border border-imperial-gold p-4 rounded-lg mb-4">
                    <p className="text-imperial-gold text-center">
                      ⏳ The council can only be summoned once per day.
                      Return tomorrow for more wisdom.
                    </p>
                  </div>
                )}

                {/* Dilemma Input */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-imperial-cream mb-2">
                      State Your Dilemma
                    </label>
                    <textarea
                      value={dilemma}
                      onChange={(e) => setDilemma(e.target.value)}
                      disabled={!canSummon}
                      className="input min-h-[150px] resize-y"
                      placeholder="Describe the situation you face. What decision weighs upon you? What forces are in tension?"
                      maxLength={COUNCIL.MAX_DILEMMA_LENGTH}
                    />
                    <div className="flex justify-between text-xs text-imperial-cream opacity-60 mt-1">
                      <span>{COUNCIL.MIN_DILEMMA_LENGTH} character minimum</span>
                      <span>{dilemma.length} / {COUNCIL.MAX_DILEMMA_LENGTH}</span>
                    </div>
                  </div>

                  <Button
                    onClick={handleSubmit}
                    loading={submitting}
                    disabled={submitting || !canSummon || dilemma.length < COUNCIL.MIN_DILEMMA_LENGTH}
                    fullWidth
                  >
                    {submitting ? 'Consulting the Masters...' : 'Summon the Council'}
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
                <button
                  onClick={() => setShowingRecent(!showingRecent)}
                  className="w-full text-left mb-4"
                >
                  <div className="flex items-center justify-between text-imperial-gold">
                    <h3 className="text-xl font-serif">Recent Verdicts</h3>
                    <span className="text-2xl">{showingRecent ? '▼' : '▶'}</span>
                  </div>
                </button>

                {showingRecent && (
                  <div className="space-y-3">
                    {recentCases.map((case_) => (
                      <Card key={case_.id}>
                        <p className="text-imperial-cream opacity-80 mb-2 line-clamp-2">
                          {case_.dilemma_text}
                        </p>
                        <p className="text-sm text-imperial-gold">
                          {new Date(case_.created_at).toLocaleDateString()}
                        </p>
                      </Card>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </>
        ) : (
          /* Council Verdict */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Dilemma Recap */}
            <Card variant="gold">
              <h3 className="text-xl font-serif text-imperial-gold mb-3">Your Dilemma</h3>
              <p className="text-imperial-cream opacity-90 italic">
                "{currentCase.dilemma_text}"
              </p>
            </Card>

            {/* Mentor Perspectives */}
            {Object.entries(currentCase.mentor_views).map(([mentorId, view]) => {
              const mentor = MENTORS[mentorId as keyof typeof MENTORS];
              return (
                <Card key={mentorId}>
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-full bg-imperial-darkGray border-2 border-imperial-gold flex items-center justify-center text-3xl flex-shrink-0">
                      {mentor.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-serif text-imperial-gold mb-2">
                        {mentor.name}
                      </h4>
                      <p className="text-imperial-cream opacity-90 leading-relaxed">
                        {view}
                      </p>
                    </div>
                  </div>
                </Card>
              );
            })}

            {/* Unified Verdict */}
            <Card className="border-4 border-imperial-gold">
              <div className="text-center mb-4">
                <div className="text-5xl mb-2">⚖️</div>
                <h3 className="text-2xl font-serif text-imperial-gold">
                  Council Verdict
                </h3>
              </div>
              <div 
                className="text-imperial-cream leading-relaxed text-lg mb-6"
                dangerouslySetInnerHTML={{ 
                  __html: currentCase.verdict
                    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-imperial-gold">$1</strong>')
                    .replace(/\n/g, '<br/>')
                }}
              />

              {/* Verdict Tasks */}
              {currentCase.verdict_tasks && currentCase.verdict_tasks.length > 0 && (
                <div className="border-t border-imperial-gray pt-4">
                  <h4 className="text-lg font-serif text-imperial-gold mb-3">
                    Recommended Actions
                  </h4>
                  <ul className="space-y-2 mb-4">
                    {currentCase.verdict_tasks.map((task, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-imperial-gold mt-1">•</span>
                        <span className="text-imperial-cream opacity-90">{task}</span>
                      </li>
                    ))}
                  </ul>
                  <Button onClick={handleCreateTasks} fullWidth>
                    Add to My Tasks
                  </Button>
                </div>
              )}
            </Card>

            {/* Actions */}
            <div className="flex gap-4">
              <Button variant="outline" onClick={handleSaveToJournal} className="flex-1">
                📖 Save to Journal
              </Button>
              <Button onClick={() => setCurrentCase(null)} className="flex-1">
                New Dilemma
              </Button>
            </div>
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