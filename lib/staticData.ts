import type { User, Task, JournalEntry, CouncilCase, Module } from '../types';

// Mock Users Database
export const USERS_DB: Record<string, User & { password: string }> = {
  'test@example.com': {
    id: 1,
    email: 'test@example.com',
    password: 'password123',
    primary_mentor: 'machiavelli',
    current_rank: 'Strategist',
    influence_xp: 750,
    streak_days: 5,
    subscription_status: 'free',
    timezone: 'UTC',
    last_activity_date: new Date().toISOString().split('T')[0],
    created_at: '2024-01-01T00:00:00.000Z',
    updated_at: new Date().toISOString(),
  },
};

// Generate Mock Token
export const generateMockToken = (userId: number): string => {
  return `mock_token_user_${userId}_${Date.now()}`;
};

// Tasks Data
export const TASKS_DATA: Task[] = [
  {
    id: 1,
    user_id: 1,
    title: 'Complete first trial',
    description: 'Finish "The Foundation of Power" trial',
    source_type: 'manual',
    status: 'done',
    completed_at: new Date().toISOString(),
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    user_id: 1,
    title: 'Practice strategic thinking',
    description: 'Apply lessons from your mentor in a real situation',
    source_type: 'manual',
    status: 'todo',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 3,
    user_id: 1,
    title: 'Document all relevant facts',
    description: 'From council verdict',
    source_type: 'council',
    source_name: 'Council Case #1',
    status: 'todo',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// Journal Data
export const JOURNAL_DATA: JournalEntry[] = [
  {
    id: 1,
    user_id: 1,
    entry_type: 'mentor_feedback',
    title: 'Trial Feedback: The Foundation of Power',
    content: `**Trial Complete: The Foundation of Power**

**Your Score: 85%**

You demonstrated strong understanding of power dynamics. Your pragmatic approach shows promise.

Keep refining your strategic thinking. Each trial brings you closer to mastery.

— Machiavelli`,
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 2,
    user_id: 1,
    entry_type: 'saved_insight',
    title: 'Key Insight: Authority vs Power',
    content: 'Authority is given, power is taken. True influence comes from the ability to shape outcomes, not just from titles or positions.',
    created_at: new Date(Date.now() - 172800000).toISOString(),
    updated_at: new Date(Date.now() - 172800000).toISOString(),
  },
];

// Council Cases Data
export const COUNCIL_CASES: CouncilCase[] = [
  {
    id: 1,
    user_id: 1,
    dilemma_text: 'I am facing resistance from my team on a new initiative. Should I push forward forcefully or seek consensus?',
    mentor_views: {
      machiavelli: 'Power demands decisive action. If the initiative serves your goals, implement it. Resistance fades when results speak.',
      napoleon: 'A leader must inspire, not just command. Show them the vision, then execute with unwavering commitment.',
      aurelius: 'Consider whether this resistance reveals flaws in your approach. True strength includes the wisdom to listen and adapt.',
    },
    verdict: `The council agrees: **Balance force with wisdom.**

**Immediate Actions:**
1. Document all relevant facts and stakeholder positions
2. Identify leverage points and constraints
3. Prepare multiple scenarios

**Strategic Principles:**
- Build your foundation carefully (Aurelius)
- Position yourself advantageously (Machiavelli)
- Execute decisively when ready (Napoleon)`,
    verdict_tasks: [
      'Document all relevant facts',
      'Identify key stakeholders',
      'Develop three action plans',
    ],
    created_at: new Date(Date.now() - 259200000).toISOString(),
    updated_at: new Date(Date.now() - 259200000).toISOString(),
  },
];

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
            lesson_content: `<h2>The Foundation of Power</h2>
<p>Power is the ability to influence outcomes and shape the behavior of others. Throughout history, leaders have wielded power through three primary sources:</p>

<h3>1. Force (Coercive Power)</h3>
<p>The most direct form of power - the ability to compel obedience through threat or actual use of force. While effective in the short term, it breeds resistance and requires constant vigilance.</p>

<h3>2. Cunning (Expert/Informational Power)</h3>
<p>Power derived from knowledge, strategy, and the ability to outmaneuver opponents. This is the power of the strategist who wins without fighting.</p>

<h3>3. Legitimacy (Legitimate/Referent Power)</h3>
<p>Authority granted through social structures, traditions, or genuine respect. The most sustainable form of power, as it requires minimal enforcement.</p>

<p><strong>Key Insight:</strong> The most effective leaders combine all three sources, knowing when to apply each. Machiavelli advised being both "the lion and the fox" - having the strength to intimidate and the cunning to detect traps.</p>`,
            xp_reward: 100,
            passing_score: 70,
            user_status: 'completed',
            user_score: 85,
            questions: [
              {
                id: 1,
                trial_id: 1,
                question_text: 'Which source of power is most sustainable over time?',
                question_type: 'multiple_choice',
                options: ['Force', 'Cunning', 'Legitimacy', 'All are equally sustainable'],
                correct_answer: 'Legitimacy',
                order_index: 1,
              },
              {
                id: 2,
                trial_id: 1,
                question_text: 'According to Machiavelli, effective leaders should be:',
                question_type: 'multiple_choice',
                options: [
                  'Only strong like the lion',
                  'Only cunning like the fox',
                  'Both strong like the lion and cunning like the fox',
                  'Neither - they should rely on legitimacy alone',
                ],
                correct_answer: 'Both strong like the lion and cunning like the fox',
                order_index: 2,
              },
              {
                id: 3,
                trial_id: 1,
                question_text: 'What is the main disadvantage of ruling through force alone?',
                question_type: 'multiple_choice',
                options: [
                  'It is too expensive',
                  'It breeds resistance and requires constant vigilance',
                  'It is morally wrong',
                  'It is ineffective in all situations',
                ],
                correct_answer: 'It breeds resistance and requires constant vigilance',
                order_index: 3,
              },
              {
                id: 4,
                trial_id: 1,
                question_text: 'Cunning as a source of power is best described as:',
                question_type: 'multiple_choice',
                options: [
                  'Physical strength',
                  'Traditional authority',
                  'Strategic knowledge and ability to outmaneuver',
                  'Charismatic leadership',
                ],
                correct_answer: 'Strategic knowledge and ability to outmaneuver',
                order_index: 4,
              },
              {
                id: 5,
                trial_id: 1,
                question_text: 'The power of legitimacy is effective because:',
                question_type: 'multiple_choice',
                options: [
                  'It requires force to maintain',
                  'It requires minimal enforcement as people accept it',
                  'It only works in democracies',
                  'It can never be challenged',
                ],
                correct_answer: 'It requires minimal enforcement as people accept it',
                order_index: 5,
              },
            ],
          },
          {
            id: 2,
            title: 'Types of Authority',
            unit_id: 1,
            order_index: 2,
            lesson_content: `<h2>Types of Authority</h2>
<p>Max Weber identified three pure types of authority that leaders can possess:</p>

<h3>1. Traditional Authority</h3>
<p>Based on customs, traditions, and the way things have "always been done." Examples include monarchies and tribal leadership.</p>

<h3>2. Charismatic Authority</h3>
<p>Based on the exceptional characteristics or qualities of the individual leader. Followers believe in the leader's vision and personality.</p>

<h3>3. Rational-Legal Authority</h3>
<p>Based on formal rules, laws, and procedures. Modern democracies and bureaucracies operate on this principle.</p>

<p><strong>Strategic Application:</strong> Understanding which type of authority you possess - or which your opponents wield - is crucial for maintaining or challenging power structures.</p>`,
            xp_reward: 100,
            passing_score: 70,
            user_status: 'current',
            questions: [
              {
                id: 6,
                trial_id: 2,
                question_text: 'Which type of authority is based on customs and traditions?',
                question_type: 'multiple_choice',
                options: ['Rational-Legal', 'Charismatic', 'Traditional', 'Democratic'],
                correct_answer: 'Traditional',
                order_index: 1,
              },
              {
                id: 7,
                trial_id: 2,
                question_text: 'Modern democracies primarily operate on which type of authority?',
                question_type: 'multiple_choice',
                options: ['Traditional', 'Charismatic', 'Rational-Legal', 'Mixed'],
                correct_answer: 'Rational-Legal',
                order_index: 2,
              },
              {
                id: 8,
                trial_id: 2,
                question_text: 'Charismatic authority is most dependent on:',
                question_type: 'multiple_choice',
                options: [
                  'Written laws and procedures',
                  'Historical precedent',
                  'The exceptional qualities of the leader',
                  'Democratic elections',
                ],
                correct_answer: 'The exceptional qualities of the leader',
                order_index: 3,
              },
            ],
          },
          {
            id: 3,
            title: 'The Nature of Influence',
            unit_id: 1,
            order_index: 3,
            lesson_content: '<h2>The Nature of Influence</h2><p>Coming soon...</p>',
            xp_reward: 100,
            passing_score: 70,
            user_status: 'locked',
            questions: [],
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
            title: 'Reading the Terrain',
            unit_id: 2,
            order_index: 1,
            lesson_content: '<h2>Reading the Terrain</h2><p>Coming soon...</p>',
            xp_reward: 100,
            passing_score: 70,
            user_status: 'locked',
            questions: [],
          },
          {
            id: 5,
            title: 'Anticipating Moves',
            unit_id: 2,
            order_index: 2,
            lesson_content: '<h2>Anticipating Moves</h2><p>Coming soon...</p>',
            xp_reward: 100,
            passing_score: 70,
            user_status: 'locked',
            questions: [],
          },
        ],
      },
    ],
  },
  {
    id: 2,
    title: 'Advanced Manipulation',
    description: 'Master the subtle arts of persuasion',
    order_index: 2,
    completed_trials: 0,
    total_trials: 3,
    units: [],
  },
];