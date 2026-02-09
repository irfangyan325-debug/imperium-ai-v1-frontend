'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/app/contexts/AuthContext';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import { CURRICULUM_DATA } from '@/lib/staticData';
import { setTrialProgress, updateUserXP, updateUserStreak, addJournalEntry } from '@/lib/storage';
import toast from 'react-hot-toast';
import type { Trial } from '@/types';

export default function TrialPage() {
  const router = useRouter();
  const params = useParams();
  const { user, loading: authLoading, refreshUser } = useAuth();
  
  const [trial, setTrial] = useState<Trial | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showLesson, setShowLesson] = useState(true);

  const loadTrial = useCallback(() => {
    const trialId = parseInt(params.id as string);
    
    // Find trial in curriculum
    let foundTrial: Trial | null = null;
    for (const curriculumModule of CURRICULUM_DATA) {
      for (const unit of curriculumModule.units || []) {
        const t = unit.trials?.find(trialItem => trialItem.id === trialId);
        if (t) {
          foundTrial = t;
          break;
        }
      }
      if (foundTrial) break;
    }
    
    if (!foundTrial) {
      toast.error('Trial not found');
      router.push('/path');
      return;
    }
    
    setTrial(foundTrial);
    setLoading(false);
  }, [params.id, router]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
      return;
    }

    if (user) {
      loadTrial();
    }
  }, [user, authLoading, loadTrial, router]);

  const generateMentorFeedback = (mentorName: string, trialTitle: string, score: number, correct: number, total: number): string => {
    const mentorStyles: Record<string, { strengths: string; growth: string; nextSteps: string }> = {
      machiavelli: {
        strengths: `You demonstrated strategic thinking in ${correct} of ${total} scenarios. Your grasp of pragmatic power dynamics shows promise.`,
        growth: `However, ${total - correct} areas require sharper analysis. Power rewards those who see all angles, not just the obvious ones.`,
        nextSteps: `Study the nuances of manipulation and influence. Remember: appearances often matter more than reality.`
      },
      napoleon: {
        strengths: `Your decisive answers on ${correct} questions show a commander's instinct. Speed and confidence are essential.`,
        growth: `Yet ${total - correct} questions revealed hesitation. In battle and in power, indecision is defeat.`,
        nextSteps: `Train your mind to assess and act with lightning speed. Fortune favors the bold who are also prepared.`
      },
      aurelius: {
        strengths: `You answered ${correct} of ${total} questions correctly, showing wisdom and reflection.`,
        growth: `The ${total - correct} errors are opportunities for growth. True strength comes from acknowledging what we don't yet understand.`,
        nextSteps: `Reflect on these lessons daily. Virtue is built through consistent practice, not sudden insight.`
      }
    };

    const style = mentorStyles[mentorName.toLowerCase()] || mentorStyles.aurelius;
    
    return `**Trial Complete: ${trialTitle}**

**Your Score: ${score}%**

${style.strengths}

${score < 70 ? style.growth : 'Your understanding is solid, but never stop refining your knowledge.'}

**Next Steps:**
${style.nextSteps}

Continue your journey with discipline and focus. Each trial brings you closer to mastery.

— ${mentorName}`;
  };

  const handleAnswerSelect = (questionId: number, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = async () => {
    if (!trial || !user) return;

    const questions = trial.questions || [];
    
    // Check all questions answered
    if (Object.keys(answers).length < questions.length) {
      toast.error('Please answer all questions');
      return;
    }

    // Calculate score
    let correctCount = 0;
    questions.forEach(q => {
      if (answers[q.id] === q.correct_answer) {
        correctCount++;
      }
    });

    const score = Math.round((correctCount / questions.length) * 100);
    const passed = score >= (trial.passing_score || 70);

    if (passed) {
      // Update progress
      setTrialProgress(trial.id, 'completed', score);
      updateUserXP(trial.xp_reward || 100);
      updateUserStreak();
      
      // Generate and save feedback
      const mentorName = user.primary_mentor || 'aurelius';
      const mentorDisplayName = mentorName.charAt(0).toUpperCase() + mentorName.slice(1);
      const feedback = generateMentorFeedback(
        mentorDisplayName,
        trial.title,
        score,
        correctCount,
        questions.length
      );

      addJournalEntry({
        entry_type: 'mentor_feedback',
        title: `Trial Feedback: ${trial.title}`,
        content: feedback,
      });

      refreshUser();
      toast.success(`Trial passed! +${trial.xp_reward || 100} XP`);
      router.push(`/feedback/${trial.id}`);
    } else {
      toast.error(`Score: ${score}%. You need ${trial.passing_score || 70}% to pass.`);
      setAnswers({});
      setCurrentQuestionIndex(0);
      setShowLesson(true);
    }
  };

  if (authLoading || loading || !trial || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-imperial-black to-imperial-darkGray">
        <div className="w-12 h-12 border-4 border-imperial-gold border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const questions = trial.questions || [];
  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen pb-20 bg-gradient-to-b from-imperial-black to-imperial-darkGray">
      {/* Header */}
      <header className="bg-imperial-darkGray border-b border-imperial-gray">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <button
            onClick={() => router.push('/path')}
            className="text-imperial-gold hover:text-imperial-lightGold mb-2 flex items-center gap-2"
          >
            ← Back to Path
          </button>
          <h1 className="text-3xl font-serif bg-gradient-to-r from-imperial-gold to-imperial-lightGold bg-clip-text text-transparent">
            {trial.title}
          </h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {showLesson ? (
          /* Lesson Content */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card variant="gold">
              <div 
                className="prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: trial.lesson_content || '' }}
              />
              <div className="mt-6 flex justify-end">
                <Button onClick={() => setShowLesson(false)}>
                  Begin Assessment →
                </Button>
              </div>
            </Card>
          </motion.div>
        ) : (
          /* Quiz Mode */
          <div className="space-y-6">
            {/* Progress */}
            <Card>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-imperial-cream">Question {currentQuestionIndex + 1} of {questions.length}</span>
                <span className="text-imperial-gold">{Object.keys(answers).length} answered</span>
              </div>
              <div className="w-full h-2 bg-imperial-gray rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-imperial-gold to-imperial-lightGold transition-all duration-300"
                  style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                />
              </div>
            </Card>

            {/* Question */}
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card variant="gold">
                <h2 className="text-xl font-serif text-imperial-gold mb-6">
                  {currentQuestion?.question_text}
                </h2>

                <div className="space-y-3">
                  {currentQuestion?.options?.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(currentQuestion.id, option)}
                      className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                        answers[currentQuestion.id] === option
                          ? 'border-imperial-gold bg-imperial-gold bg-opacity-20'
                          : 'border-imperial-gray hover:border-imperial-gold'
                      }`}
                    >
                      <span className="text-imperial-cream">{option}</span>
                    </button>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Navigation */}
            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                disabled={currentQuestionIndex === 0}
                className="flex-1"
              >
                ← Previous
              </Button>

              {currentQuestionIndex < questions.length - 1 ? (
                <Button
                  onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                  className="flex-1"
                >
                  Next →
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={Object.keys(answers).length < questions.length}
                  className="flex-1"
                >
                  Submit Trial
                </Button>
              )}
            </div>

            {/* Review Link */}
            <button
              onClick={() => setShowLesson(true)}
              className="text-imperial-gold hover:text-imperial-lightGold text-sm"
            >
              ← Review Lesson
            </button>
          </div>
        )}
      </main>
    </div>
  );
}