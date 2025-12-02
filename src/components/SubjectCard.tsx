import { LucideIcon, ArrowRight, TrendingUp } from "lucide-react";

interface SubjectCardProps {
  subject: string;
  teacher: string;
  progress: number;
  gradient: string;
  icon: LucideIcon;
  onClick: () => void;
}

const SubjectCard = ({ subject, teacher, progress, gradient, icon: Icon, onClick }: SubjectCardProps) => {
  const getProgressColor = () => {
    if (progress >= 80) return "text-green-400";
    if (progress >= 60) return "text-cyan-400";
    if (progress >= 40) return "text-yellow-400";
    return "text-orange-400";
  };

  const getProgressLabel = () => {
    if (progress >= 80) return "Puikiai!";
    if (progress >= 60) return "Gerai";
    if (progress >= 40) return "Vidutiniškai";
    return "Pradžia";
  };

  return (
    <div
      onClick={onClick}
      className="glass glass-hover rounded-2xl p-5 sm:p-6 cursor-pointer group animate-fade-in relative overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
    >
      {/* Hover gradient overlay */}
      <div className={`absolute inset-0 ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
      
      <div className="relative z-10 flex flex-col gap-4">
        {/* Header with Icon */}
        <div className="flex items-start justify-between">
          <div className={`${gradient} w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
            <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-white" strokeWidth={1.5} />
          </div>
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full bg-secondary/50 border border-white/10 ${getProgressColor()}`}>
            <TrendingUp className="w-3 h-3" />
            <span className="text-[10px] sm:text-xs font-medium">{getProgressLabel()}</span>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-1">
          <h3 className="text-base sm:text-lg font-semibold text-foreground group-hover:text-white transition-colors line-clamp-1">
            {subject}
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground line-clamp-1">
            {teacher}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-muted-foreground">Progresas</span>
            <span className={`text-foreground font-semibold ${getProgressColor()}`}>{progress}%</span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden relative">
            <div
              className={`h-full ${gradient} rounded-full transition-all duration-700 ease-out relative`}
              style={{ width: `${progress}%` }}
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
            </div>
          </div>
        </div>

        {/* Action hint */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground group-hover:text-primary transition-colors pt-1">
          <span>Peržiūrėti detales</span>
          <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </div>
  );
};

export default SubjectCard;
