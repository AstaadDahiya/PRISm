
"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { patients, getPatientData } from "@/lib/data";
import type { Patient, HealthData } from "@/lib/data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import AiRiskAnalyzer from "../patient/[id]/_components/ai-risk-analyzer";
import AiInterventionSuggester from "../patient/[id]/_components/ai-intervention-suggester";
import AiTaskExtractor from "../patient/[id]/_components/ai-task-extractor";
import AiVideoSummarizer from "../patient/[id]/_components/ai-video-summarizer";
import { Bot } from "lucide-react";

export default function AiToolsPage() {
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);

  const patientData = selectedPatientId ? getPatientData(selectedPatientId) : null;
  const patient = patientData?.patient;
  const healthData = patientData?.healthData;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl font-headline flex items-center gap-2">
            <Bot />
            AI Clinical Tools
        </h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Select a Patient</CardTitle>
          <CardDescription>
            Choose a patient to use the AI-powered analysis and content generation tools.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select onValueChange={setSelectedPatientId}>
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="Select a patient..." />
            </SelectTrigger>
            <SelectContent>
              {patients.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {patient && healthData ? (
        <div className="grid gap-6">
            <AiRiskAnalyzer patient={patient} healthData={healthData} />
            <AiInterventionSuggester patient={patient} />
            <AiTaskExtractor patientId={patient.id} />
            <AiVideoSummarizer patient={patient} />
        </div>
      ) : (
        <Alert>
          <AlertDescription>
            Please select a patient to enable the AI tools.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
