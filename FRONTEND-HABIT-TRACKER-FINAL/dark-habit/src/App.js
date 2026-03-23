import React, { useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import HabitDetail from './pages/HabitDetail';
import History from './pages/History';
import Calendar from './pages/Calendarr';
import Profile from './pages/Profile';
import { getReminders, getTasks, getHabits } from './api/api';
import Chatbot from './components/Chatbot';
import Analytics from './pages/Analytics';
import Challenge from './pages/Challenge';
function useReminderChecker() {
  const intervalRef = useRef(null);

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    const check = async () => {
      const user = JSON.parse(localStorage.getItem('user') || 'null');
      if (!user) return;
      try {
        const habitsRes = await getHabits(user.userId);
        const habits = habitsRes.data;
        for (const habit of habits) {
          const tasksRes = await getTasks(habit.habitId);
          const tasks = tasksRes.data;
          for (const task of tasks) {
            const remindersRes = await getReminders(task.taskId);
            const reminders = remindersRes.data;
            const now = new Date();
            const hh = String(now.getHours()).padStart(2, '0');
            const mm = String(now.getMinutes()).padStart(2, '0');
            const currentTime = `${hh}:${mm}:00`;
            for (const r of reminders) {
              if (r.notificationTime === currentTime) {
                if (Notification.permission === 'granted') {
                  new Notification('⏰ Habit Reminder!', {
                    body: `Hi ${user.name}! Time to complete: ${task.title}`,
                    icon: '/favicon.ico',
                  });
                }
              }
            }
          }
        }
      } catch (e) {}
    };

    intervalRef.current = setInterval(check, 60000);
    check();
    return () => clearInterval(intervalRef.current);
  }, []);
}

function PrivateRoute({ children }) {
  const user = localStorage.getItem('user');
  return user ? children : <Navigate to="/login" />;
}

export default function App() {
  useReminderChecker();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/challenge" element={<PrivateRoute><Challenge /></PrivateRoute>} />
        <Route path="/analytics" element={<PrivateRoute><Analytics /></PrivateRoute>} />
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/habit/:habitId" element={<PrivateRoute><HabitDetail /></PrivateRoute>} />
        <Route path="/history"  element={<PrivateRoute><History /></PrivateRoute>} />
        <Route path="/calendar" element={<PrivateRoute><Calendar /></PrivateRoute>} />
        <Route path="/profile"  element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Chatbot />
    </BrowserRouter>
  );
}