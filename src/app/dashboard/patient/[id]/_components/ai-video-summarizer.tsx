
"use client";

import { useState, useTransition } from "react";
import { Bot, Loader2, Sparkles, Video, FileText } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { generateVideoDescription } from "@/ai/flows/generate-video-description";
import type { Patient } from "@/lib/data";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function AiVideoSummarizer({ patient }: { patient: Patient }) {
  const [summary, setSummary] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleGenerate = () => {
    startTransition(async () => {
        setSummary(null);
      try {
        const result = await generateVideoDescription({ 
            patientName: patient.name,
            patientStatus: patient.status,
            riskScore: patient.riskScore,
        });
        if (result && result.description) {
          setSummary(result.description);
          toast({
            title: "Symbolic Summary Ready",
            description: "AI-generated summary has been created.",
          });
        } else {
            throw new Error("Invalid response from AI");
        }
      } catch (error: any) {
        console.error("Failed to generate video summary:", error);
        
        let description = "Could not generate the summary. Please try again.";
       
        toast({
          title: "Summary Generation Failed",
          description: description,
          variant: "destructive",
          duration: 9000,
        });
        setSummary(null);
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <Video />
            AI Symbolic Summary
        </CardTitle>
        <CardDescription>
          Generate a short, symbolic text description representing the patient's current status.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div>
          <Button onClick={handleGenerate} disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Summary...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Summary
              </>
            )}
          </Button>
        </div>
        
        {summary && (
          <Alert>
              <FileText className="h-4 w-4" />
              <AlertTitle>AI Symbolic Summary</AlertTitle>
              <AlertDescription className="font-body">
                  {summary}
              </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
