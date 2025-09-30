
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { DoseWiseLogo } from "@/components/dose-wise/logo";

export default function WelcomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-background">
      <div className="flex flex-col items-center text-center max-w-xl mx-auto">
        <DoseWiseLogo className="h-16 w-auto mb-6" />
        <h1 className="text-4xl sm:text-5xl font-bold font-headline text-foreground mb-4">
          Your Daily Dose of Knowledge
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          Master new skills in minutes a day. Personalized micro-learning for professionals on the go.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-xs">
          <Button asChild size="lg" className="w-full">
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="w-full">
            <Link href="/signup">Sign Up</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
