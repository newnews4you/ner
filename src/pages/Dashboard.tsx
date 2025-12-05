import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Calculator, Monitor, Atom, BookOpen, Palette, Globe, Search, Filter, ArrowUpDown, X, TrendingUp, TrendingDown, Sparkles, Calendar, FileText, Target, Home, Brain, ClipboardList, BarChart3, Folder, Clock, CheckCircle2, ArrowRight, Zap, GraduationCap, ChevronRight } from "lucide-react";
import Header from "@/components/Header";
import SubjectCard from "@/components/SubjectCard";
import ChatbotSidebar from "@/components/ChatbotSidebar";
import LessonDetail from "@/components/LessonDetail";
import StudyTimer from "@/components/StudyTimer";
import NotificationCenter from "@/components/NotificationCenter";
import { createNotification, Notification } from "@/utils/notificationUtils";
import useLocalStorage from "@/hooks/useLocalStorage";
import { api, Subject } from "@/services/api";

// Mock subjects for fallback with FULL content
const mockSubjects: Subject[] = [
  {
    id: "1",
    name: "Matematika",
    teacher: "Jonas Jonaitis",
    progress: 75,
    grade: 9,
    gradient: "gradient-blue-cyan",
    iconName: "Calculator",
    currentTopic: "Integralų skaičiavimas",
    nextAssessment: "Kontrolinis: Gruodžio 15 d.",
    pastTopics: [
      { id: 101, title: "Funkcijos ir jų savybės", status: "completed", score: 95, duration: "45 min" },
      { id: 102, title: "Išvestinių skaičiavimas", status: "completed", score: 88, duration: "60 min" },
      { id: 103, title: "Trigonometrija", status: "completed", score: 92, duration: "50 min" },
      { id: 104, title: "Vektoriai erdvėje", status: "completed", score: 85, duration: "55 min" },
      { id: 105, title: "Tikimybių teorija", status: "in-progress", duration: "40 min" }
    ]
  },
  {
    id: "2",
    name: "Fizika",
    teacher: "Petras Petraitis",
    progress: 60,
    grade: 8,
    gradient: "gradient-purple-pink",
    iconName: "Atom",
    currentTopic: "Niutono dėsniai",
    nextAssessment: "Testas: Gruodžio 12 d.",
    pastTopics: [
      { id: 201, title: "Kinematika", status: "completed", score: 90, duration: "45 min" },
      { id: 202, title: "Dinamika", status: "completed", score: 85, duration: "50 min" },
      { id: 203, title: "Tvermės dėsniai", status: "in-progress", duration: "60 min" }
    ]
  },
  {
    id: "3",
    name: "Informatika",
    teacher: "Ona Onaitė",
    progress: 90,
    grade: 10,
    gradient: "gradient-green-teal",
    iconName: "Monitor",
    currentTopic: "Python pagrindai",
    nextAssessment: "Projektas: Gruodžio 20 d.",
    pastTopics: [
      { id: 301, title: "Algoritmai", status: "completed", score: 98, duration: "40 min" },
      { id: 302, title: "Duomenų struktūros", status: "completed", score: 95, duration: "55 min" },
      { id: 303, title: "Objektinis programavimas", status: "completed", score: 92, duration: "60 min" }
    ]
  },
  {
    id: "4",
    name: "Anglų kalba",
    teacher: "Mary Smith",
    progress: 85,
    grade: 9,
    gradient: "gradient-orange-red",
    iconName: "Globe",
    currentTopic: "Essay Writing",
    nextAssessment: "Rašinys: Gruodžio 14 d.",
    pastTopics: [
      { id: 401, title: "Grammar: Tenses", status: "completed", score: 88, duration: "45 min" },
      { id: 402, title: "Vocabulary: Environment", status: "completed", score: 90, duration: "30 min" },
      { id: 403, title: "Listening Comprehension", status: "completed", score: 85, duration: "40 min" }
    ]
  }
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useLocalStorage<Notification[]>("notifications", []);

  // Tool modals state
  const [isTimerOpen, setIsTimerOpen] = useState(false);

  // Draggable Timer State
  const [timerPosition, setTimerPosition] = useState({ x: window.innerWidth - 350, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - timerPosition.x,
      y: e.clientY - timerPosition.y
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setTimerPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Global mouse events for dragging
  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove as any);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove as any);
      window.removeEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove as any);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const data = await api.subjects.getAll();
        if (data && data.length > 0) {
          setSubjects(data);
        } else {
          setSubjects(mockSubjects);
        }
      } catch (error) {
        console.error("Failed to fetch subjects, using mock data:", error);
        setSubjects(mockSubjects);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSubjects();
  }, []);

  // Filter subjects - NO LONGER FILTERING BY SEARCH QUERY as requested
  const filteredSubjects = useMemo(() => {
    return subjects;
  }, [subjects]);

  // Global Search Results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const results: any[] = [];

    subjects.forEach(subject => {
      // Subject match
      if (subject.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        results.push({ type: 'subject', data: subject });
      }
      // Topic match
      subject.pastTopics?.forEach(topic => {
        if (topic.title.toLowerCase().includes(searchQuery.toLowerCase())) {
          results.push({ type: 'topic', data: topic, subjectName: subject.name, subject });
        }
      });
    });

    return results.slice(0, 5); // Limit to 5 results
  }, [subjects, searchQuery]);

  const totalProgress = useMemo(() => {
    if (subjects.length === 0) return 0;
    const sum = subjects.reduce((acc, s) => acc + s.progress, 0);
    return Math.round(sum / subjects.length);
  }, [subjects]);

  return (
    <div className="min-h-screen bg-[#F7F7F5]">
      <div className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <Header
          onChatToggle={() => setIsChatOpen(!isChatOpen)}
          isChatOpen={isChatOpen}
          onNotificationClick={() => setShowNotifications(true)}
        />

        <div className="flex gap-12 pt-6">
          {/* Main Content Area */}
          <main className="flex-1 space-y-10 min-w-0">
            {selectedSubject ? (
              <LessonDetail
                subject={selectedSubject}
                onBack={() => setSelectedSubject(null)}
              />
            ) : (
              <>
                {/* I. Call to Action (CTA) */}
                <section className="animate-fade-in relative z-40">
                  <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm relative">
                    {/* Decorative background with overflow hidden */}
                    <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-gray-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50" />
                    </div>

                    <div className="relative z-10 flex flex-col xl:flex-row justify-between items-end gap-8">
                      {/* Left: Greeting */}
                      <div className="max-w-xl w-full">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">
                          Sveiki sugrįžę, Jonas 👋
                        </h1>
                        <p className="text-gray-500">
                          Tęskite mokymąsi ten, kur sustojote. Šiandien puiki diena pasiekti naujų tikslų!
                        </p>
                      </div>

                      {/* Right: Search & Assessment */}
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full xl:w-auto">
                        {/* Notion Search Bar with Dropdown */}
                        <div className="w-full sm:w-[450px] relative z-30">
                          <div className="relative group h-full">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-gray-900 transition-colors" />
                            <input
                              type="text"
                              placeholder="Ieškoti..."
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              className="w-full h-full pl-12 pr-4 py-4 bg-gray-50 border-transparent rounded-xl text-gray-900 placeholder:text-gray-500 focus:outline-none focus:bg-white focus:border-gray-200 focus:ring-4 focus:ring-gray-100 transition-all"
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                              <span className="text-xs text-gray-400 border border-gray-200 rounded px-1.5 py-0.5">⌘K</span>
                            </div>
                          </div>

                          {/* Search Dropdown Results */}
                          {searchQuery && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden animate-fade-in">
                              {searchResults.length > 0 ? (
                                searchResults.map((result, index) => (
                                  <div
                                    key={index}
                                    onClick={() => {
                                      if (result.type === 'subject') {
                                        setSelectedSubject(result.data);
                                      } else {
                                        setSelectedSubject(result.subject);
                                      }
                                      setSearchQuery('');
                                    }}
                                    className="p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-0 flex items-center gap-3 transition-colors"
                                  >
                                    <div className="p-2 bg-gray-100 rounded-lg shrink-0">
                                      {result.type === 'subject' ? (
                                        <BookOpen className="w-4 h-4 text-blue-600" />
                                      ) : (
                                        <FileText className="w-4 h-4 text-gray-500" />
                                      )}
                                    </div>
                                    <div className="min-w-0">
                                      <div className="font-medium text-gray-900 truncate">{result.type === 'subject' ? result.data.name : result.data.title}</div>
                                      {result.type === 'topic' && <div className="text-xs text-gray-500 truncate">{result.subjectName}</div>}
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <div className="p-4 text-center text-gray-500 text-sm">Rezultatų nerasta</div>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Assessment Card */}
                        <div
                          onClick={() => {
                            const fizika = subjects.find(s => s.name === "Fizika");
                            if (fizika) setSelectedSubject(fizika);
                          }}
                          className="flex items-center gap-4 px-6 py-3 rounded-xl bg-white border border-orange-100 shadow-sm hover:shadow-md transition-all cursor-pointer group shrink-0 h-[60px]"
                        >
                          <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                            <Calendar className="w-5 h-5 text-orange-600" />
                          </div>
                          <div>
                            <div className="text-[10px] font-bold text-orange-600 uppercase tracking-wider mb-0.5">Artimiausias</div>
                            <div className="text-sm font-bold text-gray-900 whitespace-nowrap">Fizika: Testas (12 d.)</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Course List (Moved Up) */}
                <section className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-gray-900">Mano kursai</h3>
                    <button
                      onClick={() => navigate('/all-courses')}
                      className="text-sm text-gray-500 hover:text-gray-900 font-medium flex items-center gap-1"
                    >
                      Visi kursai <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  {filteredSubjects.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {filteredSubjects.map((subject, index) => (
                        <SubjectCard
                          key={subject.id}
                          subject={subject.name}
                          progress={subject.progress}
                          gradient={subject.gradient}
                          icon={subject.iconName === 'Calculator' ? Calculator :
                            subject.iconName === 'Monitor' ? Monitor :
                              subject.iconName === 'Atom' ? Atom :
                                subject.iconName === 'BookOpen' ? BookOpen :
                                  subject.iconName === 'Palette' ? Palette : Globe}
                          onClick={() => setSelectedSubject(subject)}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white rounded-xl p-12 text-center border border-gray-200 border-dashed">
                      <p className="text-gray-500">Kursų nerasta pagal jūsų paiešką.</p>
                    </div>
                  )}
                </section>

                {/* II. Statistics & Quick Tools */}
                <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                  {/* Left Column: Stats Cards */}
                  <div className="space-y-4">
                    {/* Overall Progress */}
                    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-medium text-gray-500">Bendras progresas</span>
                        <TrendingUp className="w-4 h-4 text-green-600" />
                      </div>
                      <div className="flex items-end gap-3">
                        <span className="text-3xl font-bold text-gray-900 tracking-tight">{totalProgress}%</span>
                        <span className="text-sm text-gray-400 mb-1">išmokta</span>
                      </div>
                      <div className="mt-3 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 rounded-full" style={{ width: `${totalProgress}%` }} />
                      </div>
                    </div>

                    {/* Time Spent */}
                    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-medium text-gray-500">Laikas šią savaitę</span>
                        <Clock className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex items-end gap-3">
                        <span className="text-3xl font-bold text-gray-900 tracking-tight">4h 30m</span>
                        <span className="text-sm text-green-600 mb-1 font-medium">+12%</span>
                      </div>
                    </div>

                    {/* Pending Tasks */}
                    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-medium text-gray-500">Laukiančios užduotys</span>
                        <Target className="w-4 h-4 text-orange-600" />
                      </div>
                      <div className="flex items-end gap-3">
                        <span className="text-3xl font-bold text-gray-900 tracking-tight">3</span>
                        <span className="text-sm text-gray-400 mb-1">testai</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Quick Tools */}
                  <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Greiti įrankiai</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={() => setIsTimerOpen(!isTimerOpen)}
                        className={`p-4 rounded-xl transition-colors text-left group border flex flex-col items-start h-full ${isTimerOpen ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-100 hover:bg-gray-100'}`}
                      >
                        <div className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                          <Clock className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="font-semibold text-gray-900 text-sm">Pomodoro Timer</div>
                        <div className="text-xs text-gray-500 mt-1">{isTimerOpen ? 'Aktyvus' : 'Fokusavimosi sesijos'}</div>
                      </button>

                      <button className="p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors text-left group border border-gray-100 flex flex-col items-start h-full">
                        <div className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                          <BookOpen className="w-5 h-5 text-purple-600" />
                        </div>
                        <div className="font-semibold text-gray-900 text-sm">Formulių Katalogas</div>
                        <div className="text-xs text-gray-500 mt-1">Matematika ir Fizika</div>
                      </button>

                      <button
                        onClick={() => setIsChatOpen(true)}
                        className="p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors text-left group border border-gray-100 flex flex-col items-start h-full"
                      >
                        <div className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                          <Brain className="w-5 h-5 text-green-600" />
                        </div>
                        <div className="font-semibold text-gray-900 text-sm">AI Pagalba</div>
                        <div className="text-xs text-gray-500 mt-1">Namų darbų tikrinimas</div>
                      </button>

                      <button
                        onClick={() => navigate('/planner')}
                        className="p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors text-left group border border-gray-100 flex flex-col items-start h-full"
                      >
                        <div className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                          <Calendar className="w-5 h-5 text-orange-600" />
                        </div>
                        <div className="font-semibold text-gray-900 text-sm">Planuoklis</div>
                        <div className="text-xs text-gray-500 mt-1">Savaitės tvarkaraštis</div>
                      </button>
                    </div>
                  </div>
                </section>

                {/* III. LŠS Matrix & Recommendations */}
                <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                  {/* LŠS Matrix */}
                  <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all relative overflow-hidden">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">LŠS Kompetencijų Matrica</h3>
                        <p className="text-sm text-gray-500">Jūsų pasiekimai pagal standartus</p>
                      </div>
                      <div className="p-2 bg-gray-50 rounded-lg">
                        <GraduationCap className="w-5 h-5 text-gray-600" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      {/* Knowledge */}
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium text-gray-700">Žinios</span>
                          <span className="text-blue-600 font-bold">85%</span>
                        </div>
                        <div className="h-32 bg-gray-50 rounded-xl relative overflow-hidden flex items-end p-2 gap-1">
                          <div className="w-1/3 bg-blue-200 rounded-t-sm h-[60%]" />
                          <div className="w-1/3 bg-blue-400 rounded-t-sm h-[80%]" />
                          <div className="w-1/3 bg-blue-600 rounded-t-sm h-[85%]" />
                        </div>
                      </div>

                      {/* Understanding */}
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium text-gray-700">Supratimas</span>
                          <span className="text-purple-600 font-bold">72%</span>
                        </div>
                        <div className="h-32 bg-gray-50 rounded-xl relative overflow-hidden flex items-end p-2 gap-1">
                          <div className="w-1/3 bg-purple-200 rounded-t-sm h-[50%]" />
                          <div className="w-1/3 bg-purple-400 rounded-t-sm h-[65%]" />
                          <div className="w-1/3 bg-purple-600 rounded-t-sm h-[72%]" />
                        </div>
                      </div>

                      {/* Skills */}
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium text-gray-700">Gebėjimai</span>
                          <span className="text-green-600 font-bold">90%</span>
                        </div>
                        <div className="h-32 bg-gray-50 rounded-xl relative overflow-hidden flex items-end p-2 gap-1">
                          <div className="w-1/3 bg-green-200 rounded-t-sm h-[70%]" />
                          <div className="w-1/3 bg-green-400 rounded-t-sm h-[85%]" />
                          <div className="w-1/3 bg-green-600 rounded-t-sm h-[90%]" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recommended Next */}
                  <div className="bg-gray-900 rounded-xl p-6 text-white shadow-lg relative overflow-hidden group cursor-pointer hover:scale-[1.02] transition-transform">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                    <div className="relative z-10">
                      <div className="flex items-center gap-2 mb-4 text-gray-400">
                        <Sparkles className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-wider">AI Rekomendacija</span>
                      </div>
                      <h3 className="text-xl font-bold mb-2">Termodinamika</h3>
                      <p className="text-gray-400 text-sm mb-6">
                        Pastebėjome spragų šioje temoje. Rekomenduojame 15 min. peržiūrą.
                      </p>
                      <button
                        onClick={() => {
                          const fizika = subjects.find(s => s.name === "Fizika");
                          if (fizika) setSelectedSubject(fizika);
                        }}
                        className="w-full bg-white text-gray-900 py-2.5 rounded-lg font-semibold text-sm hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
                      >
                        Pradėti peržiūrą
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </section>
              </>
            )}
          </main>

          {/* Desktop Floating Chatbot (Global) */}
          <div className={`fixed bottom-6 right-6 w-[400px] h-[600px] max-h-[calc(100vh-6rem)] bg-white rounded-2xl shadow-2xl transform transition-all duration-300 ease-in-out z-50 hidden lg:block ${isChatOpen ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}`}>
            <ChatbotSidebar onClose={() => setIsChatOpen(false)} mode="guide" />
          </div>

          {/* Mobile/Tablet Chat Overlay */}
          <ChatbotSidebar
            isMobileOverlay
            isOpen={isChatOpen}
            onClose={() => setIsChatOpen(false)}
            mode="guide"
            subjectName={selectedSubject?.name}
          />

          {/* Floating Mokslo Gidas Button (Global) */}
          {!isChatOpen && (
            <button
              onClick={() => setIsChatOpen(true)}
              className="fixed bottom-6 right-6 z-40 bg-gray-900 text-white p-4 rounded-full shadow-xl hover:scale-110 transition-transform flex items-center gap-2 group animate-fade-in"
            >
              <div className="bg-white/20 p-1 rounded-full">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="font-medium text-sm pr-1 hidden group-hover:inline-block transition-all">Mokslo Gidas</span>
            </button>
          )}

          {/* Notification Center */}
          <NotificationCenter
            isOpen={showNotifications}
            onClose={() => setShowNotifications(false)}
          />

          {/* Draggable Timer Widget */}
          {isTimerOpen && (
            <div
              style={{
                position: 'fixed',
                left: timerPosition.x,
                top: timerPosition.y,
                zIndex: 50
              }}
              className="w-96 bg-white rounded-xl shadow-2xl border border-gray-200 animate-fade-in overflow-hidden"
            >
              <div
                onMouseDown={handleMouseDown}
                className="p-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between cursor-move select-none active:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-2 pointer-events-none">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span className="font-semibold text-sm text-gray-900">Pomodoro</span>
                </div>
                <button
                  onClick={() => setIsTimerOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="overflow-hidden">
                <StudyTimer
                  onStudyComplete={() => {
                    // Handle completion
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
