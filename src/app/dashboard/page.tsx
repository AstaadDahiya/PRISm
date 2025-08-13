import Link from "next/link";
import {
  File,
  ListFilter,
  MoreHorizontal,
  PlusCircle,
  Search,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { patients } from "@/lib/data";
import Image from "next/image";

export default function ClinicianDashboard() {
  const getRiskColor = (score: number) => {
    if (score > 75) return "bg-red-500";
    if (score > 50) return "bg-yellow-500";
    return "bg-green-500";
  };
  
  const getStatusVariant = (status: 'At Risk' | 'Discharged' | 'On Track'): "destructive" | "secondary" | "default" => {
    switch (status) {
      case 'At Risk': return 'destructive';
      case 'Discharged': return 'secondary';
      case 'On Track': return 'default';
    }
  }

  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl font-headline">Patients</h1>
      </div>
      <Tabs defaultValue="all">
        <div className="flex items-center">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="at-risk">At Risk</TabsTrigger>
            <TabsTrigger value="on-track">On Track</TabsTrigger>
            <TabsTrigger value="discharged" className="hidden sm:flex">
              Discharged
            </TabsTrigger>
          </TabsList>
          <div className="ml-auto flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 gap-1">
                  <ListFilter className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Filter
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem checked>
                  Status
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Care Manager</DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button size="sm" variant="outline" className="h-8 gap-1">
              <File className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Export
              </span>
            </Button>
            <Button size="sm" className="h-8 gap-1">
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Add Patient
              </span>
            </Button>
          </div>
        </div>
        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>Patient Overview</CardTitle>
              <CardDescription>
                Manage your patients and view their risk status.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="hidden w-[100px] sm:table-cell">
                      <span className="sr-only">Avatar</span>
                    </TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden md:table-cell">
                      Risk Score
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                      Discharge Date
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                      Care Manager
                    </TableHead>
                    <TableHead>
                      <span className="sr-only">Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {patients.map((patient) => (
                    <TableRow key={patient.id}>
                      <TableCell className="hidden sm:table-cell">
                        <Image
                          alt="Patient avatar"
                          className="aspect-square rounded-full object-cover"
                          height="64"
                          src={`https://placehold.co/64x64/D3E4E7/468B97?text=${patient.name.charAt(0)}`}
                          width="64"
                          data-ai-hint="patient portrait"
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        <Link href={`/dashboard/patient/${patient.id}`} className="hover:underline">
                          {patient.name}
                        </Link>
                      </TableCell>
                       <TableCell>
                        <Badge variant={getStatusVariant(patient.status)}>{patient.status}</Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="flex items-center gap-2">
                          <span>{patient.riskScore}%</span>
                          <Progress
                            value={patient.riskScore}
                            className="h-2 w-24"
                            indicatorClassName={getRiskColor(patient.riskScore)}
                          />
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {patient.dischargeDate}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {patient.careManager}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              aria-haspopup="true"
                              size="icon"
                              variant="ghost"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Toggle menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem asChild>
                               <Link href={`/dashboard/patient/${patient.id}`}>View Details</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>Message</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                              Discharge
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter>
              <div className="text-xs text-muted-foreground">
                Showing <strong>1-5</strong> of <strong>{patients.length}</strong> patients
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}
