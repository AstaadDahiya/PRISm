// src/app/patient-portal/[id]/_components/ai-patient-summarizer.tsx
import type { Patient, HealthData, Task } from "@/lib/data";
export default function AiPatientSummarizer({ patient, healthData, tasks }: {
    patient: Patient;
    healthData: HealthData[];
    tasks: Task[];
}): import("react/jsx-runtime").JSX.Element;
