"use server";

import {
  generateDailyCard,
  type GenerateDailyCardInput,
} from "@/ai/flows/generate-daily-card";
import { type DailyCard } from "@/lib/types";

export async function generateDailyCardAction(input: GenerateDailyCardInput): Promise<{ success: true; data: DailyCard & { id: string } } | { success: false; error: string }> {
  try {
    const card = await generateDailyCard(input);
    
    const { saveQuestion } = await import("@/lib/firestore");
    
    const levelMap: Record<string, number> = {
      'beginner': 1,
      'intermediate': 2,
      'advanced': 3,
    };
    
    const questionId = await saveQuestion({
      title: card.title,
      term: card.term,
      definition: card.definition,
      example: card.example,
      why: card.why,
      level: levelMap[card.level] || 1,
      track: card.track,
      quiz: card.quiz,
      tags: card.tags,
    });

    if (!questionId) {
      console.warn("Failed to save question to Firestore, continuing anyway");
    }

    return { success: true, data: { ...card, id: questionId || `temp-${Date.now()}` } };
  } catch (error) {
    console.error("Error generating daily card:", error);
    return { success: false, error: "Failed to generate a new card from our AI. Please try again later." };
  }
}
