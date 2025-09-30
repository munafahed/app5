import { Flame, Coins, User, Settings, LogOut } from "lucide-react";
import { DoseWiseLogo } from "@/components/dose-wise/logo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import type { User as DBUser } from "@/lib/db/schema";
import type { UserProgress } from "@/lib/firestore";
import { GameStats, XPProgressBar } from "@/components/dose-wise/game-stats";
import { calculateXPForNextLevel } from "@/lib/game-utils";

interface HeaderProps {
  userData: DBUser | null;
  gameProgress?: UserProgress | null;
}

export function Header({ userData, gameProgress }: HeaderProps) {
  const { user } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    const firebaseAuth = auth();
    await signOut(firebaseAuth);
    router.push("/login");
  };

  const xpProgress = gameProgress 
    ? calculateXPForNextLevel(gameProgress.xp)
    : { current: 0, needed: 100, percentage: 0 };

  return (
    <div className="w-full space-y-4 mb-8">
      <header className="w-full flex items-center justify-between">
        <DoseWiseLogo className="h-8 w-auto" />
        <div className="flex items-center gap-4">
          {gameProgress ? (
            <GameStats
              hearts={gameProgress.hearts}
              streak={gameProgress.streak}
              xp={gameProgress.xp}
              currentLevel={gameProgress.currentLevel}
              xpForNextLevel={xpProgress}
            />
          ) : (
            <>
              <div className="flex items-center gap-2 rounded-full bg-card px-3 py-1.5 text-sm font-medium shadow-sm">
                <Flame className="h-5 w-5 text-orange-500" />
                <span>{userData?.streak || 0}</span>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-card px-3 py-1.5 text-sm font-medium shadow-sm">
                <Coins className="h-5 w-5 text-yellow-500" />
                <span>{userData?.points || 0}</span>
              </div>
            </>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user?.photoURL || `https://picsum.photos/seed/${user?.uid}/100/100`} alt={user?.displayName || "User"} />
                  <AvatarFallback>{user?.displayName?.charAt(0) || 'U'}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.displayName || "User"}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      {gameProgress && (
        <XPProgressBar 
          currentLevel={gameProgress.currentLevel}
          xpForNextLevel={xpProgress}
        />
      )}
    </div>
  );
}
