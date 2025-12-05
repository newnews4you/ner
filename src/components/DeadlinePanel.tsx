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
    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
            <Calendar className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900 tracking-tight">Artėjantys atsiskaitymai</h3>
            <p className="text-xs text-gray-500 font-medium">{deadlines.length} artėjančios užduotys</p>
          </div>
        </div>
        <button className="text-xs font-medium text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-1 px-2 py-1 rounded-md hover:bg-gray-50">
          Visi <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      {/* Mobile: Vertical stack, Tablet: 2 cols, Desktop: 4 cols */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {deadlines.map((deadline) => (
          <div
            key={deadline.id}
            className={`p-4 rounded-xl border transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 cursor-pointer group relative overflow-hidden ${deadline.urgent
              ? "bg-orange-50/30 border-orange-200 hover:border-orange-300"
              : "bg-white border-gray-200 hover:border-gray-300"
              }`}
            onClick={() => onDeadlineClick?.(deadline.subject)}
          >
            <div className="flex items-start justify-between gap-2 mb-3 relative z-10">
              <span className={`text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1 font-medium ${deadline.urgent
                ? "bg-orange-100 text-orange-700 border border-orange-200"
                : "bg-gray-100 text-gray-600 border border-gray-200"
                }`}>
                {deadline.urgent && <Flame className="w-3 h-3" />}
                {deadline.subject}
              </span>
              {deadline.urgent && (
                <AlertCircle className="w-4 h-4 text-orange-500 shrink-0 animate-pulse" />
              )}
            </div>

            <p className="text-sm font-medium text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors relative z-10">
              {deadline.title}
            </p>

            <div className="flex items-center justify-between text-xs relative z-10">
              <div className="flex items-center gap-1.5 text-gray-500">
                <Calendar className="w-3.5 h-3.5" />
                <span>{deadline.date}</span>
              </div>
              <div className={`flex items-center gap-1.5 font-medium ${deadline.urgent ? "text-orange-600" : "text-gray-500"
                }`}>
                <Clock className="w-3.5 h-3.5" />
                <span className={deadline.urgent ? "animate-pulse" : ""}>
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
