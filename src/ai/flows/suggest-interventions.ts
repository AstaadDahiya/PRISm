'use server';

/**
 * @fileOverview Suggests clinical interventions based on patient data.
 *
 * - suggestInterventions - A function that suggests interventions based on patient data.
 * - SuggestInterventionsInput - The input type for the suggestInterventions function.
 * - SuggestInterventionsOutput - The return type for the suggestInterventions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestInterventionsInputSchema = z.object({
  patientData: z.string().describe('A summary of the patient\'s data, including demographics, risk score, and key health metrics.'),
});
export type SuggestInterventionsInput = z.infer<typeof SuggestInterventionsInputSchema>;

const InterventionSchema = z.object({
    title: z.string().describe("The concise title of the recommended intervention."),
    description: z.string().describe("A brief (1-2 sentence) description of the intervention and its purpose."),
    category: z.enum(['Medication', 'Lifestyle', 'Appointment', 'Monitoring']).describe("The category of the intervention."),
});

const SuggestInterventionsOutputSchema = z.object({
  interventions: z
    .array(InterventionSchema)
    .describe('A list of recommended clinical interventions.'),
});
export type SuggestInterventionsOutput = z.infer<typeof SuggestInterventionsOutputSchema>;

export async function suggestInterventions(input: SuggestInterventionsInput): Promise<SuggestInterventionsOutput> {
  return suggestInterventionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestInterventionsPrompt',
  input: {schema: SuggestInterventionsInputSchema},
  output: {schema: SuggestInterventionsOutputSchema},
  prompt: `You are an expert clinical decision support system. Your role is to recommend relevant interventions for a patient based on their current health profile.

Analyze the following patient data and suggest 3-4 appropriate interventions. For each intervention, provide a title, a brief description, and categorize it.

Patient Data:
{{{patientData}}}

Generate a list of targeted interventions based on this data.`,
});

const suggestInterventionsFlow = ai.defineFlow(
  {
    name: 'suggestInterventionsFlow',
    inputSchema: SuggestInterventionsInputSchema,
    outputSchema: SuggestInterventionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
