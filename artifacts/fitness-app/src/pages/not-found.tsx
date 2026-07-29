import { Link } from "wouter";
import { Dumbbell } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
      <Dumbbell className="w-24 h-24 text-muted-foreground opacity-20 mb-6" />
      <h1 className="text-6xl font-black uppercase tracking-tighter mb-2">404</h1>
      <h2 className="text-2xl font-bold uppercase tracking-tight text-muted-foreground mb-8">Rep Not Found</h2>
      <p className="text-muted-foreground max-w-md mx-auto mb-8">
        The page you are looking for doesn't exist or has been moved. Keep pushing forward and return to the dashboard.
      </p>
      <Link href="/">
        <Button size="lg" className="font-bold uppercase tracking-tight">
          Back to Dashboard
        </Button>
      </Link>
    </div>
  );
}
