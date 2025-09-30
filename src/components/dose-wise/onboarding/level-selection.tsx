import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { levels, type Level, type Track } from "@/lib/types";
import { ArrowRight, Star, GraduationCap, BarChart } from "lucide-react";
import { cn } from "@/lib/utils";

const levelInfo: Record<
  Level,
  { icon: React.ElementType; description: string }
> = {
  Beginner: {
    icon: Star,
    description: "Just starting out. I want to learn the fundamentals.",
  },
  Intermediate: {
    icon: GraduationCap,
    description: "I have some experience and want to deepen my knowledge.",
  },
  Advanced: {
    icon: BarChart,
    description: "I'm experienced and ready for complex topics.",
  },
};

interface LevelSelectionProps {
  track: Track;
  onLevelSelect: (level: Level) => void;
}

export function LevelSelection({ track, onLevelSelect }: LevelSelectionProps) {
  return (
    <Card className="animate-in fade-in-50 slide-in-from-bottom-5 duration-500">
      <CardHeader>
        <CardTitle className="text-center text-2xl font-headline">
          What's Your Level in {track}?
        </CardTitle>
        <CardDescription className="text-center">
          This helps us tailor the content just for you.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {levels.map((level) => {
          const Info = levelInfo[level];
          return (
            <button
              key={level}
              onClick={() => onLevelSelect(level)}
              className={cn(
                "group w-full text-left p-4 rounded-lg border bg-background hover:bg-primary/5 hover:border-primary/50 transition-all duration-200"
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-secondary rounded-md">
                    <Info.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-base">{level}</p>
                    <p className="text-sm text-muted-foreground">
                      {Info.description}
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </button>
          );
        })}
      </CardContent>
    </Card>
  );
}
