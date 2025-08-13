
import { notFound } from 'next/navigation';
import type { Patient, Task, HealthData } from "@/lib/data";
import { getPatientData } from "@/lib/data";
import Link from "next/link";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Activity, BedDouble, HeartPulse, Bot } from "lucide-react";
import Logo from "@/components/logo";
import { UserNav } from "@/components/user-nav";
import SecureMessagingCard from '@/components/secure-messaging-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AiPatientSummarizer from './_components/ai-patient-summarizer';
import AiPatientTaskExtractor from './_components/ai-task-extractor';


const HealthMetricCard = ({ icon: Icon, label, value, unit }: { icon: React.ElementType, label: string, value: string | number, unit: string }) => (
  <Card className="flex-1 min-w-[150px]">
    <CardHeader className="pb-2">
      <CardDescription className="flex items-center gap-2 text-sm">
        <Icon className="h-4 w-4 text-primary" />
        {label}
      </CardDescription>
    </CardHeader>
    <CardContent>
      <p className="text-2xl font-bold font-headline">{value} <span className="text-sm font-normal text-muted-foreground">{unit}</span></p>
    </CardContent>
  </Card>
);

export default function PatientPortalPage({ params }: { params: { id: string }}) {
  const data = getPatientData(params.id);

  if (!data) {
    notFound();
  }

  const { patient, tasks, healthData } = data;
  const latestHealthData = healthData.length > 0 ? healthData[healthData.length - 1] : { date: '', steps: 0, sleep: 0, heartRate: 0 };


  return (
    <div className="min-h-screen bg-background text-foreground">
       <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-card px-4 md:px-6 z-50">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Logo className="h-8 w-8 text-primary" />
          <span className="text-xl font-headline">PRISm Portal</span>
        </Link>
        <div className="ml-auto">
            <UserNav />
        </div>
      </header>

      <main className="p-4 md:p-8 lg:p-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold font-headline">Hello, {patient.name.split(' ')[0]}!</h1>
            <p className="text-lg text-muted-foreground">Here is your dashboard for today.</p>
          </div>

          <Tabs defaultValue="dashboard">
            <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="dashboard">My Dashboard</TabsTrigger>
                <TabsTrigger value="ai-assistant">AI Health Assistant</TabsTrigger>
                <TabsTrigger value="messaging">Secure Messages</TabsTrigger>
            </TabsList>
            <TabsContent value="dashboard">
                 <div className="grid gap-8 mt-6">
                    <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-2xl font-headline">Today's To-Do List</CardTitle>
                        <CardDescription>Staying on top of these tasks is key to your recovery.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                        {tasks.map((task) => (
                            <div key={task.id} className="flex items-center gap-4 p-3 bg-background rounded-lg">
                            <Checkbox id={`patient-task-${task.id}`} checked={task.completed} className="w-5 h-5"/>
                            <label htmlFor={`patient-task-${task.id}`} className={`flex-1 text-base ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                                {task.text}
                            </label>
                            </div>
                        ))}
                        </div>
                    </CardContent>
                    </Card>

                    <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-2xl font-headline">My Health Data</CardTitle>
                        <CardDescription>Your latest data from your connected devices.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-wrap gap-4">
                        <HealthMetricCard icon={HeartPulse} label="Heart Rate" value={latestHealthData.heartRate} unit="bpm" />
                        <HealthMetricCard icon={Activity} label="Steps Today" value={latestHealthData.steps.toLocaleString()} unit="steps" />
                        <HealthMetricCard icon={BedDouble} label="Last Night's Sleep" value={latestHealthData.sleep} unit="hours" />
                    </CardContent>
                    </Card>
                </div>
            </TabsContent>
            <TabsContent value="ai-assistant">
                 <div className="grid gap-8 mt-6">
                    <Card className="bg-gradient-to-br from-accent/20 to-background">
                        <CardHeader>
                             <CardTitle className="text-2xl font-headline flex items-center gap-2">
                                <Bot />
                                Your AI Health Assistant
                            </CardTitle>
                            <CardDescription>Use these AI-powered tools to better understand your health and prepare for appointments.</CardDescription>
                        </CardHeader>
                    </Card>
                    <AiPatientSummarizer patient={patient} healthData={healthData} tasks={tasks} />
                    <AiPatientTaskExtractor patientId={patient.id} />
                 </div>
            </TabsContent>
             <TabsContent value="messaging">
                <div className="mt-6">
                    <SecureMessagingCard 
                        patient={patient}
                        currentUserType="Patient"
                        view="patient"
                    />
                </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
