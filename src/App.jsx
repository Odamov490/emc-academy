import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Shell from './components/Shell.jsx';

import Home from './pages/Home.jsx';
import Academy from './pages/Academy.jsx';
import Course from './pages/Course.jsx';
import Learn from './pages/Learn.jsx';
import Quiz from './pages/Quiz.jsx';
import Certificate from './pages/Certificate.jsx';
import Verify from './pages/Verify.jsx';
import Login from './pages/Login.jsx';
import Profile from './pages/Profile.jsx';
import Admin from './pages/Admin.jsx';
import NotFound from './pages/NotFound.jsx';

import { useAuth } from './lib/auth.jsx';

function RequireAuth({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function RequireAdmin({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (!user.isAdmin) return <Navigate to="/academy" replace />;
  return children;
}

export default function App() {
  return (
    <Shell>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/academy" element={<Academy />} />
        <Route path="/course/:courseId" element={<Course />} />
        <Route
          path="/learn/:courseId"
          element={
            <RequireAuth>
              <Learn />
            </RequireAuth>
          }
        />
        <Route
          path="/quiz/:courseId"
          element={
            <RequireAuth>
              <Quiz />
            </RequireAuth>
          }
        />
        <Route
          path="/certificate/:certNo"
          element={
            <RequireAuth>
              <Certificate />
            </RequireAuth>
          }
        />
        <Route path="/verify/:certNo" element={<Verify />} />
        <Route
          path="/profile"
          element={
            <RequireAuth>
              <Profile />
            </RequireAuth>
          }
        />
        <Route
          path="/admin"
          element={
            <RequireAdmin>
              <Admin />
            </RequireAdmin>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Shell>
  );
}
