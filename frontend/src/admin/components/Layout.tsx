import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, UserCircle, Wrench, FolderKanban, 
  FileText, Briefcase, MessageSquare, Image as ImageIcon, 
  MessageCircle, LogOut, Settings, Bell, Search, Menu, X, Activity, Server, Database
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const navItems = [

  { path: '/admincms/about', label: 'About', icon: UserCircle },
  { path: '/admincms/skills', label: 'Skills', icon: Wrench },
  { path: '/admincms/projects', label: 'Projects', icon: FolderKanban },
  { path: '/admincms/blogs', label: 'Blogs', icon: FileText },
  { path: '/admincms/experience', label: 'Experience', icon: Briefcase },
  { path: '/admincms/testimonials', label: 'Testimonials', icon: MessageSquare },
  { path: '/admincms/services', label: 'Services', icon: Wrench },
  { path: '/admincms/media', label: 'Media', icon: ImageIcon },
  { path: '/admincms/messages', label: 'Messages', icon: MessageCircle },
];

const Layout = () => {
  const { logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [health, setHealth] = useState<any>(null);

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const res = await axios.get('/api/health');
        setHealth(res.data);
      } catch (err) {
        setHealth({ status: 'error' });
      }
    };
    fetchHealth();
    const interval = setInterval(fetchHealth, 60000);
    return () => clearInterval(interval);
  }, []);

  const currentPathLabel = navItems.find(i => i.path === location.pathname)?.label || 'Admin CMS';

  return (
    <div className="flex h-screen bg-gray-50/50 text-gray-900 font-sans overflow-hidden">
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 260, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="flex-shrink-0 bg-white border-r border-gray-200 flex flex-col z-20 shadow-sm relative"
          >
            <div className="h-16 flex items-center px-6 border-b border-gray-100">
              <div className="flex items-center gap-2 text-indigo-600">
                <Database className="h-6 w-6" />
                <span className="text-lg font-bold tracking-tight text-gray-900">Nexus<span className="text-indigo-600">CMS</span></span>
              </div>
            </div>
            
            <nav className="flex-1 overflow-y-auto py-4 custom-scrollbar">
              <div className="px-4 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Overview
              </div>
              <ul className="space-y-1 px-3 mb-6">
                {navItems.slice(0, 1).map((item) => (
                  <NavItem key={item.path} item={item} isActive={location.pathname === item.path} />
                ))}
              </ul>

              <div className="px-4 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Content
              </div>
              <ul className="space-y-1 px-3 mb-6">
                {navItems.slice(1).map((item) => (
                  <NavItem key={item.path} item={item} isActive={location.pathname === item.path} />
                ))}
              </ul>
            </nav>

            <div className="p-4 border-t border-gray-100">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl mb-4">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                  A
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="text-sm font-medium text-gray-900 truncate">Admin User</p>
                  <p className="text-xs text-gray-500 truncate">admin@nexus.com</p>
                </div>
              </div>
              <button
                onClick={logout}
                className="flex items-center justify-center gap-2 w-full px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 z-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 -ml-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="text-xl font-semibold text-gray-800 tracking-tight hidden sm:block">
              {currentPathLabel}
            </h1>
          </div>

          <div className="flex items-center gap-4">


            <div className="h-6 w-px bg-gray-200 hidden sm:block"></div>

            <button className="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 relative transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-auto bg-[#F8FAFC] p-4 sm:p-8 custom-scrollbar">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="max-w-7xl mx-auto h-full"
          >
            <Outlet />
          </motion.div>
        </div>
      </main>
    </div>
  );
};

const NavItem = ({ item, isActive }: { item: any, isActive: boolean }) => {
  const Icon = item.icon;
  return (
    <li>
      <Link
        to={item.path}
        className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
          isActive 
            ? 'text-indigo-700 bg-indigo-50/80' 
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
        }`}
      >
        {isActive && (
          <motion.div
            layoutId="activeNavIndicator"
            className="absolute left-0 w-1 h-6 bg-indigo-600 rounded-r-full"
          />
        )}
        <Icon className={`h-5 w-5 flex-shrink-0 transition-colors ${isActive ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
        <span>{item.label}</span>
      </Link>
    </li>
  );
};

export default Layout;
