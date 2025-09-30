'use server';

/**
 * @fileOverview A flow to provide a simpler explanation of a given concept.
 *
 * - summarizeCard - A function that takes a definition and simplifies it for a beginner level understanding.
 * - SummarizeCardInput - The input type for the summarizeCard function.
 * - SummarizeCardOutput - The return type for the summarizeCard function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeCardInputSchema = z.object({
  definition: z.string().describe('The original definition to be simplified.'),
});
export type SummarizeCardInput = z.infer<typeof SummarizeCardInputSchema>;

const SummarizeCardOutputSchema = z.object({
  simplifiedExplanation: z
    .string()
    .describe('A simplified explanation of the concept.'),
});
export type SummarizeCardOutput = z.infer<typeof SummarizeCardOutputSchema>;

export async function summarizeCard(input: SummarizeCardInput): Promise<SummarizeCardOutput> {
  return summarizeCardFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeCardPrompt',
  input: {schema: SummarizeCardInputSchema},
  output: {schema: SummarizeCardOutputSchema},
  prompt: `Re-write the following definition in simpler terms suitable for a beginner, using a short real-world analogy and keeping the explanation under 60 words:\n\n"{{{definition}}}"`,
});

const summarizeCardFlow = ai.defineFlow(
  {
    name: 'summarizeCardFlow',
    inputSchema: SummarizeCardInputSchema,
    outputSchema: SummarizeCardOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
