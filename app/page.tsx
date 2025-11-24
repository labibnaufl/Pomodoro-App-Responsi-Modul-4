'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Clock, Play, Pause, RotateCcw, CheckCircle2, ListTodo, BarChart3, User, Plus, Trash2 } from 'lucide-react';

type TimerMode = 'work' | 'shortBreak' | 'longBreak';
type Page = 'timer' | 'tasks' | 'stats' | 'profile';

interface Task {
  id: number;
  text: string;
  completed: boolean;
}

interface Stats {
  totalPomodoros: number;
  totalMinutes: number;
  completedTasks: number;
  streak: number;
}

interface TimerPageProps {
  mode: TimerMode;
  timeLeft: number;
  isRunning: boolean;
  sessions: number;
  onModeChange: (mode: TimerMode) => void;
  onToggleTimer: () => void;
  onResetTimer: () => void;
  formatTime: (seconds: number) => string;
}

interface TasksPageProps {
  tasks: Task[];
  newTask: string;
  onNewTaskChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAddTask: () => void;
  onToggleTask: (id: number) => void;
  onDeleteTask: (id: number) => void;
}

interface StatsPageProps {
  stats: Stats;
}

const DURATIONS = {
  work: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60
};

const WEEK_DATA = [
  { day: 'Mon', width: 75, count: 6 },
  { day: 'Tue', width: 60, count: 5 },
  { day: 'Wed', width: 85, count: 7 },
  { day: 'Thu', width: 50, count: 4 },
  { day: 'Fri', width: 90, count: 8 },
  { day: 'Sat', width: 40, count: 3 },
  { day: 'Sun', width: 65, count: 5 },
];

function TimerPage({ mode, timeLeft, isRunning, sessions, onModeChange, onToggleTimer, onResetTimer, formatTime }: TimerPageProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] p-6">
      <div className="w-full max-w-md">
        <div className="flex gap-2 mb-8 justify-center">
          <button onClick={() => onModeChange('work')} className={`px-6 py-2 rounded-lg font-medium transition-all ${mode === 'work' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
            Pomodoro
          </button>
          <button onClick={() => onModeChange('shortBreak')} className={`px-6 py-2 rounded-lg font-medium transition-all ${mode === 'shortBreak' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
            Short Break
          </button>
          <button onClick={() => onModeChange('longBreak')} className={`px-6 py-2 rounded-lg font-medium transition-all ${mode === 'longBreak' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
            Long Break
          </button>
        </div>
        <div className={`rounded-3xl p-12 mb-8 ${mode === 'work' ? 'bg-blue-500' : mode === 'shortBreak' ? 'bg-green-500' : 'bg-blue-500'}`}>
          <div className="text-8xl font-bold text-white text-center mb-8">{formatTime(timeLeft)}</div>
          <div className="flex gap-4 justify-center">
            <button onClick={onToggleTimer} className="bg-white text-gray-800 px-8 py-4 rounded-xl font-bold text-lg hover:scale-105 transition-transform flex items-center gap-2">
              {isRunning ? <Pause size={24} /> : <Play size={24} />}
              {isRunning ? 'Pause' : 'Start'}
            </button>
            <button onClick={onResetTimer} className="bg-white/20 text-white px-6 py-4 rounded-xl hover:bg-white/30 transition-all">
              <RotateCcw size={24} />
            </button>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 text-center shadow-md border border-gray-200">
          <div className="text-gray-600 text-sm mb-1">Sessions Completed</div>
          <div className="text-4xl font-bold text-gray-900">{sessions}</div>
        </div>
      </div>
    </div>
  );
}

function TasksPage({ tasks, newTask, onNewTaskChange, onAddTask, onToggleTask, onDeleteTask }: TasksPageProps) {
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">My Tasks</h1>
      <div className="bg-white rounded-2xl p-4 mb-4 shadow-md border border-gray-200">
        <div className="flex gap-2">
          <input type="text" value={newTask} onChange={onNewTaskChange} onKeyPress={(e) => e.key === 'Enter' && onAddTask()} placeholder="Add a new task..." className="flex-1 bg-gray-100 text-gray-900 px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 border border-gray-300" />
          <button onClick={onAddTask} className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors">
            <Plus size={20} />
          </button>
        </div>
      </div>
      <div className="space-y-2">
        {tasks.map((task: Task) => (
          <div key={task.id} className="bg-white rounded-xl p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors shadow-sm border border-gray-200">
            <button onClick={() => onToggleTask(task.id)} className={`shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${task.completed ? 'bg-green-500 border-green-500' : 'border-gray-400 hover:border-green-500'}`}>
              {task.completed && <CheckCircle2 size={16} className="text-white" />}
            </button>
            <span className={`flex-1 text-gray-900 ${task.completed ? 'line-through text-gray-400' : ''}`}>{task.text}</span>
            <button onClick={() => onDeleteTask(task.id)} className="text-gray-400 hover:text-blue-500 transition-colors">
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>
      {tasks.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <ListTodo size={48} className="mx-auto mb-4 opacity-50" />
          <p>No tasks yet. Add your first task above!</p>
        </div>
      )}
    </div>
  );
}

function StatsPage({ stats }: StatsPageProps) {
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Statistics</h1>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl p-6 shadow-lg">
          <div className="text-blue-100 text-sm mb-2">Total Pomodoros</div>
          <div className="text-4xl font-bold text-white">{stats.totalPomodoros}</div>
        </div>
        <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-2xl p-6 shadow-lg">
          <div className="text-blue-100 text-sm mb-2">Total Minutes</div>
          <div className="text-4xl font-bold text-white">{stats.totalMinutes}</div>
        </div>
        <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-2xl p-6 shadow-lg">
          <div className="text-green-100 text-sm mb-2">Tasks Completed</div>
          <div className="text-4xl font-bold text-white">{stats.completedTasks}</div>
        </div>
        <div className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl p-6 shadow-lg">
          <div className="text-purple-100 text-sm mb-2">Day Streak</div>
          <div className="text-4xl font-bold text-white">{stats.streak} 🔥</div>
        </div>
      </div>
      <div className="bg-white rounded-2xl p-6 shadow-md border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Weekly Progress</h2>
        <div className="space-y-3">
          {WEEK_DATA.map(({ day, width, count }) => (
            <div key={day} className="flex items-center gap-3">
              <div className="w-12 text-gray-600 text-sm">{day}</div>
              <div className="flex-1 bg-gray-200 rounded-full h-8 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-300 to-blue-400 h-full rounded-full flex items-center justify-end px-3" style={{ width: `${width}%` }}>
                  <span className="text-white text-sm font-medium">{count}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProfilePage() {
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="bg-gradient-to-br from-blue-300 to-blue-400 rounded-3xl p-8 mb-6 text-center shadow-lg">
        <div className="w-24 h-24 bg-white rounded-full mx-auto mb-4 flex items-center justify-center">
          <User size={48} className="text-blue-500" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Naufal Labib Nugroho</h1>
        <p className="text-blue-100">Teknik Komputer - Praktikum Pemrograman Perangkat Bergerak</p>
      </div>
      <div className="bg-white rounded-2xl p-6 space-y-4 shadow-md border border-gray-200">
        <div className="flex justify-between items-center py-3 border-b border-gray-200">
          <span className="text-gray-600">NIM</span>
          <span className="text-gray-900 font-medium">21120123130109</span>
        </div>
        <div className="flex justify-between items-center py-3 border-b border-gray-200">
          <span className="text-gray-600">Kelompok</span>
          <span className="text-gray-900 font-medium">Kelompok 26</span>
        </div>
        <div className="flex justify-between items-center py-3 border-b border-gray-200">
          <span className="text-gray-600">Shift</span>
          <span className="text-gray-900 font-medium">Shift 4</span>
        </div>
        <div className="flex justify-between items-center py-3">
          <span className="text-gray-600">Email</span>
          <span className="text-gray-900 font-medium">mahasiswa@email.com</span>
        </div>
      </div>
      <div className="bg-white rounded-2xl p-6 mt-6 shadow-md border border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Tentang Aplikasi</h2>
        <p className="text-gray-700 mb-4">Pomodoro Timer & Productivity Tracker adalah aplikasi manajemen waktu yang menggunakan teknik Pomodoro untuk meningkatkan produktivitas.</p>
        <div className="flex flex-wrap gap-2">
          <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm">React</span>
          <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm">PWA</span>
          <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm">Tailwind CSS</span>
          <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm">Vercel</span>
        </div>
      </div>
    </div>
  );
}

export default function PomodoroApp() {
  const [page, setPage] = useState<Page>('timer');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<TimerMode>('work');
  const [sessions, setSessions] = useState(0);
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, text: 'Complete project documentation', completed: false },
    { id: 2, text: 'Review code changes', completed: false },
    { id: 3, text: 'Update design mockups', completed: true }
  ]);
  const [newTask, setNewTask] = useState('');
  const [stats, setStats] = useState<Stats>({
    totalPomodoros: 12,
    totalMinutes: 300,
    completedTasks: 8,
    streak: 3
  });
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const playSound = useCallback(() => {
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZURE');
    audio.play().catch(() => {});
  }, []);

  const handleTimerComplete = useCallback(() => {
    setIsRunning(false);
    playSound();
    
    if (mode === 'work') {
      setSessions(prev => {
        const newSessions = prev + 1;
        setStats(s => ({
          ...s,
          totalPomodoros: s.totalPomodoros + 1,
          totalMinutes: s.totalMinutes + 25
        }));
        
        if (newSessions % 4 === 0) {
          setMode('longBreak');
          setTimeLeft(DURATIONS.longBreak);
        } else {
          setMode('shortBreak');
          setTimeLeft(DURATIONS.shortBreak);
        }
        return newSessions;
      });
    } else {
      setMode('work');
      setTimeLeft(DURATIONS.work);
    }
  }, [mode, playSound]);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, timeLeft, handleTimerComplete]);

  const toggleTimer = () => setIsRunning(!isRunning);
  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(DURATIONS[mode]);
  };

  const changeMode = (newMode: TimerMode) => {
    setMode(newMode);
    setTimeLeft(DURATIONS[newMode]);
    setIsRunning(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const addTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, { id: Date.now(), text: newTask, completed: false }]);
      setNewTask('');
    }
  };

  const toggleTask = (id: number) => {
    setTasks(tasks.map(task => {
      if (task.id === id) {
        if (!task.completed) {
          setStats(prev => ({ ...prev, completedTasks: prev.completedTasks + 1 }));
        }
        return { ...task, completed: !task.completed };
      }
      return task;
    }));
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock size={28} className="text-blue-500" />
              <h1 className="text-xl font-bold text-gray-900">PomodoroFlow</h1>
            </div>
            <div className="text-sm text-gray-600">Focus & Achieve</div>
          </div>
        </div>
      </header>

      <main>
        {page === 'timer' && <TimerPage mode={mode} timeLeft={timeLeft} isRunning={isRunning} sessions={sessions} onModeChange={changeMode} onToggleTimer={toggleTimer} onResetTimer={resetTimer} formatTime={formatTime} />}
        {page === 'tasks' && <TasksPage tasks={tasks} newTask={newTask} onNewTaskChange={(e) => setNewTask(e.target.value)} onAddTask={addTask} onToggleTask={toggleTask} onDeleteTask={deleteTask} />}
        {page === 'stats' && <StatsPage stats={stats} />}
        {page === 'profile' && <ProfilePage />}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-around">
            <button onClick={() => setPage('timer')} className={`flex flex-col items-center py-3 px-6 transition-colors ${page === 'timer' ? 'text-blue-500' : 'text-gray-600 hover:text-gray-900'}`}>
              <Clock size={24} />
              <span className="text-xs mt-1">Timer</span>
            </button>
            <button onClick={() => setPage('tasks')} className={`flex flex-col items-center py-3 px-6 transition-colors ${page === 'tasks' ? 'text-blue-500' : 'text-gray-600 hover:text-gray-900'}`}>
              <ListTodo size={24} />
              <span className="text-xs mt-1">Tasks</span>
            </button>
            <button onClick={() => setPage('stats')} className={`flex flex-col items-center py-3 px-6 transition-colors ${page === 'stats' ? 'text-blue-500' : 'text-gray-600 hover:text-gray-900'}`}>
              <BarChart3 size={24} />
              <span className="text-xs mt-1">Stats</span>
            </button>
            <button onClick={() => setPage('profile')} className={`flex flex-col items-center py-3 px-6 transition-colors ${page === 'profile' ? 'text-blue-500' : 'text-gray-600 hover:text-gray-900'}`}>
              <User size={24} />
              <span className="text-xs mt-1">Profile</span>
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
}