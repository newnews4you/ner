import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, Clock, BookOpen, Target } from "lucide-react";
import useLocalStorage from "@/hooks/useLocalStorage";

interface StudySession {
  date: string;
  minutes: number;
  subject: string;
}

interface ProgressChartsProps {
  subjects: Array<{ name: string; progress: number }>;
}

const ProgressCharts = ({ subjects }: ProgressChartsProps) => {
  const [studySessions] = useLocalStorage<StudySession[]>("studySessions", []);

  // Generate last 7 days data
  const getLast7DaysData = () => {
    const days = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      const daySessions = studySessions.filter(s => s.date === dateStr);
      const totalMinutes = daySessions.reduce((sum, s) => sum + s.minutes, 0);

      days.push({
        date: date.toLocaleDateString('lt-LT', { weekday: 'short' }),
        minutes: totalMinutes,
        sessions: daySessions.length,
      });
    }

    return days;
  };

  // Subject progress data
  const subjectProgressData = subjects.map(s => ({
    name: s.name.length > 10 ? s.name.substring(0, 10) + '...' : s.name,
    progress: s.progress,
  }));

  // Subject time distribution
  const subjectTimeData = studySessions.reduce((acc, session) => {
    const existing = acc.find(s => s.name === session.subject);
    if (existing) {
      existing.minutes += session.minutes;
    } else {
      acc.push({ name: session.subject, minutes: session.minutes });
    }
    return acc;
  }, [] as Array<{ name: string; minutes: number }>);

  const COLORS = ['#a855f7', '#ec4899', '#f97316', '#06b6d4', '#10b981', '#6366f1'];

  const weeklyData = getLast7DaysData();
  const totalWeeklyMinutes = weeklyData.reduce((sum, d) => sum + d.minutes, 0);
  const totalSessions = weeklyData.reduce((sum, d) => sum + d.sessions, 0);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Stats Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-cyan-600" />
            <span className="text-xs text-gray-500 font-medium">Laikas</span>
          </div>
          <p className="text-xl font-bold text-gray-900 tracking-tight">
            {Math.floor(totalWeeklyMinutes / 60)}h {totalWeeklyMinutes % 60}m
          </p>
          <p className="text-[10px] text-gray-400 font-medium">per savaitę</p>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className="w-4 h-4 text-purple-600" />
            <span className="text-xs text-gray-500 font-medium">Sesijos</span>
          </div>
          <p className="text-xl font-bold text-gray-900 tracking-tight">{totalSessions}</p>
          <p className="text-[10px] text-gray-400 font-medium">per savaitę</p>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-xs text-gray-500 font-medium">Vidurkis</span>
          </div>
          <p className="text-xl font-bold text-gray-900 tracking-tight">
            {totalSessions > 0 ? Math.round(totalWeeklyMinutes / totalSessions) : 0}m
          </p>
          <p className="text-[10px] text-gray-400 font-medium">per sesiją</p>
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-orange-600" />
            <span className="text-xs text-gray-500 font-medium">Progresas</span>
          </div>
          <p className="text-xl font-bold text-gray-900 tracking-tight">
            {subjects.length > 0
              ? Math.round(subjects.reduce((sum, s) => sum + s.progress, 0) / subjects.length)
              : 0}%
          </p>
          <p className="text-[10px] text-gray-400 font-medium">bendras</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Weekly Time Chart */}
        <div className="glass rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/10">
          <h3 className="text-sm font-semibold text-foreground mb-4">Savaitės mokymosi laikas</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--secondary))" opacity={0.3} />
              <XAxis
                dataKey="date"
                stroke="hsl(var(--muted-foreground))"
                style={{ fontSize: '12px' }}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                style={{ fontSize: '12px' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--secondary))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Line
                type="monotone"
                dataKey="minutes"
                stroke="hsl(262, 83%, 58%)"
                strokeWidth={2}
                dot={{ fill: 'hsl(330, 81%, 60%)', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Subject Progress Chart */}
        <div className="glass rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/10">
          <h3 className="text-sm font-semibold text-foreground mb-4">Dalykų progresas</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={subjectProgressData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--secondary))" opacity={0.3} />
              <XAxis
                dataKey="name"
                stroke="hsl(var(--muted-foreground))"
                style={{ fontSize: '11px' }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                style={{ fontSize: '12px' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--secondary))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="progress" fill="url(#progressGradient)">
                {subjectProgressData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Time Distribution Pie Chart */}
        {subjectTimeData.length > 0 && (
          <div className="glass rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/10 lg:col-span-2">
            <h3 className="text-sm font-semibold text-foreground mb-4">Laiko pasiskirstymas pagal dalykus</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={subjectTimeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="minutes"
                >
                  {subjectTimeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--secondary))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressCharts;

