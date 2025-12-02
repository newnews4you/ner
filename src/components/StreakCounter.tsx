import { Flame, Calendar, Trophy } from "lucide-react";
import useLocalStorage from "@/hooks/useLocalStorage";
import { StreakData, updateStreak, getInitialStreakData, calculateStreak } from "@/utils/streakUtils";
import { useEffect } from "react";

interface StreakCounterProps {
  onStudyComplete?: () => void;
}

const StreakCounter = ({ onStudyComplete }: StreakCounterProps) => {
  const [streakData, setStreakData] = useLocalStorage<StreakData>("streakData", getInitialStreakData());

  // Update streak when study is completed
  useEffect(() => {
    if (onStudyComplete) {
      const updated = updateStreak(streakData);
      if (updated.lastStudyDate !== streakData.lastStudyDate) {
        setStreakData(updated);
      }
    }
  }, [onStudyComplete]);

  // Calculate current streak based on last study date
  const currentStreak = streakData.lastStudyDate 
    ? calculateStreak(streakData.lastStudyDate) > 0 
      ? streakData.currentStreak 
      : 0
    : 0;
  const longestStreak = streakData.longestStreak;
  const getStreakMessage = () => {
    if (currentStreak === 0) return "Pradėkite mokymosi seriją!";
    if (currentStreak < 7) return "Puikiai tęsiama!";
    if (currentStreak < 30) return "Įspūdinga serija!";
    return "Neįtikėtina! Jūs tikras šampionas! 🔥";
  };

  const getStreakColor = () => {
    if (currentStreak < 3) return "text-orange-400";
    if (currentStreak < 7) return "text-orange-500";
    if (currentStreak < 30) return "text-red-500";
    return "text-red-600";
  };

  return (
    <div className="glass rounded-xl sm:rounded-2xl p-4 sm:p-6 border-2 border-orange-500/20 relative overflow-hidden animate-fade-in">
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-transparent to-orange-500/10" />
      <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full bg-orange-500/10 blur-3xl" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl gradient-orange-red flex items-center justify-center shadow-lg shadow-orange-500/30 animate-pulse">
              <Flame className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-semibold text-foreground">Mokymosi serija</h3>
              <p className="text-[10px] sm:text-xs text-muted-foreground">{getStreakMessage()}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {/* Current Streak */}
          <div className="bg-secondary/50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-orange-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Flame className={`w-4 h-4 sm:w-5 sm:h-5 ${getStreakColor()} animate-pulse`} />
              <span className="text-[10px] sm:text-xs text-muted-foreground">Dabartinė serija</span>
            </div>
            <p className={`text-2xl sm:text-3xl font-bold ${getStreakColor()} mb-1`}>
              {currentStreak}
            </p>
            <p className="text-[10px] sm:text-xs text-muted-foreground">dienos</p>
          </div>

          {/* Longest Streak */}
          <div className="bg-secondary/50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
              <span className="text-[10px] sm:text-xs text-muted-foreground">Geriausia serija</span>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-yellow-400 mb-1">
              {longestStreak}
            </p>
            <p className="text-[10px] sm:text-xs text-muted-foreground">dienos</p>
          </div>
        </div>

        {/* Progress to next milestone */}
        {currentStreak > 0 && (
          <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] sm:text-xs text-muted-foreground">Kitas pasiekimas</span>
              <span className="text-[10px] sm:text-xs text-orange-400 font-medium">
                {currentStreak < 7 ? `${7 - currentStreak} dienos iki 7` : 
                 currentStreak < 30 ? `${30 - currentStreak} dienos iki 30` : 
                 "🏆 Visi pasiekimai!"}
              </span>
            </div>
            <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full gradient-orange-red rounded-full transition-all duration-500"
                style={{
                  width: `${currentStreak < 7 
                    ? (currentStreak / 7) * 100 
                    : currentStreak < 30 
                    ? ((currentStreak - 7) / 23) * 100 
                    : 100}%`
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StreakCounter;

