"use client";

import type { DailyCard as DailyCardType } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Quiz } from "@/components/dose-wise/quiz";
import {
  Bookmark,
  ChevronsDown,
  ChevronsUp,
  Lightbulb,
  Check,
  CircleHelp,
  BookOpen,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

interface DailyCardProps {
  card: DailyCardType & { id?: string };
  userId?: string;
  onAnswerSubmit?: (isCorrect: boolean) => Promise<void>;
}

export function DailyCard({ card, userId, onAnswerSubmit }: DailyCardProps) {
  const { toast } = useToast();

  const handleAction = (action: string) => {
    toast({
      title: "Action Recorded",
      description: `You've marked this card as "${action}".`,
    });
  };

  return (
    <Card className="w-full animate-in fade-in-50 slide-in-from-bottom-5 duration-500">
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <CardTitle className="font-headline">{card.title}</CardTitle>
                <CardDescription>Term of the day: {card.term}</CardDescription>
            </div>
            <Badge variant="outline" className="capitalize">{card.level}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-semibold mb-2 text-lg">Definition</h3>
          <p className="text-muted-foreground leading-relaxed">{card.definition}</p>
        </div>
        
        <Separator />
        
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="example">
            <AccordionTrigger>
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <span className="font-semibold">Practical Example</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground leading-relaxed">
              {card.example}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="why">
            <AccordionTrigger>
              <div className="flex items-center gap-2">
                <CircleHelp className="h-5 w-5 text-accent" />
                <span className="font-semibold">Why it matters</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground leading-relaxed">
              {card.why}
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Separator />

        <Quiz quiz={card.quiz} questionId={card.id} userId={userId} onAnswerSubmit={onAnswerSubmit} />

      </CardContent>
      <CardFooter className="flex-col items-stretch gap-4">
         <Button size="lg" onClick={() => handleAction("Got it!")}>
            <Check className="mr-2 h-5 w-5" /> I got it!
        </Button>
        <div className="grid grid-cols-4 gap-2">
          <Button variant="outline" className="h-12" onClick={() => handleAction('Saved')}>
            <Bookmark className="h-5 w-5" />
          </Button>
          <Button variant="outline" className="h-12" onClick={() => handleAction('Re-explained')}>
            <Lightbulb className="h-5 w-5" />
          </Button>
          <Button variant="outline" className="h-12" onClick={() => handleAction('Harder')}>
            <ChevronsUp className="h-5 w-5" />
          </Button>
          <Button variant="outline" className="h-12" onClick={() => handleAction('Easier')}>
            <ChevronsDown className="h-5 w-5" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
