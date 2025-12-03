import { useState, useEffect, useRef } from "react";
import { Play, Pause, Square, RotateCcw, Clock, Coffee } from "lucide-react";
import useLocalStorage from "@/hooks/useLocalStorage";
import { createNotification } from "@/utils/notificationUtils";

type TimerMode = "work" | "break" | "longBreak";

interface StudyTimerProps {
  workDuration?: number; // in minutes
  shortBreakDuration?: number;
  longBreakDuration?: number;
  onStudyComplete?: () => void;
  onNotification?: (notification: ReturnType<typeof createNotification>) => void;
  currentSubject?: string;
}

const StudyTimer = ({
  workDuration = 25,
  shortBreakDuration = 5,
  longBreakDuration = 15,
  onStudyComplete,
  onNotification,
  currentSubject = "Mokymasis",
}: StudyTimerProps) => {
  const [timeLeft, setTimeLeft] = useLocalStorage("timerTimeLeft", workDuration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useLocalStorage<TimerMode>("timerMode", "work");
  const [sessionsCompleted, setSessionsCompleted] = useLocalStorage("timerSessions", 0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  const handleTimerComplete = () => {
    setIsRunning(false);
    if (mode === "work") {
      const newSessions = sessionsCompleted + 1;
      setSessionsCompleted(newSessions);
      
      // Save study session
      const sessions = JSON.parse(localStorage.getItem("studySessions") || "[]");
      const today = new Date().toISOString().split('T')[0];
      sessions.push({
        date: today,
        minutes: workDuration,
        subject: currentSubject,
      });
      localStorage.setItem("studySessions", JSON.stringify(sessions));
      
      // Trigger study complete callback
      if (onStudyComplete) {
        onStudyComplete();
      }
      
      // Show notification
      if (onNotification) {
        onNotification(
          createNotification(
            "success",
            "Mokymosi sesija baigta! 🎉",
            `Puikiai! Užbaigta ${newSessions} ${newSessions === 1 ? "sesija" : "sesijos"}. Laikas pertraukai!`
          )
        );
      }
      
      // Auto start break after work session
      const nextMode = newSessions > 0 && newSessions % 3 === 0 ? "longBreak" : "break";
      setMode(nextMode);
      setTimeLeft(
        (nextMode === "longBreak" ? longBreakDuration : shortBreakDuration) * 60
      );
    } else {
      // Auto start work after break
      if (onNotification) {
        onNotification(
          createNotification(
            "info",
            "Pertrauka baigta",
            "Laikas grįžti prie mokymosi! Tęskite darbą."
          )
        );
      }
      setMode("work");
      setTimeLeft(workDuration * 60);
    }
    
    // Browser notification
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(
        mode === "work" ? "Mokymosi sesija baigta!" : "Pertrauka baigta",
        {
          body: mode === "work" 
            ? "Puikiai! Laikas pertraukai!" 
            : "Laikas grįžti prie mokymosi!",
          icon: "/favicon.ico",
        }
      );
    }
  };

  const startTimer = () => {
    // Request notification permission
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
    setIsRunning(true);
  };

  const pauseTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(
      mode === "work"
        ? workDuration * 60
        : mode === "longBreak"
        ? longBreakDuration * 60
        : shortBreakDuration * 60
    );
  };

  const skipSession = () => {
    setIsRunning(false);
    if (mode === "work") {
      setMode("break");
      setTimeLeft(shortBreakDuration * 60);
    } else {
      setMode("work");
      setTimeLeft(workDuration * 60);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const progress = (() => {
    const total = mode === "work" 
      ? workDuration * 60 
      : mode === "longBreak" 
      ? longBreakDuration * 60 
      : shortBreakDuration * 60;
    return ((total - timeLeft) / total) * 100;
  })();

  const getModeColor = () => {
    if (mode === "work") return "gradient-purple-pink";
    if (mode === "longBreak") return "gradient-green-teal";
    return "gradient-cyan-blue";
  };

  const getModeLabel = () => {
    if (mode === "work") return "Mokymosi sesija";
    if (mode === "longBreak") return "Ilgoji pertrauka";
    return "Trumpoji pertrauka";
  };

  return (
    <div className="glass rounded-xl sm:rounded-2xl p-4 sm:p-6 border-2 border-primary/20 relative overflow-hidden animate-fade-in">
      {/* Background effects */}
      <div className={`absolute inset-0 ${getModeColor()} opacity-5`} />
      <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full bg-primary/10 blur-3xl" />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${getModeColor()} flex items-center justify-center shadow-lg`}>
              {mode === "work" ? (
                <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              ) : (
                <Coffee className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              )}
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-semibold text-foreground">{getModeLabel()}</h3>
              <p className="text-[10px] sm:text-xs text-muted-foreground">
                {sessionsCompleted} {sessionsCompleted === 1 ? "sesija" : "sesijos"} užbaigta
              </p>
            </div>
          </div>
        </div>

        {/* Timer Display */}
        <div className="flex flex-col items-center mb-4 sm:mb-6">
          <div className="relative w-48 h-48 sm:w-56 sm:h-56 mb-4">
            {/* Progress Circle */}
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
                stroke="url(#timerGradient)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${progress * 2.83} 283`}
                className="transition-all duration-1000"
              />
              <defs>
                <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="hsl(262, 83%, 58%)" />
                  <stop offset="100%" stopColor="hsl(330, 81%, 60%)" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-4xl sm:text-5xl font-bold text-foreground mb-1">
                  {formatTime(timeLeft)}
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {mode === "work" ? "Fokusavimosi laikas" : "Pailsėkite"}
                </p>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {!isRunning ? (
              <button
                onClick={startTimer}
                className={`${getModeColor()} px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl text-white font-medium flex items-center gap-2 hover:opacity-90 transition-all shadow-lg hover:scale-105`}
              >
                <Play className="w-4 h-4 sm:w-5 sm:h-5" />
                Pradėti
              </button>
            ) : (
              <button
                onClick={pauseTimer}
                className="px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl bg-secondary/80 text-foreground font-medium flex items-center gap-2 hover:bg-secondary transition-all border border-white/10 hover:scale-105"
              >
                <Pause className="w-4 h-4 sm:w-5 sm:h-5" />
                Pristabdyti
              </button>
            )}
            
            <button
              onClick={resetTimer}
              className="px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-secondary/50 text-foreground hover:bg-secondary/70 transition-all border border-white/10 flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={skipSession}
              className="px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-secondary/50 text-foreground hover:bg-secondary/70 transition-all border border-white/10 flex items-center gap-2"
            >
              <Square className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyTimer;

