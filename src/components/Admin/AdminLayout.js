import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaTachometerAlt, 
  FaUser, 
  FaBriefcase, 
  FaCogs, 
  FaUsers, 
  FaProjectDiagram, 
  FaEnvelope,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaHome,
  FaUserShield
} from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../UI/Button';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { admin, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const sidebarItems = [
    { path: '/admin', label: 'Dashboard', icon: FaTachometerAlt, exact: true },
    { path: '/admin/profile', label: 'Profile', icon: FaUser },
    { path: '/admin/experiences', label: 'Experiences', icon: FaBriefcase },
    { path: '/admin/skills', label: 'Skills', icon: FaCogs },
    { path: '/admin/organizations', label: 'Organizations', icon: FaUsers },
    { path: '/admin/projects', label: 'Projects', icon: FaProjectDiagram },
    { path: '/admin/contacts', label: 'Messages', icon: FaEnvelope },
  ];

  const isActive = (path, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-dark-900 relative">
      {/* Background Grid */}
      <div className="fixed inset-0 bg-cyber-grid bg-[size:30px_30px] opacity-10 pointer-events-none" />

      <div className="flex">
        {/* Sidebar */}
        <div className={`fixed inset-y-0 left-0 z-50 w-64 admin-sidebar transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:static lg:inset-0`}>
          
          {/* Sidebar Header */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-game-primary/30">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-neon-blue to-neon-purple rounded-lg flex items-center justify-center">
                <FaUserShield className="text-white text-sm" />
              </div>
              <span className="text-lg font-bold font-game text-gradient">
                Admin Panel
              </span>
            </div>
            
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-400 hover:text-white"
            >
              <FaTimes />
            </button>
          </div>

          {/* Admin Info */}
          <div className="p-6 border-b border-game-primary/30">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-game-primary to-game-secondary rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  {admin?.username?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-white font-semibold">{admin?.username}</p>
                <p className="text-gray-400 text-sm">Administrator</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path, item.exact);
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`admin-nav-link ${active ? 'active' : ''}`}
                >
                  <Icon className="text-lg" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-game-primary/30 space-y-3">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="admin-nav-link w-full"
            >
              <FaHome className="text-lg" />
              <span>View Portfolio</span>
            </a>
            
            <Button
              variant="danger"
              size="small"
              onClick={handleLogout}
              className="w-full"
            >
              <FaSignOutAlt className="mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Overlay for mobile */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            />
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div className="flex-1 lg:ml-0">
          {/* Top Bar */}
          <header className="h-16 bg-dark-800/50 backdrop-blur-md border-b border-game-primary/30 flex items-center justify-between px-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-game-primary/10 transition-colors"
              >
                <FaBars />
              </button>
              
              <div>
                <h1 className="text-xl font-bold text-white">
                  {sidebarItems.find(item => 
                    isActive(item.path, item.exact)
                  )?.label || 'Admin Panel'}
                </h1>
                <p className="text-gray-400 text-sm">
                  Manage your portfolio content
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Quick Actions */}
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:flex items-center space-x-2 px-3 py-2 bg-dark-700/50 rounded-lg hover:bg-dark-700 transition-colors text-gray-400 hover:text-white"
              >
                <FaHome className="text-sm" />
                <span className="text-sm">View Site</span>
              </a>

              {/* Admin Avatar */}
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-game-primary to-game-secondary rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">
                    {admin?.username?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="hidden md:block text-white font-medium">
                  {admin?.username}
                </span>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="p-6 relative z-10">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
