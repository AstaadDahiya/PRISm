
"use client";

import { useState, useTransition } from "react";
import { Bot, Loader2, Sparkles, Video } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { generateVideoSummary } from "@/ai/flows/generate-video-summary";
import type { Patient } from "@/lib/data";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function AiVideoSummarizer({ patient }: { patient: Patient }) {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleGenerateVideo = () => {
    startTransition(async () => {
        setVideoUrl(null);
      try {
        const result = await generateVideoSummary({ 
            patientName: patient.name,
            patientStatus: patient.status,
            riskScore: patient.riskScore,
        });
        if (result && result.videoUrl) {
          setVideoUrl(result.videoUrl);
          toast({
            title: "Video Summary Ready",
            description: "AI-generated video summary has been created.",
          });
        } else {
            throw new Error("Invalid response from AI");
        }
      } catch (error: any) {
        console.error("Failed to generate video summary:", error);
        
        let description = "Could not generate the video summary. This is an experimental feature and may fail. Please try again.";
        // Check for specific billing error from the Gemini API
        if (error.message && error.message.includes("billing enabled")) {
            description = "Video generation requires a Google Cloud project with billing enabled. Please enable billing in your GCP console to use this feature.";
        }

        toast({
          title: "Video Generation Failed",
          description: description,
          variant: "destructive",
          duration: 9000,
        });
        setVideoUrl(null);
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <Video />
            AI Video Summary
        </CardTitle>
        <CardDescription>
          Generate a short, symbolic video representing the patient's current status. (Experimental)
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div>
          <Button onClick={handleGenerateVideo} disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Video... (can take a minute)
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Video
              </>
            )}
          </Button>
        </div>
        
        {isPending && (
             <Alert>
                <AlertDescription>
                    The AI is generating a video based on the patient's status. This process may take up to a minute. Please wait.
                </AlertDescription>
            </Alert>
        )}

        {videoUrl && (
          <div className="rounded-lg overflow-hidden border">
            <video
              src={videoUrl}
              controls
              className="w-full aspect-video"
            >
              Your browser does not support the video tag.
            </video>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
