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
    if (mode === "work") return "bg-blue-100 text-blue-600";
    if (mode === "longBreak") return "bg-green-100 text-green-600";
    return "bg-cyan-100 text-cyan-600";
  };

  const getModeLabel = () => {
    if (mode === "work") return "Mokymosi sesija";
    if (mode === "longBreak") return "Ilgoji pertrauka";
    return "Trumpoji pertrauka";
  };

  return (
    <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm transition-all hover:shadow-md">
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${mode === "work" ? "bg-gray-100 text-gray-900" :
                mode === "longBreak" ? "bg-green-50 text-green-700" : "bg-orange-50 text-orange-700"
              }`}>
              {mode === "work" ? (
                <Clock className="w-4 h-4" />
              ) : (
                <Coffee className="w-4 h-4" />
              )}
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 tracking-tight">{getModeLabel()}</h3>
              <p className="text-[10px] text-gray-500 font-medium">
                {sessionsCompleted} {sessionsCompleted === 1 ? "sesija" : "sesijos"} užbaigta
              </p>
            </div>
          </div>
        </div>

        {/* Timer Display */}
        <div className="flex flex-col items-center mb-4">
          <div className="relative w-48 h-48 mb-4 group">
            {/* Progress Circle */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="50%"
                cy="50%"
                r="45%"
                fill="none"
                stroke="#f3f4f6"
                strokeWidth="4"
              />
              <circle
                cx="50%"
                cy="50%"
                r="45%"
                fill="none"
                stroke={mode === "work" ? "#111827" : mode === "longBreak" ? "#15803d" : "#c2410c"}
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={`${progress * 2.83} 283`}
                className="transition-all duration-1000 ease-in-out"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-4xl font-bold text-gray-900 mb-1 tracking-tighter font-mono">
                  {formatTime(timeLeft)}
                </p>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-widest">
                  {mode === "work" ? "Fokusas" : "Pertrauka"}
                </p>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2 w-full max-w-xs">
            {!isRunning ? (
              <button
                onClick={startTimer}
                className="flex-1 bg-gray-900 hover:bg-black text-white h-10 rounded-lg font-medium flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-95 text-sm"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                Pradėti
              </button>
            ) : (
              <button
                onClick={pauseTimer}
                className="flex-1 bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 h-10 rounded-lg font-medium flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-95 text-sm"
              >
                <Pause className="w-3.5 h-3.5 fill-current" />
                Pristabdyti
              </button>
            )}

            <button
              onClick={resetTimer}
              className="w-10 h-10 rounded-lg bg-white text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-all border border-gray-200 shadow-sm hover:shadow-md flex items-center justify-center"
              title="Perkrauti"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={skipSession}
              className="w-10 h-10 rounded-lg bg-white text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-all border border-gray-200 shadow-sm hover:shadow-md flex items-center justify-center"
              title="Praleisti"
            >
              <Square className="w-4 h-4 fill-current" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyTimer;

