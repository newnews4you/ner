import { Calendar, Clock, AlertCircle, ChevronRight, Flame } from "lucide-react";

interface Deadline {
  id: number;
  subject: string;
  title: string;
  date: string;
  daysLeft: number;
  urgent: boolean;
}

interface DeadlinePanelProps {
  deadlines: Deadline[];
  onDeadlineClick?: (subjectName: string) => void;
}

const DeadlinePanel = ({ deadlines, onDeadlineClick }: DeadlinePanelProps) => {
  return (
    <div className="glass rounded-xl sm:rounded-2xl p-4 sm:p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-4 sm:mb-5">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl gradient-orange-red flex items-center justify-center shadow-lg shadow-orange-500/30">
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-semibold text-foreground">Artėjantys atsiskaitymai</h3>
            <p className="text-[10px] sm:text-xs text-muted-foreground">{deadlines.length} artėjančios užduotys</p>
          </div>
        </div>
        <button className="text-xs sm:text-sm text-primary hover:text-primary/80 transition-colors flex items-center gap-1">
          Visi <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
        </button>
      </div>

      {/* Mobile: Vertical stack, Tablet: 2 cols, Desktop: 4 cols */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
        {deadlines.map((deadline) => (
          <div
            key={deadline.id}
            className={`p-3 sm:p-4 rounded-lg sm:rounded-xl bg-secondary/50 border transition-all duration-200 hover:bg-secondary/70 cursor-pointer group relative overflow-hidden ${deadline.urgent
                ? "border-orange-500/40 hover:border-orange-500/60"
                : "border-transparent hover:border-white/10"
              }`}
            onClick={() => onDeadlineClick?.(deadline.subject)}
          >
            {/* Urgent glow effect */}
            {deadline.urgent && (
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-transparent to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            )}
            <div className="flex items-start justify-between gap-2 mb-1.5 sm:mb-2 relative z-10">
              <span className={`text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full flex items-center gap-1 ${deadline.urgent
                  ? "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                  : "bg-secondary text-muted-foreground"
                }`}>
                {deadline.urgent && <Flame className="w-2.5 h-2.5" />}
                {deadline.subject}
              </span>
              {deadline.urgent && (
                <AlertCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-400 shrink-0 animate-pulse opacity-70" />
              )}
            </div>

            <p className="text-xs sm:text-sm font-medium text-foreground mb-2 sm:mb-3 line-clamp-2 group-hover:text-white transition-colors relative z-10">
              {deadline.title}
            </p>

            <div className="flex items-center justify-between text-[10px] sm:text-xs relative z-10">
              <div className="flex items-center gap-1 sm:gap-1.5 text-muted-foreground">
                <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span>{deadline.date}</span>
              </div>
              <div className={`flex items-center gap-1 sm:gap-1.5 font-medium ${deadline.urgent ? "text-orange-400" : "text-muted-foreground"
                }`}>
                <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span className={deadline.urgent ? "animate-pulse opacity-80" : ""}>
                  {deadline.daysLeft === 0
                    ? "Šiandien!"
                    : deadline.daysLeft === 1
                      ? "Rytoj"
                      : `${deadline.daysLeft} d.`}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeadlinePanel;
