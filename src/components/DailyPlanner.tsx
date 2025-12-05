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
        return "text-orange-600 bg-orange-100 border-orange-200";
      case "medium":
        return "text-blue-600 bg-blue-100 border-blue-200";
      case "low":
        return "text-gray-600 bg-gray-100 border-gray-200";
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
    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
            <Target className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900 tracking-tight">Dienos planavimas</h3>
            <p className="text-xs text-gray-500 font-medium">
              {isSelectedToday
                ? "Šiandien"
                : format(selectedDateObj, "EEEE, d MMMM", { locale: lt })}
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowAddTask(true)}
          className="w-10 h-10 rounded-lg bg-gray-900 flex items-center justify-center hover:bg-black transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-95"
        >
          <Plus className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Date Selector */}
      <div className="mb-6 flex items-center gap-2">
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-gray-300 focus:ring-2 focus:ring-gray-100 transition-all"
        />
        {!isSelectedToday && (
          <button
            onClick={() => setSelectedDate(format(new Date(), "yyyy-MM-dd"))}
            className="px-3 py-2 rounded-md bg-white border border-gray-200 hover:bg-gray-50 text-xs text-gray-700 font-medium transition-all"
          >
            Šiandien
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6 p-4 rounded-xl bg-gray-50/50 border border-gray-100">
        <div className="text-center">
          <p className="text-xl font-bold text-gray-900 tracking-tight">{completedCount}/{dayTasks.length}</p>
          <p className="text-[10px] text-gray-500 font-medium mt-0.5">Užduotys</p>
        </div>
        <div className="text-center">
          <p className="text-xl font-bold text-blue-600 tracking-tight">{Math.floor(completedTime / 60)}h {completedTime % 60}m</p>
          <p className="text-[10px] text-gray-500 font-medium mt-0.5">Užbaigta</p>
        </div>
        <div className="text-center">
          <p className="text-xl font-bold text-orange-500 tracking-tight">{Math.floor(totalTime / 60)}h {totalTime % 60}m</p>
          <p className="text-[10px] text-gray-500 font-medium mt-0.5">Liko</p>
        </div>
      </div>

      {/* Progress Bar */}
      {dayTasks.length > 0 && (
        <div className="mb-6">
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${(completedCount / dayTasks.length) * 100}%` }}
            />
          </div>
          <p className="text-[10px] text-gray-400 mt-2 text-center font-medium">
            {Math.round((completedCount / dayTasks.length) * 100)}% užbaigta
          </p>
        </div>
      )}

      {/* Tasks List */}
      <div className="space-y-2">
        {dayTasks.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <Target className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-sm text-gray-500 mb-2">Nėra suplanuotų užduočių</p>
            <button
              onClick={() => setShowAddTask(true)}
              className="text-xs text-blue-600 hover:text-blue-700 transition-colors font-medium"
            >
              Pridėti užduotį
            </button>
          </div>
        ) : (
          dayTasks.map((task) => (
            <div
              key={task.id}
              className={`p-3 sm:p-4 rounded-lg sm:rounded-xl border transition-all ${task.completed
                ? "bg-gray-50 border-gray-100 opacity-70"
                : task.priority === "high"
                  ? "bg-white border-orange-200 shadow-sm"
                  : "bg-white border-gray-200 shadow-sm"
                }`}
            >
              <div className="flex items-start gap-3">
                <button
                  onClick={() => handleToggleComplete(task.id)}
                  className="shrink-0 mt-0.5"
                >
                  {task.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  ) : (
                    <Circle className="w-5 h-5 text-gray-400 hover:text-blue-500 transition-colors" />
                  )}
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className={`text-sm font-semibold ${task.completed ? "text-gray-500 line-through" : "text-gray-900"
                      }`}>
                      {task.title}
                    </h4>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full shrink-0 border ${getPriorityColor(task.priority)}`}>
                      {getPriorityLabel(task.priority)}
                    </span>
                  </div>
                  {task.description && (
                    <p className="text-xs text-gray-500 mb-2 line-clamp-2">
                      {task.description}
                    </p>
                  )}
                  <div className="flex items-center gap-3 text-[10px] text-gray-500">
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
                  className="p-1 rounded hover:bg-gray-100 transition-colors shrink-0"
                >
                  <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" />
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
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-6 w-full max-w-md border border-gray-200 shadow-xl animate-scale-in" onClick={(e) => e.stopPropagation()}>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Pridėti užduotį</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Pavadinimas *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                placeholder="Pvz: Užbaigti matematikos užduotis"
                required
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Aprašymas</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                rows={2}
                placeholder="Papildomas aprašymas..."
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Dalykas</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
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
                <label className="text-xs text-gray-500 mb-1 block">Prioritetas</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as DailyTask["priority"])}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                >
                  <option value="high">Aukštas</option>
                  <option value="medium">Vidutinis</option>
                  <option value="low">Žemas</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Numatomas laikas (min)</label>
                <input
                  type="number"
                  value={estimatedTime}
                  onChange={(e) => setEstimatedTime(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                  min="5"
                  step="5"
                  required
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Suplanuotas laikas</label>
                <input
                  type="time"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="flex-1 px-4 py-2 rounded-lg bg-gray-900 text-white font-medium hover:bg-black transition-all shadow-sm hover:shadow-md active:scale-95"
              >
                Pridėti
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition-all"
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
