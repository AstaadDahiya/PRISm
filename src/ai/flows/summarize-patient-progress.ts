'use server';

/**
 * @fileOverview Summarizes a patient's recent progress.
 *
 * - summarizePatientProgress - A function that generates a summary of patient progress.
 * - SummarizePatientProgressInput - The input type for the function.
 * - SummarizePatientProgressOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizePatientProgressInputSchema = z.object({
  patientName: z.string().describe("The patient's name."),
  healthData: z.string().describe("A summary of the patient's recent health data (e.g., steps, sleep, heart rate)."),
  tasks: z.string().describe("A list of the patient's assigned tasks and their completion status."),
});
export type SummarizePatientProgressInput = z.infer<typeof SummarizePatientProgressInputSchema>;

const SummarizePatientProgressOutputSchema = z.object({
  summary: z.string().describe("A concise, easy-to-read summary of the patient's progress, highlighting trends, adherence, and potential concerns."),
});
export type SummarizePatientProgressOutput = z.infer<typeof SummarizePatientProgressOutputSchema>;

export async function summarizePatientProgress(input: SummarizePatientProgressInput): Promise<SummarizePatientProgressOutput> {
  return summarizePatientProgressFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizePatientProgressPrompt',
  input: {schema: SummarizePatientProgressInputSchema},
  output: {schema: SummarizePatientProgressOutputSchema},
  prompt: `You are a clinical assistant AI. Your task is to provide a quick, easy-to-read summary of a patient's recent progress for a busy clinician.

Analyze the provided health data and task adherence for the patient, {{patientName}}.

Based on the data below, generate a concise summary (2-3 sentences). Highlight key trends (e.g., increasing activity, poor sleep), task adherence, and any potential areas of concern that the clinician should be aware of. Be objective and data-driven in your summary.

Patient Name: {{patientName}}

Health Data:
{{healthData}}

To-Do List:
{{tasks}}
`,
});

const summarizePatientProgressFlow = ai.defineFlow(
  {
    name: 'summarizePatientProgressFlow',
    inputSchema: SummarizePatientProgressInputSchema,
    outputSchema: SummarizePatientProgressOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
