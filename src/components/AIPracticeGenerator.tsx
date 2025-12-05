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
      <div className="bg-white rounded-xl p-8 text-center border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
        <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-purple-50 flex items-center justify-center">
          <Sparkles className="w-6 h-6 text-purple-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2 tracking-tight">
          AI Praktikos Užduotys
        </h3>
        <p className="text-sm text-gray-500 mb-6 font-medium">
          AI sugeneruos personalizuotas užduotis pagal jūsų mokymosi lygį ir temą
        </p>
        <div className="space-y-2 mb-8 text-left max-w-md mx-auto">
          <div className="flex items-center gap-2 text-xs text-gray-600 bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">
            <BookOpen className="w-4 h-4 text-gray-400" />
            <span className="font-medium">Dalykas:</span>
            <span>{subject}</span>
          </div>
          {topic && (
            <div className="flex items-center gap-2 text-xs text-gray-600 bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">
              <BookOpen className="w-4 h-4 text-gray-400" />
              <span className="font-medium">Tema:</span>
              <span>{topic}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-xs text-gray-600 bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">
            <BookOpen className="w-4 h-4 text-gray-400" />
            <span className="font-medium">Sudėtingumas:</span>
            <span>{
              difficulty === "easy" ? "Lengvas" :
                difficulty === "medium" ? "Vidutinis" : "Sunkus"
            }</span>
          </div>
        </div>
        <button
          onClick={generateQuestions}
          className="px-6 py-3 rounded-lg bg-gray-900 text-white font-medium hover:bg-black transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-95 flex items-center gap-2 mx-auto"
        >
          <Sparkles className="w-4 h-4" />
          Generuoti užduotis su AI
        </button>
      </div>
    );
  }

  if (isGenerating) {
    return (
      <div className="bg-white rounded-xl p-8 text-center border border-gray-200 shadow-sm">
        <Loader2 className="w-10 h-10 mx-auto mb-4 text-gray-400 animate-spin" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2 tracking-tight">
          AI generuoja užduotis...
        </h3>
        <p className="text-sm text-gray-500 font-medium">
          Analizuojame jūsų mokymosi istoriją ir kuriame personalizuotas užduotis
        </p>
      </div>
    );
  }

  if (isComplete) {
    const finalScore = score;
    const percentage = Math.round((finalScore / questions.length) * 100);

    return (
      <div className="bg-white rounded-xl p-8 text-center border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
        <div className={`w-20 h-20 mx-auto mb-4 rounded-xl flex items-center justify-center ${percentage >= 80 ? "bg-green-50 text-green-600" :
          percentage >= 60 ? "bg-blue-50 text-blue-600" :
            "bg-orange-50 text-orange-600"
          }`}>
          <span className="text-2xl font-bold tracking-tight">{percentage}%</span>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2 tracking-tight">
          {percentage >= 80 ? "Puikiai! 🎉" :
            percentage >= 60 ? "Gerai! 👍" : "Tęskite mokymąsi! 💪"}
        </h3>
        <p className="text-sm text-gray-500 mb-8 font-medium">
          Jūsų rezultatas: {finalScore} / {questions.length}
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={handleRestart}
            className="px-6 py-3 rounded-lg bg-gray-900 text-white font-medium hover:bg-black transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-95 flex items-center gap-2"
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
    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
      {/* Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-gray-500">
            Klausimas {currentQuestion + 1} / {questions.length}
          </span>
          <span className="text-xs font-medium text-gray-500">
            Rezultatas: {score} / {currentQuestion}
          </span>
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gray-900 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1 rounded-md bg-purple-50">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
          </div>
          <span className="text-[10px] font-medium text-purple-600 uppercase tracking-wide">AI sugeneruotas klausimas</span>
        </div>
        <h3 className="text-base font-semibold text-gray-900 mb-6 leading-relaxed">
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
                className={`w-full p-4 rounded-xl text-left transition-all duration-200 ${showResult && isCorrect
                  ? "bg-green-50 border-2 border-green-200"
                  : showResult && isSelected && !isCorrect
                    ? "bg-red-50 border-2 border-red-200"
                    : isSelected
                      ? "bg-gray-900 border-2 border-gray-900 text-white"
                      : "bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <div className="flex items-center gap-3">
                  {showResult && isCorrect && (
                    <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                  )}
                  {showResult && isSelected && !isCorrect && (
                    <XCircle className="w-5 h-5 text-red-600 shrink-0" />
                  )}
                  <span className={`text-sm font-medium ${isSelected && !showResult ? "text-white" : "text-gray-900"}`}>{option}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Explanation */}
      {showExplanation && (
        <div className="mb-6 p-4 rounded-xl bg-purple-50 border border-purple-100">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span className="text-xs font-semibold text-purple-600 uppercase tracking-wide">AI Paaiškinimas</span>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">{question.explanation}</p>
        </div>
      )}

      {/* Next Button */}
      {showExplanation && (
        <button
          onClick={handleNext}
          className="w-full px-6 py-3 rounded-lg bg-gray-900 text-white font-medium hover:bg-black transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2"
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
