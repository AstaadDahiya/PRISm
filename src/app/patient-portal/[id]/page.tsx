
"use client";

import { useState, useEffect } from 'react';
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
import { Activity, BedDouble, HeartPulse } from "lucide-react";
import Logo from "@/components/logo";
import { UserNav } from "@/components/user-nav";
import { Skeleton } from '@/components/ui/skeleton';
import SecureMessagingCard from '@/components/secure-messaging-card';


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


const PatientPortalSkeleton = () => (
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
                    <Skeleton className="h-10 w-64 mb-2" />
                    <Skeleton className="h-6 w-80" />
                </div>
                <div className="grid gap-8">
                    <Card className="shadow-lg">
                        <CardHeader>
                            <CardTitle><Skeleton className="h-8 w-48" /></CardTitle>
                            <CardDescription><Skeleton className="h-4 w-72" /></CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-4"><Skeleton className="h-5 w-5 rounded-sm" /><Skeleton className="h-6 w-full" /></div>
                            <div className="flex items-center gap-4"><Skeleton className="h-5 w-5 rounded-sm" /><Skeleton className="h-6 w-full" /></div>
                            <div className="flex items-center gap-4"><Skeleton className="h-5 w-5 rounded-sm" /><Skeleton className="h-6 w-full" /></div>
                        </CardContent>
                    </Card>
                    <Card className="shadow-lg">
                        <CardHeader>
                             <CardTitle><Skeleton className="h-8 w-40" /></CardTitle>
                            <CardDescription><Skeleton className="h-4 w-64" /></CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-wrap gap-4">
                            <Skeleton className="h-24 flex-1 min-w-[150px] rounded-lg" />
                            <Skeleton className="h-24 flex-1 min-w-[150px] rounded-lg" />
                            <Skeleton className="h-24 flex-1 min-w-[150px] rounded-lg" />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle><Skeleton className="h-8 w-56" /></CardTitle>
                             <CardDescription><Skeleton className="h-4 w-64" /></CardDescription>
                        </CardHeader>
                         <CardContent>
                            <Skeleton className="h-96 w-full" />
                         </CardContent>
                    </Card>
                </div>
            </div>
        </main>
    </div>
);


export default function PatientPortalPage({ params }: { params: { id: string }}) {
  const [patientData, setPatientData] = useState<{ patient: Patient; tasks: Task[]; healthData: HealthData; } | null>(null);

  useEffect(() => {
    const data = getPatientData(params.id);
    if (data) {
        const latestHealthData = data.healthData.length > 0 ? data.healthData[data.healthData.length - 1] : { date: '', steps: 0, sleep: 0, heartRate: 0 };
        setPatientData({
            patient: data.patient,
            tasks: data.tasks,
            healthData: latestHealthData
        });
    } else {
        notFound();
    }
  }, [params.id]);


  if (!patientData) {
    return <PatientPortalSkeleton />;
  }

  const { patient, tasks, healthData } = patientData;

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
                 <HealthMetricCard icon={HeartPulse} label="Heart Rate" value={healthData.heartRate} unit="bpm" />
                 <HealthMetricCard icon={Activity} label="Steps Today" value={healthData.steps.toLocaleString()} unit="steps" />
                 <HealthMetricCard icon={BedDouble} label="Last Night's Sleep" value={healthData.sleep} unit="hours" />
              </CardContent>
            </Card>
            
            <SecureMessagingCard 
                patient={patient}
                currentUserType="Patient"
                view="patient"
            />

          </div>
        </div>
      </main>
    </div>
  );
}
