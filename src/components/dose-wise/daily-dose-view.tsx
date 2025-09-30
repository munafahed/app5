import type { DailyCard as DailyCardType } from "@/lib/types";
import type { User } from "@/lib/db/schema";
import type { UserProgress } from "@/lib/firestore";
import { Header } from "@/components/dose-wise/header";
import { DailyCard } from "@/components/dose-wise/daily-card";

interface DailyDoseViewProps {
  card: DailyCardType & { id?: string };
  userData: User | null;
  gameProgress?: UserProgress | null;
  userId?: string;
  onAnswerSubmit?: (isCorrect: boolean) => Promise<void>;
}

export function DailyDoseView({ card, userData, gameProgress, userId, onAnswerSubmit }: DailyDoseViewProps) {
  return (
    <div className="w-full">
      <Header userData={userData} gameProgress={gameProgress} />
      <DailyCard card={card} userId={userId} onAnswerSubmit={onAnswerSubmit} />
    </div>
  );
}
