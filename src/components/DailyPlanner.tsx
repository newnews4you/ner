import { useState, useMemo } from "react";
import { Calendar, CheckCircle2, Circle, Plus, Trash2, Clock, Target, TrendingUp } from "lucide-react";
import useLocalStorage from "@/hooks/useLocalStorage";
import { format, isToday, isPast, isFuture } from "date-fns";
import { lt } from "date-fns/locale";

export interface DailyTask {
  id: string;
  title: string;
  description?: string;
  subject?: string;
  priority: "high" | "medium" | "low";
  estimatedTime: number; // minutes
  completed: boolean;
  scheduledTime?: string; // HH:mm
  date: string; // YYYY-MM-DD
}

interface DailyPlannerProps {
  subjects: Array<{ name: string }>;
  onTaskComplete?: (task: DailyTask) => void;
}

const DailyPlanner = ({ subjects, onTaskComplete }: DailyPlannerProps) => {
  const [tasks, setTasks] = useLocalStorage<DailyTask[]>("dailyTasks", []);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [showAddTask, setShowAddTask] = useState(false);

  const selectedDateObj = new Date(selectedDate);
  const isSelectedToday = isToday(selectedDateObj);

  const dayTasks = useMemo(() => {
    return tasks
      .filter(task => task.date === selectedDate)
      .sort((a, b) => {
        // Sort by priority first, then by scheduled time
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        }
        if (a.scheduledTime && b.scheduledTime) {
          return a.scheduledTime.localeCompare(b.scheduledTime);
        }
        return 0;
      });
  }, [tasks, selectedDate]);

  const completedCount = dayTasks.filter(t => t.completed).length;
  const totalTime = dayTasks.reduce((sum, t) => sum + (t.completed ? 0 : t.estimatedTime), 0);
  const completedTime = dayTasks.filter(t => t.completed).reduce((sum, t) => sum + t.estimatedTime, 0);

  const handleAddTask = (task: Omit<DailyTask, "id" | "completed">) => {
    const newTask: DailyTask = {
      ...task,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      completed: false,
    };
    setTasks([...tasks, newTask]);
    setShowAddTask(false);
  };

  const handleToggleComplete = (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const updated = { ...task, completed: !task.completed };
    setTasks(tasks.map(t => t.id === id ? updated : t));
    
    if (updated.completed && onTaskComplete) {
      onTaskComplete(updated);
    }
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const getPriorityColor = (priority: DailyTask["priority"]) => {
    switch (priority) {
      case "high":
        return "text-orange-400 bg-orange-500/20 border-orange-500/30";
      case "medium":
        return "text-cyan-400 bg-cyan-500/20 border-cyan-500/30";
      case "low":
        return "text-muted-foreground bg-secondary border-white/10";
    }
  };

  const getPriorityLabel = (priority: DailyTask["priority"]) => {
    switch (priority) {
      case "high":
        return "Aukštas";
      case "medium":
        return "Vidutinis";
      case "low":
        return "Žemas";
    }
  };

  return (
    <div className="glass rounded-xl sm:rounded-2xl p-4 sm:p-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-5">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl gradient-green-teal flex items-center justify-center shadow-lg shadow-green-500/30">
            <Target className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-semibold text-foreground">Dienos planavimas</h3>
            <p className="text-[10px] sm:text-xs text-muted-foreground">
              {isSelectedToday 
                ? "Šiandien" 
                : format(selectedDateObj, "EEEE, d MMMM", { locale: lt })}
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowAddTask(true)}
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl gradient-green-teal flex items-center justify-center hover:opacity-90 transition-all shadow-lg hover:scale-110"
        >
          <Plus className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
        </button>
      </div>

      {/* Date Selector */}
      <div className="mb-4 flex items-center gap-2">
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="px-3 py-2 bg-secondary/50 border border-white/10 rounded-lg text-sm text-foreground focus:outline-none focus:border-primary/50"
        />
        {!isSelectedToday && (
          <button
            onClick={() => setSelectedDate(format(new Date(), "yyyy-MM-dd"))}
            className="px-3 py-2 rounded-lg bg-secondary/50 hover:bg-secondary/70 text-xs text-foreground transition-colors"
          >
            Šiandien
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 mb-4 p-3 rounded-lg bg-secondary/30">
        <div className="text-center">
          <p className="text-lg font-bold text-foreground">{completedCount}/{dayTasks.length}</p>
          <p className="text-[10px] text-muted-foreground">Užduotys</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-cyan-400">{Math.floor(completedTime / 60)}h {completedTime % 60}m</p>
          <p className="text-[10px] text-muted-foreground">Užbaigta</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-orange-400">{Math.floor(totalTime / 60)}h {totalTime % 60}m</p>
          <p className="text-[10px] text-muted-foreground">Liko</p>
        </div>
      </div>

      {/* Progress Bar */}
      {dayTasks.length > 0 && (
        <div className="mb-4">
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full gradient-green-teal rounded-full transition-all duration-500"
              style={{ width: `${(completedCount / dayTasks.length) * 100}%` }}
            />
          </div>
          <p className="text-[10px] text-muted-foreground mt-1 text-center">
            {Math.round((completedCount / dayTasks.length) * 100)}% užbaigta
          </p>
        </div>
      )}

      {/* Tasks List */}
      <div className="space-y-2">
        {dayTasks.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary/50 flex items-center justify-center">
              <Target className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground mb-2">Nėra suplanuotų užduočių</p>
            <button
              onClick={() => setShowAddTask(true)}
              className="text-xs text-primary hover:text-primary/80 transition-colors"
            >
              Pridėti užduotį
            </button>
          </div>
        ) : (
          dayTasks.map((task) => (
            <div
              key={task.id}
              className={`p-3 sm:p-4 rounded-lg sm:rounded-xl border transition-all ${
                task.completed
                  ? "bg-secondary/20 border-white/5 opacity-70"
                  : task.priority === "high"
                  ? "bg-secondary/50 border-orange-500/30"
                  : "bg-secondary/30 border-white/10"
              }`}
            >
              <div className="flex items-start gap-3">
                <button
                  onClick={() => handleToggleComplete(task.id)}
                  className="shrink-0 mt-0.5"
                >
                  {task.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                  ) : (
                    <Circle className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors" />
                  )}
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className={`text-sm font-semibold ${
                      task.completed ? "text-muted-foreground line-through" : "text-foreground"
                    }`}>
                      {task.title}
                    </h4>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full shrink-0 ${getPriorityColor(task.priority)}`}>
                      {getPriorityLabel(task.priority)}
                    </span>
                  </div>
                  {task.description && (
                    <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                      {task.description}
                    </p>
                  )}
                  <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                    {task.subject && (
                      <span className="flex items-center gap-1">
                        <Target className="w-3 h-3" />
                        {task.subject}
                      </span>
                    )}
                    {task.scheduledTime && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {task.scheduledTime}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      ~{task.estimatedTime} min
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className="p-1 rounded hover:bg-secondary/50 transition-colors shrink-0"
                >
                  <Trash2 className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Task Modal */}
      {showAddTask && (
        <AddTaskModal
          subjects={subjects}
          date={selectedDate}
          onAdd={handleAddTask}
          onClose={() => setShowAddTask(false)}
        />
      )}
    </div>
  );
};

// Add Task Modal
const AddTaskModal = ({
  subjects,
  date,
  onAdd,
  onClose,
}: {
  subjects: Array<{ name: string }>;
  date: string;
  onAdd: (task: Omit<DailyTask, "id" | "completed">) => void;
  onClose: () => void;
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subject, setSubject] = useState(subjects[0]?.name || "");
  const [priority, setPriority] = useState<DailyTask["priority"]>("medium");
  const [estimatedTime, setEstimatedTime] = useState(30);
  const [scheduledTime, setScheduledTime] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAdd({
        title,
        description: description || undefined,
        subject: subject || undefined,
        priority,
        estimatedTime,
        scheduledTime: scheduledTime || undefined,
        date,
      });
      setTitle("");
      setDescription("");
      setEstimatedTime(30);
      setScheduledTime("");
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="glass rounded-2xl p-6 w-full max-w-md border-2 border-primary/30 animate-scale-in" onClick={(e) => e.stopPropagation()}>
          <h3 className="text-lg font-semibold text-foreground mb-4">Pridėti užduotį</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Pavadinimas *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 bg-secondary/50 border border-white/10 rounded-lg text-sm text-foreground focus:outline-none focus:border-primary/50"
                placeholder="Pvz: Užbaigti matematikos užduotis"
                required
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Aprašymas</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 bg-secondary/50 border border-white/10 rounded-lg text-sm text-foreground focus:outline-none focus:border-primary/50"
                rows={2}
                placeholder="Papildomas aprašymas..."
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Dalykas</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3 py-2 bg-secondary/50 border border-white/10 rounded-lg text-sm text-foreground focus:outline-none focus:border-primary/50"
                >
                  <option value="">Nėra</option>
                  {subjects.map((s) => (
                    <option key={s.name} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Prioritetas</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as DailyTask["priority"])}
                  className="w-full px-3 py-2 bg-secondary/50 border border-white/10 rounded-lg text-sm text-foreground focus:outline-none focus:border-primary/50"
                >
                  <option value="high">Aukštas</option>
                  <option value="medium">Vidutinis</option>
                  <option value="low">Žemas</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Numatomas laikas (min)</label>
                <input
                  type="number"
                  value={estimatedTime}
                  onChange={(e) => setEstimatedTime(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-secondary/50 border border-white/10 rounded-lg text-sm text-foreground focus:outline-none focus:border-primary/50"
                  min="5"
                  step="5"
                  required
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Suplanuotas laikas</label>
                <input
                  type="time"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className="w-full px-3 py-2 bg-secondary/50 border border-white/10 rounded-lg text-sm text-foreground focus:outline-none focus:border-primary/50"
                />
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="flex-1 px-4 py-2 rounded-lg gradient-green-teal text-white font-medium hover:opacity-90 transition-all"
              >
                Pridėti
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-secondary/50 text-foreground hover:bg-secondary/70 transition-colors"
              >
                Atšaukti
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default DailyPlanner;

