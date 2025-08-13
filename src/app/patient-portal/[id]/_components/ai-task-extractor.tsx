"use client";

import { useState, useTransition } from "react";
import { Bot, Loader2, Sparkles, Plus } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { extractTasks } from "@/ai/flows/extract-actionable-tasks";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function AiPatientTaskExtractor({ patientId }: { patientId: string }) {
  const [transcript, setTranscript] = useState("");
  const [extractedTasks, setExtractedTasks] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleExtractTasks = () => {
    if (!transcript.trim()) {
      toast({
        title: "Input is empty",
        description: "Please write something to get started.",
        variant: "destructive",
      });
      return;
    }

    startTransition(async () => {
        setExtractedTasks([]);
      try {
        const result = await extractTasks({ conversationTranscript: transcript });
        if (result && result.tasks) {
          setExtractedTasks(result.tasks);
          toast({
            title: "Tasks Extracted Successfully!",
            description: `${result.tasks.length} potential questions or tasks were identified.`,
          });
        } else {
            throw new Error("Invalid response from AI");
        }
      } catch (error) {
        console.error("Failed to extract tasks:", error);
        toast({
          title: "Extraction Failed",
          description: "Could not extract tasks from your notes. Please try again.",
          variant: "destructive",
        });
        setExtractedTasks([]);
      }
    });
  };
  
  const handleSaveNote = (task: string) => {
    console.log(`Saving note for patient ${patientId}: ${task}`);
    toast({
        title: "Note Saved",
        description: `Your question/note has been saved for your care team.`
    });
  }


  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Note Helper</CardTitle>
        <CardDescription>
            Have a question for your care team? Write down what you're thinking or feeling, and the AI will help identify key points to discuss.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid gap-2">
          <Textarea
            placeholder="For example: 'I've been feeling more tired than usual in the afternoons, and I'm not sure if my new medication is working correctly. I also keep forgetting if I should take it with food or not.'"
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            className="min-h-[150px] text-base"
          />
        </div>
        <div>
          <Button onClick={handleExtractTasks} disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Find Key Points
              </>
            )}
          </Button>
        </div>

        {extractedTasks.length > 0 && (
          <div className="grid gap-4">
            <h3 className="font-semibold">Here are the key points from your notes:</h3>
            <ul className="space-y-3">
              {extractedTasks.map((task, index) => (
                <li key={index} className="flex items-center justify-between gap-4 p-3 rounded-md bg-muted/50">
                  <p className="text-sm">{task}</p>
                   <Button variant="secondary" size="sm" onClick={() => handleSaveNote(task)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Save Note
                  </Button>
                </li>
              ))}
            </ul>
             <Alert>
                <AlertDescription>
                   You can save these points to share with your care team in your next message or appointment.
                </AlertDescription>
            </Alert>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
