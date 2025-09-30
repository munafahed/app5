'use server';

/**
 * @fileOverview This file defines the Genkit flow for generating a daily learning card.
 *
 * It includes:
 * - `generateDailyCard`: A function to generate a daily learning card based on user preferences.
 * - `GenerateDailyCardInput`: The input type for the generateDailyCard function.
 * - `GenerateDailyCardOutput`: The output type for the generateDailyCard function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateDailyCardInputSchema = z.object({
  track: z.string().describe('The specialization track (e.g., cybersecurity, networks).'),
  level: z
    .enum(['beginner', 'intermediate', 'advanced'])
    .describe('The user level of expertise.'),
  locale: z.enum(['ar', 'en']).describe('The language of the card (ar for Arabic, en for English).'),
});

export type GenerateDailyCardInput = z.infer<typeof GenerateDailyCardInputSchema>;

const GenerateDailyCardOutputSchema = z.object({
  title: z.string().describe('The title of the daily card.'),
  term: z.string().describe('The key term or concept for the day.'),
  definition: z.string().describe('A simplified definition of the term.'),
  example: z.string().describe('A practical example of the term in use.'),
  why: z.string().describe('The importance or relevance of the term.'),
  quiz: z.object({
    type: z.enum(['mcq', 'tf']).describe('The type of quiz question (mcq or tf).'),
    question: z.string().describe('The quiz question.'),
    options: z.string().array().describe('The quiz options (2-4 options).'),
    answerIndex: z.number().describe('The index of the correct answer.'),
  }),
  track: z.string().describe('The specialization track of the card.'),
  level: z
    .enum(['beginner', 'intermediate', 'advanced'])
    .describe('The level of expertise the card is designed for.'),
  locale: z.enum(['ar', 'en']).describe('The language of the card.'),
  tags: z.string().array().describe('Relevant tags for the card content.'),
});

export type GenerateDailyCardOutput = z.infer<typeof GenerateDailyCardOutputSchema>;

export async function generateDailyCard(
  input: GenerateDailyCardInput
): Promise<GenerateDailyCardOutput> {
  return generateDailyCardFlow(input);
}

const generateDailyCardPromptArabic = ai.definePrompt({
  name: 'generateDailyCardPromptArabic',
  input: {schema: GenerateDailyCardInputSchema},
  output: {schema: GenerateDailyCardOutputSchema},
  prompt: `You are a micro-learning content writer.
Generate a daily knowledge card in Arabic with these fields:
- track: {{track}}
- level: {{level}}
- total length ≤ 120 words.
- fields: title (≤ 40 chars), term, definition, example, why, quiz { type (mcq|tf), question, options (2..4), answerIndex }
- All text fields (title, term, definition, example, why, quiz.question, quiz.options) must be in Arabic.

Output *valid JSON only* without any additional text.`,
});

const generateDailyCardPromptEnglish = ai.definePrompt({
  name: 'generateDailyCardPromptEnglish',
  input: {schema: GenerateDailyCardInputSchema},
  output: {schema: GenerateDailyCardOutputSchema},
  prompt: `You are a micro-learning content writer.
Generate a daily knowledge card in English with these fields:
- track: {{track}}
- level: {{level}}
- total length ≤ 120 words.
- fields: title (≤ 40 chars), term, definition, example, why, quiz { type (mcq|tf), question, options (2..4), answerIndex }

Output *valid JSON only* without any additional text.`,
});


const generateDailyCardFlow = ai.defineFlow(
  {
    name: 'generateDailyCardFlow',
    inputSchema: GenerateDailyCardInputSchema,
    outputSchema: GenerateDailyCardOutputSchema,
  },
  async input => {
    const prompt = input.locale === 'ar' ? generateDailyCardPromptArabic : generateDailyCardPromptEnglish;
    const {output} = await prompt(input);
    return output!;
  }
);
