import { useState, useEffect } from "react";
import { X, Clock, CheckCircle2, AlertCircle, ChevronRight } from "lucide-react";

interface Question {
    id: number;
    text: string;
    options: string[];
    correctAnswer: number;
}

interface TestModalProps {
    isOpen: boolean;
    onClose: () => void;
    topicTitle: string;
    onComplete: (score: number, total: number) => void;
}

const mockQuestions: Question[] = [
    {
        id: 1,
        text: "Kas yra dirbtinis intelektas?",
        options: [
            "Kompiuterinė programa, kuri gali atlikti užduotis, reikalaujančias žmogaus intelekto",
            "Naujas išmanusis telefonas",
            "Programavimo kalba",
            "Interneto svetainė"
        ],
        correctAnswer: 0
    },
    {
        id: 2,
        text: "Kuris iš šių nėra mašininio mokymosi tipas?",
        options: [
            "Mokymasis su mokytoju",
            "Mokymasis be mokytojo",
            "Mokymasis mintinai",
            "Pastiprinamasis mokymasis"
        ],
        correctAnswer: 2
    },
    {
        id: 3,
        text: "Ką reiškia trumpinys NLP?",
        options: [
            "Natural Language Processing",
            "New Learning Protocol",
            "Neural Link Processor",
            "Network Level Protocol"
        ],
        correctAnswer: 0
    }
];

const TestModal = ({ isOpen, onClose, topicTitle, onComplete }: TestModalProps) => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState<number[]>([]);
    const [timeLeft, setTimeLeft] = useState(300); // 5 minutes

    useEffect(() => {
        if (!isOpen) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isOpen]);

    if (!isOpen) return null;

    const handleAnswer = (optionIndex: number) => {
        const newAnswers = [...answers];
        newAnswers[currentQuestion] = optionIndex;
        setAnswers(newAnswers);
    };

    const handleSubmit = () => {
        let score = 0;
        answers.forEach((answer, index) => {
            if (answer === mockQuestions[index].correctAnswer) {
                score++;
            }
        });
        onComplete(score, mockQuestions.length);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="relative w-full max-w-2xl flex flex-col bg-white rounded-xl border border-gray-200 shadow-xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-white">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900 tracking-tight">{topicTitle} - Testas</h2>
                        <p className="text-xs text-gray-500 font-medium">Klausimas {currentQuestion + 1} iš {mockQuestions.length}</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${timeLeft < 60 ? 'bg-red-50 border-red-200 text-red-600' : 'bg-gray-50 border-gray-200 text-gray-600'
                            }`}>
                            <Clock className="w-4 h-4" />
                            <span className="font-mono font-medium">{formatTime(timeLeft)}</span>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <X className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 bg-gray-50/30">
                    <div className="mb-6">
                        <h3 className="text-xl font-medium text-gray-900 mb-4">
                            {mockQuestions[currentQuestion].text}
                        </h3>
                        <div className="space-y-3">
                            {mockQuestions[currentQuestion].options.map((option, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleAnswer(index)}
                                    className={`w-full p-4 rounded-xl text-left transition-all border ${answers[currentQuestion] === index
                                        ? 'bg-gray-900 border-gray-900 text-white'
                                        : 'bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300 text-gray-900'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 ${answers[currentQuestion] === index
                                            ? 'border-white bg-white text-gray-900'
                                            : 'border-gray-300'
                                            }`}>
                                            {answers[currentQuestion] === index && <div className="w-2.5 h-2.5 rounded-full bg-gray-900" />}
                                        </div>
                                        <span>{option}</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-100 bg-white flex justify-end gap-3">
                    {currentQuestion > 0 && (
                        <button
                            onClick={() => setCurrentQuestion(currentQuestion - 1)}
                            className="px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium text-gray-700"
                        >
                            Atgal
                        </button>
                    )}

                    {currentQuestion < mockQuestions.length - 1 ? (
                        <button
                            onClick={() => setCurrentQuestion(currentQuestion + 1)}
                            disabled={answers[currentQuestion] === undefined}
                            className="flex items-center gap-2 px-6 py-2 rounded-lg bg-gray-900 text-white hover:bg-black disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm font-medium shadow-sm hover:shadow-md active:scale-95"
                        >
                            Kitas
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            disabled={answers[currentQuestion] === undefined}
                            className="flex items-center gap-2 px-6 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm font-medium shadow-sm hover:shadow-md active:scale-95"
                        >
                            Baigti testą
                            <CheckCircle2 className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TestModal;
