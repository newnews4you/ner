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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="relative w-full max-w-2xl flex flex-col bg-white rounded-xl border border-gray-200 shadow-xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-white">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                            <Calculator className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900 tracking-tight">{topicTitle} - Pratybos</h2>
                            <p className="text-xs text-gray-500 font-medium">Uždavinys {currentStep + 1} iš {problems.length}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 bg-gray-50/30">
                    <div className="mb-6">
                        <h3 className="text-xl font-medium text-gray-900 mb-4">
                            {problems[currentStep].question}
                        </h3>

                        <div className="flex gap-4">
                            <input
                                type="text"
                                value={answer}
                                onChange={(e) => setAnswer(e.target.value)}
                                placeholder="Įveskite atsakymą..."
                                className="flex-1 px-4 py-3 rounded-lg bg-white border border-gray-200 focus:outline-none focus:border-gray-300 focus:ring-2 focus:ring-gray-100 text-gray-900"
                                disabled={isCorrect === true}
                            />
                            <button
                                onClick={checkAnswer}
                                disabled={!answer || isCorrect === true}
                                className="px-6 py-3 rounded-lg bg-gray-900 text-white font-medium hover:bg-black disabled:opacity-50 transition-all shadow-sm hover:shadow-md active:scale-95"
                            >
                                Tikrinti
                            </button>
                        </div>

                        {isCorrect === false && (
                            <div className="mt-4 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 flex items-start gap-3">
                                <X className="w-5 h-5 shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-medium">Neteisingai. Bandykite dar kartą!</p>
                                </div>
                            </div>
                        )}

                        {isCorrect === true && (
                            <div className="mt-4 p-4 rounded-xl bg-green-50 border border-green-200 text-green-600 flex items-start gap-3">
                                <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-medium">Teisingai! Puikus darbas.</p>
                                    <p className="text-sm mt-1 opacity-90">{problems[currentStep].explanation}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                        <button
                            onClick={() => setShowHint(!showHint)}
                            className="flex items-center gap-2 text-sm text-yellow-600 hover:text-yellow-700 transition-colors font-medium"
                        >
                            <Lightbulb className="w-4 h-4" />
                            {showHint ? "Slėpti užuominą" : "Rodyti užuominą"}
                        </button>

                        {isCorrect === true && (
                            <button
                                onClick={nextProblem}
                                className="flex items-center gap-2 px-6 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition-all text-sm font-medium shadow-sm hover:shadow-md active:scale-95"
                            >
                                {currentStep < problems.length - 1 ? "Kitas uždavinys" : "Baigti pratybas"}
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    {showHint && (
                        <div className="mt-4 p-4 rounded-xl bg-yellow-50 border border-yellow-200 text-yellow-700 flex items-start gap-3">
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
