import { clsx, type ClassValue } from 'clsx';
import { RANKS, STATUS_COLORS } from './constants';
import type { Rank } from '../types';

// Utility for merging Tailwind classes
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

// Date Formatting
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  // Less than a minute
  if (diffInSeconds < 60) {
    return 'just now';
  }

  // Less than an hour
  if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
  }

  // Less than a day
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  }

  // Less than a week
  if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} ${days === 1 ? 'day' : 'days'} ago`;
  }

  // Format as date
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  });
}

export function formatRelativeTime(dateString: string): string {
  return formatDate(dateString);
}

// Number Formatting
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
}

// Text Utilities
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

// Rank and XP
export function getRankFromXP(xp: number): Rank {
  for (let i = RANKS.length - 1; i >= 0; i--) {
    if (xp >= RANKS[i].minXP) {
      return RANKS[i];
    }
  }
  return RANKS[0];
}

export function calculateXPProgress(currentXP: number): {
  progress: number;
  remaining: number;
  nextRank: Rank | null;
} {
  const currentRank = getRankFromXP(currentXP);
  const currentRankIndex = RANKS.findIndex(r => r.name === currentRank.name);
  
  if (currentRankIndex === RANKS.length - 1) {
    // Already at max rank
    return {
      progress: 100,
      remaining: 0,
      nextRank: null,
    };
  }

  const nextRank = RANKS[currentRankIndex + 1];
  const xpInCurrentRank = currentXP - currentRank.minXP;
  const xpNeededForNextRank = nextRank.minXP - currentRank.minXP;
  const progress = Math.round((xpInCurrentRank / xpNeededForNextRank) * 100);
  const remaining = nextRank.minXP - currentXP;

  return {
    progress,
    remaining,
    nextRank,
  };
}

// Status Colors
export function getTrialStatusColor(status: string): string {
  return STATUS_COLORS.trial[status as keyof typeof STATUS_COLORS.trial] || STATUS_COLORS.trial.locked;
}

export function getTaskStatusColor(status: string): string {
  return STATUS_COLORS.task[status as keyof typeof STATUS_COLORS.task] || STATUS_COLORS.task.todo;
}

// Validation
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 6) {
    errors.push('Password must be at least 6 characters');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// Error Handling
export function getErrorMessage(error: any): string {
  if (typeof error === 'string') return error;
  if (error?.response?.data?.message) return error.response.data.message;
  if (error?.message) return error.message;
  return 'An unexpected error occurred';
}

// Streak Calculation
export function formatStreak(days: number): string {
  if (days === 0) return 'Start your streak!';
  if (days === 1) return '1 day streak 🔥';
  return `${days} day streak 🔥`;
}

// Mentor Color
export function getMentorColor(mentorId: string): string {
  const colors: Record<string, string> = {
    machiavelli: '#CD7F32',
    napoleon: '#4169E1',
    aurelius: '#708090',
  };
  return colors[mentorId] || '#D4AF37';
}

// Score Formatting
export function formatScore(score: number): string {
  return `${score}%`;
}

export function isQuizPassed(score: number, passingScore: number = 70): boolean {
  return score >= passingScore;
}

// Array Utilities
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Local Storage Helpers
export function safeLocalStorage() {
  if (typeof window === 'undefined') {
    return {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
    };
  }
  return localStorage;
}

// Time Utilities
export function isToday(dateString: string): boolean {
  const date = new Date(dateString);
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

export function isYesterday(dateString: string): boolean {
  const date = new Date(dateString);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return (
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear()
  );
}

// Debounce
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Sleep utility for delays
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}