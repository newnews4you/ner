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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="relative w-full max-w-md p-6 overflow-hidden bg-white rounded-xl border border-gray-200 shadow-xl text-center">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-1 rounded-lg hover:bg-gray-100 transition-colors"
                >
                    <X className="w-5 h-5 text-gray-500" />
                </button>

                <div className="mb-6 flex justify-center">
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center shadow-sm ${isPassed ? 'bg-green-50' : 'bg-orange-50'
                        }`}>
                        {isPassed ? (
                            <CheckCircle2 className="w-10 h-10 text-green-600" />
                        ) : (
                            <XCircle className="w-10 h-10 text-orange-600" />
                        )}
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">
                    {isPassed ? "Puikus rezultatas! 🎉" : "Reikia pasistengti 💪"}
                </h2>
                <p className="text-sm text-gray-500 mb-6 font-medium">
                    {topicTitle}
                </p>

                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 mb-8">
                    <div className="text-4xl font-bold text-gray-900 mb-1">{percentage}%</div>
                    <div className="text-sm text-gray-600">
                        Teisingai atsakyta: {score} iš {total}
                    </div>
                </div>

                <div className="space-y-3">
                    <button
                        onClick={onContinue}
                        className="w-full py-3 rounded-lg bg-gray-900 text-white font-medium hover:bg-black transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2 active:scale-95"
                    >
                        Tęsti mokymąsi
                        <ArrowRight className="w-4 h-4" />
                    </button>

                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={onRetry}
                            className="py-3 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 transition-all text-gray-700 font-medium flex items-center justify-center gap-2"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Bandyti dar kartą
                        </button>
                        <button
                            className="py-3 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 transition-all text-gray-700 font-medium flex items-center justify-center gap-2"
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
