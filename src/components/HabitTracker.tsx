import { useState, useMemo } from "react";
import { Calendar, Flame, CheckCircle2, Circle, Plus, Edit2, Trash2, Target } from "lucide-react";
import useLocalStorage from "@/hooks/useLocalStorage";
import { format, startOfWeek, addDays, isSameDay, eachDayOfInterval, subDays } from "date-fns";
import { lt } from "date-fns/locale";

export interface Habit {
  id: string;
  name: string;
  description?: string;
  color: string;
  streak: number;
  longestStreak: number;
  completedDates: string[]; // YYYY-MM-DD format
  targetDays: number; // per week
}

interface HabitTrackerProps {
  onHabitComplete?: (habit: Habit) => void;
}

const HabitTracker = ({ onHabitComplete }: HabitTrackerProps) => {
  const [habits, setHabits] = useLocalStorage<Habit[]>("habits", []);
  const [showAddHabit, setShowAddHabit] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState(new Date());

  const weekStart = startOfWeek(selectedWeek, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const last30Days = eachDayOfInterval({
    start: subDays(new Date(), 29),
    end: new Date(),
  });

  const COLORS = [
    "bg-purple-500",
    "bg-blue-500",
    "bg-orange-500",
    "bg-green-500",
    "bg-indigo-500",
  ];

  const handleAddHabit = (habit: Omit<Habit, "id" | "streak" | "longestStreak" | "completedDates">) => {
    const newHabit: Habit = {
      ...habit,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      streak: 0,
      longestStreak: 0,
      completedDates: [],
    };
    setHabits([...habits, newHabit]);
    setShowAddHabit(false);
  };

  const handleToggleHabit = (habitId: string, date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;

    const isCompleted = habit.completedDates.includes(dateStr);
    let newCompletedDates: string[];
    let newStreak = habit.streak;
    let newLongestStreak = habit.longestStreak;

    if (isCompleted) {
      // Uncomplete
      newCompletedDates = habit.completedDates.filter(d => d !== dateStr);
      // Recalculate streak
      newStreak = calculateStreak(newCompletedDates);
    } else {
      // Complete
      newCompletedDates = [...habit.completedDates, dateStr];
      newStreak = calculateStreak(newCompletedDates);
      newLongestStreak = Math.max(newStreak, habit.longestStreak);
    }

    const updated = {
      ...habit,
      completedDates: newCompletedDates,
      streak: newStreak,
      longestStreak: newLongestStreak,
    };

    setHabits(habits.map(h => h.id === habitId ? updated : h));

    if (!isCompleted && onHabitComplete) {
      onHabitComplete(updated);
    }
  };

  const calculateStreak = (completedDates: string[]): number => {
    if (completedDates.length === 0) return 0;

    const sorted = [...completedDates].sort().reverse();
    let streak = 0;
    let currentDate = new Date();

    for (const dateStr of sorted) {
      const date = new Date(dateStr);
      const expectedDate = format(currentDate, "yyyy-MM-dd");

      if (dateStr === expectedDate) {
        streak++;
        currentDate = subDays(currentDate, 1);
      } else {
        break;
      }
    }

    return streak;
  };

  const handleDeleteHabit = (id: string) => {
    setHabits(habits.filter(h => h.id !== id));
  };

  const isHabitCompleted = (habit: Habit, date: Date) => {
    return habit.completedDates.includes(format(date, "yyyy-MM-dd"));
  };

  const getWeekCompletion = (habit: Habit) => {
    const weekDates = weekDays.map(d => format(d, "yyyy-MM-dd"));
    const completed = weekDates.filter(d => habit.completedDates.includes(d)).length;
    return { completed, total: weekDates.length, percent: (completed / weekDates.length) * 100 };
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
            <Flame className="w-5 h-5 text-orange-600" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900 tracking-tight">Įpročių sekimas</h3>
            <p className="text-xs text-gray-500 font-medium">
              {habits.length} {habits.length === 1 ? "įprotis" : "įpročiai"}
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowAddHabit(true)}
          className="w-10 h-10 rounded-lg bg-gray-900 flex items-center justify-center hover:bg-black transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-95"
        >
          <Plus className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Week Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setSelectedWeek(addDays(weekStart, -7))}
          className="px-3 py-1.5 rounded-md bg-white border border-gray-200 hover:bg-gray-50 text-xs text-gray-700 font-medium transition-all"
        >
          ← Ankstesnė
        </button>
        <span className="text-xs font-semibold text-gray-900">
          {format(weekStart, "d MMM", { locale: lt })} - {format(addDays(weekStart, 6), "d MMM", { locale: lt })}
        </span>
        <button
          onClick={() => setSelectedWeek(addDays(weekStart, 7))}
          className="px-3 py-1.5 rounded-md bg-white border border-gray-200 hover:bg-gray-50 text-xs text-gray-700 font-medium transition-all"
        >
          Sekanti →
        </button>
      </div>

      {/* Habits List */}
      <div className="space-y-4">
        {habits.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <Flame className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-sm text-gray-500 mb-2">Nėra įpročių</p>
            <button
              onClick={() => setShowAddHabit(true)}
              className="text-xs text-orange-600 hover:text-orange-700 transition-colors font-medium"
            >
              Pridėti įprotį
            </button>
          </div>
        ) : (
          habits.map((habit) => {
            const weekStats = getWeekCompletion(habit);
            const isTodayCompleted = isHabitCompleted(habit, new Date());

            return (
              <div
                key={habit.id}
                className="p-3 sm:p-4 rounded-lg sm:rounded-xl border border-gray-200 bg-white shadow-sm"
              >
                {/* Habit Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <div className={`w-8 h-8 rounded-lg ${habit.color} flex items-center justify-center shrink-0`}>
                      <Target className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-gray-900 line-clamp-1">
                        {habit.name}
                      </h4>
                      {habit.description && (
                        <p className="text-xs text-gray-500 line-clamp-1">
                          {habit.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteHabit(habit.id)}
                    className="p-1 rounded hover:bg-gray-100 transition-colors shrink-0"
                  >
                    <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" />
                  </button>
                </div>

                {/* Streak Info */}
                <div className="flex items-center gap-4 mb-3 text-xs">
                  <div className="flex items-center gap-1">
                    <Flame className="w-3 h-3 text-orange-500" />
                    <span className="text-gray-900 font-semibold">{habit.streak}</span>
                    <span className="text-gray-500">dienos serija</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Target className="w-3 h-3 text-yellow-500" />
                    <span className="text-gray-500">Geriausia: {habit.longestStreak}</span>
                  </div>
                </div>

                {/* Week Calendar */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {weekDays.map((day) => {
                    const isCompleted = isHabitCompleted(habit, day);
                    const isToday = isSameDay(day, new Date());
                    const isPast = day < new Date() && !isSameDay(day, new Date());

                    return (
                      <button
                        key={day.toISOString()}
                        onClick={() => handleToggleHabit(habit.id, day)}
                        disabled={!isPast && !isToday}
                        className={`aspect-square rounded-lg text-[10px] transition-all ${isCompleted
                          ? `${habit.color} text-white shadow-sm`
                          : isToday
                            ? "bg-blue-50 border-2 border-blue-200 text-gray-900"
                            : isPast
                              ? "bg-gray-100 border border-gray-200 text-gray-500 hover:bg-gray-200"
                              : "bg-gray-50 border border-gray-100 text-gray-300 cursor-not-allowed"
                          }`}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="w-3 h-3 mx-auto" />
                        ) : (
                          <Circle className="w-3 h-3 mx-auto opacity-50" />
                        )}
                        <div className="mt-0.5">{format(day, "d")}</div>
                      </button>
                    );
                  })}
                </div>

                {/* Week Progress */}
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">
                    Savaitė: {weekStats.completed} / {weekStats.total}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${habit.color} rounded-full transition-all`}
                        style={{ width: `${weekStats.percent}%` }}
                      />
                    </div>
                    <span className="text-gray-900 font-medium">
                      {Math.round(weekStats.percent)}%
                    </span>
                  </div>
                </div>

                {/* Quick Complete Today */}
                {!isTodayCompleted && (
                  <button
                    onClick={() => handleToggleHabit(habit.id, new Date())}
                    className="w-full mt-3 px-3 py-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 text-xs text-gray-700 font-medium transition-all flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    Pažymėti šiandien
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Add Habit Modal */}
      {showAddHabit && (
        <AddHabitModal
          colors={COLORS}
          onAdd={handleAddHabit}
          onClose={() => setShowAddHabit(false)}
        />
      )}
    </div>
  );
};

// Add Habit Modal
const AddHabitModal = ({
  colors,
  onAdd,
  onClose,
}: {
  colors: string[];
  onAdd: (habit: Omit<Habit, "id" | "streak" | "longestStreak" | "completedDates">) => void;
  onClose: () => void;
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState(colors[0]);
  const [targetDays, setTargetDays] = useState(5);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onAdd({
        name,
        description: description || undefined,
        color,
        targetDays,
      });
      setName("");
      setDescription("");
      setTargetDays(5);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-6 w-full max-w-md border border-gray-200 shadow-xl animate-scale-in" onClick={(e) => e.stopPropagation()}>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Pridėti įprotį</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Pavadinimas *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                placeholder="Pvz: Mokytis 30 min kasdien"
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
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Spalva</label>
              <div className="flex gap-2">
                {colors.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={`w-10 h-10 rounded-lg ${c} border-2 transition-all ${color === c ? "border-white scale-110 shadow-md" : "border-transparent"
                      }`}
                  />
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">
                Tikslas: {targetDays} dienos per savaitę
              </label>
              <input
                type="range"
                min="1"
                max="7"
                value={targetDays}
                onChange={(e) => setTargetDays(Number(e.target.value))}
                className="w-full accent-orange-500"
              />
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

export default HabitTracker;
