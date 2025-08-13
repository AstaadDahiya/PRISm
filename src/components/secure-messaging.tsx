"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, MessageSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  text: string;
  sender: "Clinician" | "Patient";
  timestamp: Timestamp;
}

interface SecureMessagingProps {
  patientId: string;
  currentUser: "Clinician" | "Patient";
}

export default function SecureMessaging({ patientId, currentUser }: SecureMessagingProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const messagesCollection = collection(db, "patients", patientId, "messages");
    const q = query(messagesCollection, orderBy("timestamp", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedMessages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Message[];
      setMessages(fetchedMessages);
    }, (error) => {
      console.error("Error fetching messages:", error);
      toast({
        title: "Error",
        description: "Could not load messages.",
        variant: "destructive",
      });
    });

    return () => unsubscribe();
  }, [patientId, toast]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === "") return;

    const messagesCollection = collection(db, "patients", patientId, "messages");

    try {
      await addDoc(messagesCollection, {
        text: newMessage,
        sender: currentUser,
        timestamp: serverTimestamp(),
      });
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Could not send message.",
        variant: "destructive",
      });
    }
  };

  const formatTimestamp = (timestamp: Timestamp | null) => {
    if (!timestamp) return "Sending...";
    return new Date(timestamp.seconds * 1000).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-headline flex items-center gap-2">
            <MessageSquare className="w-6 h-6" /> 
            Secure Messages
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col h-[400px]">
        <div className="flex-grow space-y-4 overflow-y-auto pr-2 bg-background p-4 rounded-lg">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-end gap-2 ${message.sender === currentUser ? "justify-end" : "justify-start"}`}
            >
              {message.sender !== currentUser && <Avatar className="h-8 w-8"><AvatarFallback>{message.sender.charAt(0)}</AvatarFallback></Avatar>}
              <div className={cn(
                  "rounded-lg px-4 py-3 max-w-sm shadow-md",
                  message.sender === currentUser ? "bg-primary text-primary-foreground" : "bg-muted"
              )}>
                <p className="text-base">{message.text}</p>
                <p className={cn(
                    "text-xs mt-1 text-right",
                     message.sender === currentUser ? "text-primary-foreground/70" : "text-muted-foreground"
                )}>
                    {formatTimestamp(message.timestamp)}
                </p>
              </div>
              {message.sender === currentUser && <Avatar className="h-8 w-8"><AvatarFallback>You</AvatarFallback></Avatar>}
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
