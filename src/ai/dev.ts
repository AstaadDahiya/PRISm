import { config } from 'dotenv';
config();

import '@/ai/flows/extract-actionable-tasks.ts';
import '@/ai/flows/generate-risk-score.ts';