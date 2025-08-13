import Link from "next/link";
import { ArrowRight, Stethoscope, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Logo from "@/components/logo";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="flex flex-col items-center text-center mb-12">
        <Logo className="h-16 w-16 mb-4 text-primary" />
        <h1 className="text-5xl font-bold font-headline text-foreground">
          Welcome to PRISm
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
          The Patient Readmission Intelligence System designed to enhance patient care and reduce readmission rates through smart, AI-driven insights.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <Stethoscope className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl font-headline">For Clinicians</CardTitle>
            </div>
            <CardDescription className="pt-2">
              Access patient dashboards, risk analyses, and AI-powered tools to streamline your workflow and provide proactive care.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full" size="lg">
              <Link href="/dashboard">
                Go to Clinician Dashboard <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <div className="flex items-center gap-4">
               <div className="bg-primary/10 p-3 rounded-full">
                <User className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl font-headline">For Patients</CardTitle>
            </div>
            <CardDescription className="pt-2">
              View your personalized to-do list, track your health data, and securely communicate with your care team.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full" variant="secondary" size="lg">
               <Link href="/dashboard/patient-view">
                Go to Patient Portal <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

       <footer className="mt-16 text-center text-muted-foreground text-sm">
          <p>&copy; {new Date().getFullYear()} PRISm. All rights reserved.</p>
        </footer>
    </div>
  );
}
