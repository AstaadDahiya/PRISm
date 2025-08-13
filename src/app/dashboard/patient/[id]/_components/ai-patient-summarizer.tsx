"use client";

import { useState, useTransition } from "react";
import { Loader2, Sparkles, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { summarizePatientProgress } from "@/ai/flows/summarize-patient-progress";
import type { Patient, HealthData, Task } from "@/lib/data";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function AiPatientSummarizer({ patient, healthData, tasks }: { patient: Patient, healthData: HealthData[], tasks: Task[] }) {
  const [summary, setSummary] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleSummarize = () => {
    startTransition(async () => {
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
            description: "Patient progress summary created successfully.",
          });
        } else {
            throw new Error("Invalid response from AI");
        }
      } catch (error) {
        console.error("Failed to generate summary:", error);
        toast({
          title: "Summary Failed",
          description: "Could not generate patient summary. Please try again.",
          variant: "destructive",
        });
        setSummary(null);
      }
    });
  };
  
  return (
    <div className="space-y-4">
       <div>
          <Button onClick={handleSummarize} disabled={isPending} variant="outline" size="sm">
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Summary...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate AI Summary
              </>
            )}
          </Button>
        </div>
      {summary && (
        <Alert>
            <FileText className="h-4 w-4" />
            <AlertTitle>AI Patient Summary</AlertTitle>
            <AlertDescription className="whitespace-pre-wrap font-body">
                {summary}
            </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
