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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="relative w-full max-w-2xl flex flex-col glass rounded-2xl border border-white/10 shadow-2xl animate-scale-in overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-white/10 bg-black/20">
                    <div>
                        <h2 className="text-lg font-semibold text-foreground">{topicTitle} - Testas</h2>
                        <p className="text-xs text-muted-foreground">Klausimas {currentQuestion + 1} iš {mockQuestions.length}</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${timeLeft < 60 ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-secondary/50 border-white/10 text-muted-foreground'
                            }`}>
                            <Clock className="w-4 h-4" />
                            <span className="font-mono font-medium">{formatTime(timeLeft)}</span>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full hover:bg-white/10 transition-colors"
                        >
                            <X className="w-5 h-5 text-muted-foreground" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="mb-6">
                        <h3 className="text-xl font-medium text-foreground mb-4">
                            {mockQuestions[currentQuestion].text}
                        </h3>
                        <div className="space-y-3">
                            {mockQuestions[currentQuestion].options.map((option, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleAnswer(index)}
                                    className={`w-full p-4 rounded-xl text-left transition-all border ${answers[currentQuestion] === index
                                            ? 'bg-primary/20 border-primary text-primary'
                                            : 'bg-secondary/30 border-white/5 hover:bg-secondary/50 hover:border-white/10 text-foreground'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 ${answers[currentQuestion] === index
                                                ? 'border-primary bg-primary text-white'
                                                : 'border-muted-foreground/30'
                                            }`}>
                                            {answers[currentQuestion] === index && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
                                        </div>
                                        <span>{option}</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-white/10 bg-black/20 flex justify-end gap-3">
                    {currentQuestion > 0 && (
                        <button
                            onClick={() => setCurrentQuestion(currentQuestion - 1)}
                            className="px-4 py-2 rounded-lg hover:bg-white/10 transition-colors text-sm font-medium"
                        >
                            Atgal
                        </button>
                    )}

                    {currentQuestion < mockQuestions.length - 1 ? (
                        <button
                            onClick={() => setCurrentQuestion(currentQuestion + 1)}
                            disabled={answers[currentQuestion] === undefined}
                            className="flex items-center gap-2 px-6 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                        >
                            Kitas
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            disabled={answers[currentQuestion] === undefined}
                            className="flex items-center gap-2 px-6 py-2 rounded-lg gradient-green-teal text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium shadow-lg"
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
