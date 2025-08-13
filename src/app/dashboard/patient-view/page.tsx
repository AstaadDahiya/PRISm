import { notFound } from "next/navigation";
import { getPatientData, type HealthData } from "@/lib/data";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Activity, BedDouble, HeartPulse, Send, MessageSquare } from "lucide-react";
import Logo from "@/components/logo";
import Link from "next/link";
import { UserNav } from "@/components/user-nav";

// Let's assume we're viewing patient '1' for this portal
const PATIENT_ID_FOR_VIEW = '1';

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

export default function PatientViewPage() {
  const data = getPatientData(PATIENT_ID_FOR_VIEW);

  if (!data) {
    notFound();
  }

  const { patient, tasks, messages, healthData } = data;
  const latestHealthData = healthData[healthData.length - 1] || { steps: 0, sleep: 0, heartRate: 0 };

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
            <p className="text-lg text-muted-foreground">Here is your summary for today.</p>
          </div>

          <div className="grid gap-8">
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

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-headline flex items-center gap-2"><MessageSquare className="w-6 h-6" /> Secure Messages</CardTitle>
                <CardDescription>Communicate securely with your care team.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col h-[400px]">
                <div className="flex-grow space-y-4 overflow-y-auto pr-2 bg-background p-4 rounded-lg">
                  {messages.map((message) => (
                    <div key={message.id} className={`flex items-end gap-2 ${message.sender === 'Patient' ? 'justify-end' : 'justify-start'}`}>
                      {message.sender === 'Clinician' && <Avatar className="h-8 w-8"><AvatarFallback>C</AvatarFallback></Avatar>}
                      <div className={`rounded-lg px-4 py-3 max-w-sm shadow-md ${message.sender === 'Clinician' ? 'bg-card' : 'bg-primary text-primary-foreground'}`}>
                        <p className="text-base">{message.text}</p>
                        <p className={`text-xs mt-1 text-right ${message.sender === 'Clinician' ? 'text-muted-foreground' : 'text-primary-foreground/70'}`}>{message.timestamp}</p>
                      </div>
                      {message.sender === 'Patient' && <Avatar className="h-8 w-8"><AvatarFallback>You</AvatarFallback></Avatar>}
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex gap-2">
                  <Input placeholder="Type your message..." className="text-base h-12" />
                  <Button size="lg"><Send className="h-5 w-5" /></Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

const Avatar = ({ className, children }: { className?: string, children: React.ReactNode }) => (
    <div className={`flex items-center justify-center rounded-full bg-muted text-muted-foreground ${className}`}>
        {children}
    </div>
)

const AvatarFallback = ({ children }: { children: React.ReactNode }) => (
    <span className="font-semibold">{children}</span>
)
