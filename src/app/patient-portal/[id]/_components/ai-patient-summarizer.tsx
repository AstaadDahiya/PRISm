"use client";

import { useState, useTransition } from "react";
import { Loader2, Sparkles, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { summarizePatientProgress } from "@/ai/flows/summarize-patient-progress";
import type { Patient, HealthData, Task } from "@/lib/data";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AiPatientSummarizer({ patient, healthData, tasks }: { patient: Patient, healthData: HealthData[], tasks: Task[] }) {
  const [summary, setSummary] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleSummarize = () => {
    startTransition(async () => {
        setSummary(null);
      try {
         const healthDataSummary = healthData.map(d => `- ${d.date}: ${d.steps} steps, ${d.sleep}h sleep, ${d.heartRate}bpm`).join('\n');
         const taskSummary = tasks.map(t => `- ${t.text} (Completed: ${t.completed})`).join('\n');

        const result = await summarizePatientProgress({
            patientName: patient.name,
            healthData: healthDataSummary,
            tasks: taskSummary,
         });

        if (result && result.summary) {
          setSummary(result.summary);
          toast({
            title: "Summary Generated",
            description: "Your progress summary is ready.",
          });
        } else {
            throw new Error("Invalid response from AI");
        }
      } catch (error) {
        console.error("Failed to generate summary:", error);
        toast({
          title: "Summary Failed",
          description: "Could not generate your summary. Please try again.",
          variant: "destructive",
        });
        setSummary(null);
      }
    });
  };

  return (
    <Card>
        <CardHeader>
            <CardTitle>Your AI Progress Summary</CardTitle>
            <CardDescription>Get a quick summary of your recent activity and progress.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
        <div>
            <Button onClick={handleSummarize} disabled={isPending} variant="outline">
                {isPending ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Summary...
                </>
                ) : (
                <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Summarize My Progress
                </>
                )}
            </Button>
            </div>
        {summary && (
            <Alert>
                <FileText className="h-4 w-4" />
                <AlertTitle>AI Health Summary</AlertTitle>
                <AlertDescription className="whitespace-pre-wrap font-body">
                    {summary}
                </AlertDescription>
            </Alert>
        )}
        </CardContent>
    </Card>
  );
}
