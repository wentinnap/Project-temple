import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Home from "./pages/frontend/Home";
import About from "./pages/frontend/about";
import NewsPage from "./pages/frontend/NewsPage";
import TempleCalendar from "./pages/frontend/TempleCalendar";
import Donate from "./pages/frontend/Donate";
import QA from "./pages/frontend/Q&A";
import Booking from "./pages/frontend/Booking";
import AdminHome from "./pages/admin/AdminHome";
import Adminbooking from "./pages/admin/Adminbooking";
import Dashboard from "./pages/admin/Dashboard";
import Events from "./pages/admin/Events";
import Monks from "./pages/admin/Monks";
import News from "./pages/admin/News";
import Users from "./pages/admin/Users";

// Protected Route Component
function ProtectedRoute({ children, requiredRole = null }) {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  
  // ถ้าไม่มี token → ไป login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // ถ้าต้องการ role เฉพาะ
  if (requiredRole) {
    let user;
    try {
      user = JSON.parse(userStr);
    } catch {
      return <Navigate to="/login" replace />;
    }

    // ถ้า role ไม่ตรง → redirect ตามสิทธิ์
    if (user.role !== requiredRole) {
      if (user.role === 'admin') {
        return <Navigate to="/admin" replace />;
      } else {
        return <Navigate to="/" replace />;
      }
    }
  }

  return children;
}

// Login Redirect Component
function LoginRedirect() {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  try {
    const user = JSON.parse(userStr);
    if (user.role === 'admin') {
      return <Navigate to="/admin" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  } catch {
    return <Navigate to="/login" replace />;
  }
}

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Home & About */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/Calendar" element={<TempleCalendar />} />
        <Route path="/donate" element={<Donate />} />
        <Route path="/Q&A" element={<QA />} />
        <Route path="/Booking" element={<Booking />} />

        {/* Admin Routes - เฉพาะ admin เท่านั้น */}
        <Route path="/admin" element={
          <ProtectedRoute requiredRole="admin">
            <AdminHome />
          </ProtectedRoute>
        } />
        <Route path="/admin/dashboard" element={
          <ProtectedRoute requiredRole="admin">
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/Adminbooking" element={
          <ProtectedRoute requiredRole="admin">
            <Adminbooking />
          </ProtectedRoute>
        } />
        <Route path="/admin/events" element={
          <ProtectedRoute requiredRole="admin">
            <Events />
          </ProtectedRoute>
        } />
        <Route path="/admin/monks" element={
          <ProtectedRoute requiredRole="admin">
            <Monks />
          </ProtectedRoute>
        } />
        <Route path="/admin/news" element={
          <ProtectedRoute requiredRole="admin">
            <News />
          </ProtectedRoute>
        } />
        <Route path="/admin/users" element={
          <ProtectedRoute requiredRole="admin">
            <Users />
          </ProtectedRoute>
        } />

        {/* 404 - redirect ไปหน้าแรก */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}


export default App;