"use client";

import { useState, useTransition } from "react";
import { Bot, Loader2, Sparkles } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { extractTasks } from "@/ai/flows/extract-actionable-tasks";

export default function AiTaskExtractor({ patientId }: { patientId: string }) {
  const [transcript, setTranscript] = useState("");
  const [extractedTasks, setExtractedTasks] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleExtractTasks = () => {
    if (!transcript.trim()) {
      toast({
        title: "Transcript is empty",
        description: "Please paste a conversation transcript to extract tasks.",
        variant: "destructive",
      });
      return;
    }

    startTransition(async () => {
      try {
        const result = await extractTasks({ conversationTranscript: transcript });
        if (result && result.tasks) {
          setExtractedTasks(result.tasks);
          toast({
            title: "Tasks Extracted Successfully!",
            description: `${result.tasks.length} tasks were identified.`,
          });
        } else {
            throw new Error("Invalid response from AI");
        }
      } catch (error) {
        console.error("Failed to extract tasks:", error);
        toast({
          title: "Extraction Failed",
          description: "Could not extract tasks from the transcript. Please try again.",
          variant: "destructive",
        });
        setExtractedTasks([]);
      }
    });
  };

  const handleAddTask = (task: string) => {
    // In a real app, this would update the database.
    console.log(`Adding task for patient ${patientId}: ${task}`);
    toast({
        title: "Task Added",
        description: `"${task}" has been added to the patient's to-do list.`
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot />
          AI Actionable Task Extraction
        </CardTitle>
        <CardDescription>
          Paste a transcribed conversation with the patient below. The AI will
          identify and extract actionable tasks for their to-do list.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid gap-2">
          <Textarea
            placeholder="Paste conversation transcript here..."
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            className="min-h-[150px]"
          />
        </div>
        <div>
          <Button onClick={handleExtractTasks} disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Extracting...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Extract Tasks
              </>
            )}
          </Button>
        </div>
        {extractedTasks.length > 0 && (
          <div className="grid gap-4">
            <h3 className="font-semibold">Extracted Tasks:</h3>
            <ul className="space-y-3">
              {extractedTasks.map((task, index) => (
                <li key={index} className="flex items-center justify-between gap-4 p-3 rounded-md bg-muted/50">
                  <p className="text-sm">{task}</p>
                  <Button variant="outline" size="sm" onClick={() => handleAddTask(task)}>
                    Add to List
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
