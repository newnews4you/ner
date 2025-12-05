import { Clock, CheckCircle2, Target, TrendingUp, Zap } from "lucide-react";

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
    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
          <Zap className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-gray-900 tracking-tight">Šiandienos statistika</h3>
          <p className="text-xs text-gray-500 font-medium">Jūsų šiandienos pasiekimai</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {/* Time Spent */}
        <div className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 rounded-md bg-blue-50 text-blue-600">
              <Clock className="w-4 h-4" />
            </div>
            <span className="text-xs font-medium text-gray-500">Laikas</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 tracking-tight">{todayTime}</p>
          <p className="text-[10px] font-medium text-gray-400 mt-1">šiandien</p>
        </div>

        {/* Completed Tasks */}
        <div className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 rounded-md bg-green-50 text-green-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <span className="text-xs font-medium text-gray-500">Užduotys</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 tracking-tight">
            {completedTasks}/{totalTasks}
          </p>
          <div className="w-full h-1.5 bg-gray-100 rounded-full mt-2 overflow-hidden">
            <div
              className="h-full bg-green-500 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>

        {/* Upcoming Deadline */}
        {upcomingDeadline && (
          <div className="bg-white rounded-xl p-4 border border-gray-200 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group col-span-2 sm:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 rounded-md bg-orange-50 text-orange-600">
                <Target className="w-4 h-4" />
              </div>
              <span className="text-xs font-medium text-gray-500">Artimiausias</span>
            </div>
            <p className="text-sm font-semibold text-gray-900 line-clamp-1 mb-1">
              {upcomingDeadline.subject}
            </p>
            <p className="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full inline-block">
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
        <div className="mt-6 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2 text-sm font-medium text-green-600 bg-green-50 px-3 py-2 rounded-lg">
            <TrendingUp className="w-4 h-4" />
            <span>Puikiai sekasi! Tęskite tokiu tempu! 🚀</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuickStats;
