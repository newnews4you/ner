import { Clock, CheckCircle2, Target, TrendingUp, BookOpen, Zap } from "lucide-react";

interface QuickStatsProps {
  todayTime: string;
  completedTasks: number;
  totalTasks: number;
  upcomingDeadline?: {
    subject: string;
    daysLeft: number;
  };
}

const QuickStats = ({ todayTime, completedTasks, totalTasks, upcomingDeadline }: QuickStatsProps) => {
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="glass rounded-xl sm:rounded-2xl p-4 sm:p-6 animate-fade-in">
      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5">
        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl gradient-cyan-blue flex items-center justify-center shadow-lg shadow-cyan-500/30">
          <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
        </div>
        <div>
          <h3 className="text-sm sm:text-base font-semibold text-foreground">Šiandienos statistika</h3>
          <p className="text-[10px] sm:text-xs text-muted-foreground">Jūsų šiandienos pasiekimai</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
        {/* Time Spent */}
        <div className="bg-secondary/50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-white/5 hover:border-cyan-500/30 transition-colors group">
          <div className="flex items-center gap-1.5 sm:gap-2 mb-2">
            <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400" />
            <span className="text-[10px] sm:text-xs text-muted-foreground">Laikas</span>
          </div>
          <p className="text-lg sm:text-xl font-bold text-foreground">{todayTime}</p>
          <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">šiandien</p>
        </div>

        {/* Completed Tasks */}
        <div className="bg-secondary/50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-white/5 hover:border-green-500/30 transition-colors group">
          <div className="flex items-center gap-1.5 sm:gap-2 mb-2">
            <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-400" />
            <span className="text-[10px] sm:text-xs text-muted-foreground">Užduotys</span>
          </div>
          <p className="text-lg sm:text-xl font-bold text-foreground">
            {completedTasks}/{totalTasks}
          </p>
          <div className="w-full h-1 bg-secondary rounded-full mt-1.5 overflow-hidden">
            <div
              className="h-full gradient-green-teal rounded-full transition-all duration-500"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>

        {/* Upcoming Deadline */}
        {upcomingDeadline && (
          <div className="bg-secondary/50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-white/5 hover:border-orange-500/30 transition-colors group col-span-2 sm:col-span-1">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-2">
              <Target className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-400" />
              <span className="text-[10px] sm:text-xs text-muted-foreground">Artimiausias</span>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-foreground line-clamp-1 mb-1">
              {upcomingDeadline.subject}
            </p>
            <p className="text-[10px] sm:text-xs text-orange-400">
              {upcomingDeadline.daysLeft === 0
                ? "Šiandien!"
                : upcomingDeadline.daysLeft === 1
                ? "Rytoj"
                : `Liko ${upcomingDeadline.daysLeft} d.`}
            </p>
          </div>
        )}
      </div>

      {/* Motivation message */}
      {completionRate >= 80 && (
        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-green-400">
            <TrendingUp className="w-4 h-4" />
            <span>Puikiai sekasi! Tęskite tokiu tempu! 🚀</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuickStats;

