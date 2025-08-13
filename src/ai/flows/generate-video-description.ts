'use server';

/**
 * @fileOverview Generates a symbolic video summary of a patient's status.
 *
 * - generateVideoDescription - A function that handles the video generation process.
 * - GenerateVideoDescriptionInput - The input type for the function.
 * - GenerateVideoDescriptionOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateVideoDescriptionInputSchema = z.object({
    patientName: z.string().describe("The patient's name."),
    patientStatus: z.enum(['At Risk', 'On Track', 'Discharged']).describe("The patient's current status."),
    riskScore: z.number().describe("The patient's current risk score."),
});
export type GenerateVideoDescriptionInput = z.infer<typeof GenerateVideoDescriptionInputSchema>;


const GenerateVideoDescriptionOutputSchema = z.object({
  description: z.string().describe("A text description of a symbolic video."),
});
export type GenerateVideoDescriptionOutput = z.infer<typeof GenerateVideoDescriptionOutputSchema>;


export async function generateVideoDescription(input: GenerateVideoDescriptionInput): Promise<GenerateVideoDescriptionOutput> {
  return generateVideoDescriptionFlow(input);
}


const generateVideoDescriptionFlow = ai.defineFlow(
  {
    name: 'generateVideoDescriptionFlow',
    inputSchema: GenerateVideoDescriptionInputSchema,
    outputSchema: GenerateVideoDescriptionOutputSchema,
  },
  async (input) => {
    let promptText = `Generate a short, one-sentence description of a symbolic video representing the status of a patient named ${input.patientName}. `;
    
    switch (input.patientStatus) {
        case 'At Risk':
            promptText += `The patient is at high risk (score: ${input.riskScore}). The video should be a cinematic, moody scene like a stormy sea, a turbulent sky, or a lone tree in a strong wind to visually represent this risk.`;
            break;
        case 'On Track':
            promptText += `The patient is on track with their recovery (risk score: ${input.riskScore}). The video should be a calm and positive scene, like a peaceful sunrise over a meadow, a gentle flowing stream, or a time-lapse of a flower blooming.`;
            break;
        case 'Discharged':
             promptText += `The patient has been discharged. The video should be a hopeful and forward-looking scene, such as a person walking down a sunny path, birds flying into a clear sky, or a boat sailing towards the horizon.`;
            break;
    }

    const { output } = await ai.generate({
      prompt: promptText,
      output: {
          schema: GenerateVideoDescriptionOutputSchema,
      }
    });
    
    return output!;
  }
);
