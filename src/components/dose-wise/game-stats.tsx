"use client";

import * as React from "react";
import { Heart, Flame, Zap } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { MAX_HEARTS as DEFAULT_MAX_HEARTS } from "@/lib/game-utils";

interface GameStatsProps {
  hearts: number;
  maxHearts?: number;
  streak: number;
  xp: number;
  currentLevel: number;
  xpForNextLevel: {
    current: number;
    needed: number;
    percentage: number;
  };
  className?: string;
}

export function GameStats({
  hearts,
  maxHearts = DEFAULT_MAX_HEARTS,
  streak,
  xp,
  currentLevel,
  xpForNextLevel,
  className,
}: GameStatsProps) {
  return (
    <div className={cn("flex items-center gap-4 flex-wrap", className)}>
      <div className="flex items-center gap-2">
        {Array.from({ length: maxHearts }).map((_, i) => (
          <Heart
            key={i}
            className={cn(
              "w-5 h-5 transition-all",
              i < hearts
                ? "fill-red-500 text-red-500"
                : "fill-gray-200 dark:fill-gray-700 text-gray-200 dark:text-gray-700"
            )}
          />
        ))}
      </div>
      
      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-100 dark:bg-orange-900/30 rounded-full">
        <Flame className="w-4 h-4 text-orange-500" />
        <span className="text-sm font-semibold text-orange-700 dark:text-orange-300">
          {streak}
        </span>
      </div>
      
      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
        <Zap className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
        <span className="text-sm font-semibold text-yellow-700 dark:text-yellow-300">
          {xp} XP
        </span>
      </div>
    </div>
  );
}

interface XPProgressBarProps {
  currentLevel: number;
  xpForNextLevel: {
    current: number;
    needed: number;
    percentage: number;
  };
  className?: string;
}

export function XPProgressBar({ currentLevel, xpForNextLevel, className }: XPProgressBarProps) {
  return (
    <div className={cn("w-full space-y-2", className)}>
      <div className="flex items-center justify-between text-sm">
        <span className="font-semibold text-primary">Level {currentLevel}</span>
        <span className="text-muted-foreground">
          {xpForNextLevel.current} / {xpForNextLevel.needed} XP
        </span>
      </div>
      <Progress value={xpForNextLevel.percentage} className="h-2" />
    </div>
  );
}
