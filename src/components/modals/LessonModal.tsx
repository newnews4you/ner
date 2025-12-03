import { X, ChevronLeft, ChevronRight, Play, CheckCircle2 } from "lucide-react";
import { useState } from "react";

interface LessonModalProps {
    isOpen: boolean;
    onClose: () => void;
    topicTitle: string;
}

const LessonModal = ({ isOpen, onClose, topicTitle }: LessonModalProps) => {
    const [currentStep, setCurrentStep] = useState(0);

    if (!isOpen) return null;

    const steps = [
        {
            title: "Įvadas",
            content: "Šioje pamokoje susipažinsime su pagrindinėmis sąvokomis...",
            type: "text"
        },
        {
            title: "Video medžiaga",
            content: "Video placeholder",
            type: "video"
        },
        {
            title: "Pavyzdžiai",
            content: "Panagrinėkime kelis pavyzdžius...",
            type: "example"
        }
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="relative w-full max-w-4xl h-[80vh] flex flex-col glass rounded-2xl border border-white/10 shadow-2xl animate-scale-in overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-white/10 bg-black/20">
                    <div>
                        <h2 className="text-lg font-semibold text-foreground">{topicTitle}</h2>
                        <p className="text-xs text-muted-foreground">Pamoka {currentStep + 1} iš {steps.length}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-white/10 transition-colors"
                    >
                        <X className="w-5 h-5 text-muted-foreground" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 p-6 overflow-y-auto">
                    <div className="max-w-2xl mx-auto space-y-6">
                        <h3 className="text-2xl font-bold text-foreground">{steps[currentStep].title}</h3>

                        {steps[currentStep].type === 'video' ? (
                            <div className="aspect-video bg-black/50 rounded-xl flex items-center justify-center border border-white/10">
                                <Play className="w-12 h-12 text-white/50" />
                            </div>
                        ) : (
                            <div className="prose prose-invert max-w-none">
                                <p className="text-muted-foreground text-lg leading-relaxed">
                                    {steps[currentStep].content}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Navigation */}
                <div className="p-4 border-t border-white/10 bg-black/20 flex items-center justify-between">
                    <button
                        onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                        disabled={currentStep === 0}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Atgal
                    </button>

                    <div className="flex gap-1">
                        {steps.map((_, idx) => (
                            <div
                                key={idx}
                                className={`w-2 h-2 rounded-full transition-colors ${idx === currentStep ? 'bg-primary' : 'bg-white/10'
                                    }`}
                            />
                        ))}
                    </div>

                    <button
                        onClick={() => {
                            if (currentStep < steps.length - 1) {
                                setCurrentStep(currentStep + 1);
                            } else {
                                onClose();
                            }
                        }}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-colors text-sm font-medium"
                    >
                        {currentStep === steps.length - 1 ? (
                            <>
                                Baigti
                                <CheckCircle2 className="w-4 h-4" />
                            </>
                        ) : (
                            <>
                                Toliau
                                <ChevronRight className="w-4 h-4" />
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LessonModal;
