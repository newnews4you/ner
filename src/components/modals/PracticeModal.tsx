import { useState } from "react";
import { X, CheckCircle2, ChevronRight, Calculator, HelpCircle, Lightbulb } from "lucide-react";

interface PracticeModalProps {
    isOpen: boolean;
    onClose: () => void;
    topicTitle: string;
}

const PracticeModal = ({ isOpen, onClose, topicTitle }: PracticeModalProps) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [showHint, setShowHint] = useState(false);
    const [answer, setAnswer] = useState("");
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

    if (!isOpen) return null;

    const problems = [
        {
            question: "Apskaičiuokite trikampio plotą, kai pagrindas a=10, o aukštinė h=5.",
            hint: "Trikampio ploto formulė: S = (a * h) / 2",
            answer: "25",
            explanation: "S = (10 * 5) / 2 = 50 / 2 = 25"
        },
        {
            question: "Išspręskite lygtį: 2x + 5 = 15",
            hint: "Pirmiausia atimkite 5 iš abiejų pusių, tada padalinkite iš 2",
            answer: "5",
            explanation: "2x = 10, x = 5"
        }
    ];

    const checkAnswer = () => {
        if (answer.trim() === problems[currentStep].answer) {
            setIsCorrect(true);
        } else {
            setIsCorrect(false);
        }
    };

    const nextProblem = () => {
        if (currentStep < problems.length - 1) {
            setCurrentStep(currentStep + 1);
            setAnswer("");
            setIsCorrect(null);
            setShowHint(false);
        } else {
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="relative w-full max-w-2xl flex flex-col glass rounded-2xl border border-white/10 shadow-2xl animate-scale-in overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-white/10 bg-black/20">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
                            <Calculator className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-foreground">{topicTitle} - Pratybos</h2>
                            <p className="text-xs text-muted-foreground">Uždavinys {currentStep + 1} iš {problems.length}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-white/10 transition-colors"
                    >
                        <X className="w-5 h-5 text-muted-foreground" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="mb-6">
                        <h3 className="text-xl font-medium text-foreground mb-4">
                            {problems[currentStep].question}
                        </h3>

                        <div className="flex gap-4">
                            <input
                                type="text"
                                value={answer}
                                onChange={(e) => setAnswer(e.target.value)}
                                placeholder="Įveskite atsakymą..."
                                className="flex-1 px-4 py-3 rounded-xl bg-secondary/50 border border-white/10 focus:outline-none focus:border-primary/50 text-foreground"
                                disabled={isCorrect === true}
                            />
                            <button
                                onClick={checkAnswer}
                                disabled={!answer || isCorrect === true}
                                className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 disabled:opacity-50 transition-colors"
                            >
                                Tikrinti
                            </button>
                        </div>

                        {isCorrect === false && (
                            <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-start gap-3 animate-shake">
                                <X className="w-5 h-5 shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-medium">Neteisingai. Bandykite dar kartą!</p>
                                </div>
                            </div>
                        )}

                        {isCorrect === true && (
                            <div className="mt-4 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 flex items-start gap-3 animate-fade-in">
                                <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-medium">Teisingai! Puikus darbas.</p>
                                    <p className="text-sm mt-1 opacity-90">{problems[currentStep].explanation}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center justify-between pt-6 border-t border-white/10">
                        <button
                            onClick={() => setShowHint(!showHint)}
                            className="flex items-center gap-2 text-sm text-yellow-400 hover:text-yellow-300 transition-colors"
                        >
                            <Lightbulb className="w-4 h-4" />
                            {showHint ? "Slėpti užuominą" : "Rodyti užuominą"}
                        </button>

                        {isCorrect === true && (
                            <button
                                onClick={nextProblem}
                                className="flex items-center gap-2 px-6 py-2 rounded-lg gradient-green-teal text-white hover:opacity-90 transition-colors text-sm font-medium shadow-lg"
                            >
                                {currentStep < problems.length - 1 ? "Kitas uždavinys" : "Baigti pratybas"}
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    {showHint && (
                        <div className="mt-4 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 flex items-start gap-3 animate-fade-in">
                            <HelpCircle className="w-5 h-5 shrink-0 mt-0.5" />
                            <p className="text-sm">{problems[currentStep].hint}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PracticeModal;
