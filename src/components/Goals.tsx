import { Target, Calendar, TrendingUp, CheckCircle2, Circle, Plus, Edit2, Trash2 } from "lucide-react";
import { useState } from "react";
import useLocalStorage from "@/hooks/useLocalStorage";

export interface Goal {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  unit: string;
  deadline: string;
  completed: boolean;
  category: "daily" | "weekly" | "monthly";
}

interface GoalsProps {
  onGoalComplete?: (goal: Goal) => void;
}

const Goals = ({ onGoalComplete }: GoalsProps) => {
  const [goals, setGoals] = useLocalStorage<Goal[]>("goals", []);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);

  const activeGoals = goals.filter(g => !g.completed);
  const completedGoals = goals.filter(g => g.completed);

  const handleAddGoal = (goal: Omit<Goal, "id" | "completed" | "current">) => {
    const newGoal: Goal = {
      ...goal,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      current: 0,
      completed: false,
    };
    setGoals([...goals, newGoal]);
    setShowAddGoal(false);
  };

  const handleUpdateProgress = (id: string, increment: number = 1) => {
    setGoals(goals.map(goal => {
      if (goal.id === id) {
        const newCurrent = Math.min(goal.current + increment, goal.target);
        const completed = newCurrent >= goal.target;
        
        if (completed && !goal.completed && onGoalComplete) {
          onGoalComplete({ ...goal, current: newCurrent, completed: true });
        }
        
        return { ...goal, current: newCurrent, completed };
      }
      return goal;
    }));
  };

  const handleDeleteGoal = (id: string) => {
    setGoals(goals.filter(g => g.id !== id));
  };

  const handleToggleComplete = (id: string) => {
    setGoals(goals.map(goal => 
      goal.id === id ? { ...goal, completed: !goal.completed } : goal
    ));
  };

  const getProgressPercent = (goal: Goal) => {
    return Math.min((goal.current / goal.target) * 100, 100);
  };

  const getDaysUntilDeadline = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="glass rounded-xl sm:rounded-2xl p-4 sm:p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-4 sm:mb-5">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl gradient-green-teal flex items-center justify-center shadow-lg shadow-green-500/30">
            <Target className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-semibold text-foreground">Mano tikslai</h3>
            <p className="text-[10px] sm:text-xs text-muted-foreground">
              {activeGoals.length} aktyvūs, {completedGoals.length} užbaigti
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowAddGoal(true)}
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl gradient-green-teal flex items-center justify-center hover:opacity-90 transition-all shadow-lg hover:scale-110"
        >
          <Plus className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
        </button>
      </div>

      {/* Active Goals */}
      {activeGoals.length > 0 ? (
        <div className="space-y-3 mb-4">
          {activeGoals.map((goal) => {
            const progress = getProgressPercent(goal);
            const daysLeft = getDaysUntilDeadline(goal.deadline);
            const isUrgent = daysLeft <= 3 && daysLeft >= 0;

            return (
              <div
                key={goal.id}
                className={`p-3 sm:p-4 rounded-lg sm:rounded-xl border transition-all ${
                  isUrgent
                    ? "bg-secondary/50 border-orange-500/30"
                    : "bg-secondary/30 border-white/10"
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-semibold text-foreground line-clamp-1">
                        {goal.title}
                      </h4>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                        goal.category === "daily" ? "bg-cyan-500/20 text-cyan-400" :
                        goal.category === "weekly" ? "bg-purple-500/20 text-purple-400" :
                        "bg-orange-500/20 text-orange-400"
                      }`}>
                        {goal.category === "daily" ? "Dieninis" :
                         goal.category === "weekly" ? "Savaitinis" : "Mėnesinis"}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2 line-clamp-1">
                      {goal.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                      <span>
                        {goal.current} / {goal.target} {goal.unit}
                      </span>
                      <span className={`flex items-center gap-1 ${
                        isUrgent ? "text-orange-400" : ""
                      }`}>
                        <Calendar className="w-3 h-3" />
                        {daysLeft < 0 ? "Praėjo" : daysLeft === 0 ? "Šiandien" : `Liko ${daysLeft} d.`}
                      </span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden mb-2">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          progress >= 100 ? "gradient-green-teal" :
                          progress >= 75 ? "gradient-cyan-blue" :
                          progress >= 50 ? "gradient-purple-pink" :
                          "gradient-orange-red"
                        }`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleUpdateProgress(goal.id, 1)}
                        className="px-2 py-1 rounded-lg bg-secondary/50 hover:bg-secondary/70 text-xs text-foreground transition-colors flex items-center gap-1"
                      >
                        <TrendingUp className="w-3 h-3" />
                        +1
                      </button>
                      <button
                        onClick={() => handleToggleComplete(goal.id)}
                        className="px-2 py-1 rounded-lg bg-secondary/50 hover:bg-secondary/70 text-xs text-foreground transition-colors flex items-center gap-1"
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        Užbaigti
                      </button>
                      <button
                        onClick={() => handleDeleteGoal(goal.id)}
                        className="px-2 py-1 rounded-lg bg-secondary/50 hover:bg-red-500/20 text-xs text-red-400 transition-colors flex items-center gap-1 ml-auto"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8 mb-4">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary/50 flex items-center justify-center">
            <Target className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground mb-2">Nėra aktyvių tikslų</p>
          <button
            onClick={() => setShowAddGoal(true)}
            className="text-xs text-primary hover:text-primary/80 transition-colors"
          >
            Pridėti tikslą
          </button>
        </div>
      )}

      {/* Completed Goals */}
      {completedGoals.length > 0 && (
        <div className="pt-4 border-t border-white/10">
          <h4 className="text-xs font-medium text-muted-foreground mb-3">Užbaigti tikslai</h4>
          <div className="space-y-2">
            {completedGoals.slice(0, 3).map((goal) => (
              <div
                key={goal.id}
                className="p-2 rounded-lg bg-secondary/20 border border-green-500/20 flex items-center justify-between"
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                  <span className="text-xs text-foreground line-clamp-1">{goal.title}</span>
                </div>
                <button
                  onClick={() => handleDeleteGoal(goal.id)}
                  className="p-1 rounded hover:bg-secondary/50 transition-colors"
                >
                  <Trash2 className="w-3 h-3 text-muted-foreground" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Goal Modal */}
      {showAddGoal && (
        <AddGoalModal
          onAdd={handleAddGoal}
          onClose={() => setShowAddGoal(false)}
        />
      )}
    </div>
  );
};

// Simple Add Goal Modal
const AddGoalModal = ({ onAdd, onClose }: { onAdd: (goal: Omit<Goal, "id" | "completed" | "current">) => void; onClose: () => void }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [target, setTarget] = useState(10);
  const [unit, setUnit] = useState("užduotys");
  const [category, setCategory] = useState<Goal["category"]>("daily");
  const [deadline, setDeadline] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    return date.toISOString().split('T')[0];
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAdd({ title, description, target, unit, deadline, category });
      setTitle("");
      setDescription("");
      setTarget(10);
      setUnit("užduotys");
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="glass rounded-2xl p-6 w-full max-w-md border-2 border-primary/30 animate-scale-in" onClick={(e) => e.stopPropagation()}>
          <h3 className="text-lg font-semibold text-foreground mb-4">Pridėti tikslą</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Pavadinimas</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 bg-secondary/50 border border-white/10 rounded-lg text-sm text-foreground focus:outline-none focus:border-primary/50"
                placeholder="Pvz: Užbaigti 10 matematikos užduočių"
                required
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Aprašymas</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 bg-secondary/50 border border-white/10 rounded-lg text-sm text-foreground focus:outline-none focus:border-primary/50"
                placeholder="Papildomas aprašymas (neprivaloma)"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Tikslas</label>
                <input
                  type="number"
                  value={target}
                  onChange={(e) => setTarget(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-secondary/50 border border-white/10 rounded-lg text-sm text-foreground focus:outline-none focus:border-primary/50"
                  min="1"
                  required
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Vienetas</label>
                <input
                  type="text"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full px-3 py-2 bg-secondary/50 border border-white/10 rounded-lg text-sm text-foreground focus:outline-none focus:border-primary/50"
                  placeholder="užduotys"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Kategorija</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Goal["category"])}
                  className="w-full px-3 py-2 bg-secondary/50 border border-white/10 rounded-lg text-sm text-foreground focus:outline-none focus:border-primary/50"
                >
                  <option value="daily">Dieninis</option>
                  <option value="weekly">Savaitinis</option>
                  <option value="monthly">Mėnesinis</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Terminas</label>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full px-3 py-2 bg-secondary/50 border border-white/10 rounded-lg text-sm text-foreground focus:outline-none focus:border-primary/50"
                  required
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

export default Goals;

