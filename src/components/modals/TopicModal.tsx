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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="relative w-full max-w-2xl p-6 overflow-hidden glass rounded-2xl border border-white/10 shadow-2xl animate-scale-in">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-1 rounded-full hover:bg-white/10 transition-colors"
                >
                    <X className="w-5 h-5 text-muted-foreground" />
                </button>

                <div className="flex items-start gap-4 mb-6">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${topic.status === 'completed' ? 'gradient-green-teal' :
                        topic.status === 'in-progress' ? 'gradient-purple-pink' :
                            'bg-secondary'
                        }`}>
                        {topic.status === 'completed' ? <CheckCircle2 className="w-6 h-6 text-white" /> :
                            topic.status === 'in-progress' ? <Play className="w-6 h-6 text-white" /> :
                                <Clock className="w-6 h-6 text-muted-foreground" />}
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-foreground mb-1">{topic.title}</h2>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" />
                                {topic.duration}
                            </span>
                            {topic.score !== undefined && (
                                <span className="flex items-center gap-1 text-green-400">
                                    <BarChart3 className="w-3.5 h-3.5" />
                                    Rezultatas: {topic.score}%
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-secondary/30 rounded-xl p-4 border border-white/5">
                        <h3 className="text-sm font-semibold text-foreground mb-2">Apie šią temą</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            {topic.description}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <button
                            onClick={onStartLesson}
                            className="flex items-center justify-center gap-2 p-4 rounded-xl gradient-purple-pink text-white font-medium hover:opacity-90 transition-all shadow-lg hover:scale-[1.02]"
                        >
                            <Play className="w-5 h-5" />
                            Pradėti pamoką
                        </button>
                        <button
                            onClick={onStartTest}
                            className="flex items-center justify-center gap-2 p-4 rounded-xl bg-secondary/80 text-foreground font-medium hover:bg-secondary transition-all border border-white/10 hover:scale-[1.02]"
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
