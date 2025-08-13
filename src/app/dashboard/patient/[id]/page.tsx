
import { notFound } from "next/navigation";
import {
  getPatientData,
  interventions as allInterventions,
  type HealthData,
  type RiskHistory,
  type RiskFactors,
} from "@/lib/data";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Activity,
  ArrowUp,
  BedDouble,
  Bot,
  HeartPulse,
  Plus,
  Send,
  Stethoscope,
  TrendingUp,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  Legend as RechartsLegend,
  Cell,
} from "recharts";
import AiPatientSummarizer from "./_components/ai-patient-summarizer";
import SecureMessaging from "./_components/secure-messaging";

type ChartProps = {
  data: any[];
};

const RiskTrendChart = ({ data }: { data: RiskHistory[] }) => (
  <ChartContainer config={{}} className="min-h-[200px] w-full">
    <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 0 }}>
      <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} domain={[0, 100]} />
      <RechartsTooltip content={<ChartTooltipContent />} />
      <Line
        type="monotone"
        dataKey="riskScore"
        stroke="hsl(var(--primary))"
        strokeWidth={2}
        dot={{ r: 4, fill: "hsl(var(--primary))" }}
      />
    </LineChart>
  </ChartContainer>
);

const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))"];

const RiskFactorsChart = ({ data }: { data: RiskFactors[] }) => (
    <ChartContainer config={{}} className="min-h-[200px] w-full aspect-square">
        <PieChart>
            <RechartsTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="hsl(var(--primary))" label>
                 {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
            </Pie>
            <RechartsLegend content={<ChartLegendContent />} />
        </PieChart>
    </ChartContainer>
);


const HealthDataChart = ({ data }: { data: HealthData[] }) => (
  <ChartContainer config={{}} className="min-h-[200px] w-full">
    <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 0 }}>
      <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
      <RechartsTooltip content={<ChartTooltipContent />} />
      <RechartsLegend content={<ChartLegendContent />} />
      <Bar dataKey="steps" fill="hsl(var(--chart-1))" name="Steps" radius={[4, 4, 0, 0]} />
    </BarChart>
  </ChartContainer>
);

export default function PatientDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const data = getPatientData(params.id);

  if (!data) {
    notFound();
  }

  const { patient, tasks, messages, healthData, riskHistory, riskFactors, interventions } = data;

  const getStatusVariant = (status: 'At Risk' | 'Discharged' | 'On Track'): "destructive" | "secondary" | "default" => {
    switch (status) {
      case 'At Risk': return 'destructive';
      case 'Discharged': return 'secondary';
      case 'On Track': return 'default';
    }
  }

  const healthMetrics = [
    { icon: HeartPulse, label: 'Avg Heart Rate', value: `${Math.round(healthData.reduce((acc, curr) => acc + curr.heartRate, 0) / healthData.length)} bpm`, trend: 'down' },
    { icon: Activity, label: 'Avg Steps', value: `${Math.round(healthData.reduce((acc, curr) => acc + curr.steps, 0) / healthData.length)}`, trend: 'up' },
    { icon: BedDouble, label: 'Avg Sleep', value: `${(healthData.reduce((acc, curr) => acc + curr.sleep, 0) / healthData.length).toFixed(1)} hrs`, trend: 'up' },
  ]

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <Image
            alt="Patient avatar"
            className="aspect-square rounded-full object-cover"
            height="100"
            src={`https://placehold.co/100x100/D3E4E7/468B97?text=${patient.name.charAt(0)}`}
            width="100"
            data-ai-hint="patient portrait"
          />
          <div className="grid gap-1">
            <h1 className="text-2xl font-bold font-headline">{patient.name}</h1>
            <p className="text-sm text-muted-foreground">
              {patient.age} y/o {patient.gender} &bull; Care Manager:{" "}
              {patient.careManager}
            </p>
            <div className="flex items-center gap-2 pt-1">
              <Badge variant={getStatusVariant(patient.status)}>{patient.status}</Badge>
              <Badge variant="outline">Risk Score: {patient.riskScore}%</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <AiPatientSummarizer patient={patient} healthData={healthData} tasks={tasks} />
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <div className="lg:col-span-5 grid gap-4">
          <Tabs defaultValue="health-data">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="health-data">Health Data</TabsTrigger>
              <TabsTrigger value="interventions">Interventions</TabsTrigger>
            </TabsList>
            <TabsContent value="health-data">
              <div className="grid gap-4 md:grid-cols-2">
                 <Card>
                  <CardHeader>
                    <CardTitle>Risk Score Trend</CardTitle>
                    <CardDescription>Monthly readmission risk score.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RiskTrendChart data={riskHistory} />
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Top Risk Factors</CardTitle>
                     <CardDescription>Primary contributors to the risk score.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RiskFactorsChart data={riskFactors} />
                  </CardContent>
                </Card>
              </div>
               <Card className="mt-4">
                <CardHeader>
                  <CardTitle>Wearable & Health Data</CardTitle>
                  <CardDescription>Recent data from connected devices and EHR.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 sm:grid-cols-3 mb-6">
                        {healthMetrics.map(metric => (
                            <Card key={metric.label}>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">{metric.label}</CardTitle>
                                    <metric.icon className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{metric.value}</div>
                                    <p className="text-xs text-muted-foreground">
                                        +2.1% from last week
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                  <HealthDataChart data={healthData} />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="interventions">
              <div className="grid gap-4 md:grid-cols-1">
                 <Card>
                  <CardHeader>
                    <CardTitle>Assigned Interventions</CardTitle>
                    <CardDescription>
                      Currently active interventions for this patient.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-4">
                    {interventions.length > 0 ? (
                      interventions.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-2 rounded-lg bg-background">
                            <div>
                              <p className="font-semibold">{item.title}</p>
                              <p className="text-sm text-muted-foreground">{item.description}</p>
                          </div>
                          <Button size="sm" variant="ghost">Manage</Button>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No interventions assigned.</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        <div className="lg:col-span-2 grid gap-4 auto-rows-max">
           <Card>
            <CardHeader>
              <CardTitle>Today's To-Do List</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tasks.map((task) => (
                  <div key={task.id} className="flex items-start gap-3">
                    <Checkbox id={`task-${task.id}`} checked={task.completed} className="mt-1" />
                    <label htmlFor={`task-${task.id}`} className={`text-sm ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                      {task.text}
                    </label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <SecureMessaging patient={patient} sender="Clinician" />
        </div>
      </div>
    </div>
  );
}
