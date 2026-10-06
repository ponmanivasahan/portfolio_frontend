import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Github, Linkedin, Mail } from 'lucide-react';
import { useState } from 'react';

// Public Portfolio Pages
import Home from './pages/Home';
import About from './pages/About';
import Projects from './pages/Projects';
import Skills from './pages/Skills';
import Experience from './pages/Experience';
import Services from './pages/Services';
import Blog from './pages/Blog';
import Contact from './pages/Contact';

// Admin CMS
import AdminLayout from './admin/components/Layout';
import AdminLogin from './admin/pages/Login';

import CRUDPage from './admin/pages/CRUDPage';
import { AuthProvider, useAuth } from './admin/context/AuthContext';

const PublicLayout = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Projects', path: '/projects' },
    { name: 'Skills', path: '/skills' },
    { name: 'Experience', path: '/experience' },
    { name: 'Services', path: '/services' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="fixed w-full z-50 bg-background/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="text-xl font-bold tracking-tighter">Portfolio.</Link>
            
            <div className="hidden md:block">
              <div className="flex items-baseline space-x-4">
                {links.map(link => (
                  <Link key={link.name} to={link.path} className="hover:text-primary transition-colors px-3 py-2 rounded-md text-sm font-medium">
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="md:hidden">
              <button onClick={() => setIsOpen(!isOpen)} className="p-2">
                {isOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="md:hidden bg-background border-b border-white/10"
            >
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                {links.map(link => (
                  <Link 
                    key={link.name} 
                    to={link.path} 
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-2 rounded-md text-base font-medium hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main className="flex-grow pt-16">
        <AnimatePresence mode="wait">
          {children}
        </AnimatePresence>
      </main>

      <footer className="border-t border-white/10 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">© {new Date().getFullYear()} Portfolio. All rights reserved.</p>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-400 hover:text-white transition-colors"><Github className="w-5 h-5" /></a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors"><Linkedin className="w-5 h-5" /></a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors"><Mail className="w-5 h-5" /></a>
          </div>
        </div>
      </footer>
    </div>
  );
};

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/admincms/login" />;
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Admin Routes */}
          <Route path="/admincms/login" element={<AdminLogin />} />
          <Route path="/admincms" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
            <Route index element={<Navigate to="about" replace />} />
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
          
          {/* Public Routes */}
          <Route path="/*" element={
            <PublicLayout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/skills" element={<Skills />} />
                <Route path="/experience" element={<Experience />} />
                <Route path="/services" element={<Services />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/contact" element={<Contact />} />
              </Routes>
            </PublicLayout>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
