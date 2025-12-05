import { useState } from "react";
import { Calendar, Clock, Plus, Edit2, Trash2, CheckCircle2, Circle, Sparkles } from "lucide-react";
import useLocalStorage from "@/hooks/useLocalStorage";
import { format, addDays, startOfWeek, isSameDay } from "date-fns";
import { lt } from "date-fns/locale";

export interface TimeBlock {
  id: string;
  subject: string;
  topic: string;
  startTime: string; // HH:mm format
  endTime: string;
  date: string; // YYYY-MM-DD format
  completed: boolean;
  color: string;
  notes?: string;
}

interface StudyScheduleProps {
  subjects: Array<{ name: string; icon: any; gradient: string }>;
  onBlockComplete?: (block: TimeBlock) => void;
}

const StudySchedule = ({ subjects, onBlockComplete }: StudyScheduleProps) => {
  const [timeBlocks, setTimeBlocks] = useLocalStorage<TimeBlock[]>("studySchedule", []);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAddBlock, setShowAddBlock] = useState(false);
  const [editingBlock, setEditingBlock] = useState<TimeBlock | null>(null);

  // Get week days
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 }); // Monday
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  // Get time blocks for selected date
  const getBlocksForDate = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    return timeBlocks
      .filter(block => block.date === dateStr)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  };

  // Time slots (7:00 - 23:00)
  const timeSlots = Array.from({ length: 17 }, (_, i) => {
    const hour = 7 + i;
    return `${hour.toString().padStart(2, "0")}:00`;
  });

  const handleAddBlock = (block: Omit<TimeBlock, "id" | "completed">) => {
    const newBlock: TimeBlock = {
      ...block,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      completed: false,
    };
    setTimeBlocks([...timeBlocks, newBlock]);
    setShowAddBlock(false);
  };

  const handleUpdateBlock = (id: string, updates: Partial<TimeBlock>) => {
    setTimeBlocks(timeBlocks.map(block =>
      block.id === id ? { ...block, ...updates } : block
    ));
  };

  const handleDeleteBlock = (id: string) => {
    setTimeBlocks(timeBlocks.filter(block => block.id !== id));
  };

  const handleToggleComplete = (block: TimeBlock) => {
    const updated = { ...block, completed: !block.completed };
    handleUpdateBlock(block.id, { completed: updated.completed });
    if (updated.completed && onBlockComplete) {
      onBlockComplete(updated);
    }
  };

  const getBlockPosition = (startTime: string, endTime: string) => {
    const [startHour, startMin] = startTime.split(":").map(Number);
    const [endHour, endMin] = endTime.split(":").map(Number);
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    const duration = endMinutes - startMinutes;

    const top = ((startMinutes - 420) / 60) * 100; // 420 = 7:00 in minutes
    const height = (duration / 60) * 100;

    return { top: `${top}%`, height: `${height}%` };
  };

  const getSubjectColor = (subjectName: string) => {
    // Return solid colors instead of gradients for Notion style
    const subject = subjects.find(s => s.name === subjectName);
    // Map existing gradients to solid colors if needed, or just use a default
    // For now, we'll use a simple mapping or default to blue
    return "bg-blue-500";
  };

  // Helper for subject specific colors
  const getSubjectColorClass = (subjectName: string) => {
    const colors: Record<string, string> = {
      'Matematika': 'bg-blue-500',
      'IT Technologijos': 'bg-purple-500',
      'Fizika': 'bg-indigo-500',
      'Lietuvių kalba': 'bg-yellow-500',
      'Dailė': 'bg-pink-500',
      'Istorija': 'bg-red-500'
    };
    return colors[subjectName] || 'bg-gray-500';
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
            <Calendar className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2 tracking-tight">
              Mokymosi tvarkaraštis
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 font-medium border border-blue-100">
                Planavimas
              </span>
            </h3>
            <p className="text-xs text-gray-500 font-medium">
              {format(weekStart, "d MMMM", { locale: lt })} - {format(addDays(weekStart, 6), "d MMMM", { locale: lt })}
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowAddBlock(true)}
          className="w-10 h-10 rounded-lg bg-gray-900 flex items-center justify-center hover:bg-black transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-95"
        >
          <Plus className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Week Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setSelectedDate(addDays(weekStart, -7))}
          className="px-3 py-1.5 rounded-md bg-white border border-gray-200 hover:bg-gray-50 text-xs text-gray-700 font-medium transition-all hover:shadow-sm"
        >
          ← Ankstesnė
        </button>
        <button
          onClick={() => setSelectedDate(new Date())}
          className="px-3 py-1.5 rounded-md bg-gray-900 hover:bg-black text-xs text-white font-medium transition-all shadow-sm hover:shadow-md"
        >
          Šiandien
        </button>
        <button
          onClick={() => setSelectedDate(addDays(weekStart, 7))}
          className="px-3 py-1.5 rounded-md bg-white border border-gray-200 hover:bg-gray-50 text-xs text-gray-700 font-medium transition-all hover:shadow-sm"
        >
          Sekanti →
        </button>
      </div>

      {/* Week View */}
      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Days Header */}
          <div className="grid grid-cols-8 gap-2 mb-2">
            <div className="text-xs text-gray-500 font-medium">Laikas</div>
            {weekDays.map((day) => {
              const isToday = isSameDay(day, new Date());
              const blocksCount = getBlocksForDate(day).length;
              return (
                <div
                  key={day.toISOString()}
                  className={`text-center p-2 rounded-lg ${isToday
                    ? "bg-blue-50 border-2 border-blue-200"
                    : "bg-gray-50"
                    }`}
                >
                  <div className="text-xs font-semibold text-gray-900">
                    {format(day, "EEE", { locale: lt })}
                  </div>
                  <div className="text-[10px] text-gray-500">
                    {format(day, "d MMM", { locale: lt })}
                  </div>
                  {blocksCount > 0 && (
                    <div className="text-[10px] text-blue-600 mt-1">
                      {blocksCount} {blocksCount === 1 ? "blokas" : "blokai"}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Time Grid */}
          <div className="relative border border-gray-200 rounded-lg overflow-hidden bg-white">
            {/* Time Slots */}
            {timeSlots.map((time, index) => (
              <div
                key={time}
                className="grid grid-cols-8 gap-2 border-b border-gray-100 last:border-b-0"
                style={{ minHeight: "60px" }}
              >
                <div className="text-xs text-gray-400 p-2 flex items-center">
                  {time}
                </div>
                {weekDays.map((day) => (
                  <div
                    key={`${day.toISOString()}-${time}`}
                    className="border-r border-gray-100 last:border-r-0 relative"
                  />
                ))}
              </div>
            ))}

            {/* Time Blocks */}
            {weekDays.map((day) => {
              const dayBlocks = getBlocksForDate(day);
              const dayIndex = weekDays.indexOf(day) + 1;

              return dayBlocks.map((block) => {
                const position = getBlockPosition(block.startTime, block.endTime);
                const subjectColor = getSubjectColorClass(block.subject);

                return (
                  <div
                    key={block.id}
                    className={`absolute ${subjectColor} rounded-lg p-2 text-white text-xs cursor-pointer hover:opacity-90 transition-all border-2 ${block.completed ? "border-green-400 opacity-70" : "border-white/20"
                      } shadow-sm`}
                    style={{
                      left: `${(dayIndex / 8) * 100}%`,
                      width: `${(1 / 8) * 100 - 0.5}%`,
                      top: position.top,
                      height: position.height,
                      zIndex: 10,
                    }}
                    onClick={() => handleToggleComplete(block)}
                  >
                    <div className="flex items-start justify-between h-full">
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold line-clamp-1">{block.subject}</div>
                        <div className="text-[10px] opacity-90 line-clamp-1">{block.topic}</div>
                        <div className="text-[10px] opacity-75 mt-1">
                          {block.startTime} - {block.endTime}
                        </div>
                      </div>
                      {block.completed ? (
                        <CheckCircle2 className="w-3 h-3 shrink-0" />
                      ) : (
                        <Circle className="w-3 h-3 shrink-0 opacity-50" />
                      )}
                    </div>
                  </div>
                );
              });
            })}
          </div>
        </div>
      </div>

      {/* Today's Summary */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <span className="text-xs font-medium text-gray-900">Šiandienos planas</span>
        </div>
        <div className="space-y-2">
          {getBlocksForDate(new Date()).length === 0 ? (
            <p className="text-xs text-gray-500">Nėra suplanuotų užsiėmimų šiandien</p>
          ) : (
            getBlocksForDate(new Date()).map((block) => {
              return (
                <div key={block.id} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    {block.completed ? (
                      <CheckCircle2 className="w-3 h-3 text-green-500" />
                    ) : (
                      <Circle className="w-3 h-3 text-gray-400" />
                    )}
                    <span className={block.completed ? "text-gray-400 line-through" : "text-gray-900"}>
                      {block.startTime} - {block.subject}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
        {getBlocksForDate(new Date()).length > 0 && (
          <div className="mt-2 text-xs text-gray-500">
            Užbaigta: {getBlocksForDate(new Date()).filter(b => b.completed).length} / {getBlocksForDate(new Date()).length}
          </div>
        )}
      </div>

      {/* Add/Edit Block Modal */}
      {(showAddBlock || editingBlock) && (
        <AddTimeBlockModal
          subjects={subjects}
          date={editingBlock ? new Date(editingBlock.date) : selectedDate}
          block={editingBlock}
          onAdd={handleAddBlock}
          onUpdate={(updates) => editingBlock && handleUpdateBlock(editingBlock.id, updates)}
          onClose={() => {
            setShowAddBlock(false);
            setEditingBlock(null);
          }}
        />
      )}
    </div>
  );
};

// Add/Edit Time Block Modal
const AddTimeBlockModal = ({
  subjects,
  date,
  block,
  onAdd,
  onUpdate,
  onClose,
}: {
  subjects: Array<{ name: string; icon: any; gradient: string }>;
  date: Date;
  block?: TimeBlock | null;
  onAdd: (block: Omit<TimeBlock, "id" | "completed">) => void;
  onUpdate?: (updates: Partial<TimeBlock>) => void;
  onClose: () => void;
}) => {
  const [subject, setSubject] = useState(block?.subject || subjects[0]?.name || "");
  const [topic, setTopic] = useState(block?.topic || "");
  const [startTime, setStartTime] = useState(block?.startTime || "09:00");
  const [endTime, setEndTime] = useState(block?.endTime || "10:00");
  const [selectedDate, setSelectedDate] = useState(format(block ? new Date(block.date) : date, "yyyy-MM-dd"));
  const [notes, setNotes] = useState(block?.notes || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const timeBlock: Omit<TimeBlock, "id" | "completed"> = {
      subject,
      topic,
      startTime,
      endTime,
      date: selectedDate,
      color: "bg-blue-500", // Default color
      notes: notes || undefined,
    };

    if (block && onUpdate) {
      onUpdate(timeBlock);
    } else {
      onAdd(timeBlock);
    }
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-6 w-full max-w-md border border-gray-200 shadow-xl animate-scale-in" onClick={(e) => e.stopPropagation()}>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {block ? "Redaguoti laiko bloką" : "Pridėti laiko bloką"}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Dalykas</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                required
              >
                {subjects.map((s) => (
                  <option key={s.name} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Tema</label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                placeholder="Pvz: Diferencialinės lygtys"
                required
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Data</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                  required
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Pradžia</label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                  required
                />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Pabaiga</label>
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                  required
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Pastabos (neprivaloma)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                rows={2}
                placeholder="Papildomos pastabos..."
              />
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="flex-1 px-4 py-2 rounded-lg bg-gray-900 text-white font-medium hover:bg-black transition-all shadow-sm hover:shadow-md active:scale-95"
              >
                {block ? "Atnaujinti" : "Pridėti"}
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

export default StudySchedule;
