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
        return "bg-blue-100 text-blue-600";
      case "practice":
        return "bg-purple-100 text-purple-600";
      case "review":
        return "bg-green-100 text-green-600";
      case "focus":
        return "bg-orange-100 text-orange-600";
    }
  };

  const getPriorityColor = (priority: Recommendation["priority"]) => {
    switch (priority) {
      case "high":
        return "text-orange-600 bg-orange-50";
      case "medium":
        return "text-blue-600 bg-blue-50";
      case "low":
        return "text-gray-500 bg-gray-100";
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden">
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-purple-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2 tracking-tight">
              AI Rekomendacijos
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-50 text-purple-600 font-medium border border-purple-100">
                Personalizuota
              </span>
            </h3>
            <p className="text-xs text-gray-500 font-medium">
              Remiantis jūsų mokymosi duomenimis
            </p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setSelectedType("all")}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${selectedType === "all"
              ? "bg-gray-900 text-white shadow-sm"
              : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
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
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${selectedType === type
                  ? "bg-gray-900 text-white shadow-sm"
                  : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
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
            <div className="text-center py-12">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gray-50 flex items-center justify-center animate-pulse">
                <Sparkles className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-sm text-gray-500 font-medium">
                Generuojamos rekomendacijos...
              </p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gray-50 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-sm text-gray-500 font-medium">
                Nėra rekomendacijų šiam filtrui
              </p>
            </div>
          ) : (
            filtered.map((rec) => (
              <div
                key={rec.id}
                className={`p-4 rounded-xl border transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 cursor-pointer bg-white border-gray-200 group`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-lg ${getTypeColor(rec.type)} flex items-center justify-center shrink-0`}>
                    {getTypeIcon(rec.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className="text-sm font-semibold text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                        {rec.title}
                      </h4>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full shrink-0 font-medium ${getPriorityColor(rec.priority)}`}>
                        {rec.priority === "high" ? "Aukštas" :
                          rec.priority === "medium" ? "Vidutinis" : "Žemas"}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mb-3 line-clamp-2 leading-relaxed">
                      {rec.description}
                    </p>
                    <div className="flex items-center gap-4 text-[11px] text-gray-500 mb-3 font-medium">
                      <span className="flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5" />
                        {rec.subject}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {rec.estimatedTime}
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                      <p className="text-[10px] text-purple-600 italic font-medium">
                        💡 {rec.reason}
                      </p>
                      <button className="px-3 py-1.5 rounded-md bg-gray-900 text-white hover:bg-black text-[10px] font-medium transition-all flex items-center gap-1.5 shadow-sm hover:shadow-md active:scale-95">
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
