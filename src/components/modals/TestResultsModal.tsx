import { X, CheckCircle2, XCircle, RefreshCw, ArrowRight, Share2 } from "lucide-react";

interface TestResultsModalProps {
    isOpen: boolean;
    onClose: () => void;
    score: number;
    total: number;
    topicTitle: string;
    onRetry: () => void;
    onContinue: () => void;
}

const TestResultsModal = ({ isOpen, onClose, score, total, topicTitle, onRetry, onContinue }: TestResultsModalProps) => {
    if (!isOpen) return null;

    const percentage = Math.round((score / total) * 100);
    const isPassed = percentage >= 70;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="relative w-full max-w-md p-6 overflow-hidden glass rounded-2xl border border-white/10 shadow-2xl animate-scale-in text-center">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-1 rounded-full hover:bg-white/10 transition-colors"
                >
                    <X className="w-5 h-5 text-muted-foreground" />
                </button>

                <div className="mb-6 flex justify-center">
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center shadow-xl ${isPassed ? 'gradient-green-teal' : 'gradient-orange-red'
                        }`}>
                        {isPassed ? (
                            <CheckCircle2 className="w-10 h-10 text-white" />
                        ) : (
                            <XCircle className="w-10 h-10 text-white" />
                        )}
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-foreground mb-2">
                    {isPassed ? "Puikus rezultatas! 🎉" : "Reikia pasistengti 💪"}
                </h2>
                <p className="text-sm text-muted-foreground mb-6">
                    {topicTitle}
                </p>

                <div className="bg-secondary/30 rounded-xl p-4 border border-white/5 mb-8">
                    <div className="text-4xl font-bold text-foreground mb-1">{percentage}%</div>
                    <div className="text-sm text-muted-foreground">
                        Teisingai atsakyta: {score} iš {total}
                    </div>
                </div>

                <div className="space-y-3">
                    <button
                        onClick={onContinue}
                        className="w-full py-3 rounded-xl gradient-purple-pink text-white font-medium hover:opacity-90 transition-all shadow-lg flex items-center justify-center gap-2"
                    >
                        Tęsti mokymąsi
                        <ArrowRight className="w-4 h-4" />
                    </button>

                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={onRetry}
                            className="py-3 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors text-foreground font-medium flex items-center justify-center gap-2"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Bandyti dar kartą
                        </button>
                        <button
                            className="py-3 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors text-foreground font-medium flex items-center justify-center gap-2"
                        >
                            <Share2 className="w-4 h-4" />
                            Dalintis
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TestResultsModal;
