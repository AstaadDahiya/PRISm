'use server';

/**
 * @fileOverview A patient risk score generation AI agent.
 *
 * - generateRiskScore - A function that handles the risk score generation process.
 * - GenerateRiskScoreInput - The input type for the generateRiskScore function.
 * - GenerateRiskScoreOutput - The return type for the generateRiskScore function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateRiskScoreInputSchema = z.object({
  patientData: z.string().describe('The patient data, including EHR information, wearable data and patient history.'),
});
export type GenerateRiskScoreInput = z.infer<typeof GenerateRiskScoreInputSchema>;

const GenerateRiskScoreOutputSchema = z.object({
  riskScore: z.number().describe('The risk score of the patient, from 0 to 100.'),
  riskFactors: z.string().describe('The risk factors contributing to the risk score.'),
});
export type GenerateRiskScoreOutput = z.infer<typeof GenerateRiskScoreOutputSchema>;

export async function generateRiskScore(input: GenerateRiskScoreInput): Promise<GenerateRiskScoreOutput> {
  return generateRiskScoreFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateRiskScorePrompt',
  input: {schema: GenerateRiskScoreInputSchema},
  output: {schema: GenerateRiskScoreOutputSchema},
  prompt: `You are an expert healthcare analyst specializing in patient readmission risk assessment.

You will use the patient data to generate a risk score from 0 to 100, and identify the risk factors contributing to the score.

Patient Data: {{{patientData}}}

Based on the data above, generate a risk score and identify the risk factors.`,
});

const generateRiskScoreFlow = ai.defineFlow(
  {
    name: 'generateRiskScoreFlow',
    inputSchema: GenerateRiskScoreInputSchema,
    outputSchema: GenerateRiskScoreOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
