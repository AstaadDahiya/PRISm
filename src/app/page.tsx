
import Link from "next/link";
import { ArrowRight, Stethoscope, User, LogIn } from "lucide-react";
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

       <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-headline">Get Started</CardTitle>
            <CardDescription>
              Login to your account or create a new one.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Button asChild className="w-full" size="lg">
              <Link href="/login">
                <LogIn className="mr-2 h-5 w-5" />
                Clinician Login
              </Link>
            </Button>
             <Button asChild className="w-full" size="lg" variant="secondary">
              <Link href="/dashboard/patient-view">
                <User className="mr-2 h-5 w-5" />
                Patient Portal
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
