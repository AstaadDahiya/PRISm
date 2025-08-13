"use client";

import { useState, useEffect, useRef } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Message, Patient } from '@/lib/data';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';

const Avatar = ({ className, children }: { className?: string, children: React.ReactNode }) => (
    <div className={`flex items-center justify-center rounded-full bg-muted text-muted-foreground ${className}`}>
        {children}
    </div>
)

const AvatarFallback = ({ children }: { children: React.ReactNode }) => (
    <span className="font-semibold">{children}</span>
)

export default function SecureMessaging({ patient }: { patient: Patient }) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!patient?.id) return;
        const q = query(collection(db, `patients/${patient.id}/messages`), orderBy("timestamp", "asc"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const msgs: Message[] = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                msgs.push({ 
                    id: doc.id, 
                    ...data,
                    timestamp: data.timestamp?.toDate()?.toLocaleTimeString() || new Date().toLocaleTimeString()
                } as Message);
            });
            setMessages(msgs);
        });

        return () => unsubscribe();
    }, [patient.id]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim() === "" || !patient?.id) return;

        await addDoc(collection(db, `patients/${patient.id}/messages`), {
            text: newMessage,
            sender: 'Patient',
            timestamp: serverTimestamp(),
        });
        setNewMessage("");
    };

    return (
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
                <div ref={messagesEndRef} />
              </div>
              <form onSubmit={handleSendMessage} className="mt-4 flex gap-2">
                <Input 
                    placeholder="Type your message..." 
                    className="text-base h-12"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                />
                <Button type="submit" size="lg"><Send className="h-5 w-5" /></Button>
              </form>
            </CardContent>
          </Card>
    );
}
