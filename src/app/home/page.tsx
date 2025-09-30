
"use client";

import * as React from "react";
import type { DailyCard, Level, Track } from "@/lib/types";
import { generateDailyCardAction } from "@/app/actions";
import { getUserData, createOrUpdateUser, updateUserPreferences, updateUserStreak } from "@/app/user-actions";
import { getOrInitializeProgress, handleCorrectAnswer, handleWrongAnswer } from "@/app/game-actions";
import type { UserProgress } from "@/lib/firestore";
import { LevelSelection } from "@/components/dose-wise/onboarding/level-selection";
import { TrackSelection } from "@/components/dose-wise/onboarding/track-selection";
import { DailyDoseView } from "@/components/dose-wise/daily-dose-view";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Bot, Terminal } from "lucide-react";
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from "@/context/auth-context";
import { useToast } from "@/hooks/use-toast";
import type { User as DBUser } from "@/lib/db/schema";

type OnboardingStep = "track" | "level" | "dose";

export default function HomePage() {
  const { user, loading: authLoading } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();

  const startOnboarding = searchParams.get('onboarding') === 'true';

  const [step, setStep] = React.useState<OnboardingStep>("track");
  const [track, setTrack] = React.useState<Track | null>(null);
  const [level, setLevel] = React.useState<Level | null>(null);
  const [card, setCard] = React.useState<(DailyCard & { id?: string }) | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [userData, setUserData] = React.useState<DBUser | null>(null);
  const [gameProgress, setGameProgress] = React.useState<UserProgress | null>(null);
  const [isAutoAdvancing, setIsAutoAdvancing] = React.useState(false);

  React.useEffect(() => {
    const initializeUser = async () => {
      if (!authLoading && user) {
        await createOrUpdateUser({
          id: user.uid,
          email: user.email!,
          displayName: user.displayName || undefined,
          photoURL: user.photoURL || undefined,
        });

        const dbUser = await getUserData(user.uid);
        setUserData(dbUser);

        const progressResult = await getOrInitializeProgress(user.uid);
        if (progressResult.success && progressResult.progress) {
          setGameProgress(progressResult.progress);
        }

        if (startOnboarding || !dbUser?.track || !dbUser?.level) {
          setStep("track");
        } else {
          setTrack(dbUser.track as Track);
          setLevel(dbUser.level as Level);
          setStep("dose");
          await updateUserStreak(user.uid);
          const updatedUser = await getUserData(user.uid);
          setUserData(updatedUser);
        }
      }
    };

    initializeUser();
  }, [user, authLoading, startOnboarding]);


  const handleTrackSelect = (selectedTrack: Track) => {
    setTrack(selectedTrack);
    setStep("level");
  };

  const handleLevelSelect = async (selectedLevel: Level) => {
    setLevel(selectedLevel);
    
    if (user && track) {
      await updateUserPreferences(user.uid, track, selectedLevel);
      await updateUserStreak(user.uid);
      const updatedUser = await getUserData(user.uid);
      setUserData(updatedUser);
    }
    
    setStep("dose");
    router.push('/home', { scroll: false });
  };

  const fetchQuestionFromFirestoreOrAI = async () => {
    if (!user || !track) return false;

    setLoading(true);
    setError(null);
    
    try {
      const { getNextQuestion } = await import("@/lib/firestore");
      const formattedTrack = track.toLowerCase().replace(/ & /g, "/");
      const nextQuestion = await getNextQuestion(user.uid, formattedTrack);
      
      if (nextQuestion) {
        setCard({
          title: nextQuestion.title,
          term: nextQuestion.term,
          definition: nextQuestion.definition,
          example: nextQuestion.example,
          why: nextQuestion.why,
          level: nextQuestion.level === 1 ? "beginner" : nextQuestion.level === 2 ? "intermediate" : "advanced",
          track: nextQuestion.track,
          quiz: nextQuestion.quiz,
          tags: nextQuestion.tags,
          locale: "en",
          id: nextQuestion.id,
        });
        return true;
      } else {
        const finalLevel = level || 'Beginner';
        const result = await generateDailyCardAction({
          track: formattedTrack,
          level: finalLevel.toLowerCase() as "beginner" | "intermediate" | "advanced",
          locale: "en",
        });

        if (result.success && result.data) {
          setCard(result.data);
          return true;
        } else {
          setError(!result.success && 'error' in result ? result.error : "No more questions available.");
          return false;
        }
      }
    } catch (e) {
      setError("Failed to load question.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (step === "dose" && !card && !authLoading && !isAutoAdvancing && !loading && !error && user) {
      fetchQuestionFromFirestoreOrAI();
    }
  }, [step, card, authLoading, isAutoAdvancing, loading, error, user]);

  const loadNextQuestion = async () => {
    setIsAutoAdvancing(true);
    setCard(null);
    await fetchQuestionFromFirestoreOrAI();
    setIsAutoAdvancing(false);
  };

  const handleAnswerSubmit = async (isCorrect: boolean) => {
    if (!user || !card?.id) return;

    try {
      let result;
      if (isCorrect) {
        result = await handleCorrectAnswer(user.uid, card.id);
        toast({
          title: "Correct! +10 XP",
          description: "Great job! Keep learning.",
          variant: "default",
        });
        
        setTimeout(() => {
          loadNextQuestion();
        }, 1500);
      } else {
        result = await handleWrongAnswer(user.uid, card.id);
        toast({
          title: "Incorrect - 1 Heart",
          description: "Don't worry, you'll see this question again.",
          variant: "destructive",
        });
      }

      if (result.success && result.progress) {
        setGameProgress(result.progress);
      }
    } catch (error) {
      console.error("Error handling answer:", error);
      toast({
        title: "Error",
        description: "Failed to save your progress. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleRetry = () => {
    setError(null);
    fetchQuestionFromFirestoreOrAI();
  };

  const renderContent = () => {
    if (authLoading) {
      return <LoadingState message="Authenticating..." />;
    }

    switch (step) {
      case "track":
        return <TrackSelection onTrackSelect={handleTrackSelect} />;
      case "level":
        return <LevelSelection onLevelSelect={handleLevelSelect} track={track!} />;
      case "dose":
        if (loading) {
          return <LoadingState message="Crafting your daily dose..." />;
        }
        if (error) {
          return <ErrorState error={error} onRetry={handleRetry} />;
        }
        if (card) {
          return <DailyDoseView card={card} userData={userData} gameProgress={gameProgress} userId={user?.uid} onAnswerSubmit={handleAnswerSubmit} />;
        }
        return <LoadingState message="Preparing your card..." />; // Fallback loading
      default:
        return <TrackSelection onTrackSelect={handleTrackSelect} />;
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-2xl">{renderContent()}</div>
    </main>
  );
}

function LoadingState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center space-y-6 text-center">
       <div className="p-4 bg-primary/10 rounded-full">
         <Bot className="w-12 h-12 text-primary animate-pulse" />
      </div>
      <h2 className="text-2xl font-bold">{message}</h2>
      <div className="w-full space-y-4">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    </div>
  );
}

function ErrorState({ error, onRetry }: { error: string; onRetry?: () => void }) {
  return (
    <div className="space-y-4">
      <Alert variant="destructive">
        <Terminal className="h-4 w-4" />
        <AlertTitle>Generation Failed</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
      {onRetry && (
        <Button onClick={onRetry} className="w-full">
          Try Again
        </Button>
      )}
    </div>
  );
}
