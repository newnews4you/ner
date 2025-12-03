import { useState } from "react";

import { ArrowLeft, Play, FileText, CheckCircle2, Clock, BarChart3, BookOpen, Brain, Target, MessageCircle, X } from "lucide-react";
import TopicModal from "./modals/TopicModal";
import LessonModal from "./modals/LessonModal";
import TestModal from "./modals/TestModal";
import TestResultsModal from "./modals/TestResultsModal";
import PracticeModal from "./modals/PracticeModal";
import NotesModal from "./modals/NotesModal";
import SubjectChatbot from "./SubjectChatbot";

import { Subject, Topic } from "@/services/api";

interface LessonDetailProps {
  subject: Subject;
  onBack: () => void;
}

const LessonDetail = ({ subject, onBack }: LessonDetailProps) => {
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [isTopicModalOpen, setIsTopicModalOpen] = useState(false);
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [isTestResultsModalOpen, setIsTestResultsModalOpen] = useState(false);
  const [isPracticeModalOpen, setIsPracticeModalOpen] = useState(false);
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [currentLessonTitle, setCurrentLessonTitle] = useState("");
  const [testResults, setTestResults] = useState({ score: 0, total: 0 });

  const handleTopicClick = (topicData: Topic) => {
    setSelectedTopic(topicData);
    setIsTopicModalOpen(true);
  };

  const startLesson = (title: string) => {
    setCurrentLessonTitle(title);
    setIsTopicModalOpen(false);
    setIsLessonModalOpen(true);
  };

  const startTest = (title: string) => {
    setCurrentLessonTitle(title);
    setIsTopicModalOpen(false);
    setIsTestModalOpen(true);
  };

  const startPractice = (title: string) => {
    setCurrentLessonTitle(title);
    setIsPracticeModalOpen(true);
  };

  const openNotes = (title: string) => {
    setCurrentLessonTitle(title);
    setIsNotesModalOpen(true);
  };

  const handleTestComplete = (score: number, total: number) => {
    setTestResults({ score, total });
    setIsTestModalOpen(false);
    setIsTestResultsModalOpen(true);
  };

  return (
    <div className="animate-fade-in">
      {/* Header Banner */}
      <div className={`${subject.gradient} rounded-3xl p-6 sm:p-8 mb-6 sm:mb-8 text-white relative overflow-hidden shadow-2xl`}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>

        <button
          onClick={onBack}
          className="absolute top-4 left-4 sm:top-6 sm:left-6 p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all backdrop-blur-md group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        </button>

        <div className="relative z-10 mt-8 sm:mt-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 sm:gap-0">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-medium mb-3 border border-white/10">
                <Brain className="w-3.5 h-3.5" />
                <span>{subject.teacher}</span>
              </div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-0.5 sm:mb-1">{subject.name}</h1>
              <p className="text-white/80 text-sm sm:text-base">Pažangumas: {subject.grade}/10</p>
            </div>
            <div className="flex items-center gap-4 bg-black/20 backdrop-blur-md rounded-2xl p-3 sm:p-4 border border-white/10">
              <div className="text-center">
                <div className="text-xs text-white/60 mb-0.5">Progresas</div>
                <div className="text-lg sm:text-xl font-bold">{subject.progress}%</div>
              </div>
              <div className="w-px h-8 bg-white/10"></div>
              <div className="text-center">
                <div className="text-xs text-white/60 mb-0.5">Liko temų</div>
                <div className="text-lg sm:text-xl font-bold">12</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* Current Topic Section */}
          <div className="glass rounded-xl sm:rounded-2xl p-4 sm:p-6 relative overflow-hidden border-2 border-primary/50 glow-purple animate-glow">
            <div className="absolute top-0 right-0 px-3 py-1 bg-primary/20 rounded-bl-xl text-xs font-medium text-primary border-b border-l border-primary/20">
              Dabartinė tema
            </div>
            <div className="flex items-start gap-4 mb-4 sm:mb-6">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl gradient-purple-pink flex items-center justify-center shrink-0 shadow-lg shadow-purple-500/20">
                <Play className="w-6 h-6 sm:w-7 sm:h-7 text-white ml-1" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-2 sm:mb-3">
                  {subject.currentTopic}
                </h2>
                <div className="flex flex-wrap gap-2 sm:gap-3 text-xs sm:text-sm text-muted-foreground">
                  <span className="flex items-center gap-1 bg-secondary/50 px-2 py-1 rounded-lg">
                    <Clock className="w-3.5 h-3.5" />
                    45 min
                  </span>
                  <span className="flex items-center gap-1 bg-secondary/50 px-2 py-1 rounded-lg">
                    <FileText className="w-3.5 h-3.5" />
                    Teorija + Praktika
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <button
                className={`${subject.gradient} px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-white text-sm font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg hover:scale-105 active:scale-95`}
                onClick={() => startLesson(subject.currentTopic)}
              >
                <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                Tęsti mokymąsi
              </button>
              <button
                className="neon-button px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-secondary/80 text-foreground text-sm font-medium flex items-center justify-center gap-2 border border-primary/30 hover:border-primary/60 transition-all hover:bg-secondary active:scale-95"
                onClick={() => startTest(subject.currentTopic)}
              >
                <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                Generuoti Kontrolinį Darbą
              </button>
            </div>
          </div>

          {/* Past Topics */}
          <div className="glass rounded-xl sm:rounded-2xl p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
              Įveiktos temos
            </h3>
            <div className="space-y-1.5 sm:space-y-2">
              {subject.pastTopics.map((topic) => (
                <div
                  key={topic.id}
                  className="flex items-center justify-between p-3 sm:p-4 rounded-lg sm:rounded-xl bg-secondary/50 hover:bg-secondary/70 transition-all cursor-pointer group border border-transparent hover:border-white/10 hover:scale-[1.02]"
                  onClick={() => handleTopicClick(topic)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${topic.status === 'completed' ? 'bg-green-500/20 text-green-400' : 'bg-secondary text-muted-foreground'
                      }`}>
                      {topic.status === 'completed' ? <CheckCircle2 className="w-4 h-4" /> : <div className="w-2 h-2 rounded-full bg-current" />}
                    </div>
                    <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                      {topic.title}
                    </span>
                  </div>
                  {topic.score && (
                    <span className="text-xs font-bold text-green-400 bg-green-500/10 px-2 py-1 rounded-md border border-green-500/20">
                      {topic.score}%
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4 sm:space-y-6">
          {/* Next Assessment */}
          <div className="glass rounded-xl sm:rounded-2xl p-4 sm:p-6 border-l-4 border-orange-500">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Artimiausias atsiskaitymas</h3>
            <div className="flex items-start gap-3 mb-4">
              <div className="p-2 rounded-lg bg-orange-500/20 text-orange-400">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-foreground text-lg">{subject.nextAssessment}</div>
                <div className="text-sm text-orange-400 font-medium">Už 2 dienų</div>
              </div>
            </div>
            <button className="w-full py-2.5 rounded-lg bg-orange-500/10 text-orange-400 font-medium hover:bg-orange-500/20 transition-colors text-sm border border-orange-500/20 flex items-center justify-center gap-2">
              <Target className="w-4 h-4" />
              Ruoštis atsiskaitymui
            </button>
          </div>

          {/* Quick Actions */}
          <div className="glass rounded-xl sm:rounded-2xl p-4 sm:p-6">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Greitieji veiksmai</h3>
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <button
                className="p-3 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors text-center group border border-transparent hover:border-white/5"
                onClick={() => openNotes(subject.currentTopic)}
              >
                <BookOpen className="w-5 h-5 mx-auto mb-2 text-blue-400 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-medium text-foreground">Užrašai</span>
              </button>
              <button 
                onClick={() => setIsChatbotOpen(true)}
                className="p-3 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors text-center group border border-transparent hover:border-white/5"
              >
                <Brain className="w-5 h-5 mx-auto mb-2 text-purple-400 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-medium text-foreground">AI Tutorius</span>
              </button>
              <button className="p-3 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors text-center group border border-transparent hover:border-white/5">
                <BarChart3 className="w-5 h-5 mx-auto mb-2 text-green-400 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-medium text-foreground">Statistika</span>
              </button>
              <button
                className="p-3 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors text-center group border border-transparent hover:border-white/5"
                onClick={() => startPractice(subject.currentTopic)}
              >
                <Target className="w-5 h-5 mx-auto mb-2 text-red-400 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-medium text-foreground">Tikslai</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <TopicModal
        isOpen={isTopicModalOpen}
        onClose={() => setIsTopicModalOpen(false)}
        topic={selectedTopic}
        onStartLesson={() => {
          if (selectedTopic) {
            startLesson(selectedTopic.title);
          }
        }}
        onStartTest={() => {
          if (selectedTopic) {
            startTest(selectedTopic.title);
          }
        }}
      />

      <LessonModal
        isOpen={isLessonModalOpen}
        onClose={() => setIsLessonModalOpen(false)}
        topicTitle={currentLessonTitle}
      />

      <TestModal
        isOpen={isTestModalOpen}
        onClose={() => setIsTestModalOpen(false)}
        topicTitle={currentLessonTitle}
        onComplete={handleTestComplete}
      />

      <TestResultsModal
        isOpen={isTestResultsModalOpen}
        onClose={() => setIsTestResultsModalOpen(false)}
        score={testResults.score}
        total={testResults.total}
        topicTitle={currentLessonTitle}
        onRetry={() => {
          setIsTestResultsModalOpen(false);
          setIsTestModalOpen(true);
        }}
        onContinue={() => {
          setIsTestResultsModalOpen(false);
          // Could navigate to next topic or close
        }}
      />

      <PracticeModal
        isOpen={isPracticeModalOpen}
        onClose={() => setIsPracticeModalOpen(false)}
        topicTitle={currentLessonTitle}
      />

      <NotesModal
        isOpen={isNotesModalOpen}
        onClose={() => setIsNotesModalOpen(false)}
        topicTitle={currentLessonTitle}
      />

      {/* Subject-specific AI Chatbot */}
      {isChatbotOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[400px] max-w-[calc(100vw-3rem)]">
          <SubjectChatbot
            subjectName={subject.name}
            topic={subject.currentTopic}
            gradient={subject.gradient}
            onClose={() => setIsChatbotOpen(false)}
          />
        </div>
      )}

      {/* Floating Chat Button when closed */}
      {!isChatbotOpen && (
        <button
          onClick={() => setIsChatbotOpen(true)}
          className={`fixed bottom-6 right-6 z-50 ${subject.gradient} w-14 h-14 rounded-2xl shadow-2xl flex items-center justify-center hover:scale-110 transition-transform`}
        >
          <MessageCircle className="w-6 h-6 text-white" />
        </button>
      )}
    </div>
  );
};

export default LessonDetail;
