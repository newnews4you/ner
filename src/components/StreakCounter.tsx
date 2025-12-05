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
    if (currentStreak < 3) return "text-orange-500";
    if (currentStreak < 7) return "text-orange-600";
    if (currentStreak < 30) return "text-red-500";
    return "text-red-600";
  };

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-gray-200 shadow-sm relative overflow-hidden animate-fade-in">
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-orange-50 via-transparent to-orange-50 opacity-50" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-orange-100 flex items-center justify-center shadow-sm">
              <Flame className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-semibold text-gray-900">Mokymosi serija</h3>
              <p className="text-[10px] sm:text-xs text-gray-500">{getStreakMessage()}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {/* Current Streak */}
          <div className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <Flame className={`w-4 h-4 sm:w-5 sm:h-5 ${getStreakColor()} animate-pulse`} />
              <span className="text-[10px] sm:text-xs text-gray-500">Dabartinė serija</span>
            </div>
            <p className={`text-2xl sm:text-3xl font-bold ${getStreakColor()} mb-1`}>
              {currentStreak}
            </p>
            <p className="text-[10px] sm:text-xs text-gray-500">dienos</p>
          </div>

          {/* Longest Streak */}
          <div className="bg-gray-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
              <span className="text-[10px] sm:text-xs text-gray-500">Geriausia serija</span>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-yellow-500 mb-1">
              {longestStreak}
            </p>
            <p className="text-[10px] sm:text-xs text-gray-500">dienos</p>
          </div>
        </div>

        {/* Progress to next milestone */}
        {currentStreak > 0 && (
          <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] sm:text-xs text-gray-500">Kitas pasiekimas</span>
              <span className="text-[10px] sm:text-xs text-orange-500 font-medium">
                {currentStreak < 7 ? `${7 - currentStreak} dienos iki 7` :
                  currentStreak < 30 ? `${30 - currentStreak} dienos iki 30` :
                    "🏆 Visi pasiekimai!"}
              </span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-orange-500 rounded-full transition-all duration-500"
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

