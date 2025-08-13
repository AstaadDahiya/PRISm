"use client";

import { useState, useEffect, useRef } from "react";
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Patient } from "@/lib/data";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "./ui/skeleton";

interface Message {
  id: string;
  sender: 'Clinician' | 'Patient';
  text: string;
  timestamp: any;
}

interface SecureMessagingCardProps {
  patient: Patient;
  currentUserType: 'Clinician' | 'Patient';
  className?: string;
  view: 'clinician' | 'patient';
}

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


export default function SecureMessagingCard({ patient, currentUserType, className, view }: SecureMessagingCardProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const messagesQuery = query(
      collection(db, `patients/${patient.id}/messages`),
      orderBy("timestamp", "asc")
    );

    const unsubscribe = onSnapshot(messagesQuery, (querySnapshot) => {
      const msgs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message));
      setMessages(msgs);
      setLoading(false);
    }, (error) => {
        console.error("Error fetching messages:", error);
        toast({
            title: "Error",
            description: "Could not load messages.",
            variant: "destructive"
        });
        setLoading(false);
    });

    return () => unsubscribe();
  }, [patient.id, toast]);
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === "") return;

    try {
        await addDoc(collection(db, `patients/${patient.id}/messages`), {
            text: newMessage,
            sender: currentUserType,
            timestamp: serverTimestamp(),
        });
        setNewMessage("");
    } catch (error) {
         console.error("Error sending message:", error);
         toast({
            title: "Error",
            description: "Could not send message.",
            variant: "destructive"
        })
    }
  };
  
  const getAvatarFallback = (sender: 'Clinician' | 'Patient') => {
      if (sender === currentUserType) {
          return "You";
      }
      return view === 'clinician' ? patient.name.charAt(0) : "C";
  }

  const formatTimestamp = (timestamp: any) => {
      if (!timestamp) return 'sending...';
      return timestamp.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  return (
    <Card className={cn("flex flex-col shadow-lg", className)}>
      <CardHeader>
        <CardTitle className={cn("flex items-center gap-2", view === 'patient' && "text-2xl font-headline")}>
            {view === 'patient' && <MessageSquare className="w-6 h-6" />}
            Secure Messaging
        </CardTitle>
        {view === 'patient' && <CardDescription>Communicate securely with your care team.</CardDescription>}
      </CardHeader>
      <CardContent className={cn("flex flex-col flex-grow", view === 'patient' && "h-[400px]")}>
        <div className="flex-grow space-y-4 overflow-y-auto pr-2 bg-background p-4 rounded-lg">
          {loading ? <MessagingSkeleton /> : (
            <>
            {messages.map((message) => (
                <div key={message.id} className={cn("flex items-end gap-2", message.sender === currentUserType ? 'justify-end' : 'justify-start')}>
                {message.sender !== currentUserType && <Avatar className="h-8 w-8"><AvatarFallback>{getAvatarFallback(message.sender)}</AvatarFallback></Avatar>}
                <div className={cn("rounded-lg px-3 py-2 max-w-xs shadow", view === 'patient' ? "text-base px-4 py-3" : "text-sm", message.sender === currentUserType ? 'bg-primary text-primary-foreground' : 'bg-muted')}>
                    <p>{message.text}</p>
                    <p className={cn("text-xs mt-1", message.sender === currentUserType ? 'text-primary-foreground/70' : 'text-muted-foreground')}>{formatTimestamp(message.timestamp)}</p>
                </div>
                {message.sender === currentUserType && <Avatar className="h-8 w-8"><AvatarFallback>{getAvatarFallback(message.sender)}</AvatarFallback></Avatar>}
                </div>
            ))}
            <div ref={messagesEndRef} />
            </>
          )}
        </div>
        <form onSubmit={handleSendMessage} className="mt-4 flex gap-2">
          <Input
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className={view === 'patient' ? "text-base h-12" : ""}
          />
          <Button type="submit" size={view === 'patient' ? 'lg' : 'default'}><Send className="h-4 w-4" /></Button>
        </form>
      </CardContent>
    </Card>
  );
}
