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
import { Send, MessageSquare } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import SecureMessagingCard from "@/components/secure-messaging-card";

interface Message {
  id: string;
  patientId: string;
  sender: 'Clinician' | 'Patient';
  text: string;
  timestamp: Timestamp | null;
}

type SecureMessagingProps = {
  patient: Patient;
};

export default function SecureMessaging({ patient }: SecureMessagingProps) {
  return (
    <SecureMessagingCard 
        patient={patient}
        currentUserType="Clinician"
        view="clinician"
    />
  )
}
