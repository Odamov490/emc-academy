import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './contexts/AppContext';
import Navbar from './components/Navbar';
import { Toast, Spinner } from './components/UI';
import Home from './pages/Home';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import { Auth, Profile, Teachers, About } from './pages/OtherPages';
import { Admin, Dashboard } from './pages/AdminDashboard';

function ProtectedRoute({ children, requireTeacher, requireAdmin }) {
  const { currentUser, userProfile, authLoading, isAdmin, isTeacher } = useApp();
  if (authLoading) return <Spinner />;
  if (!currentUser) return <Navigate to="/auth" replace />;
  if (requireAdmin && !isAdmin) return <Navigate to="/" replace />;
  if (requireTeacher && !isTeacher) return <Navigate to="/" replace />;
  return children;
}

function AppRoutes() {
  const { authLoading } = useApp();

  if (authLoading) {
    return (
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', flexDirection:'column', gap:24, background:'var(--bg)' }}>
        <div style={{ fontFamily:'var(--font-head)', fontSize:'2rem', fontWeight:800, color:'var(--yellow)' }}>EMC Academy</div>
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/courses/:id" element={<CourseDetail />} />
        <Route path="/teachers" element={<Teachers />} />
        <Route path="/about" element={<About />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute requireTeacher><Dashboard /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute requireAdmin><Admin /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toast />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppRoutes />
      </AppProvider>
    </BrowserRouter>
  );
}
