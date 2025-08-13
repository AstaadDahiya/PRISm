import { config } from 'dotenv';
config();

import '@/ai/flows/extract-actionable-tasks.ts';
import '@/ai/flows/generate-risk-score.ts';
import '@/ai/flows/summarize-patient-progress.ts';
import '@/ai/flows/suggest-interventions.ts';
