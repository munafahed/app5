import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { tracks, type Track } from "@/lib/types";
import {
  Shield,
  Network,
  Cloud,
  BrainCircuit,
  Code,
  Megaphone,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const trackIcons: Record<Track, React.ElementType> = {
  Cybersecurity: Shield,
  Networks: Network,
  "Cloud & DevOps": Cloud,
  "AI & ML": BrainCircuit,
  "Software Engineering": Code,
  Marketing: Megaphone,
};

interface TrackSelectionProps {
  onTrackSelect: (track: Track) => void;
}

export function TrackSelection({ onTrackSelect }: TrackSelectionProps) {
  return (
    <Card className="animate-in fade-in-50 slide-in-from-bottom-5 duration-500">
      <CardHeader>
        <CardTitle className="text-center text-2xl font-headline">
          Choose Your Path
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-center text-muted-foreground mb-6">
          Your daily dose of knowledge starts now. Select a track to begin.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {tracks.map((track) => {
            const Icon = trackIcons[track];
            return (
              <button
                key={track}
                onClick={() => onTrackSelect(track)}
                className={cn(
                  "group text-left p-4 rounded-lg border bg-background hover:bg-primary/5 hover:border-primary/50 transition-all duration-200"
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-secondary rounded-md">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <span className="font-semibold text-base">{track}</span>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
