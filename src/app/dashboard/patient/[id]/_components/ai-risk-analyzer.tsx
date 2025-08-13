"use client";

import { useState, useTransition } from "react";
import { Bot, Loader2, Sparkles } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { generateRiskScore, GenerateRiskScoreOutput } from "@/ai/flows/generate-risk-score";
import type { Patient, HealthData } from "@/lib/data";
import { Badge } from "@/components/ui/badge";

export default function AiRiskAnalyzer({ patient, healthData }: { patient: Patient, healthData: HealthData[] }) {
  const [analysis, setAnalysis] = useState<GenerateRiskScoreOutput | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleAnalyzeRisk = () => {
    startTransition(async () => {
      try {
        const patientData = `
          Patient Details:
          - Name: ${patient.name}
          - Age: ${patient.age}
          - Gender: ${patient.gender}
          - Status: ${patient.status}

          Recent Health Data (last 7 days):
          ${healthData.map(d => `- Date: ${d.date}, Steps: ${d.steps}, Sleep: ${d.sleep}hrs, Heart Rate: ${d.heartRate}bpm`).join('\n')}
        `;
        
        const result = await generateRiskScore({ patientData });
        if (result && result.riskScore !== undefined) {
          setAnalysis(result);
          toast({
            title: "Analysis Complete",
            description: `The patient's readmission risk score is ${result.riskScore}.`,
          });
        } else {
            throw new Error("Invalid response from AI");
        }
      } catch (error) {
        console.error("Failed to analyze risk:", error);
        toast({
          title: "Analysis Failed",
          description: "Could not analyze the patient's risk. Please try again.",
          variant: "destructive",
        });
        setAnalysis(null);
      }
    });
  };
  
  const getRiskColor = (score: number) => {
    if (score > 75) return "bg-red-500 text-white";
    if (score > 50) return "bg-yellow-500 text-black";
    return "bg-green-500 text-white";
  };


  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot />
          AI Risk Analyzer
        </CardTitle>
        <CardDescription>
          Generate a real-time readmission risk score based on the latest patient data from EHR and wearables.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div>
          <Button onClick={handleAnalyzeRisk} disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Analyze Risk
              </>
            )}
          </Button>
        </div>
        {analysis && (
          <div className="grid gap-4">
            <div className="flex items-center gap-4">
                <h3 className="font-semibold">Generated Risk Score:</h3>
                <Badge className={`text-lg ${getRiskColor(analysis.riskScore)}`}>{analysis.riskScore}</Badge>
            </div>
            <div>
                <h3 className="font-semibold mb-2">Contributing Risk Factors:</h3>
                <p className="text-sm p-3 rounded-md bg-muted/50 whitespace-pre-wrap">{analysis.riskFactors}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
