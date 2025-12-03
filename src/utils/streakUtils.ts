export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastStudyDate: string | null;
  totalStudyDays: number;
}

export const calculateStreak = (lastStudyDate: string | null): number => {
  if (!lastStudyDate) return 0;
  
  const lastDate = new Date(lastStudyDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  lastDate.setHours(0, 0, 0, 0);
  
  const diffTime = today.getTime() - lastDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  // If last study was today, streak continues
  if (diffDays === 0) return 1;
  // If last study was yesterday, streak continues
  if (diffDays === 1) return 1;
  // Otherwise streak is broken
  return 0;
};

export const updateStreak = (streakData: StreakData): StreakData => {
  const today = new Date().toISOString().split('T')[0];
  const lastStudyDate = streakData.lastStudyDate;
  
  // Check if already studied today
  if (lastStudyDate === today) {
    return streakData;
  }
  
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];
  
  let newStreak = streakData.currentStreak;
  
  // If last study was yesterday, increment streak
  if (lastStudyDate === yesterdayStr) {
    newStreak = streakData.currentStreak + 1;
  } else if (lastStudyDate === today) {
    // Already studied today, keep streak
    newStreak = streakData.currentStreak;
  } else {
    // Streak broken, reset to 1
    newStreak = 1;
  }
  
  return {
    currentStreak: newStreak,
    longestStreak: Math.max(newStreak, streakData.longestStreak),
    lastStudyDate: today,
    totalStudyDays: streakData.totalStudyDays + (lastStudyDate !== today ? 1 : 0),
  };
};

export const getInitialStreakData = (): StreakData => ({
  currentStreak: 0,
  longestStreak: 0,
  lastStudyDate: null,
  totalStudyDays: 0,
});

