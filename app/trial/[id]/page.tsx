'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import { CURRICULUM_DATA } from '@/lib/staticData';
import { setTrialProgress, updateUserXP, updateUserStreak, addJournalEntry } from '@/lib/storage';
import { MENTORS } from '@/utils/constants';
import toast from 'react-hot-toast';
import type { Trial } from '@/types';

export default function TrialPage() {
  const router = useRouter();
  const params = useParams();
  const { user, loading: authLoading, refreshUser } = useAuth();
  
  const [trial, setTrial] = useState<Trial | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showLesson, setShowLesson] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
      return;
    }

    loadTrial();
  }, [user, authLoading, params.id]);

  const loadTrial = () => {
    const trialId = parseInt(params.id as string);
    
    // Find trial in curriculum
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
      toast.error('Trial not found');
      router.push('/path');
      return;
    }
    
    setTrial(foundTrial);
  };

  const handleStartQuiz = () => {
    setShowLesson(false);
  };

  const handleAnswerChange = (questionId: number, answer: string) => {
    setAnswers({ ...answers, [questionId]: answer });
  };

  const handleSubmit = async () => {
    if (!trial || !user) return;
    
    const unansweredQuestions = trial.questions?.filter(q => !answers[q.id]);
    if (unansweredQuestions && unansweredQuestions.length > 0) {
      toast.error('Please answer all questions');
      return;
    }

    setSubmitting(true);
    
    // Calculate score
    const questions = trial.questions || [];
    const correctCount = questions.filter(q => answers[q.id] === q.correct_answer).length;
    const score = Math.round((correctCount / questions.length) * 100);
    const passed = score >= (trial.passing_score || 70);
    
    // Update trial progress
    setTrialProgress(trial.id, 'completed', score);
    
    if (passed) {
      // Award XP
      updateUserXP(trial.xp_reward);
      updateUserStreak();
      
      // Generate mentor feedback
      const mentor = user.primary_mentor ? MENTORS[user.primary_mentor] : MENTORS.machiavelli;
      const feedback = generateMentorFeedback(mentor.name, trial.title, score, correctCount, questions.length);
      
      addJournalEntry({
        entry_type: 'mentor_feedback',
        title: `Feedback on ${trial.title}`,
        content: feedback,
      });
      
      toast.success(`Trial completed! +${trial.xp_reward} XP`);
      
      // Redirect to feedback page
      setTimeout(() => {
        router.push(`/feedback/${trial.id}`);
      }, 1500);
    } else {
      toast.error(`Score: ${score}%. You need ${trial.passing_score}% to pass. Try again!`);
      setAnswers({});
      setShowLesson(true);
    }
    
    refreshUser();
    setSubmitting(false);
  };

  const generateMentorFeedback = (mentorName: string, trialTitle: string, score: number, correct: number, total: number): string => {
    const performance = score >= 90 ? 'excellent' : score >= 80 ? 'strong' : score >= 70 ? 'solid' : 'acceptable';
    
    return `**${mentorName}'s Assessment:**

Your performance on "${trialTitle}" was ${performance}. You scored ${score}%, answering ${correct} out of ${total} questions correctly.

**Strengths:**
- Demonstrated understanding of core concepts
- Successfully completed the trial

**Areas for Growth:**
- Continue practicing these principles in real situations
- Review the lesson content for deeper insights
- Apply what you've learned in your daily interactions

**Next Steps:**
Move forward to the next trial when ready. Each lesson builds upon the previous, strengthening your mastery of power dynamics.

Remember: Knowledge without application is merely philosophy. True power comes from practiced wisdom.`;
  };

  if (authLoading || !user || !trial) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  const currentQuestion = trial.questions?.[currentQuestionIndex];
  const totalQuestions = trial.questions?.length || 0;
  const progress = totalQuestions > 0 ? ((currentQuestionIndex + 1) / totalQuestions) * 100 : 0;

  return (
    <div className="min-h-screen pb-20 bg-gradient-dark">
      {/* Header */}
      <header className="bg-imperial-darkGray border-b border-imperial-gray sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-serif text-gradient-gold">{trial.title}</h1>
              <p className="text-imperial-cream opacity-70 text-sm">
                {showLesson ? 'Study the lesson' : `Question ${currentQuestionIndex + 1} of ${totalQuestions}`}
              </p>
            </div>
            <Button variant="ghost" onClick={() => router.push('/path')}>
              ← Back to Path
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {showLesson ? (
          /* Lesson Content */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <Card>
              <div 
                className="prose prose-invert max-w-none"
                dangerouslySetInnerHTML={{ 
                  __html: trial.lesson_content
                    .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-serif text-imperial-gold mb-4">$1</h1>')
                    .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-serif text-imperial-gold mb-3 mt-6">$1</h2>')
                    .replace(/^### (.*$)/gim, '<h3 class="text-xl font-serif text-imperial-gold mb-2 mt-4">$1</h3>')
                    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-imperial-gold">$1</strong>')
                    .replace(/\n/g, '<br/>')
                }}
              />
            </Card>

            <div className="flex justify-center">
              <Button onClick={handleStartQuiz} size="lg">
                Begin Quiz →
              </Button>
            </div>
          </motion.div>
        ) : (
          /* Quiz */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Progress Bar */}
            <div className="progress-bar">
              <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
            </div>

            {/* Question */}
            {currentQuestion && (
              <Card>
                <h2 className="text-xl font-serif text-imperial-gold mb-6">
                  {currentQuestion.question_text}
                </h2>

                <div className="space-y-3">
                  {currentQuestion.options?.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswerChange(currentQuestion.id, option)}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                        answers[currentQuestion.id] === option
                          ? 'border-imperial-gold bg-imperial-gold bg-opacity-10'
                          : 'border-imperial-gray hover:border-imperial-gold'
                      }`}
                    >
                      <span className="text-imperial-cream">{option}</span>
                    </button>
                  ))}
                </div>
              </Card>
            )}

            {/* Navigation */}
            <div className="flex justify-between">
              <Button
                variant="ghost"
                onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                disabled={currentQuestionIndex === 0}
              >
                ← Previous
              </Button>

              {currentQuestionIndex < totalQuestions - 1 ? (
                <Button
                  onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
                  disabled={!answers[currentQuestion?.id || 0]}
                >
                  Next →
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  loading={submitting}
                  disabled={submitting || Object.keys(answers).length < totalQuestions}
                >
                  Submit Trial
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}