'use server';

/**
 * @fileOverview Generates a symbolic video summary of a patient's status.
 *
 * - generateVideoSummary - A function that handles the video generation process.
 * - GenerateVideoSummaryInput - The input type for the function.
 * - GenerateVideoSummaryOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

const GenerateVideoSummaryInputSchema = z.object({
    patientName: z.string().describe("The patient's name."),
    patientStatus: z.enum(['At Risk', 'On Track', 'Discharged']).describe("The patient's current status."),
    riskScore: z.number().describe("The patient's current risk score."),
});
export type GenerateVideoSummaryInput = z.infer<typeof GenerateVideoSummaryInputSchema>;


const GenerateVideoSummaryOutputSchema = z.object({
  videoUrl: z.string().describe("A data URI of the generated video in mp4 format."),
});
export type GenerateVideoSummaryOutput = z.infer<typeof GenerateVideoSummaryOutputSchema>;


export async function generateVideoSummary(input: GenerateVideoSummaryInput): Promise<GenerateVideoSummaryOutput> {
  return generateVideoSummaryFlow(input);
}


const generateVideoSummaryFlow = ai.defineFlow(
  {
    name: 'generateVideoSummaryFlow',
    inputSchema: GenerateVideoSummaryInputSchema,
    outputSchema: GenerateVideoSummaryOutputSchema,
  },
  async (input) => {
    let promptText = `Generate a short, 5-second, symbolic video representing the status of a patient named ${input.patientName}. `;
    
    switch (input.patientStatus) {
        case 'At Risk':
            promptText += `The patient is at high risk (score: ${input.riskScore}). Create a cinematic, moody scene like a stormy sea, a turbulent sky, or a lone tree in a strong wind to visually represent this risk.`;
            break;
        case 'On Track':
            promptText += `The patient is on track with their recovery (risk score: ${input.riskScore}). Create a calm and positive scene, like a peaceful sunrise over a meadow, a gentle flowing stream, or a time-lapse of a flower blooming.`;
            break;
        case 'Discharged':
             promptText += `The patient has been discharged. Create a hopeful and forward-looking scene, such as a person walking down a sunny path, birds flying into a clear sky, or a boat sailing towards the horizon.`;
            break;
    }

    let { operation } = await ai.generate({
      model: googleAI.model('veo-2.0-generate-001'),
      prompt: promptText,
      config: {
        durationSeconds: 5,
        aspectRatio: '16:9',
      },
    });

    if (!operation) {
      throw new Error('Expected the model to return an operation');
    }

    // Wait until the operation completes.
    while (!operation.done) {
      operation = await ai.checkOperation(operation);
      // Sleep for 5 seconds before checking again.
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }

    if (operation.error) {
      throw new Error('failed to generate video: ' + operation.error.message);
    }
    
    const videoPart = operation.output?.message?.content.find((p) => !!p.media);
    if (!videoPart || !videoPart.media?.url) {
      throw new Error('Failed to find the generated video in the response.');
    }
    
    // The URL from Veo is temporary, so we need to download it and convert to a data URI.
    const fetch = (await import('node-fetch')).default;
    const videoDownloadResponse = await fetch(
       `${videoPart.media.url}&key=${process.env.GEMINI_API_KEY}`
    );
     if (!videoDownloadResponse.ok || !videoDownloadResponse.body) {
        throw new Error(`Failed to download video: ${videoDownloadResponse.statusText}`);
    }
    
    const buffer = await videoDownloadResponse.buffer();
    const base64Video = buffer.toString('base64');
    const contentType = videoPart.media.contentType || 'video/mp4';


    return {
      videoUrl: `data:${contentType};base64,${base64Video}`,
    };
  }
);
