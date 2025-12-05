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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="relative w-full max-w-4xl h-[80vh] flex flex-col bg-white rounded-xl border border-gray-200 shadow-xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-white">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900 tracking-tight">{topicTitle}</h2>
                        <p className="text-xs text-gray-500 font-medium">Pamoka {currentStep + 1} iš {steps.length}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 p-6 overflow-y-auto bg-gray-50/30">
                    <div className="max-w-2xl mx-auto space-y-6">
                        <h3 className="text-2xl font-bold text-gray-900 tracking-tight">{steps[currentStep].title}</h3>

                        {steps[currentStep].type === 'video' ? (
                            <div className="aspect-video bg-gray-100 rounded-xl flex items-center justify-center border border-gray-200">
                                <Play className="w-12 h-12 text-gray-400" />
                            </div>
                        ) : (
                            <div className="prose max-w-none">
                                <p className="text-gray-600 text-lg leading-relaxed">
                                    {steps[currentStep].content}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Navigation */}
                <div className="p-4 border-t border-gray-100 bg-white flex items-center justify-between">
                    <button
                        onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                        disabled={currentStep === 0}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium text-gray-700"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Atgal
                    </button>

                    <div className="flex gap-1">
                        {steps.map((_, idx) => (
                            <div
                                key={idx}
                                className={`w-2 h-2 rounded-full transition-colors ${idx === currentStep ? 'bg-gray-900' : 'bg-gray-200'
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
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-black transition-all text-sm font-medium shadow-sm hover:shadow-md active:scale-95"
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
