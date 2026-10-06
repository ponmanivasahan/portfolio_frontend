import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CRUDPage from './pages/CRUDPage';
import { AuthProvider, useAuth } from './context/AuthContext';

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/admincms/login" />;
  return children;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/admincms" />} />
      <Route path="/admincms/login" element={<Login />} />
      <Route path="/admincms" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="about" element={<CRUDPage resource="about" />} />
        <Route path="skills" element={<CRUDPage resource="skills" />} />
        <Route path="projects" element={<CRUDPage resource="projects" />} />
        <Route path="blogs" element={<CRUDPage resource="blogs" />} />
        <Route path="experience" element={<CRUDPage resource="experience" />} />
        <Route path="testimonials" element={<CRUDPage resource="testimonials" />} />
        <Route path="services" element={<CRUDPage resource="services" />} />
        <Route path="media" element={<CRUDPage resource="media" />} />
        <Route path="messages" element={<CRUDPage resource="messages" />} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
