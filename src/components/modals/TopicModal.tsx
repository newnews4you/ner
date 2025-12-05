import { X, Play, FileText, CheckCircle2, Clock, BarChart3 } from "lucide-react";

import { Topic } from "@/services/api";

interface TopicModalProps {
    isOpen: boolean;
    onClose: () => void;
    topic: Topic | null;
    onStartLesson: () => void;
    onStartTest: () => void;
}

const TopicModal = ({ isOpen, onClose, topic, onStartLesson, onStartTest }: TopicModalProps) => {
    if (!isOpen || !topic) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="relative w-full max-w-2xl p-6 overflow-hidden bg-white rounded-xl border border-gray-200 shadow-xl">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-1 rounded-lg hover:bg-gray-100 transition-colors"
                >
                    <X className="w-5 h-5 text-gray-500" />
                </button>

                <div className="flex items-start gap-4 mb-6">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${topic.status === 'completed' ? 'bg-green-50' :
                            topic.status === 'in-progress' ? 'bg-purple-50' :
                                'bg-gray-100'
                        }`}>
                        {topic.status === 'completed' ? <CheckCircle2 className="w-6 h-6 text-green-600" /> :
                            topic.status === 'in-progress' ? <Play className="w-6 h-6 text-purple-600" /> :
                                <Clock className="w-6 h-6 text-gray-500" />}
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-1 tracking-tight">{topic.title}</h2>
                        <div className="flex items-center gap-3 text-sm text-gray-500">
                            <span className="flex items-center gap-1 font-medium">
                                <Clock className="w-3.5 h-3.5" />
                                {topic.duration}
                            </span>
                            {topic.score !== undefined && (
                                <span className="flex items-center gap-1 text-green-600 font-medium">
                                    <BarChart3 className="w-3.5 h-3.5" />
                                    Rezultatas: {topic.score}%
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                        <h3 className="text-sm font-semibold text-gray-900 mb-2">Apie šią temą</h3>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            {topic.description}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <button
                            onClick={onStartLesson}
                            className="flex items-center justify-center gap-2 p-4 rounded-lg bg-gray-900 text-white font-medium hover:bg-black transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-95"
                        >
                            <Play className="w-5 h-5" />
                            Pradėti pamoką
                        </button>
                        <button
                            onClick={onStartTest}
                            className="flex items-center justify-center gap-2 p-4 rounded-lg bg-white border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5"
                        >
                            <FileText className="w-5 h-5" />
                            Spręsti testą
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TopicModal;
