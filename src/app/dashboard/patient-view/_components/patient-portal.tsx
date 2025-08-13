"use client";

import { useState, useEffect, useRef } from 'react';
import type { Patient, Task, HealthData } from "@/lib/data";
import { getPatientData } from "@/lib/data";
import Image from "next/image";
import Link from "next/link";
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, Timestamp } from 'firebase/firestore';

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
import { UserNav } from "@/components/user-nav";
import { db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';


type Message = {
  id: string;
  sender: 'Clinician' | 'Patient';
  text: string;
  timestamp: Timestamp;
};


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

const MessagingSkeleton = () => (
  <div className="space-y-4">
    <div className="flex items-end gap-2 justify-start">
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-16 w-48 rounded-lg" />
    </div>
    <div className="flex items-end gap-2 justify-end">
        <Skeleton className="h-12 w-40 rounded-lg" />
        <Skeleton className="h-8 w-8 rounded-full" />
    </div>
    <div className="flex items-end gap-2 justify-start">
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-12 w-32 rounded-lg" />
    </div>
  </div>
)

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
                        <CardContent className="flex flex-col h-[400px]">
                             <div className="flex-grow space-y-4 overflow-y-auto pr-2 bg-background p-4 rounded-lg">
                                <MessagingSkeleton />
                            </div>
                            <div className="mt-4 flex gap-2">
                                <Skeleton className="h-12 flex-grow" />
                                <Skeleton className="h-12 w-16" />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </main>
    </div>
)


export default function PatientPortal({ patientId }: { patientId: string}) {
  const [patientData, setPatientData] = useState<{ patient: Patient; tasks: Task[]; healthData: HealthData; } | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loadingMessages, setLoadingMessages] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const data = getPatientData(patientId);
    if (data) {
        const latestHealthData = data.healthData[data.healthData.length - 1] || { steps: 0, sleep: 0, heartRate: 0 };
        setPatientData({
            patient: data.patient,
            tasks: data.tasks,
            healthData: latestHealthData
        });
    }

    const q = query(
      collection(db, `patients/${patientId}/messages`),
      orderBy("timestamp", "asc")
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const msgs: Message[] = [];
      querySnapshot.forEach((doc) => {
        msgs.push({ id: doc.id, ...doc.data() } as Message);
      });
      setMessages(msgs);
      setLoadingMessages(false);
    }, (error) => {
      console.error("Error fetching messages: ", error);
      toast({
        title: "Error",
        description: "Could not load messages.",
        variant: "destructive"
      })
      setLoadingMessages(false);
    });

    return () => unsubscribe();
  }, [patientId, toast]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === "") return;

    try {
      await addDoc(collection(db, `patients/${patientId}/messages`), {
        text: newMessage,
        sender: 'Patient',
        timestamp: serverTimestamp(),
      });
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message: ", error);
      toast({
        title: "Error",
        description: "Could not send message.",
        variant: "destructive"
      })
    }
  };


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

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl font-headline flex items-center gap-2"><MessageSquare className="w-6 h-6" /> Secure Messages</CardTitle>
                <CardDescription>Communicate securely with your care team.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col h-[400px]">
                <div className="flex-grow space-y-4 overflow-y-auto pr-2 bg-background p-4 rounded-lg">
                 {loadingMessages ? <MessagingSkeleton /> : (
                  <>
                  {messages.map((message) => (
                    <div key={message.id} className={cn('flex items-end gap-2', message.sender === 'Patient' ? 'justify-end' : 'justify-start')}>
                      {message.sender === 'Clinician' && <Avatar className="h-8 w-8"><AvatarFallback>C</AvatarFallback></Avatar>}
                      <div className={cn('rounded-lg px-4 py-3 max-w-sm shadow-md', message.sender === 'Clinician' ? 'bg-card' : 'bg-primary text-primary-foreground')}>
                        <p className="text-base">{message.text}</p>
                        <p className={cn('text-xs mt-1 text-right', message.sender === 'Clinician' ? 'text-muted-foreground' : 'text-primary-foreground/70')}>
                           {message.timestamp?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) || 'Sending...'}
                        </p>
                      </div>
                      {message.sender === 'Patient' && <Avatar className="h-8 w-8"><AvatarFallback>You</AvatarFallback></Avatar>}
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                  </>
                 )}
                </div>
                 <form onSubmit={handleSendMessage} className="mt-4 flex gap-2">
                  <Input placeholder="Type your message..." className="text-base h-12" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} />
                  <Button type="submit" size="lg"><Send className="h-5 w-5" /></Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

const Avatar = ({ className, children }: { className?: string, children: React.ReactNode }) => (
    <div className={cn('flex items-center justify-center rounded-full bg-muted text-muted-foreground', className)}>
        {children}
    </div>
)

const AvatarFallback = ({ children }: { children: React.ReactNode }) => (
    <span className="font-semibold">{children}</span>
)
