export const MAX_HEARTS = 5;
export const XP_REWARD = 10;
export const XP_PER_LEVEL = 100;

export function calculateXPForNextLevel(currentXP: number): { 
  current: number; 
  needed: number; 
  percentage: number;
} {
  const currentLevelXP = currentXP % XP_PER_LEVEL;
  const percentage = (currentLevelXP / XP_PER_LEVEL) * 100;
  
  return {
    current: currentLevelXP,
    needed: XP_PER_LEVEL,
    percentage,
  };
}
