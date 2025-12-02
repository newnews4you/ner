import { Trophy, Star, Target, Zap, Flame, BookOpen, Clock, Award } from "lucide-react";

interface Achievement {
  id: number;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
  gradient: string;
}

interface AchievementsProps {
  achievements: Achievement[];
}

const Achievements = ({ achievements }: AchievementsProps) => {
  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;

  return (
    <div className="glass rounded-xl sm:rounded-2xl p-4 sm:p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-4 sm:mb-5">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl gradient-indigo-purple flex items-center justify-center shadow-lg shadow-purple-500/30">
            <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-semibold text-foreground">Pasiekimai</h3>
            <p className="text-[10px] sm:text-xs text-muted-foreground">
              {unlockedCount} / {totalCount} atrakinta
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-lg sm:text-xl font-bold text-foreground">
            {Math.round((unlockedCount / totalCount) * 100)}%
          </p>
          <p className="text-[10px] sm:text-xs text-muted-foreground">Užbaigta</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4 sm:mb-5">
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full gradient-indigo-purple rounded-full transition-all duration-500"
            style={{ width: `${(unlockedCount / totalCount) * 100}%` }}
          />
        </div>
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
        {achievements.map((achievement) => {
          const Icon = achievement.icon;
          const progressPercent = achievement.progress && achievement.maxProgress
            ? (achievement.progress / achievement.maxProgress) * 100
            : 0;

          return (
            <div
              key={achievement.id}
              className={`relative p-3 sm:p-4 rounded-lg sm:rounded-xl border transition-all ${
                achievement.unlocked
                  ? `${achievement.gradient} border-transparent shadow-lg`
                  : "bg-secondary/30 border-white/10 opacity-60"
              } group hover:scale-105 cursor-pointer`}
            >
              {/* Unlocked badge */}
              {achievement.unlocked && (
                <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-yellow-400 flex items-center justify-center shadow-lg animate-pulse">
                  <Star className="w-3 h-3 text-yellow-900" fill="currentColor" />
                </div>
              )}

              <div className="flex flex-col items-center text-center gap-2">
                <div
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center ${
                    achievement.unlocked
                      ? "bg-white/20"
                      : "bg-secondary/50"
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 sm:w-6 sm:h-6 ${
                      achievement.unlocked ? "text-white" : "text-muted-foreground"
                    }`}
                  />
                </div>
                <div className="space-y-1">
                  <p
                    className={`text-[10px] sm:text-xs font-semibold line-clamp-1 ${
                      achievement.unlocked ? "text-white" : "text-foreground"
                    }`}
                  >
                    {achievement.title}
                  </p>
                  {!achievement.unlocked && achievement.progress !== undefined && (
                    <div className="space-y-1">
                      <div className="h-1 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full gradient-purple-pink rounded-full transition-all"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                      <p className="text-[9px] text-muted-foreground">
                        {achievement.progress} / {achievement.maxProgress}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Tooltip on hover */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                <div className="glass rounded-lg p-2 text-xs text-foreground whitespace-nowrap border border-white/10 shadow-xl">
                  {achievement.description}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Mock achievements data
export const mockAchievements: Achievement[] = [
  {
    id: 1,
    title: "Pirmieji žingsniai",
    description: "Užbaigti pirmąją temą",
    icon: Target,
    unlocked: true,
    gradient: "gradient-green-teal",
  },
  {
    id: 2,
    title: "7 dienų serija",
    description: "Mokytis 7 dienas iš eilės",
    icon: Flame,
    unlocked: false,
    progress: 5,
    maxProgress: 7,
    gradient: "gradient-orange-red",
  },
  {
    id: 3,
    title: "Greitas mokinys",
    description: "Užbaigti 10 temų per savaitę",
    icon: Zap,
    unlocked: false,
    progress: 7,
    maxProgress: 10,
    gradient: "gradient-cyan-blue",
  },
  {
    id: 4,
    title: "100% kurso",
    description: "Užbaigti visą kursą",
    icon: BookOpen,
    unlocked: false,
    progress: 72,
    maxProgress: 100,
    gradient: "gradient-purple-pink",
  },
  {
    id: 5,
    title: "Naktinis mokinys",
    description: "Mokytis 5 valandas per dieną",
    icon: Clock,
    unlocked: true,
    gradient: "gradient-indigo-purple",
  },
  {
    id: 6,
    title: "Perfekcionistas",
    description: "Gauti 100% visuose testuose",
    icon: Award,
    unlocked: false,
    progress: 3,
    maxProgress: 5,
    gradient: "gradient-cyan-blue",
  },
  {
    id: 7,
    title: "30 dienų šampionas",
    description: "Mokytis 30 dienų iš eilės",
    icon: Trophy,
    unlocked: false,
    progress: 5,
    maxProgress: 30,
    gradient: "gradient-orange-red",
  },
  {
    id: 8,
    title: "Žvaigždė",
    description: "Užbaigti 50 temų",
    icon: Star,
    unlocked: false,
    progress: 23,
    maxProgress: 50,
    gradient: "gradient-purple-pink",
  },
];

export default Achievements;

