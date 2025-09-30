
'use server';

/**
 * @fileOverview This file defines a Genkit flow for adjusting the difficulty of daily learning cards based on user performance.
 *
 * - adjustCardDifficulty - A function that adjusts the difficulty of the card based on user performance.
 * - AdjustCardDifficultyInput - The input type for the adjustCardDifficulty function.
 * - AdjustCardDifficultyOutput - The return type for the adjustCardDifficulty function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AdjustCardDifficultyInputSchema = z.object({
  definition: z.string().describe('The current definition of the term.'),
  targetLevel: z
    .enum(['beginner', 'intermediate', 'advanced'])
    .describe('The target difficulty level to adjust the definition to.'),
});
export type AdjustCardDifficultyInput = z.infer<typeof AdjustCardDifficultyInputSchema>;

const AdjustCardDifficultyOutputSchema = z.object({
  adjustedDefinition: z
    .string()
    .describe('The adjusted definition of the term for the target level.'),
});
export type AdjustCardDifficultyOutput = z.infer<typeof AdjustCardDifficultyOutputSchema>;

export async function adjustCardDifficulty(input: AdjustCardDifficultyInput): Promise<AdjustCardDifficultyOutput> {
  return adjustCardDifficultyFlow(input);
}

const adjustCardDifficultyPrompt = ai.definePrompt({
  name: 'adjustCardDifficultyPrompt',
  input: {schema: AdjustCardDifficultyInputSchema},
  output: {schema: AdjustCardDifficultyOutputSchema},
  prompt: `Transform the following text to match the {{targetLevel}} level, adding two new technical terms if necessary:\n\n"{{definition}}"`,
});

const adjustCardDifficultyFlow = ai.defineFlow(
  {
    name: 'adjustCardDifficultyFlow',
    inputSchema: AdjustCardDifficultyInputSchema,
    outputSchema: AdjustCardDifficultyOutputSchema,
  },
  async input => {
    const {output} = await adjustCardDifficultyPrompt(input);
    return output!;
  }
);
