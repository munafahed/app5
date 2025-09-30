import { config } from 'dotenv';
config();

import '@/ai/flows/generate-daily-card.ts';
import '@/ai/flows/adjust-card-difficulty.ts';
import '@/ai/flows/summarize-card.ts';