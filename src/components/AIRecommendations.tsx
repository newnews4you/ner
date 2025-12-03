import { Sparkles, BookOpen, Target, TrendingUp, Clock, Lightbulb, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";

interface Recommendation {
  id: string;
  type: "study" | "practice" | "review" | "focus";
  title: string;
  description: string;
  subject: string;
  priority: "high" | "medium" | "low";
  estimatedTime: string;
  reason: string;
}

interface AIRecommendationsProps {
  currentSubject?: string;
  weakAreas?: string[];
  studyHistory?: any[];
}

const AIRecommendations = ({ currentSubject, weakAreas, studyHistory }: AIRecommendationsProps) => {
  const [selectedType, setSelectedType] = useState<"all" | Recommendation["type"]>("all");

  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      setIsLoading(true);
      try {
        const { api } = await import('@/services/api');
        const data = await api.ai.getRecommendations(currentSubject);
        setRecommendations(data);
      } catch (error) {
        console.error('Failed to fetch recommendations:', error);
        // Fallback to empty array
        setRecommendations([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, [currentSubject]);
  const filtered = selectedType === "all"
    ? recommendations
    : recommendations.filter(r => r.type === selectedType);

  const getTypeIcon = (type: Recommendation["type"]) => {
    switch (type) {
      case "study":
        return <BookOpen className="w-4 h-4" />;
      case "practice":
        return <Target className="w-4 h-4" />;
      case "review":
        return <TrendingUp className="w-4 h-4" />;
      case "focus":
        return <Lightbulb className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: Recommendation["type"]) => {
    switch (type) {
      case "study":
        return "gradient-cyan-blue";
      case "practice":
        return "gradient-purple-pink";
      case "review":
        return "gradient-green-teal";
      case "focus":
        return "gradient-orange-red";
    }
  };

  const getPriorityColor = (priority: Recommendation["priority"]) => {
    switch (priority) {
      case "high":
        return "text-orange-400";
      case "medium":
        return "text-cyan-400";
      case "low":
        return "text-muted-foreground";
    }
  };

  return (
    <div className="glass rounded-xl sm:rounded-2xl p-4 sm:p-6 border-2 border-primary/20 relative overflow-hidden animate-fade-in">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5" />
      <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl gradient-purple-pink flex items-center justify-center shadow-lg shadow-primary/30">
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-white animate-pulse" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm sm:text-base font-semibold text-foreground flex items-center gap-2">
              AI Rekomendacijos
              <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary">
                Personalizuota
              </span>
            </h3>
            <p className="text-[10px] sm:text-xs text-muted-foreground">
              Remiantis jūsų mokymosi duomenimis
            </p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => setSelectedType("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${selectedType === "all"
                ? "gradient-purple-pink text-white"
                : "bg-secondary/50 text-foreground hover:bg-secondary/70"
              }`}
          >
            Visi ({recommendations.length})
          </button>
          {(["study", "practice", "review", "focus"] as const).map((type) => {
            const count = recommendations.filter(r => r.type === type).length;
            if (count === 0) return null;
            return (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${selectedType === type
                    ? "gradient-purple-pink text-white"
                    : "bg-secondary/50 text-foreground hover:bg-secondary/70"
                  }`}
              >
                {getTypeIcon(type)}
                {type === "study" ? "Mokymasis" :
                  type === "practice" ? "Praktika" :
                    type === "review" ? "Peržiūra" : "Fokusas"} ({count})
              </button>
            );
          })}
        </div>

        {/* Recommendations List */}
        <div className="space-y-3">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary/50 flex items-center justify-center animate-pulse">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground">
                Generuojamos rekomendacijos...
              </p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary/50 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">
                Nėra rekomendacijų šiam filtrui
              </p>
            </div>
          ) : (
            filtered.map((rec) => (
              <div
                key={rec.id}
                className={`p-3 sm:p-4 rounded-lg sm:rounded-xl border transition-all hover:scale-[1.02] cursor-pointer ${rec.priority === "high"
                    ? "bg-secondary/50 border-orange-500/30"
                    : "bg-secondary/30 border-white/10"
                  }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl ${getTypeColor(rec.type)} flex items-center justify-center shrink-0 shadow-lg`}>
                    {getTypeIcon(rec.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className="text-sm font-semibold text-foreground line-clamp-1">
                        {rec.title}
                      </h4>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full shrink-0 ${rec.priority === "high" ? "bg-orange-500/20 text-orange-400" :
                          rec.priority === "medium" ? "bg-cyan-500/20 text-cyan-400" :
                            "bg-secondary text-muted-foreground"
                        }`}>
                        {rec.priority === "high" ? "Aukštas" :
                          rec.priority === "medium" ? "Vidutinis" : "Žemas"}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                      {rec.description}
                    </p>
                    <div className="flex items-center gap-4 text-[10px] sm:text-xs text-muted-foreground mb-2">
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-3 h-3" />
                        {rec.subject}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {rec.estimatedTime}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] text-primary italic">
                        💡 {rec.reason}
                      </p>
                      <button className="px-3 py-1.5 rounded-lg bg-secondary/50 hover:bg-secondary/70 text-xs text-foreground transition-colors flex items-center gap-1">
                        Pradėti
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AIRecommendations;

