

import type { Mentor, Rank } from '../types';

/* ======================================================
   Mentors
====================================================== */
export const MENTORS: Record<string, Mentor> = {
  machiavelli: {
    id: 'machiavelli',
    name: 'Niccolò Machiavelli',
    title: 'The Pragmatist',
    description:
      'Master of realpolitik and strategic cunning. Teaches that the ends justify the means and power must be understood without moral illusions.',
    quote: 'It is better to be feared than loved, if you cannot be both.',
    style: 'Direct, pragmatic, and unflinching in examining power dynamics',
    tone: 'Sharp, analytical, ruthlessly honest',
    focus: 'Strategic manipulation, maintaining power, understanding human nature',
    color: '#CD7F32',
    icon: '⚔️',
  },
  napoleon: {
    id: 'napoleon',
    name: 'Napoleon Bonaparte',
    title: 'The Commander',
    description:
      'Military genius and empire builder. Emphasizes decisive action, bold strategy, and the importance of seizing opportunity.',
    quote: 'Impossible is a word to be found only in the dictionary of fools.',
    style: 'Bold, action-oriented, emphasizing execution and momentum',
    tone: 'Commanding, confident, inspiring',
    focus: 'Leadership, strategic execution, seizing opportunities',
    color: '#4169E1',
    icon: '⚡',
  },
  aurelius: {
    id: 'aurelius',
    name: 'Marcus Aurelius',
    title: 'The Philosopher',
    description:
      'Stoic emperor and philosopher. Teaches self-mastery, virtue, and maintaining inner strength regardless of external circumstances.',
    quote:
      'You have power over your mind—not outside events. Realize this, and you will find strength.',
    style: 'Reflective, principled, focused on character development',
    tone: 'Calm, wise, introspective',
    focus: 'Self-discipline, virtue, inner strength, emotional regulation',
    color: '#708090',
    icon: '🏛️',
  },
};

/* ======================================================
   Rank System
====================================================== */
export const RANKS: Rank[] = [
  {
    name: 'Initiate',
    minXP: 0,
    maxXP: 499,
    icon: '🌱',
    description: 'Beginning your journey to power',
  },
  {
    name: 'Strategist',
    minXP: 500,
    maxXP: 1999,
    icon: '⚔️',
    description: 'Developing strategic thinking',
  },
  {
    name: 'Dominator',
    minXP: 2000,
    maxXP: 4999,
    icon: '👑',
    description: 'Mastering the art of influence',
  },
  {
    name: 'Emperor',
    minXP: 5000,
    maxXP: Infinity,
    icon: '⚡',
    description: 'Achieved supreme mastery',
  },
];

/* ======================================================
   Curriculum / Path Data (FIXED)
====================================================== */
export const CURRICULUM_DATA = [
  {
    id: 'foundation',
    title: 'Foundation of Power',
    description: 'Discipline, clarity, and control.',
    units: [
      {
        id: 'discipline',
        title: 'Discipline & Will',
        trials: [
          {
            id: 1,
            title: 'The First Oath',
            description: 'Commit to the path.',
            user_status: 'completed',
          },
          {
            id: 2,
            title: 'Discipline Over Motivation',
            description: 'Why consistency beats motivation.',
            user_status: 'current',
          },
        ],
      },
    ],
  },
  {
    id: 'strategy',
    title: 'Strategy & Influence',
    description: 'Learn how power truly works.',
    units: [
      {
        id: 'power',
        title: 'Understanding Power',
        trials: [
          {
            id: 3,
            title: 'Power Dynamics',
            description: 'How influence operates in reality.',
            user_status: 'locked',
          },
        ],
      },
    ],
  },
];

/* ======================================================
   XP System
====================================================== */
export const XP_PER_TRIAL = 100;
export const XP_PER_TASK = 20;
export const XP_PER_COUNCIL = 50;
export const TRIAL_PASSING_SCORE = 70;

/* ======================================================
   Council Settings
====================================================== */
export const COUNCIL = {
  DAILY_LIMIT: 1,
  MIN_DILEMMA_LENGTH: 10,
  MAX_DILEMMA_LENGTH: 2000,
};

/* ======================================================
   Colors
====================================================== */
export const COLORS = {
  imperial: {
    black: '#0A0A0A',
    darkGray: '#1A1A1A',
    gray: '#2A2A2A',
    lightGray: '#3A3A3A',
    gold: '#D4AF37',
    lightGold: '#E5C158',
    darkGold: '#B8941F',
    bronze: '#CD7F32',
    cream: '#F5F5DC',
  },
};

/* ======================================================
   Status Colors
====================================================== */
export const STATUS_COLORS = {
  trial: {
    locked: 'bg-imperial-gray text-imperial-cream opacity-50',
    current: 'bg-imperial-gold text-imperial-black',
    completed: 'bg-green-600 text-white',
  },
  task: {
    todo: 'bg-imperial-gold text-imperial-black',
    done: 'bg-green-600 text-white',
    skipped: 'bg-imperial-gray text-imperial-cream',
  },
};

/* ======================================================
   Messages
====================================================== */
export const ERROR_MESSAGES = {
  AUTH: {
    INVALID_CREDENTIALS: 'Invalid email or password',
    EMAIL_EXISTS: 'Email already registered',
    REQUIRED_FIELDS: 'Please fill in all fields',
    PASSWORD_MISMATCH: 'Passwords do not match',
    PASSWORD_LENGTH: 'Password must be at least 6 characters',
  },
  TRIAL: {
    NOT_FOUND: 'Trial not found',
    LOCKED: 'Complete the previous trial first',
    ANSWER_ALL: 'Please answer all questions',
  },
  TASK: {
    TITLE_REQUIRED: 'Task title is required',
    NOT_FOUND: 'Task not found',
  },
  COUNCIL: {
    DAILY_LIMIT: 'Council can only be summoned once per day',
    DILEMMA_REQUIRED: 'Please describe your dilemma',
    DILEMMA_TOO_SHORT: 'Dilemma is too short',
  },
};

export const SUCCESS_MESSAGES = {
  AUTH: {
    LOGIN: 'Welcome back!',
    REGISTER: 'Account created successfully!',
    LOGOUT: 'Logged out successfully',
  },
  TRIAL: {
    COMPLETED: 'Trial completed!',
  },
  TASK: {
    CREATED: 'Task created!',
    COMPLETED: 'Task completed!',
    DELETED: 'Task deleted',
  },
  COUNCIL: {
    SUMMONED: 'The council has spoken!',
  },
};

/* ======================================================
   Routes
====================================================== */
export const ROUTES = {
  HOME: '/',
  LOGIN: '/auth/login',
  SIGNUP: '/auth/signup',
  SELECTION_HALL: '/selection-hall',
  HALL: '/hall',
  PATH: '/path',
  TRIAL: (id: number) => `/trial/${id}`,
  TASKS: '/tasks',
  COUNCIL: '/council',
  JOURNAL: '/journal',
  PROFILE: '/profile',
};

/* ======================================================
   Validation & Storage
====================================================== */
export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_MIN_LENGTH: 6,
};

export const STORAGE_KEYS = {
  TOKEN: 'imperium_token',
  USER: 'imperium_user',
  TASKS: 'imperium_tasks',
  TRIAL_PROGRESS: 'imperium_trial_progress',
};

/* ======================================================
   Feature Flags
====================================================== */
export const FEATURES = {
  ENABLE_TASKS: true,
  ENABLE_COUNCIL: true,
  ENABLE_JOURNAL: true,
};
