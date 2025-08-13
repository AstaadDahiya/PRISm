'use server';

/**
 * @fileOverview Extracts actionable tasks from a conversation transcript.
 *
 * - extractTasks - A function that extracts tasks from the conversation.
 * - ExtractTasksInput - The input type for the extractTasks function.
 * - ExtractTasksOutput - The return type for the extractTasks function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractTasksInputSchema = z.object({
  conversationTranscript: z
    .string()
    .describe('The transcript of the conversation with the clinician.'),
});
export type ExtractTasksInput = z.infer<typeof ExtractTasksInputSchema>;

const ExtractTasksOutputSchema = z.object({
  tasks: z
    .array(z.string())
    .describe('The actionable tasks extracted from the conversation.'),
});
export type ExtractTasksOutput = z.infer<typeof ExtractTasksOutputSchema>;

export async function extractTasks(input: ExtractTasksInput): Promise<ExtractTasksOutput> {
  return extractTasksFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractTasksPrompt',
  input: {schema: ExtractTasksInputSchema},
  output: {schema: ExtractTasksOutputSchema},
  prompt: `You are an AI assistant that extracts actionable tasks from a conversation transcript.

  Given the following conversation transcript, identify all actionable tasks for the patient.
  Return a list of tasks.

  Conversation Transcript:
  {{conversationTranscript}}`,
});

const extractTasksFlow = ai.defineFlow(
  {
    name: 'extractTasksFlow',
    inputSchema: ExtractTasksInputSchema,
    outputSchema: ExtractTasksOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
