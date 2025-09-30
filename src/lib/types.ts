import type { GenerateDailyCardOutput } from '@/ai/flows/generate-daily-card';

export type DailyCard = GenerateDailyCardOutput;

export const tracks = [
  'Cybersecurity',
  'Networks',
  'Cloud & DevOps',
  'AI & ML',
  'Software Engineering',
  'Marketing',
] as const;
export type Track = (typeof tracks)[number];

export const levels = ['Beginner', 'Intermediate', 'Advanced'] as const;
export type Level = (typeof levels)[number];
