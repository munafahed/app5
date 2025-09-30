'use server';

import { addCorrectAnswer, addWrongAnswer, getUserProgress, updateStreak, initializeUserProgress } from '@/lib/firestore';

export async function handleCorrectAnswer(userId: string, questionId: string) {
  try {
    const progress = await addCorrectAnswer(userId, questionId);
    return { success: true, progress };
  } catch (error) {
    console.error('Error handling correct answer:', error);
    return { success: false, error: 'Failed to update progress' };
  }
}

export async function handleWrongAnswer(userId: string, questionId: string) {
  try {
    const progress = await addWrongAnswer(userId, questionId);
    return { success: true, progress };
  } catch (error) {
    console.error('Error handling wrong answer:', error);
    return { success: false, error: 'Failed to update progress' };
  }
}

export async function getOrInitializeProgress(userId: string) {
  try {
    let progress = await getUserProgress(userId);
    
    if (!progress) {
      progress = await initializeUserProgress(userId);
    }
    
    await updateStreak(userId);
    progress = await getUserProgress(userId);
    
    return { success: true, progress };
  } catch (error) {
    console.error('Error getting/initializing progress:', error);
    return { success: false, error: 'Failed to load progress' };
  }
}
