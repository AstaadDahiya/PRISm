
import Link from "next/link";
import {
  Activity,
  ArrowUpRight,
  BadgeCent,
  BedDouble,
  HeartPulse,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { patients, tasks } from "@/lib/data";
import Image from "next/image";

export default function ClinicianDashboard() {
  const atRiskPatients = patients.filter((p) => p.status === "At Risk");
  const onTrackPatients = patients.filter((p) => p.status === "On Track");
  const totalPatients = patients.filter(p => p.status !== 'Discharged').length;
  const recentTasks = tasks.filter(t => !t.completed).slice(0, 5);
  
  const getStatusVariant = (status: 'At Risk' | 'Discharged' | 'On Track'): "destructive" | "secondary" | "default" => {
    switch (status) {
      case 'At Risk': return 'destructive';
      case 'Discharged': return 'secondary';
      case 'On Track': return 'default';
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Patients
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPatients}</div>
            <p className="text-xs text-muted-foreground">
              {onTrackPatients.length} on track
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              At Risk Patients
            </CardTitle>
            <BadgeCent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{atRiskPatients.length}</div>
            <p className="text-xs text-muted-foreground">
              Require immediate attention
            </p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Tasks</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tasks.filter(t => !t.completed).length}</div>
            <p className="text-xs text-muted-foreground">
              {tasks.filter(t => t.completed).length} completed this week
            </p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg. Risk Score
            </CardTitle>
            <HeartPulse className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">62%</div>
            <p className="text-xs text-muted-foreground">
              -3% from last month
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader className="flex flex-row items-center">
            <div className="grid gap-2">
              <CardTitle>At-Risk Patients</CardTitle>
              <CardDescription>
                Patients with the highest readmission risk.
              </CardDescription>
            </div>
            <Button asChild size="sm" className="ml-auto gap-1">
              <Link href="/dashboard/patient">
                View All
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead className="hidden xl:table-cell">
                    Status
                  </TableHead>
                  <TableHead className="text-right">Risk Score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {atRiskPatients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell>
                       <Link href={`/dashboard/patient/${patient.id}`} className="hover:underline">
                        <div className="font-medium">{patient.name}</div>
                        <div className="hidden text-sm text-muted-foreground md:inline">
                          {patient.age} y/o {patient.gender}
                        </div>
                      </Link>
                    </TableCell>
                    <TableCell className="hidden xl:table-cell">
                       <Badge variant={getStatusVariant(patient.status)}>{patient.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">{patient.riskScore}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Tasks</CardTitle>
            <CardDescription>
              Uncompleted tasks that require follow-up.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            {recentTasks.map((task) => (
                <div key={task.id} className="flex items-center gap-4">
                    <div className="p-1 rounded-lg bg-primary/10 text-primary">
                        <Activity className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-medium leading-none">{task.text}</p>
                        <p className="text-sm text-muted-foreground">Patient: {patients.find(p => p.id === task.patientId)?.name}</p>
                    </div>
                    <Button asChild variant="outline" size="sm">
                        <Link href={`/dashboard/patient/${task.patientId}`}>View</Link>
                    </Button>
                </div>
            ))}
            
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
