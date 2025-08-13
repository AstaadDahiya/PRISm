import { Timestamp } from "firebase/firestore";

export type Patient = {
  id: string;
  name: string;
  avatar: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  dischargeDate: string;
  riskScore: number;
  careManager: string;
  status: 'At Risk' | 'Discharged' | 'On Track';
};

export type Task = {
  id: string;
  patientId: string;
  text: string;
  completed: boolean;
};

export type Message = {
  id: string;
  patientId: string;
  sender: 'Clinician' | 'Patient';
  text: string;
  timestamp: string | Timestamp;
};

export type HealthData = {
  date: string;
  steps: number;
  sleep: number; // in hours
  heartRate: number; // in bpm
};

export type RiskHistory = {
  date: string;
  riskScore: number;
};

export type Intervention = {
  id: string;
  title: string;
  description: string;
  category: 'Medication' | 'Lifestyle' | 'Appointment' | 'Monitoring';
};

export type RiskFactors = {
    name: string;
    value: number;
}

export const patients: Patient[] = [
  {
    id: '1',
    name: 'John Doe',
    avatar: '/avatars/01.png',
    age: 68,
    gender: 'Male',
    dischargeDate: '2024-07-15',
    riskScore: 78,
    careManager: 'Dr. Alice Smith',
    status: 'At Risk',
  },
  {
    id: '2',
    name: 'Jane Smith',
    avatar: '/avatars/02.png',
    age: 72,
    gender: 'Female',
    dischargeDate: '2024-07-20',
    riskScore: 45,
    careManager: 'Dr. Bob Johnson',
    status: 'On Track',
  },
  {
    id: '3',
    name: 'Michael Brown',
    avatar: '/avatars/03.png',
    age: 55,
    gender: 'Male',
    dischargeDate: '2024-06-30',
    riskScore: 22,
    careManager: 'Dr. Carol White',
    status: 'Discharged',
  },
  {
    id: '4',
    name: 'Emily Davis',
    avatar: '/avatars/04.png',
    age: 81,
    gender: 'Female',
    dischargeDate: '2024-07-18',
    riskScore: 85,
    careManager: 'Dr. Alice Smith',
    status: 'At Risk',
  },
   {
    id: '5',
    name: 'David Wilson',
    avatar: '/avatars/05.png',
    age: 62,
    gender: 'Male',
    dischargeDate: '2024-07-22',
    riskScore: 35,
    careManager: 'Dr. Bob Johnson',
    status: 'On Track',
  },
];

export const tasks: Task[] = [
  { id: 't1', patientId: '1', text: 'Take medication at 8 AM and 8 PM', completed: false },
  { id: 't2', patientId: '1', text: 'Check blood pressure', completed: true },
  { id: 't3', patientId: '1', text: 'Schedule follow-up with cardiologist', completed: false },
  { id: 't4', patientId: '2', text: 'Walk for 30 minutes', completed: true },
  { id: 't5', patientId: '2', text: 'Monitor blood sugar levels before meals', completed: false },
  { id: 't6', patientId: '4', text: 'Breathing exercises for 10 minutes', completed: false },
  { id: 't7', patientId: '4', text: 'Consult with nutritionist about low-sodium diet', completed: false },
];

export const messages: Message[] = [
    { id: 'm1', patientId: '1', sender: 'Clinician', text: 'Hi John, how are you feeling today?', timestamp: '9:00 AM'},
    { id: 'm2', patientId: '1', sender: 'Patient', text: 'A bit tired, but otherwise okay. I took my morning medication.', timestamp: '9:05 AM'},
    { id: 'm3', patientId: '1', sender: 'Clinician', text: 'That\'s good to hear. Don\'t forget to check your blood pressure.', timestamp: '9:06 AM'},
];

export const healthData: { [patientId: string]: HealthData[] } = {
  '1': [
    { date: 'Jul 18', steps: 2500, sleep: 6.5, heartRate: 75 },
    { date: 'Jul 19', steps: 2800, sleep: 7.0, heartRate: 72 },
    { date: 'Jul 20', steps: 2600, sleep: 6.0, heartRate: 78 },
    { date: 'Jul 21', steps: 3200, sleep: 7.5, heartRate: 70 },
    { date: 'Jul 22', steps: 3000, sleep: 7.2, heartRate: 71 },
    { date: 'Jul 23', steps: 3500, sleep: 8.0, heartRate: 68 },
    { date: 'Jul 24', steps: 3300, sleep: 7.8, heartRate: 69 },
  ]
};

export const riskHistory: { [patientId: string]: RiskHistory[] } = {
  '1': [
    { date: 'Apr', riskScore: 65 },
    { date: 'May', riskScore: 70 },
    { date: 'Jun', riskScore: 72 },
    { date: 'Jul', riskScore: 78 },
  ]
};

export const interventions: { [patientId: string]: Intervention[] } = {
    '1': [
        { id: 'i1', title: 'Medication Adherence Program', description: 'Enroll patient in a program to improve medication adherence.', category: 'Medication' },
        { id: 'i2', title: 'Dietary Consultation', description: 'Schedule a consultation with a dietitian.', category: 'Lifestyle' },
    ],
    '2': [
       { id: 'i3', title: 'Physical Therapy Referral', description: 'Refer patient for physical therapy evaluation.', category: 'Appointment' },
    ],
    '4': [
       { id: 'i4', title: 'Remote Heart Rate Monitoring', description: 'Set up daily remote monitoring for heart rate fluctuations.', category: 'Monitoring' },
    ]
};


export const riskFactors: { [key: string]: RiskFactors[] } = {
    '1': [
        { name: 'Age', value: 30 },
        { name: 'Previous Conditions', value: 40 },
        { name: 'Medication Non-adherence', value: 20 },
        { name: 'Lifestyle', value: 10 },
    ]
}

export const getPatientData = (id: string) => {
    const patient = patients.find(p => p.id === id);
    if (!patient) return null;

    return {
        patient,
        tasks: tasks.filter(t => t.patientId === id),
        messages: messages.filter(m => m.patientId === id),
        healthData: healthData[id] || [],
        riskHistory: riskHistory[id] || [],
        riskFactors: riskFactors[id] || [],
        interventions: interventions[id] || []
    }
}
