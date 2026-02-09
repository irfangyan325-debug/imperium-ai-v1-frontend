// User Types
export interface User {
  id: number;
  email: string;
  primary_mentor?: 'machiavelli' | 'napoleon' | 'aurelius';
  current_rank: 'Initiate' | 'Strategist' | 'Dominator' | 'Emperor';
  influence_xp: number;
  streak_days: number;
  subscription_status: 'free' | 'paid';
  timezone?: string;
  last_activity_date: string;
  created_at: string;
  updated_at?: string;
}

export interface UserStats {
  trials_completed: number;
  tasks_completed: number;
  streak_days: number;
  influence_xp: number;
  current_rank: string;
}

// Curriculum Types
export interface Module {
  id: number;
  title: string;
  description: string;
  order_index: number;
  completed_trials?: number;
  total_trials?: number;
  units?: Unit[];
}

export interface Unit {
  id: number;
  title: string;
  description: string;
  order_index: number;
  module_id: number;
  trials?: Trial[];
}

export interface Trial {
  id: number;
  title: string;
  unit_id?: number;            // optional to allow partial trial objects
  order_index?: number;        // optional
  lesson_content?: string;     // optional
  xp_reward?: number;          // optional
  passing_score?: number;      // optional
  questions?: Question[];
  user_status?: 'locked' | 'current' | 'completed';
  user_score?: number;
}

export interface Question {
  id: number;
  trial_id?: number;           // optional
  question_text: string;
  question_type: 'multiple_choice' | 'short_answer';
  options?: string[];
  correct_answer: string;
  order_index?: number;        // optional
}

// Task Types
export type TaskStatus = 'todo' | 'done' | 'skipped';

export interface Task {
  id: number;
  user_id: number;
  title: string;
  description?: string;
  source_type: 'trial' | 'council' | 'manual';
  source_name?: string;
  status: TaskStatus;
  due_date?: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

// Council Types
export interface CouncilCase {
  id: number;
  user_id: number;
  dilemma_text: string;
  mentor_views: {
    machiavelli: string;
    napoleon: string;
    aurelius: string;
  };
  verdict: string;
  verdict_tasks?: string[];
  created_at: string;
  updated_at: string;
}

// Journal Types
export type JournalEntryType = 'mentor_feedback' | 'council_verdict' | 'saved_insight';

export interface JournalEntry {
  id: number;
  user_id: number;
  entry_type: JournalEntryType;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

// Mentor Types
export interface Mentor {
  id: string;
  name: string;
  title: string;
  description: string;
  quote: string;
  style: string;
  tone: string;
  focus: string;
  color: string;
  icon: string;
}

// Rank Types
export interface Rank {
  name: string;
  minXP: number;
  maxXP: number;
  icon: string;
  description: string;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: any[];
}
