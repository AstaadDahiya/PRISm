"use client";

import { useState, useEffect, useRef } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot, addDoc, serverTimestamp, orderBy } from 'firebase/firestore';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import type { Message } from '@/lib/data';

const SecureMessagingClinician = ({ patientId, patientName }: { patientId: string, patientName: string }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(() => {
        const q = query(
            collection(db, "messages"), 
            where("patientId", "==", patientId),
            orderBy("timestamp", "asc")
        );
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const msgs: Message[] = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                msgs.push({
                    id: doc.id,
                    patientId: data.patientId,
                    sender: data.sender,
                    text: data.text,
                    timestamp: data.timestamp?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) || 'sending...'
                });
            });
            setMessages(msgs);
        });

        return () => unsubscribe();
    }, [patientId]);
    
    useEffect(scrollToBottom, [messages]);


    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim() === '') return;

        try {
            await addDoc(collection(db, "messages"), {
                patientId: patientId,
                sender: 'Clinician',
                text: newMessage,
                timestamp: serverTimestamp()
            });
            setNewMessage('');
        } catch (error) {
            console.error("Error sending message: ", error);
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Secure Messaging</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col h-[400px]">
                <div className="flex-grow space-y-4 overflow-y-auto pr-2 mb-4">
                    {messages.map((message) => (
                        <div key={message.id} className={cn('flex items-end gap-2', message.sender === 'Patient' ? 'justify-start' : 'justify-end')}>
                            {message.sender === 'Patient' && <Avatar className="h-8 w-8"><AvatarFallback>{patientName.charAt(0)}</AvatarFallback></Avatar>}
                            <div className={cn('rounded-lg px-3 py-2 max-w-xs', message.sender === 'Patient' ? 'bg-muted' : 'bg-primary text-primary-foreground')}>
                                <p className="text-sm">{message.text}</p>
                                <p className={cn('text-xs mt-1', message.sender === 'Patient' ? 'text-muted-foreground' : 'text-primary-foreground/70')}>{message.timestamp}</p>
                            </div>
                            {message.sender === 'Clinician' && <Avatar className="h-8 w-8"><AvatarFallback>C</AvatarFallback></Avatar>}
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
                <form onSubmit={handleSendMessage} className="flex gap-2">
                    <Input 
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <Button type="submit"><Send className="h-4 w-4" /></Button>
                </form>
            </CardContent>
        </Card>
    )
}


export default SecureMessagingClinician;
