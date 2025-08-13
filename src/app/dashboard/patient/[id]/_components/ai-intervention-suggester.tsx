"use client";

import { useState, useTransition } from "react";
import { Bot, Loader2, Plus, Sparkles } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { suggestInterventions, SuggestInterventionsOutput } from "@/ai/flows/suggest-interventions";
import type { Patient } from "@/lib/data";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function AiInterventionSuggester({ patient }: { patient: Patient }) {
  const [suggestions, setSuggestions] = useState<SuggestInterventionsOutput['interventions'] | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleSuggestInterventions = () => {
    startTransition(async () => {
        setSuggestions(null);
      try {
        const patientData = `
          Patient Details:
          - Name: ${patient.name}
          - Age: ${patient.age}
          - Gender: ${patient.gender}
          - Status: ${patient.status}
          - Current Risk Score: ${patient.riskScore}%
        `;
        
        const result = await suggestInterventions({ patientData });
        if (result && result.interventions) {
          setSuggestions(result.interventions);
          toast({
            title: "Suggestions Ready",
            description: `Found ${result.interventions.length} recommended interventions.`,
          });
        } else {
            throw new Error("Invalid response from AI");
        }
      } catch (error) {
        console.error("Failed to suggest interventions:", error);
        toast({
          title: "Suggestion Failed",
          description: "Could not generate intervention suggestions. Please try again.",
          variant: "destructive",
        });
        setSuggestions(null);
      }
    });
  };

  const handleAssign = (title: string) => {
    // In a real app, this would update the database.
    console.log(`Assigning intervention "${title}" to patient ${patient.id}`);
    toast({
      title: "Intervention Assigned",
      description: `"${title}" has been added to the patient's active interventions.`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <Bot />
            Recommended Interventions
        </CardTitle>
        <CardDescription>
          Use AI to generate intervention suggestions based on the patient's risk profile.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div>
          <Button onClick={handleSuggestInterventions} disabled={isPending} variant="outline">
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate AI Suggestions
              </>
            )}
          </Button>
        </div>
        {suggestions === null && (
             <Alert>
                <AlertDescription>
                    Click the button to generate AI-powered intervention recommendations.
                </AlertDescription>
            </Alert>
        )}
        {suggestions && suggestions.length > 0 && (
          <div className="grid gap-4">
            {suggestions.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <p className="font-semibold">{item.title}</p>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
                <Button size="sm" variant="secondary" onClick={() => handleAssign(item.title)}><Plus className="mr-2 h-4 w-4" /> Assign</Button>
              </div>
            ))}
          </div>
        )}
        {suggestions && suggestions.length === 0 && (
            <Alert>
                <AlertTitle>No Suggestions Found</AlertTitle>
                <AlertDescription>
                    The AI could not identify any specific interventions at this time.
                </AlertDescription>
            </Alert>
        )}
      </CardContent>
    </Card>
  );
}
