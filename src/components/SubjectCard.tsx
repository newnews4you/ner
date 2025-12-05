import { LucideIcon, ArrowRight, TrendingUp } from "lucide-react";

interface SubjectCardProps {
  subject: string;
  progress: number;
  gradient: string;
  icon: LucideIcon;
  onClick: () => void;
}

const SubjectCard = ({ subject, progress, gradient, icon: Icon, onClick }: SubjectCardProps) => {
  // Map subjects to darker, more visible colors
  const getColorTheme = () => {
    if (subject.includes("Matematika")) return { bg: "bg-blue-100", text: "text-blue-700", bar: "bg-blue-600" };
    if (subject.includes("Fizika")) return { bg: "bg-purple-100", text: "text-purple-700", bar: "bg-purple-600" };
    if (subject.includes("Lietuvių")) return { bg: "bg-yellow-100", text: "text-yellow-700", bar: "bg-yellow-600" };
    if (subject.includes("Anglų")) return { bg: "bg-red-100", text: "text-red-700", bar: "bg-red-600" };
    if (subject.includes("IT") || subject.includes("Informatika")) return { bg: "bg-green-100", text: "text-green-700", bar: "bg-green-600" };
    return { bg: "bg-gray-100", text: "text-gray-700", bar: "bg-gray-600" };
  };

  const theme = getColorTheme();

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl p-5 cursor-pointer group animate-fade-in relative overflow-hidden transition-all duration-300 border border-gray-200 shadow-sm hover:shadow-md hover:-translate-y-1"
    >
      <div className="relative z-10 flex flex-col gap-4">
        {/* Header with Icon */}
        <div className="flex items-start justify-between">
          <div className={`${theme.bg} w-12 h-12 rounded-xl flex items-center justify-center transition-colors`}>
            <Icon className={`w-6 h-6 ${theme.text}`} strokeWidth={2} />
          </div>
          {progress >= 90 && (
            <div className="px-2 py-1 rounded-full bg-green-50 border border-green-100 text-[10px] font-semibold text-green-700">
              Puikiai!
            </div>
          )}
        </div>

        {/* Content */}
        <div>
          <h3 className="text-base font-semibold text-gray-900 group-hover:text-gray-700 transition-colors line-clamp-1 tracking-tight">
            {subject}
          </h3>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2 pt-1">
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-400 font-medium">Progresas</span>
            <span className="font-semibold text-gray-900">{progress}%</span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full ${theme.bar} rounded-full transition-all duration-700 ease-out`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubjectCard;
