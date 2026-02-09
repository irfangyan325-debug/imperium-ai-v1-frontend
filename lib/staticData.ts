import type { User, Module, Trial, Task, CouncilCase, JournalEntry } from '../types';

// Mock Users Database
export const USERS_DB: Record<string, User & { password: string }> = {
  'test@example.com': {
    id: 1,
    email: 'test@example.com',
    password: 'password123',
    primary_mentor: 'machiavelli',
    current_rank: 'Strategist',
    influence_xp: 1250,
    streak_days: 7,
    subscription_status: 'free',
    timezone: 'UTC',
    last_activity_date: new Date().toISOString().split('T')[0],
    created_at: '2024-01-15T10:00:00.000Z',
    updated_at: new Date().toISOString(),
  },
};

// Curriculum Data
export const CURRICULUM_DATA: Module[] = [
  {
    id: 1,
    title: 'Introduction to Power Dynamics',
    description: 'Master the fundamentals of influence and authority',
    order_index: 1,
    completed_trials: 2,
    total_trials: 5,
    units: [
      {
        id: 1,
        title: 'Understanding Authority',
        description: 'Learn the nature and sources of power',
        order_index: 1,
        module_id: 1,
        trials: [
          {
            id: 1,
            title: 'The Foundation of Power',
            unit_id: 1,
            order_index: 1,
            lesson_content: `# The Foundation of Power

## Introduction

Power is not merely the ability to command—it is the art of influence, the mastery of perception, and the strategic positioning of oneself in relation to others.

## Core Principles

### 1. Sources of Authority
- **Legitimate Power**: Derived from position and hierarchy
- **Expert Power**: Born from knowledge and competence
- **Referent Power**: Earned through respect and admiration
- **Coercive Power**: Based on fear and consequences
- **Reward Power**: Stemming from the ability to grant benefits

### 2. The Three Pillars
Your mentor, Machiavelli, teaches that power rests on three foundations:

1. **Force**: The capacity to compel action
2. **Cunning**: The intelligence to outmaneuver opponents
3. **Legitimacy**: The perception of rightful authority

### 3. Practical Application
True power is maintained through:
- Strategic alliances
- Information control
- Calculated generosity
- Managed perception
- Decisive action when necessary

Remember: "It is better to be feared than loved, if you cannot be both."`,
            xp_reward: 100,
            passing_score: 70,
            questions: [
              {
                id: 1,
                question_text: 'According to the lesson, which is NOT a source of authority?',
                question_type: 'multiple_choice',
                options: ['Legitimate Power', 'Expert Power', 'Inherited Wealth', 'Coercive Power'],
                correct_answer: 'Inherited Wealth',
                order_index: 1,
                trial_id: 1,
              },
              {
                id: 2,
                question_text: 'What are the three pillars of power according to Machiavelli?',
                question_type: 'multiple_choice',
                options: [
                  'Force, Cunning, Legitimacy',
                  'Money, Status, Influence',
                  'Fear, Love, Respect',
                  'Knowledge, Wealth, Connections',
                ],
                correct_answer: 'Force, Cunning, Legitimacy',
                order_index: 2,
                trial_id: 1,
              },
              {
                id: 3,
                question_text: 'True power is maintained through strategic alliances and information control.',
                question_type: 'multiple_choice',
                options: ['True', 'False'],
                correct_answer: 'True',
                order_index: 3,
                trial_id: 1,
              },
              {
                id: 4,
                question_text: 'Which type of power is earned through respect and admiration?',
                question_type: 'multiple_choice',
                options: ['Legitimate Power', 'Coercive Power', 'Referent Power', 'Reward Power'],
                correct_answer: 'Referent Power',
                order_index: 4,
                trial_id: 1,
              },
              {
                id: 5,
                question_text: 'Complete this quote: "It is better to be feared than _____, if you cannot be both."',
                question_type: 'multiple_choice',
                options: ['respected', 'wealthy', 'loved', 'powerful'],
                correct_answer: 'loved',
                order_index: 5,
                trial_id: 1,
              },
            ],
            user_status: 'completed',
            user_score: 85,
          },
          {
            id: 2,
            title: 'Types of Authority',
            unit_id: 1,
            order_index: 2,
            lesson_content: `# Types of Authority

## Understanding Different Forms of Power

Authority manifests in various forms, each with unique characteristics and applications.

## Traditional Authority
Based on established customs and long-standing practices. This type of authority is inherited and passed down through generations.

## Charismatic Authority
Derived from personal magnetism and exceptional qualities. Leaders who possess this inspire devotion and loyalty.

## Rational-Legal Authority
Founded on rules, regulations, and formal positions. This is the bedrock of modern institutions.

## Application in Strategy
Understanding these types allows you to:
- Recognize the source of your opponents' power
- Build multiple foundations for your own authority
- Adapt your approach to different situations`,
            xp_reward: 100,
            passing_score: 70,
            questions: [
              {
                id: 6,
                question_text: 'Which type of authority is based on established customs?',
                question_type: 'multiple_choice',
                options: ['Traditional', 'Charismatic', 'Rational-Legal', 'Expert'],
                correct_answer: 'Traditional',
                order_index: 1,
                trial_id: 2,
              },
              {
                id: 7,
                question_text: 'Charismatic authority is derived from personal magnetism.',
                question_type: 'multiple_choice',
                options: ['True', 'False'],
                correct_answer: 'True',
                order_index: 2,
                trial_id: 2,
              },
              {
                id: 8,
                question_text: 'What is the foundation of modern institutions?',
                question_type: 'multiple_choice',
                options: ['Traditional Authority', 'Charismatic Authority', 'Rational-Legal Authority', 'Divine Right'],
                correct_answer: 'Rational-Legal Authority',
                order_index: 3,
                trial_id: 2,
              },
            ],
            user_status: 'current',
          },
          {
            id: 3,
            title: 'Building Influence Networks',
            unit_id: 1,
            order_index: 3,
            lesson_content: `# Building Influence Networks

## The Web of Power

Your network is your net worth in the game of power. Strategic relationships multiply your capabilities.

## Key Principles
- Quality over quantity
- Diverse connections
- Reciprocal value
- Strategic positioning`,
            xp_reward: 100,
            passing_score: 70,
            questions: [],
            user_status: 'locked',
          },
        ],
      },
      {
        id: 2,
        title: 'Strategic Thinking',
        description: 'Develop the mindset of a strategist',
        order_index: 2,
        module_id: 1,
        trials: [
          {
            id: 4,
            title: 'Reading the Room',
            unit_id: 2,
            order_index: 1,
            lesson_content: `# Reading the Room

## Situational Awareness

The ability to assess power dynamics in any situation is crucial for strategic success.`,
            xp_reward: 100,
            passing_score: 70,
            questions: [],
            user_status: 'locked',
          },
          {
            id: 5,
            title: 'Timing and Opportunity',
            unit_id: 2,
            order_index: 2,
            lesson_content: `# Timing and Opportunity

## Seizing the Moment

Napoleon taught that the art of war is the art of timing. Know when to strike.`,
            xp_reward: 100,
            passing_score: 70,
            questions: [],
            user_status: 'locked',
          },
        ],
      },
    ],
  },
  {
    id: 2,
    title: 'Advanced Manipulation',
    description: 'Learn the subtle arts of influence',
    order_index: 2,
    completed_trials: 0,
    total_trials: 4,
    units: [],
  },
];

// Tasks Data
export const TASKS_DATA: Task[] = [
  {
    id: 1,
    user_id: 1,
    title: 'Complete The Foundation of Power trial',
    description: 'Finish the first trial to understand power dynamics',
    source_type: 'trial',
    source_name: 'The Foundation of Power',
    status: 'done',
    due_date: new Date().toISOString().split('T')[0],
    completed_at: new Date(Date.now() - 86400000).toISOString(),
    created_at: new Date(Date.now() - 172800000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 2,
    user_id: 1,
    title: 'Practice strategic thinking',
    description: 'Analyze a recent decision using power dynamics framework',
    source_type: 'manual',
    status: 'todo',
    due_date: new Date().toISOString().split('T')[0],
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 3,
    user_id: 1,
    title: 'Reflect on a situation where you held authority',
    description: 'Write about what made your authority effective or ineffective',
    source_type: 'council',
    source_name: 'Council Verdict #1',
    status: 'todo',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// Journal Entries
export const JOURNAL_DATA: JournalEntry[] = [
  {
    id: 1,
    user_id: 1,
    entry_type: 'mentor_feedback',
    title: 'Feedback on The Foundation of Power',
    content: `**Machiavelli's Assessment:**

Your understanding of power's foundations shows promise, young strategist. You scored 85%, demonstrating solid comprehension of the core principles.

**Strengths:**
- Excellent grasp of the three pillars: Force, Cunning, and Legitimacy
- Strong understanding of different power sources
- Good recognition of strategic alliance importance

**Areas for Growth:**
- Deepen your understanding of when to apply force versus cunning
- Study historical examples of power transitions
- Practice identifying power dynamics in daily situations

**Recommended Action:**
Observe three interactions this week. In each, identify:
1. Who holds power and why
2. What type of authority is at play
3. How the power dynamic could shift

Remember: Power is not given, it is taken—but the wise know when to wait and when to seize.`,
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 2,
    user_id: 1,
    entry_type: 'saved_insight',
    title: 'Observation: Office Politics',
    content: `Today I noticed how my manager maintains authority through a combination of legitimate power (position) and expert power (deep knowledge of the systems).

When challenged by a colleague, they didn't resort to pulling rank. Instead, they demonstrated superior understanding of the problem, which naturally reestablished their authority.

This aligns with what I learned about the three pillars—legitimacy backed by actual competence creates the strongest foundation.`,
    created_at: new Date(Date.now() - 43200000).toISOString(),
    updated_at: new Date(Date.now() - 43200000).toISOString(),
  },
];

// Council Cases
export const COUNCIL_CASES: CouncilCase[] = [
  {
    id: 1,
    user_id: 1,
    dilemma_text: 'I discovered my colleague is taking credit for my work in meetings with upper management. Should I confront them directly or go to my boss?',
    mentor_views: {
      machiavelli: 'Direct confrontation reveals your hand too soon. First, gather evidence. Then, ensure your work is visible to management through other channels—copy them on key emails, present in meetings yourself. Let your colleague realize their deception is no longer sustainable. Only then, if necessary, bring documented proof to your superior. Never fight a battle you can avoid winning through superior positioning.',
      napoleon: 'Strike swiftly and decisively, but choose your battlefield wisely. Document your contributions immediately. Request a private meeting with your boss, present the facts without emotion, and propose a solution: clear attribution processes going forward. Boldness wins respect, but recklessness invites disaster. Confront the issue head-on, but do so with prepared evidence and a proposed path forward.',
      aurelius: 'Consider first: what is within your control? You cannot control your colleague\'s character, but you can control your response. Document your work meticulously. Seek first to understand their motivation—perhaps they feel insecure. If possible, address this privately with them, giving them a chance to correct course. If this fails, bring the matter to your superior calmly and factually. Your integrity is your true victory, regardless of the outcome.',
    },
    verdict: `The council agrees: Act with strategic patience while maintaining clear boundaries.

**Immediate Actions:**
1. Begin documenting your contributions systematically
2. Increase your visibility to management through legitimate channels
3. Approach your colleague privately first—give them one chance to self-correct
4. If behavior continues, present documented evidence to your superior

**Strategic Principles:**
- Never engage in battles you can avoid through superior positioning (Machiavelli)
- Act decisively when you do engage, with evidence prepared (Napoleon)
- Maintain your integrity and focus on what you can control (Aurelius)

The strongest position is one where your value is undeniable and your character unimpeachable. Build this foundation, and the situation will resolve itself—with or without confrontation.`,
    verdict_tasks: [
      'Document all your contributions for the next two weeks',
      'Schedule brief check-ins with your manager to discuss your projects',
      'Prepare a private conversation script for your colleague',
      'Create a folder of evidence showing your work timeline',
    ],
    created_at: new Date(Date.now() - 172800000).toISOString(),
    updated_at: new Date(Date.now() - 172800000).toISOString(),
  },
];

// Generate mock token
export const generateMockToken = (userId: number): string => {
  return `mock_token_user_${userId}_${Date.now()}`;
};