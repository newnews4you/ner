import { useState } from "react";
import { Sparkles, Loader2, CheckCircle2, XCircle, ArrowRight, RefreshCw, BookOpen } from "lucide-react";

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
  subject: string;
  topic: string;
}

interface AIPracticeGeneratorProps {
  subject: string;
  topic?: string;
  difficulty?: "easy" | "medium" | "hard";
  onComplete?: (score: number, total: number) => void;
}

const AIPracticeGenerator = ({ 
  subject, 
  topic, 
  difficulty = "medium",
  onComplete 
}: AIPracticeGeneratorProps) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const generateQuestions = async () => {
    setIsGenerating(true);
    
    try {
      const { api } = await import('@/services/api');
      const generatedQuestions = await api.ai.generatePractice(
        subject,
        topic || subject,
        difficulty,
        5
      );
      
      // Transform API response to component format
      const transformedQuestions: Question[] = generatedQuestions.map((q: any, index: number) => ({
        id: q.id || String(index + 1),
        question: q.question,
        options: q.options || [],
        correctAnswer: q.correctAnswer,
        explanation: q.explanation || "AI sugeneravo šį klausimą remiantis jūsų mokymosi lygiu.",
        difficulty: difficulty,
        subject: subject,
        topic: topic || "Bendras",
      }));
      
      setQuestions(transformedQuestions);
    } catch (error) {
      console.error('Failed to generate questions:', error);
      // Fallback to empty array or show error
      setQuestions([]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAnswerSelect = (index: number) => {
    if (showExplanation) return;
    setSelectedAnswer(index);
    
    const question = questions[currentQuestion];
    if (index === question.correctAnswer) {
      setScore(prev => prev + 1);
    }
    
    setShowExplanation(true);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setIsComplete(true);
      if (onComplete) {
        onComplete(score + (selectedAnswer === questions[currentQuestion].correctAnswer ? 1 : 0), questions.length);
      }
    }
  };

  const handleRestart = () => {
    setQuestions([]);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setIsComplete(false);
  };

  if (questions.length === 0 && !isGenerating && !isComplete) {
    return (
      <div className="glass rounded-xl sm:rounded-2xl p-6 sm:p-8 text-center animate-fade-in">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full gradient-purple-pink flex items-center justify-center shadow-lg">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          AI Praktikos Užduotys
        </h3>
        <p className="text-sm text-muted-foreground mb-6">
          AI sugeneruos personalizuotas užduotis pagal jūsų mokymosi lygį ir temą
        </p>
        <div className="space-y-2 mb-6 text-left max-w-md mx-auto">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <BookOpen className="w-4 h-4" />
            <span>Dalykas: {subject}</span>
          </div>
          {topic && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <BookOpen className="w-4 h-4" />
              <span>Tema: {topic}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <BookOpen className="w-4 h-4" />
            <span>Sudėtingumas: {
              difficulty === "easy" ? "Lengvas" :
              difficulty === "medium" ? "Vidutinis" : "Sunkus"
            }</span>
          </div>
        </div>
        <button
          onClick={generateQuestions}
          className="px-6 py-3 rounded-xl gradient-purple-pink text-white font-medium hover:opacity-90 transition-all shadow-lg hover:scale-105 flex items-center gap-2 mx-auto"
        >
          <Sparkles className="w-5 h-5" />
          Generuoti užduotis su AI
        </button>
      </div>
    );
  }

  if (isGenerating) {
    return (
      <div className="glass rounded-xl sm:rounded-2xl p-6 sm:p-8 text-center animate-fade-in">
        <Loader2 className="w-12 h-12 mx-auto mb-4 text-primary animate-spin" />
        <h3 className="text-lg font-semibold text-foreground mb-2">
          AI generuoja užduotis...
        </h3>
        <p className="text-sm text-muted-foreground">
          Analizuojame jūsų mokymosi istoriją ir sukuriu personalizuotas užduotis
        </p>
      </div>
    );
  }

  if (isComplete) {
    const finalScore = score;
    const percentage = Math.round((finalScore / questions.length) * 100);
    
    return (
      <div className="glass rounded-xl sm:rounded-2xl p-6 sm:p-8 text-center animate-fade-in">
        <div className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center ${
          percentage >= 80 ? "gradient-green-teal" :
          percentage >= 60 ? "gradient-cyan-blue" :
          "gradient-orange-red"
        }`}>
          <span className="text-2xl font-bold text-white">{percentage}%</span>
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">
          {percentage >= 80 ? "Puikiai! 🎉" :
           percentage >= 60 ? "Gerai! 👍" : "Tęskite mokymąsi! 💪"}
        </h3>
        <p className="text-sm text-muted-foreground mb-6">
          Jūsų rezultatas: {finalScore} / {questions.length}
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={handleRestart}
            className="px-6 py-3 rounded-xl gradient-purple-pink text-white font-medium hover:opacity-90 transition-all shadow-lg flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Bandyti dar kartą
          </button>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="glass rounded-xl sm:rounded-2xl p-4 sm:p-6 animate-fade-in">
      {/* Progress */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-muted-foreground">
            Klausimas {currentQuestion + 1} / {questions.length}
          </span>
          <span className="text-xs text-muted-foreground">
            Rezultatas: {score} / {currentQuestion}
          </span>
        </div>
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full gradient-purple-pink rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-xs text-primary">AI sugeneruotas klausimas</span>
        </div>
        <h3 className="text-base sm:text-lg font-semibold text-foreground mb-4">
          {question.question}
        </h3>
        
        {/* Options */}
        <div className="space-y-2">
          {question.options.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const isCorrect = index === question.correctAnswer;
            const showResult = showExplanation;

            return (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={showExplanation}
                className={`w-full p-3 sm:p-4 rounded-xl text-left transition-all ${
                  showResult && isCorrect
                    ? "bg-green-500/20 border-2 border-green-500/50"
                    : showResult && isSelected && !isCorrect
                    ? "bg-red-500/20 border-2 border-red-500/50"
                    : isSelected
                    ? "bg-primary/20 border-2 border-primary/50"
                    : "bg-secondary/50 border border-white/10 hover:bg-secondary/70"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <div className="flex items-center gap-3">
                  {showResult && isCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
                  )}
                  {showResult && isSelected && !isCorrect && (
                    <XCircle className="w-5 h-5 text-red-400 shrink-0" />
                  )}
                  <span className="text-sm sm:text-base text-foreground">{option}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Explanation */}
      {showExplanation && (
        <div className="mb-6 p-4 rounded-xl bg-primary/10 border border-primary/20 animate-fade-in">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-xs font-medium text-primary">AI Paaiškinimas</span>
          </div>
          <p className="text-sm text-foreground">{question.explanation}</p>
        </div>
      )}

      {/* Next Button */}
      {showExplanation && (
        <button
          onClick={handleNext}
          className="w-full px-6 py-3 rounded-xl gradient-purple-pink text-white font-medium hover:opacity-90 transition-all shadow-lg flex items-center justify-center gap-2"
        >
          {currentQuestion < questions.length - 1 ? (
            <>
              Kitas klausimas
              <ArrowRight className="w-4 h-4" />
            </>
          ) : (
            "Užbaigti testą"
          )}
        </button>
      )}
    </div>
  );
};

export default AIPracticeGenerator;

