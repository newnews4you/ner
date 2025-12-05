import { Map, CheckCircle2, Circle, ArrowRight, Sparkles, Target, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

interface LearningStep {
  id: string;
  title: string;
  description: string;
  estimatedTime: string;
  difficulty: "easy" | "medium" | "hard";
  completed: boolean;
  prerequisites: string[];
  aiRecommendation?: string;
}

interface AILearningPathProps {
  subject: string;
  currentLevel: number;
  onStepComplete?: (stepId: string) => void;
}

const AILearningPath = ({ subject, currentLevel, onStepComplete }: AILearningPathProps) => {
  const [steps, setSteps] = useState<LearningStep[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLearningPath = async () => {
      setIsLoading(true);
      try {
        const { api } = await import('@/services/api');
        const generatedSteps = await api.ai.generateLearningPath(subject, currentLevel);

        // Transform API response to component format
        const transformedSteps: LearningStep[] = generatedSteps.map((step: any, index: number) => ({
          id: step.id || String(index + 1),
          title: step.title,
          description: step.description || "",
          estimatedTime: step.estimatedTime || "30-45 min",
          difficulty: step.difficulty || (index < 2 ? "easy" : index < 3 ? "medium" : "hard"),
          completed: index < currentLevel,
          prerequisites: index > 0 ? [String(index)] : [],
          aiRecommendation: step.description || "AI rekomenduoja šį žingsnį",
        }));

        setSteps(transformedSteps);
      } catch (error) {
        console.error('Failed to generate learning path:', error);
        // Fallback to empty array
        setSteps([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLearningPath();
  }, [subject, currentLevel]);
  const [expandedStep, setExpandedStep] = useState<string | null>(null);

  const getDifficultyColor = (difficulty: LearningStep["difficulty"]) => {
    switch (difficulty) {
      case "easy":
        return "text-green-600 bg-green-100";
      case "medium":
        return "text-yellow-600 bg-yellow-100";
      case "hard":
        return "text-orange-600 bg-orange-100";
    }
  };

  const getDifficultyLabel = (difficulty: LearningStep["difficulty"]) => {
    switch (difficulty) {
      case "easy":
        return "Lengvas";
      case "medium":
        return "Vidutinis";
      case "hard":
        return "Sunkus";
    }
  };

  const canAccessStep = (step: LearningStep) => {
    if (step.prerequisites.length === 0) return true;
    return step.prerequisites.every(prereqId =>
      steps.find(s => s.id === prereqId)?.completed
    );
  };

  const completedCount = steps.filter(s => s.completed).length;
  const progress = steps.length > 0 ? (completedCount / steps.length) * 100 : 0;

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 text-center animate-fade-in border border-gray-200 shadow-sm">
        <Loader2 className="w-12 h-12 mx-auto mb-4 text-blue-500 animate-spin" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          AI generuoja mokymosi kelią...
        </h3>
        <p className="text-sm text-gray-500">
          Analizuojame jūsų mokymosi lygį ir sukuriu personalizuotą planą
        </p>
      </div>
    );
  }

  if (steps.length === 0) {
    return (
      <div className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 text-center animate-fade-in border border-gray-200 shadow-sm">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
          <Map className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Nepavyko sugeneruoti mokymosi kelio
        </h3>
        <p className="text-sm text-gray-500">
          Bandykite dar kartą arba susisiekite su palaikymu
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 animate-fade-in border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-5">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-indigo-100 flex items-center justify-center shadow-sm">
            <Map className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-semibold text-gray-900 flex items-center gap-2">
              AI Mokymosi Kelias
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-600">
                Personalizuotas
              </span>
            </h3>
            <p className="text-[10px] sm:text-xs text-gray-500">
              {subject} • {completedCount} / {steps.length} žingsniai
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-lg sm:text-xl font-bold text-gray-900">{Math.round(progress)}%</p>
          <p className="text-[10px] sm:text-xs text-gray-500">Progresas</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4 sm:mb-6">
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-500 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Learning Steps */}
      <div className="space-y-3">
        {steps.map((step, index) => {
          const canAccess = canAccessStep(step);
          const isExpanded = expandedStep === step.id;

          return (
            <div
              key={step.id}
              className={`p-3 sm:p-4 rounded-lg sm:rounded-xl border transition-all ${step.completed
                  ? "bg-green-50 border-green-200"
                  : canAccess
                    ? "bg-white border-gray-200 hover:border-blue-300 hover:shadow-md cursor-pointer"
                    : "bg-gray-50 border-gray-100 opacity-60"
                }`}
              onClick={() => canAccess && !step.completed && setExpandedStep(isExpanded ? null : step.id)}
            >
              <div className="flex items-start gap-3">
                {/* Step Number */}
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${step.completed
                    ? "bg-green-100"
                    : canAccess
                      ? "bg-indigo-100"
                      : "bg-gray-200"
                  }`}>
                  {step.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                  ) : (
                    <span className={`text-xs font-bold ${canAccess ? "text-indigo-600" : "text-gray-500"}`}>{index + 1}</span>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className={`text-sm font-semibold ${step.completed ? "text-green-700" : "text-gray-900"
                      }`}>
                      {step.title}
                    </h4>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full shrink-0 ${getDifficultyColor(step.difficulty)}`}>
                      {getDifficultyLabel(step.difficulty)}
                    </span>
                  </div>

                  <p className="text-xs text-gray-500 mb-2 line-clamp-1">
                    {step.description}
                  </p>

                  <div className="flex items-center gap-3 text-[10px] text-gray-500 mb-2">
                    <span>⏱ {step.estimatedTime}</span>
                    {step.prerequisites.length > 0 && (
                      <span>🔗 Reikia {step.prerequisites.length} žingsnio</span>
                    )}
                  </div>

                  {/* AI Recommendation */}
                  {step.aiRecommendation && (isExpanded || step.completed) && (
                    <div className="mt-2 p-2 rounded-lg bg-blue-50 border border-blue-100 animate-fade-in">
                      <div className="flex items-center gap-2 mb-1">
                        <Sparkles className="w-3 h-3 text-blue-500" />
                        <span className="text-[10px] font-medium text-blue-600">AI Rekomendacija</span>
                      </div>
                      <p className="text-[10px] text-gray-700">{step.aiRecommendation}</p>
                    </div>
                  )}

                  {/* Action Button */}
                  {canAccess && !step.completed && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onStepComplete) {
                          onStepComplete(step.id);
                        }
                      }}
                      className="mt-2 px-4 py-2 rounded-lg bg-indigo-500 text-white text-xs font-medium hover:bg-indigo-600 transition-all flex items-center gap-2 shadow-sm"
                    >
                      Pradėti žingsnį
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}

                  {!canAccess && (
                    <p className="text-[10px] text-gray-400 mt-2">
                      🔒 Užrakinta. Užbaikite ankstesnius žingsnius.
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* AI Insight */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-start gap-2 p-3 rounded-lg bg-blue-50 border border-blue-100">
          <Sparkles className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-medium text-blue-700 mb-1">AI Analizė</p>
            <p className="text-[10px] text-gray-700">
              Remiantis jūsų mokymosi greičiu, AI prognozuoja, kad užbaigsite šį kelią per{" "}
              <span className="font-semibold text-blue-600">
                {Math.ceil((steps.length - completedCount) * 1.5)} dienas
              </span>
              . Tęskite tokiu tempu! 🚀
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AILearningPath;
