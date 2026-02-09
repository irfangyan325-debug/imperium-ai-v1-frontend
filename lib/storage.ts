import { TASKS_DATA, JOURNAL_DATA, COUNCIL_CASES, CURRICULUM_DATA, generateMockToken } from './staticData';
import { STORAGE_KEYS } from '../utils/constants';
import type { User, Task, JournalEntry, CouncilCase, Trial } from '../types';

// User Management
export const getStoredUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  const userData = localStorage.getItem(STORAGE_KEYS.USER);
  return userData ? JSON.parse(userData) : null;
};

export const setStoredUser = (user: User): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
};

export const getStoredToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(STORAGE_KEYS.TOKEN);
};

export const setStoredToken = (token: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.TOKEN, token);
};

export const clearAuth = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEYS.TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER);
};

// Tasks Management
export const getStoredTasks = (): Task[] => {
  if (typeof window === 'undefined') return TASKS_DATA;
  const tasksData = localStorage.getItem(STORAGE_KEYS.TASKS);
  return tasksData ? JSON.parse(tasksData) : TASKS_DATA;
};

export const setStoredTasks = (tasks: Task[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
};

export const addTask = (task: Omit<Task, 'id' | 'created_at' | 'updated_at'>): Task => {
  const tasks = getStoredTasks();
  const newTask: Task = {
    ...task,
    id: Math.max(0, ...tasks.map(t => t.id)) + 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  tasks.push(newTask);
  setStoredTasks(tasks);
  return newTask;
};

export const updateTask = (taskId: number, updates: Partial<Task>): Task | null => {
  const tasks = getStoredTasks();
  const index = tasks.findIndex(t => t.id === taskId);
  if (index === -1) return null;
  
  tasks[index] = {
    ...tasks[index],
    ...updates,
    updated_at: new Date().toISOString(),
  };
  setStoredTasks(tasks);
  return tasks[index];
};

export const deleteTask = (taskId: number): boolean => {
  const tasks = getStoredTasks();
  const filtered = tasks.filter(t => t.id !== taskId);
  if (filtered.length === tasks.length) return false;
  setStoredTasks(filtered);
  return true;
};

// Journal Management
export const getStoredJournal = (): JournalEntry[] => {
  if (typeof window === 'undefined') return JOURNAL_DATA;
  const journalData = localStorage.getItem(STORAGE_KEYS.JOURNAL);
  return journalData ? JSON.parse(journalData) : JOURNAL_DATA;
};

export const setStoredJournal = (entries: JournalEntry[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.JOURNAL, JSON.stringify(entries));
};

export const addJournalEntry = (entry: Omit<JournalEntry, 'id' | 'user_id' | 'created_at' | 'updated_at'>): JournalEntry => {
  const entries = getStoredJournal();
  const user = getStoredUser();
  const newEntry: JournalEntry = {
    ...entry,
    id: Math.max(0, ...entries.map(e => e.id)) + 1,
    user_id: user?.id || 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  entries.unshift(newEntry);
  setStoredJournal(entries);
  return newEntry;
};

export const deleteJournalEntry = (entryId: number): boolean => {
  const entries = getStoredJournal();
  const filtered = entries.filter(e => e.id !== entryId);
  if (filtered.length === entries.length) return false;
  setStoredJournal(filtered);
  return true;
};

// Council Cases Management
export const getStoredCouncilCases = (): CouncilCase[] => {
  if (typeof window === 'undefined') return COUNCIL_CASES;
  const casesData = localStorage.getItem(STORAGE_KEYS.COUNCIL_CASES);
  return casesData ? JSON.parse(casesData) : COUNCIL_CASES;
};

export const setStoredCouncilCases = (cases: CouncilCase[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.COUNCIL_CASES, JSON.stringify(cases));
};

export const canSummonCouncil = (): boolean => {
  if (typeof window === 'undefined') return true;
  const lastSummon = localStorage.getItem(STORAGE_KEYS.LAST_COUNCIL_SUMMON);
  if (!lastSummon) return true;
  
  const lastDate = new Date(lastSummon);
  const today = new Date();
  return lastDate.toDateString() !== today.toDateString();
};

export const recordCouncilSummon = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.LAST_COUNCIL_SUMMON, new Date().toISOString());
};

// Trial Progress Management
export const getTrialProgress = (): Record<number, { status: string; score?: number }> => {
  if (typeof window === 'undefined') return {};
  const progressData = localStorage.getItem(STORAGE_KEYS.TRIAL_PROGRESS);
  return progressData ? JSON.parse(progressData) : {};
};

export const setTrialProgress = (trialId: number, status: string, score?: number): void => {
  if (typeof window === 'undefined') return;
  const progress = getTrialProgress();
  progress[trialId] = { status, score };
  localStorage.setItem(STORAGE_KEYS.TRIAL_PROGRESS, JSON.stringify(progress));
};

export const updateUserXP = (xpToAdd: number): void => {
  const user = getStoredUser();
  if (!user) return;
  
  const newXP = user.influence_xp + xpToAdd;
  let newRank = user.current_rank;
  
  // Update rank based on XP
  if (newXP >= 5000) newRank = 'Emperor';
  else if (newXP >= 2000) newRank = 'Dominator';
  else if (newXP >= 500) newRank = 'Strategist';
  else newRank = 'Initiate';
  
  const updatedUser = {
    ...user,
    influence_xp: newXP,
    current_rank: newRank,
  };
  
  setStoredUser(updatedUser);
};

export const updateUserStreak = (): void => {
  const user = getStoredUser();
  if (!user) return;
  
  const today = new Date().toISOString().split('T')[0];
  const lastActivity = user.last_activity_date;
  
  if (lastActivity === today) return; // Already updated today
  
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  const newStreak = lastActivity === yesterday ? user.streak_days + 1 : 1;
  
  const updatedUser = {
    ...user,
    streak_days: newStreak,
    last_activity_date: today,
  };
  
  setStoredUser(updatedUser);
};

// Initialize default data if not exists
export const initializeStorage = (): void => {
  if (typeof window === 'undefined') return;
  
  if (!localStorage.getItem(STORAGE_KEYS.TASKS)) {
    setStoredTasks(TASKS_DATA);
  }
  if (!localStorage.getItem(STORAGE_KEYS.JOURNAL)) {
    setStoredJournal(JOURNAL_DATA);
  }
  if (!localStorage.getItem(STORAGE_KEYS.COUNCIL_CASES)) {
    setStoredCouncilCases(COUNCIL_CASES);
  }
};