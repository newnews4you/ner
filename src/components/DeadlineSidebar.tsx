import { Calendar, Clock, AlertCircle } from "lucide-react";

interface Deadline {
  id: number;
  subject: string;
  title: string;
  date: string;
  daysLeft: number;
  urgent: boolean;
}

interface DeadlineSidebarProps {
  deadlines: Deadline[];
}

const DeadlineSidebar = ({ deadlines }: DeadlineSidebarProps) => {
  return (
    <aside className="w-80 shrink-0 hidden lg:block">
      <div className="glass rounded-2xl p-6 sticky top-6 animate-slide-in-right">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl gradient-orange-red flex items-center justify-center">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-foreground">Artėjantys atsiskaitymai</h2>
            <p className="text-xs text-muted-foreground">Artimiausios užduotys</p>
          </div>
        </div>

        <div className="space-y-3">
          {deadlines.map((deadline) => (
            <div
              key={deadline.id}
              className={`p-4 rounded-xl bg-secondary/50 border transition-all duration-200 hover:bg-secondary/70 ${
                deadline.urgent 
                  ? "border-orange-500/30 hover:border-orange-500/50" 
                  : "border-transparent hover:border-white/10"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {deadline.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {deadline.subject}
                  </p>
                </div>
                {deadline.urgent && (
                  <AlertCircle className="w-4 h-4 text-orange-400 shrink-0" />
                )}
              </div>

              <div className="flex items-center gap-4 mt-3 text-xs">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{deadline.date}</span>
                </div>
                <div className={`flex items-center gap-1.5 ${
                  deadline.urgent ? "text-orange-400" : "text-muted-foreground"
                }`}>
                  <Clock className="w-3.5 h-3.5" />
                  <span>
                    {deadline.daysLeft === 0 
                      ? "Šiandien!" 
                      : deadline.daysLeft === 1 
                        ? "Rytoj" 
                        : `Liko ${deadline.daysLeft} d.`}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button className="w-full mt-4 py-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary/50">
          Rodyti visus →
        </button>
      </div>
    </aside>
  );
};

export default DeadlineSidebar;
