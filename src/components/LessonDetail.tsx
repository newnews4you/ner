import { ArrowLeft, Play, CheckCircle2, Circle, Calendar, Clock, BookOpen, Sparkles, TrendingUp, Target, Timer, FileText } from "lucide-react";
import { LucideIcon } from "lucide-react";

interface Topic {
  id: number;
  title: string;
  completed: boolean;
  duration: string;
}

interface Subject {
  id: number;
  name: string;
  teacher: string;
  gradient: string;
  icon: LucideIcon;
  currentTopic: string;
  nextAssessment: string;
  progress: number;
  pastTopics: Topic[];
}

interface LessonDetailProps {
  subject: Subject;
  onBack: () => void;
}

const LessonDetail = ({ subject, onBack }: LessonDetailProps) => {
  const Icon = subject.icon;

  // Mock statistics data
  const stats = {
    overallScore: 85,
    lastTestResult: "9/10",
    timeSpent: "4 val. 30 min.",
    completedTopics: subject.pastTopics.filter(t => t.completed).length,
    totalTopics: subject.pastTopics.length + 1,
  };

  return (
    <div className="animate-fade-in">
      {/* Header Banner */}
      <div className={`${subject.gradient} rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 relative overflow-hidden mb-4 sm:mb-6`}>
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />
        <div className="absolute -right-10 -top-10 w-32 sm:w-40 h-32 sm:h-40 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -right-5 -bottom-5 w-24 sm:w-32 h-24 sm:h-32 rounded-full bg-white/5 blur-xl" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNDBMNDAgNDBIMHoiLz48cGF0aCBkPSJNNDAgMEgwdjQwaDQweiIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiLz48L2c+PC9zdmc+')] opacity-30" />
        
        <div className="relative z-10">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 sm:gap-2 text-white/80 hover:text-white transition-colors mb-4 sm:mb-6 group"
          >
            <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs sm:text-sm font-medium">Grįžti</span>
          </button>

          <div className="flex items-center gap-3 sm:gap-5">
            <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/20">
              <Icon className="w-7 h-7 sm:w-10 sm:h-10 text-white" strokeWidth={1.5} />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-0.5 sm:mb-1">{subject.name}</h1>
              <p className="text-white/70 text-xs sm:text-sm">{subject.teacher}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* Current Topic - Glowing */}
          <div className="glass rounded-xl sm:rounded-2xl p-4 sm:p-6 relative overflow-hidden border-2 border-primary/50 glow-purple animate-glow">
            <div className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 rounded-full bg-primary/20 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-20 sm:w-24 h-20 sm:h-24 rounded-full bg-accent/10 blur-2xl" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-primary animate-neon" />
                <span className="text-xs sm:text-sm font-medium text-primary">Dabartinė tema</span>
              </div>

              <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-2 sm:mb-3">
                {subject.currentTopic}
              </h2>

              <p className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6">
                Tęskite mokymąsi nuo ten, kur baigėte. Jūsų pažanga išsaugoma automatiškai.
              </p>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <button 
                  className={`${subject.gradient} px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-white text-sm font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg hover:scale-105 active:scale-95`}
                  onClick={() => {
                    // TODO: Implement lesson continuation
                    console.log("Tęsti mokymąsi:", subject.currentTopic);
                  }}
                >
                  <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  Tęsti mokymąsi
                </button>
                <button 
                  className="neon-button px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-secondary/80 text-foreground text-sm font-medium flex items-center justify-center gap-2 border border-primary/30 hover:border-primary/60 transition-all hover:bg-secondary active:scale-95"
                  onClick={() => {
                    // TODO: Implement test generation
                    console.log("Generuoti kontrolinį darbą:", subject.name);
                  }}
                >
                  <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  Generuoti Kontrolinį Darbą
                </button>
              </div>
            </div>
          </div>

          {/* Statistics Panel */}
          <div className="glass rounded-xl sm:rounded-2xl p-4 sm:p-6">
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl gradient-cyan-blue flex items-center justify-center shadow-lg shadow-cyan-500/30">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-semibold text-foreground">Temos Išmokimo Statistika</h3>
                <p className="text-[10px] sm:text-xs text-muted-foreground">Jūsų mokymosi progresas</p>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
              {/* Overall Score */}
              <div className="bg-secondary/50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-white/5 hover:border-primary/30 transition-colors group">
                <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                  <Target className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
                  <span className="text-[10px] sm:text-xs text-muted-foreground">Bendras įvertis</span>
                </div>
                <div className="relative w-12 h-12 sm:w-16 sm:h-16 mx-auto">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="50%"
                      cy="50%"
                      r="40%"
                      fill="none"
                      stroke="hsl(var(--secondary))"
                      strokeWidth="6"
                    />
                    <circle
                      cx="50%"
                      cy="50%"
                      r="40%"
                      fill="none"
                      stroke="url(#scoreGradient)"
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeDasharray={`${stats.overallScore * 1.76} 176`}
                      className="transition-all duration-1000"
                    />
                    <defs>
                      <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="hsl(320, 100%, 60%)" />
                        <stop offset="100%" stopColor="hsl(180, 100%, 50%)" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm sm:text-lg font-bold text-foreground">{stats.overallScore}%</span>
                  </div>
                </div>
              </div>

              {/* Last Test Result */}
              <div className="bg-secondary/50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-white/5 hover:border-cyan-500/30 transition-colors group">
                <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                  <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400" />
                  <span className="text-[10px] sm:text-xs text-muted-foreground line-clamp-1">Pask. testo rez.</span>
                </div>
                <p className="text-xl sm:text-2xl font-bold text-foreground text-center mt-2 sm:mt-4">{stats.lastTestResult}</p>
                <p className="text-[10px] sm:text-xs text-green-400 text-center mt-0.5 sm:mt-1">Puikiai!</p>
              </div>

              {/* Time Spent */}
              <div className="bg-secondary/50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-white/5 hover:border-orange-500/30 transition-colors group">
                <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                  <Timer className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-400" />
                  <span className="text-[10px] sm:text-xs text-muted-foreground">Laikas</span>
                </div>
                <p className="text-base sm:text-xl font-bold text-foreground text-center mt-2 sm:mt-4">{stats.timeSpent}</p>
                <p className="text-[10px] sm:text-xs text-muted-foreground text-center mt-0.5 sm:mt-1">šią temą</p>
              </div>

              {/* Topics Completed */}
              <div className="bg-secondary/50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-white/5 hover:border-green-500/30 transition-colors group">
                <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                  <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-400" />
                  <span className="text-[10px] sm:text-xs text-muted-foreground">Užbaigtos</span>
                </div>
                <p className="text-xl sm:text-2xl font-bold text-foreground text-center mt-2 sm:mt-4">{stats.completedTopics}/{stats.totalTopics}</p>
                <div className="w-full h-1 sm:h-1.5 bg-secondary rounded-full mt-1.5 sm:mt-2 overflow-hidden">
                  <div 
                    className="h-full gradient-green-teal rounded-full transition-all duration-500"
                    style={{ width: `${(stats.completedTopics / stats.totalTopics) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Past Topics */}
          <div className="glass rounded-xl sm:rounded-2xl p-4 sm:p-6">
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5">
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
              <h3 className="text-sm sm:text-base font-semibold text-foreground">Buvusios temos</h3>
            </div>

            <div className="space-y-1.5 sm:space-y-2">
              {subject.pastTopics.map((topic) => (
                <div
                  key={topic.id}
                  className="flex items-center justify-between p-3 sm:p-4 rounded-lg sm:rounded-xl bg-secondary/50 hover:bg-secondary/70 transition-all cursor-pointer group border border-transparent hover:border-white/10 hover:scale-[1.02]"
                  onClick={() => {
                    // TODO: Navigate to topic details
                    console.log("Atidaryti temą:", topic.title);
                  }}
                >
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                    {topic.completed ? (
                      <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 shrink-0 animate-pulse" />
                    ) : (
                      <Circle className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground shrink-0 group-hover:text-primary transition-colors" />
                    )}
                    <span className={`text-xs sm:text-sm truncate ${topic.completed ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"} transition-colors`}>
                      {topic.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-xs text-muted-foreground shrink-0">
                    <span className="hidden sm:inline">{topic.duration}</span>
                    <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 rotate-180 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4 sm:space-y-6">
          {/* Progress */}
          <div className="glass rounded-xl sm:rounded-2xl p-4 sm:p-6">
            <h3 className="text-xs sm:text-sm font-medium text-muted-foreground mb-3 sm:mb-4">Bendras progresas</h3>
            
            <div className="relative w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-3 sm:mb-4">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="50%"
                  cy="50%"
                  r="45%"
                  fill="none"
                  stroke="hsl(var(--secondary))"
                  strokeWidth="8"
                />
                <circle
                  cx="50%"
                  cy="50%"
                  r="45%"
                  fill="none"
                  stroke="url(#progressGradient)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${subject.progress * 2.83} 283`}
                  className="transition-all duration-1000"
                />
                <defs>
                  <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="hsl(262, 83%, 58%)" />
                    <stop offset="100%" stopColor="hsl(330, 81%, 60%)" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl sm:text-2xl font-bold text-foreground">{subject.progress}%</span>
              </div>
            </div>

            <p className="text-center text-xs sm:text-sm text-muted-foreground">
              {100 - subject.progress}% iki kurso pabaigos
            </p>
          </div>

          {/* Next Assessment */}
          <div className="glass rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-orange-500/20">
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl gradient-orange-red flex items-center justify-center shadow-lg shadow-orange-500/30">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div>
                <p className="text-[10px] sm:text-xs text-muted-foreground">Kitas atsiskaitymas</p>
                <p className="text-xs sm:text-sm font-semibold text-foreground">{subject.nextAssessment}</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-orange-400">
              <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>Liko 5 dienos</span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="glass rounded-xl sm:rounded-2xl p-4 sm:p-6">
            <h3 className="text-xs sm:text-sm font-medium text-muted-foreground mb-3 sm:mb-4">Greiti veiksmai</h3>
            <div className="space-y-1.5 sm:space-y-2">
              <button 
                className="w-full p-2.5 sm:p-3 rounded-lg sm:rounded-xl bg-secondary/50 hover:bg-secondary/70 text-xs sm:text-sm text-foreground text-left transition-all flex items-center gap-2 sm:gap-3 border border-transparent hover:border-primary/30 hover:scale-[1.02] active:scale-95"
                onClick={() => {
                  // TODO: Start practice
                  console.log("Pradėti pratybas:", subject.name);
                }}
              >
                <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
                Pradėti pratybas
              </button>
              <button 
                className="w-full p-2.5 sm:p-3 rounded-lg sm:rounded-xl bg-secondary/50 hover:bg-secondary/70 text-xs sm:text-sm text-foreground text-left transition-all flex items-center gap-2 sm:gap-3 border border-transparent hover:border-cyan-500/30 hover:scale-[1.02] active:scale-95"
                onClick={() => {
                  // TODO: View notes
                  console.log("Peržiūrėti užrašus:", subject.name);
                }}
              >
                <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400" />
                Peržiūrėti užrašus
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonDetail;
