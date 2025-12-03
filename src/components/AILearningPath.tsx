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
        return "text-green-400 bg-green-500/20";
      case "medium":
        return "text-yellow-400 bg-yellow-500/20";
      case "hard":
        return "text-orange-400 bg-orange-500/20";
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
      <div className="glass rounded-xl sm:rounded-2xl p-6 sm:p-8 text-center animate-fade-in">
        <Loader2 className="w-12 h-12 mx-auto mb-4 text-primary animate-spin" />
        <h3 className="text-lg font-semibold text-foreground mb-2">
          AI generuoja mokymosi kelią...
        </h3>
        <p className="text-sm text-muted-foreground">
          Analizuojame jūsų mokymosi lygį ir sukuriu personalizuotą planą
        </p>
      </div>
    );
  }

  if (steps.length === 0) {
    return (
      <div className="glass rounded-xl sm:rounded-2xl p-6 sm:p-8 text-center animate-fade-in">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary/50 flex items-center justify-center">
          <Map className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Nepavyko sugeneruoti mokymosi kelio
        </h3>
        <p className="text-sm text-muted-foreground">
          Bandykite dar kartą arba susisiekite su palaikymu
        </p>
      </div>
    );
  }

  return (
    <div className="glass rounded-xl sm:rounded-2xl p-4 sm:p-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-5">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl gradient-indigo-purple flex items-center justify-center shadow-lg shadow-purple-500/30">
            <Map className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-semibold text-foreground flex items-center gap-2">
              AI Mokymosi Kelias
              <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary">
                Personalizuotas
              </span>
            </h3>
            <p className="text-[10px] sm:text-xs text-muted-foreground">
              {subject} • {completedCount} / {steps.length} žingsniai
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-lg sm:text-xl font-bold text-foreground">{Math.round(progress)}%</p>
          <p className="text-[10px] sm:text-xs text-muted-foreground">Progresas</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4 sm:mb-6">
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full gradient-indigo-purple rounded-full transition-all duration-500"
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
              className={`p-3 sm:p-4 rounded-lg sm:rounded-xl border transition-all ${
                step.completed
                  ? "bg-green-500/10 border-green-500/30"
                  : canAccess
                  ? "bg-secondary/50 border-primary/20 hover:border-primary/40 cursor-pointer"
                  : "bg-secondary/20 border-white/5 opacity-60"
              }`}
              onClick={() => canAccess && !step.completed && setExpandedStep(isExpanded ? null : step.id)}
            >
              <div className="flex items-start gap-3">
                {/* Step Number */}
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  step.completed
                    ? "gradient-green-teal"
                    : canAccess
                    ? "gradient-indigo-purple"
                    : "bg-secondary"
                }`}>
                  {step.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  ) : (
                    <span className="text-xs font-bold text-white">{index + 1}</span>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className={`text-sm font-semibold ${
                      step.completed ? "text-green-400" : "text-foreground"
                    }`}>
                      {step.title}
                    </h4>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full shrink-0 ${getDifficultyColor(step.difficulty)}`}>
                      {getDifficultyLabel(step.difficulty)}
                    </span>
                  </div>
                  
                  <p className="text-xs text-muted-foreground mb-2 line-clamp-1">
                    {step.description}
                  </p>

                  <div className="flex items-center gap-3 text-[10px] text-muted-foreground mb-2">
                    <span>⏱ {step.estimatedTime}</span>
                    {step.prerequisites.length > 0 && (
                      <span>🔗 Reikia {step.prerequisites.length} žingsnio</span>
                    )}
                  </div>

                  {/* AI Recommendation */}
                  {step.aiRecommendation && (isExpanded || step.completed) && (
                    <div className="mt-2 p-2 rounded-lg bg-primary/10 border border-primary/20 animate-fade-in">
                      <div className="flex items-center gap-2 mb-1">
                        <Sparkles className="w-3 h-3 text-primary" />
                        <span className="text-[10px] font-medium text-primary">AI Rekomendacija</span>
                      </div>
                      <p className="text-[10px] text-foreground">{step.aiRecommendation}</p>
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
                      className="mt-2 px-4 py-2 rounded-lg gradient-indigo-purple text-white text-xs font-medium hover:opacity-90 transition-all flex items-center gap-2"
                    >
                      Pradėti žingsnį
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}

                  {!canAccess && (
                    <p className="text-[10px] text-muted-foreground mt-2">
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
      <div className="mt-4 pt-4 border-t border-white/10">
        <div className="flex items-start gap-2 p-3 rounded-lg bg-primary/10 border border-primary/20">
          <Sparkles className="w-4 h-4 text-primary shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-medium text-primary mb-1">AI Analizė</p>
            <p className="text-[10px] text-foreground">
              Remiantis jūsų mokymosi greičiu, AI prognozuoja, kad užbaigsite šį kelią per{" "}
              <span className="font-semibold text-primary">
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

