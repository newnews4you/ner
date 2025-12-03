import { useState, useMemo, useEffect } from "react";
import { Calculator, Monitor, Atom, BookOpen, Palette, Globe, Search, Filter, ArrowUpDown, X, TrendingUp, TrendingDown, Sparkles, Calendar, FileText, Target, Home, Brain, ClipboardList, BarChart3, Folder } from "lucide-react";
import Header from "@/components/Header";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import SubjectCard from "@/components/SubjectCard";
import DeadlinePanel from "@/components/DeadlinePanel";
import ChatbotSidebar from "@/components/ChatbotSidebar";
import LessonDetail from "@/components/LessonDetail";
import StreakCounter from "@/components/StreakCounter";
import QuickStats from "@/components/QuickStats";
import StudyTimer from "@/components/StudyTimer";
import Achievements, { mockAchievements } from "@/components/Achievements";
import NotificationCenter from "@/components/NotificationCenter";
import Goals, { Goal } from "@/components/Goals";
import ProgressCharts from "@/components/ProgressCharts";
import AIRecommendations from "@/components/AIRecommendations";
import AIPracticeGenerator from "@/components/AIPracticeGenerator";
import AILearningPath from "@/components/AILearningPath";
import StudySchedule, { TimeBlock } from "@/components/StudySchedule";
import DailyPlanner, { DailyTask } from "@/components/DailyPlanner";
import HabitTracker, { Habit } from "@/components/HabitTracker";
import NotionWorkspace from "@/components/NotionWorkspace";
import MaterialsManager from "@/components/MaterialsManager";
import { createNotification, Notification } from "@/utils/notificationUtils";
import useLocalStorage from "@/hooks/useLocalStorage";
import { api, Subject } from "@/services/api";



const deadlines = [
  {
    id: 1,
    subject: "Fizika",
    title: "Niutono dėsnių testas",
    date: "Gruodžio 12 d.",
    daysLeft: 2,
    urgent: true,
  },
  {
    id: 2,
    subject: "Anglų kalba",
    title: "Essay submission",
    date: "Gruodžio 14 d.",
    daysLeft: 4,
    urgent: false,
  },
  {
    id: 3,
    subject: "Matematika",
    title: "Integralų kontrolinis",
    date: "Gruodžio 15 d.",
    daysLeft: 5,
    urgent: false,
  },
  {
    id: 4,
    subject: "Lietuvių kalba",
    title: "Rašinio pateikimas",
    date: "Gruodžio 18 d.",
    daysLeft: 8,
    urgent: false,
  },
];

type SortOption = "name" | "progress-asc" | "progress-desc" | "deadline";

const Dashboard = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const data = await api.subjects.getAll();
        setSubjects(data);
      } catch (error) {
        console.error("Failed to fetch subjects:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSubjects();
  }, []);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("progress-desc");
  const [showFilters, setShowFilters] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useLocalStorage<Notification[]>("notifications", []);
  const [studyCompleted, setStudyCompleted] = useState(0);
  const [shouldUpdateStreak, setShouldUpdateStreak] = useState(false);

  // Mock data for QuickStats
  const quickStatsData = {
    todayTime: "2 val. 15 min",
    completedTasks: 7 + studyCompleted,
    totalTasks: 10,
    upcomingDeadline: deadlines[0] ? {
      subject: deadlines[0].subject,
      daysLeft: deadlines[0].daysLeft,
    } : undefined,
  };

  const handleStudyComplete = () => {
    setStudyCompleted(prev => prev + 1);
    setShouldUpdateStreak(true);
    const newNotification = createNotification(
      "success",
      "Mokymosi sesija užbaigta! 🎉",
      "Puikiai! Jūsų progresas išsaugotas."
    );
    setNotifications([newNotification, ...notifications]);
  };

  const handleNotification = (notification: Notification) => {
    setNotifications([notification, ...notifications]);
  };

  const handleGoalComplete = (goal: Goal) => {
    const newNotification = createNotification(
      "achievement",
      "Tikslas pasiektas! 🎯",
      `Puikiai! Užbaigėte tikslą: "${goal.title}"`
    );
    setNotifications([newNotification, ...notifications]);
  };

  const handleTimeBlockComplete = (block: TimeBlock) => {
    const newNotification = createNotification(
      "success",
      "Laiko blokas užbaigtas! ✅",
      `Puikiai! Užbaigėte: ${block.subject} - ${block.topic}`
    );
    setNotifications([newNotification, ...notifications]);
  };

  const handleTaskComplete = (task: DailyTask) => {
    const newNotification = createNotification(
      "success",
      "Užduotis užbaigta! ✅",
      `Puikiai! Užbaigėte: ${task.title}`
    );
    setNotifications([newNotification, ...notifications]);
  };

  const handleHabitComplete = (habit: Habit) => {
    if (habit.streak > 0 && habit.streak % 7 === 0) {
      const newNotification = createNotification(
        "achievement",
        "Įspūdinga serija! 🔥",
        `Puikiai! Jūsų įprotis "${habit.name}" tęsiasi jau ${habit.streak} dienų!`
      );
      setNotifications([newNotification, ...notifications]);
    }
  };

  // Prepare subjects data for planning components
  const subjectsForPlanning = subjects.map(s => ({
    name: s.name,
    icon: s.iconName === 'Calculator' ? Calculator :
      s.iconName === 'Monitor' ? Monitor :
        s.iconName === 'Atom' ? Atom :
          s.iconName === 'BookOpen' ? BookOpen :
            s.iconName === 'Palette' ? Palette : Globe,
    gradient: s.gradient,
  }));

  // Filter and sort subjects
  const filteredAndSortedSubjects = useMemo(() => {
    let filtered = subjects.filter((subject) =>
      subject.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      subject.teacher.toLowerCase().includes(searchQuery.toLowerCase()) ||
      subject.currentTopic.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Sort subjects
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "progress-asc":
          return a.progress - b.progress;
        case "progress-desc":
          return b.progress - a.progress;
        case "deadline":
          const aDeadline = deadlines.find(d => d.subject === a.name)?.daysLeft ?? 999;
          const bDeadline = deadlines.find(d => d.subject === b.name)?.daysLeft ?? 999;
          return aDeadline - bDeadline;
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchQuery, sortBy]);

  const totalProgress = useMemo(() => {
    const sum = subjects.reduce((acc, s) => acc + s.progress, 0);
    return Math.round(sum / subjects.length);
  }, []);

  return (
    <div className="min-h-screen synthwave-bg">
      <div className="relative z-10 max-w-[1600px] mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
        <Header
          onChatToggle={() => setIsChatOpen(!isChatOpen)}
          isChatOpen={isChatOpen}
          onNotificationClick={() => setShowNotifications(true)}
        />

        <div className="flex gap-4 lg:gap-6">
          {/* Main Content */}
          <main className="flex-1 min-w-0 pb-8 sm:pb-12">
            {selectedSubject ? (
              <LessonDetail
                subject={selectedSubject}
                onBack={() => setSelectedSubject(null)}
              />
            ) : (
              <>
                {/* Welcome Section */}
                <div className="mb-4 sm:mb-6 lg:mb-8 animate-fade-in">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-0.5 sm:mb-1">
                        Sveiki sugrįžę, Jonas 👋
                      </h2>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        Tęskite mokymąsi. Šiandien puiki diena tobulėti!
                      </p>
                    </div>
                    {/* Overall Progress Card */}
                    <div className="glass rounded-xl p-3 sm:p-4 border border-primary/20 animate-fade-in">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="relative w-12 h-12 sm:w-14 sm:h-14">
                          <svg className="w-full h-full transform -rotate-90">
                            <circle
                              cx="50%"
                              cy="50%"
                              r="45%"
                              fill="none"
                              stroke="hsl(var(--secondary))"
                              strokeWidth="4"
                            />
                            <circle
                              cx="50%"
                              cy="50%"
                              r="45%"
                              fill="none"
                              stroke="url(#overallProgressGradient)"
                              strokeWidth="4"
                              strokeLinecap="round"
                              strokeDasharray={`${totalProgress * 2.83} 283`}
                              className="transition-all duration-1000"
                            />
                            <defs>
                              <linearGradient id="overallProgressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="hsl(262, 83%, 58%)" />
                                <stop offset="100%" stopColor="hsl(330, 81%, 60%)" />
                              </linearGradient>
                            </defs>
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-xs sm:text-sm font-bold text-foreground">{totalProgress}%</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-[10px] sm:text-xs text-muted-foreground">Bendras progresas</p>
                          <p className="text-sm sm:text-base font-semibold text-foreground">{subjects.length} kursai</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tabs Navigation */}
                <Tabs defaultValue="overview" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 sm:grid-cols-6 mb-6 glass border border-white/10 p-1 h-auto">
                    <TabsTrigger value="overview" className="flex items-center gap-2 text-xs sm:text-sm py-2.5 sm:py-3 data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                      <Home className="w-4 h-4" />
                      <span className="hidden sm:inline">Pagrindinis</span>
                      <span className="sm:hidden">Pagr.</span>
                    </TabsTrigger>
                    <TabsTrigger value="ai" className="flex items-center gap-2 text-xs sm:text-sm py-2.5 sm:py-3 data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                      <Brain className="w-4 h-4" />
                      <span className="hidden sm:inline">AI Funkcijos</span>
                      <span className="sm:hidden">AI</span>
                    </TabsTrigger>
                    <TabsTrigger value="planning" className="flex items-center gap-2 text-xs sm:text-sm py-2.5 sm:py-3 data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                      <Calendar className="w-4 h-4" />
                      <span className="hidden sm:inline">Planavimas</span>
                      <span className="sm:hidden">Plan.</span>
                    </TabsTrigger>
                    <TabsTrigger value="notes" className="flex items-center gap-2 text-xs sm:text-sm py-2.5 sm:py-3 data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                      <FileText className="w-4 h-4" />
                      <span className="hidden sm:inline">Užrašai</span>
                      <span className="sm:hidden">Užr.</span>
                    </TabsTrigger>
                    <TabsTrigger value="materials" className="flex items-center gap-2 text-xs sm:text-sm py-2.5 sm:py-3 data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                      <Folder className="w-4 h-4" />
                      <span className="hidden sm:inline">Medžiaga</span>
                      <span className="sm:hidden">Medž.</span>
                    </TabsTrigger>
                    <TabsTrigger value="stats" className="flex items-center gap-2 text-xs sm:text-sm py-2.5 sm:py-3 data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
                      <BarChart3 className="w-4 h-4" />
                      <span className="hidden sm:inline">Statistika</span>
                      <span className="sm:hidden">Stat.</span>
                    </TabsTrigger>
                  </TabsList>

                  {/* Overview Tab */}
                  <TabsContent value="overview" className="space-y-4 sm:space-y-6">
                    {/* Quick Stats & Streak Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                      <QuickStats {...quickStatsData} />
                      <StreakCounter onStudyComplete={shouldUpdateStreak ? () => { setShouldUpdateStreak(false); } : undefined} />
                    </div>

                    {/* Study Timer */}
                    <div>
                      <button
                        onClick={() => setShowTimer(!showTimer)}
                        className="w-full glass rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-primary/20 hover:border-primary/40 transition-all text-left group"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl gradient-purple-pink flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                              <Calculator className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                            </div>
                            <div>
                              <h3 className="text-sm sm:text-base font-semibold text-foreground">
                                Pomodoro Timer
                              </h3>
                              <p className="text-[10px] sm:text-xs text-muted-foreground">
                                {showTimer ? "Paslėpti timer" : "Atidaryti mokymosi timer"}
                              </p>
                            </div>
                          </div>
                          <div className={`text-xs sm:text-sm text-primary transition-transform ${showTimer ? 'rotate-180' : ''}`}>
                            ▼
                          </div>
                        </div>
                      </button>

                      {showTimer && (
                        <div className="mt-3 sm:mt-4 animate-fade-in">
                          <StudyTimer
                            onStudyComplete={handleStudyComplete}
                            onNotification={handleNotification}
                            currentSubject={selectedSubject?.name || "Bendras mokymasis"}
                          />
                        </div>
                      )}
                    </div>

                    {/* Deadlines Panel */}
                    <DeadlinePanel
                      deadlines={deadlines}
                      onDeadlineClick={(subjectName) => {
                        const subject = subjects.find(s => s.name === subjectName);
                        if (subject) {
                          setSelectedSubject(subject);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }
                      }}
                    />

                    {/* Search and Filter Section */}
                    <div className="space-y-3">
                      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                        <div className="relative flex-1">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <input
                            type="text"
                            placeholder="Ieškoti kursų..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-10 py-2.5 sm:py-3 bg-secondary/50 border border-white/10 rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all glass"
                          />
                          {searchQuery && (
                            <button
                              onClick={() => setSearchQuery("")}
                              className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-secondary hover:bg-secondary/80 flex items-center justify-center transition-colors"
                            >
                              <X className="w-3 h-3 text-muted-foreground" />
                            </button>
                          )}
                        </div>
                        <div className="relative">
                          <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center gap-2 px-4 py-2.5 sm:py-3 bg-secondary/50 border border-white/10 rounded-xl text-sm text-foreground hover:bg-secondary/70 hover:border-primary/30 transition-all glass"
                          >
                            <ArrowUpDown className="w-4 h-4" />
                            <span className="hidden sm:inline">
                              {sortBy === "name" && "Pagal pavadinimą"}
                              {sortBy === "progress-asc" && "Progresas ↑"}
                              {sortBy === "progress-desc" && "Progresas ↓"}
                              {sortBy === "deadline" && "Pagal terminą"}
                            </span>
                            <span className="sm:hidden">Rūšiuoti</span>
                          </button>
                          {showFilters && (
                            <>
                              <div className="fixed inset-0 z-40" onClick={() => setShowFilters(false)} />
                              <div className="absolute right-0 top-full mt-2 z-50 w-48 glass rounded-xl border border-white/10 p-2 shadow-xl animate-scale-in">
                                <button onClick={() => { setSortBy("progress-desc"); setShowFilters(false); }} className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${sortBy === "progress-desc" ? "bg-primary/20 text-primary" : "text-foreground hover:bg-secondary/70"}`}>
                                  <TrendingDown className="w-4 h-4" /> Progresas (didėjimo)
                                </button>
                                <button onClick={() => { setSortBy("progress-asc"); setShowFilters(false); }} className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${sortBy === "progress-asc" ? "bg-primary/20 text-primary" : "text-foreground hover:bg-secondary/70"}`}>
                                  <TrendingUp className="w-4 h-4" /> Progresas (mažėjimo)
                                </button>
                                <button onClick={() => { setSortBy("name"); setShowFilters(false); }} className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${sortBy === "name" ? "bg-primary/20 text-primary" : "text-foreground hover:bg-secondary/70"}`}>
                                  Pagal pavadinimą
                                </button>
                                <button onClick={() => { setSortBy("deadline"); setShowFilters(false); }} className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${sortBy === "deadline" ? "bg-primary/20 text-primary" : "text-foreground hover:bg-secondary/70"}`}>
                                  Pagal terminą
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                      {searchQuery && (
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          Rasta: <span className="text-foreground font-medium">{filteredAndSortedSubjects.length}</span> iš {subjects.length} kursų
                        </p>
                      )}
                    </div>

                    {/* Subject Grid */}
                    <div>
                      <div className="flex items-center justify-between mb-3 sm:mb-4">
                        <h3 className="text-base sm:text-lg font-semibold text-foreground">Mano kursai</h3>
                        <span className="text-xs sm:text-sm text-muted-foreground">
                          {filteredAndSortedSubjects.length} {filteredAndSortedSubjects.length === 1 ? "kursas" : "kursai"}
                        </span>
                      </div>
                      {filteredAndSortedSubjects.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                          {filteredAndSortedSubjects.map((subject, index) => (
                            <div key={subject.id} style={{ animationDelay: `${index * 0.1}s` }} className="animate-fade-in">
                              <SubjectCard
                                subject={subject.name}
                                teacher={subject.teacher}
                                progress={subject.progress}
                                gradient={subject.gradient}
                                icon={subject.iconName === 'Calculator' ? Calculator :
                                  subject.iconName === 'Monitor' ? Monitor :
                                    subject.iconName === 'Atom' ? Atom :
                                      subject.iconName === 'BookOpen' ? BookOpen :
                                        subject.iconName === 'Palette' ? Palette : Globe}
                                onClick={() => setSelectedSubject(subject)}
                              />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="glass rounded-2xl p-8 sm:p-12 text-center animate-fade-in">
                          <div className="w-16 h-16 mx-auto mb-4 rounded-full gradient-purple-pink/20 flex items-center justify-center">
                            <Search className="w-8 h-8 text-primary" />
                          </div>
                          <h3 className="text-lg font-semibold text-foreground mb-2">Kursų nerasta</h3>
                          <p className="text-sm text-muted-foreground mb-4">Pabandykite pakeisti paieškos užklausą arba filtravimo kriterijus</p>
                          <button onClick={() => { setSearchQuery(""); setSortBy("progress-desc"); }} className="px-4 py-2 rounded-lg bg-secondary/50 hover:bg-secondary/70 text-sm text-foreground transition-colors border border-white/10">
                            Išvalyti filtrus
                          </button>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  {/* AI Tab */}
                  <TabsContent value="ai" className="space-y-4 sm:space-y-6">
                    <AIRecommendations
                      currentSubject={selectedSubject?.name}
                      weakAreas={selectedSubject?.pastTopics.filter(t => t.status !== 'completed').map(t => t.title) || []}
                    />
                    {selectedSubject && (
                      <AILearningPath
                        subject={selectedSubject.name}
                        currentLevel={selectedSubject.pastTopics.filter(t => t.status === 'completed').length}
                      />
                    )}
                    {selectedSubject && (
                      <AIPracticeGenerator
                        subject={selectedSubject.name}
                        topic={selectedSubject.currentTopic}
                        onComplete={(score, total) => {
                          const newNotification = createNotification(
                            "success",
                            "Praktikos testas baigtas! 🎯",
                            `Jūsų rezultatas: ${score} / ${total} (${Math.round((score / total) * 100)}%)`
                          );
                          setNotifications([newNotification, ...notifications]);
                        }}
                      />
                    )}
                    {!selectedSubject && (
                      <div className="glass rounded-2xl p-8 sm:p-12 text-center">
                        <Brain className="w-16 h-16 mx-auto mb-4 text-primary/50" />
                        <h3 className="text-lg font-semibold text-foreground mb-2">Pasirinkite kursą</h3>
                        <p className="text-sm text-muted-foreground">Pasirinkite kursą, kad pamatytumėte AI funkcijas</p>
                      </div>
                    )}
                  </TabsContent>

                  {/* Planning Tab */}
                  <TabsContent value="planning" className="space-y-4 sm:space-y-6">
                    <StudySchedule
                      subjects={subjectsForPlanning}
                      onBlockComplete={handleTimeBlockComplete}
                    />
                    <DailyPlanner
                      subjects={subjectsForPlanning}
                      onTaskComplete={handleTaskComplete}
                    />
                    <HabitTracker
                      onHabitComplete={handleHabitComplete}
                    />
                  </TabsContent>

                  {/* Notes Tab */}
                  <TabsContent value="notes" className="space-y-4 sm:space-y-6">
                    <NotionWorkspace subject={selectedSubject?.name} />
                  </TabsContent>

                  {/* Materials Tab */}
                  <TabsContent value="materials" className="space-y-4 sm:space-y-6">
                    <MaterialsManager subjects={subjects} />
                  </TabsContent>

                  {/* Stats Tab */}
                  <TabsContent value="stats" className="space-y-4 sm:space-y-6">
                    <ProgressCharts subjects={subjects} />
                    <Goals onGoalComplete={handleGoalComplete} />
                    <Achievements achievements={mockAchievements} />
                  </TabsContent>
                </Tabs>
              </>
            )}
          </main>

          {/* Desktop AI Chatbot Sidebar */}
          <ChatbotSidebar />
        </div>
      </div>

      {/* Mobile/Tablet Chat Overlay */}
      <ChatbotSidebar
        isMobileOverlay
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />

      {/* Notification Center */}
      <NotificationCenter
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />
    </div>
  );
};

export default Dashboard;
