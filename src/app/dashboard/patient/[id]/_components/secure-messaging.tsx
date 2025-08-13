"use client";

import { useState, useEffect, useRef } from "react";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { cn } from "@/lib/utils";
import type { Patient } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Message {
  id: string;
  patientId: string;
  sender: 'Clinician' | 'Patient';
  text: string;
  timestamp: Timestamp | null;
}

type SecureMessagingProps = {
  patient: Patient;
  sender: 'Clinician' | 'Patient';
};

export default function SecureMessaging({ patient, sender }: SecureMessagingProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const messagesRef = collection(db, "patients", patient.id, "messages");

  useEffect(() => {
    const q = query(messagesRef, orderBy("timestamp", "asc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const msgs = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          patientId: patient.id,
          ...data
        } as Message;
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
    if (newMessage.trim() === "") return;

    await addDoc(messagesRef, {
      text: newMessage,
      sender: sender,
      timestamp: serverTimestamp(),
      patientId: patient.id,
    });

    setNewMessage("");
  };
  
  const getSenderAvatar = () => {
    if(sender === 'Patient') return 'You';
    return 'C';
  }

  const formatTimestamp = (timestamp: Timestamp | null) => {
    if (!timestamp) return 'sending...';
    return timestamp.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Secure Messaging</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col h-[300px]">
        <div className="flex-grow space-y-4 overflow-y-auto pr-2">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex items-end gap-2",
                message.sender === sender
                  ? "justify-end"
                  : "justify-start"
              )}
            >
              {message.sender !== sender && (
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
                </Avatar>
              )}
              <div
                className={cn(
                  "rounded-lg px-3 py-2 max-w-xs",
                  message.sender === sender
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                )}
              >
                <p className="text-sm">{message.text}</p>
                <p className={cn("text-xs mt-1", message.sender === sender ? 'text-primary-foreground/70' : 'text-muted-foreground')}>{formatTimestamp(message.timestamp)}</p>
              </div>
              {message.sender === sender && (
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{getSenderAvatar()}</AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
           <div ref={messagesEndRef} />
        </div>
        <form onSubmit={handleSendMessage} className="mt-4 flex gap-2">
          <Input
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <Button type="submit">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
