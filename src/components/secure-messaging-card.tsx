"use client";

import { useState, useEffect, useRef } from "react";
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Patient } from "@/lib/data";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

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

export default function SecureMessagingCard({ patient, currentUserType, className, view }: SecureMessagingCardProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

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
    });

    return () => unsubscribe();
  }, [patient.id]);
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === "") return;

    await addDoc(collection(db, `patients/${patient.id}/messages`), {
      text: newMessage,
      sender: currentUserType,
      timestamp: serverTimestamp(),
    });

    setNewMessage("");
  };
  
  const clinicianBubbleClasses = view === 'clinician' ? 'bg-primary text-primary-foreground' : 'bg-muted';
  const patientBubbleClasses = view === 'patient' ? 'bg-primary text-primary-foreground' : 'bg-muted';
  const patientAvatarFallback = view === 'patient' ? 'You' : patient.name.charAt(0);
  const clinicianAvatarFallback = view === 'clinician' ? 'You' : 'C';

  return (
    <Card className={cn("flex flex-col", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            {view === 'patient' && <MessageSquare className="w-6 h-6" />}
            Secure Messaging
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col flex-grow">
        <div className="flex-grow space-y-4 overflow-y-auto pr-2 bg-background p-4 rounded-lg h-[250px]">
          {messages.map((message) => (
            <div key={message.id} className={`flex items-end gap-2 ${message.sender === currentUserType ? 'justify-end' : 'justify-start'}`}>
               {message.sender !== currentUserType && <Avatar className="h-8 w-8"><AvatarFallback>{message.sender === 'Patient' ? patientAvatarFallback : clinicianAvatarFallback}</AvatarFallback></Avatar>}
              <div className={`rounded-lg px-3 py-2 max-w-xs shadow-md ${message.sender === currentUserType ? (currentUserType === 'Clinician' ? clinicianBubbleClasses : patientBubbleClasses) : (message.sender === 'Clinician' ? 'bg-muted' : 'bg-card')}`}>
                <p className="text-sm">{message.text}</p>
                <p className={`text-xs mt-1 ${message.sender === currentUserType ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                  {message.timestamp?.toDate().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) || 'Sending...'}
                </p>
              </div>
              {message.sender === currentUserType && <Avatar className="h-8 w-8"><AvatarFallback>{currentUserType === 'Patient' ? 'You' : 'You'}</AvatarFallback></Avatar>}
            </div>
          ))}
          <div ref={messagesEndRef} />
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