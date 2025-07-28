import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaUsers, 
  FaEye, 
  FaProjectDiagram, 
  FaEnvelope,
  FaChartLine,
  FaClock,
  FaServer,
  FaShieldAlt,
  FaTachometerAlt,
  FaCode,
  FaBriefcase,
  FaCogs
} from 'react-icons/fa';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    projects: 0,
    skills: 0,
    experiences: 0,
    organizations: 0,
    contacts: 0,
    profileViews: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [systemStatus, setSystemStatus] = useState({
    api: 'online',
    database: 'online',
    lastBackup: '2024-01-15 02:00:00'
  });
  const [loading, setLoading] = useState(true);
  const { admin } = useAuth();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch all data in parallel
      const [projectsRes, skillsRes, experiencesRes, organizationsRes, contactsRes] = await Promise.all([
        api.get('/projects'),
        api.get('/skills'),
        api.get('/experiences'),
        api.get('/organizations'),
        api.get('/contact')
      ]);

      setStats({
        projects: projectsRes.data.data?.length || 0,
        skills: skillsRes.data.data?.length || 0,
        experiences: experiencesRes.data.data?.length || 0,
        organizations: organizationsRes.data.data?.length || 0,
        contacts: contactsRes.data.data?.length || 0,
        profileViews: Math.floor(Math.random() * 1000) + 500 // Mock data
      });

      // Generate mock recent activity
      setRecentActivity([
        {
          id: 1,
          action: 'New contact message received',
          type: 'contact',
          time: '2 minutes ago',
          icon: FaEnvelope
        },
        {
          id: 2,
          action: 'Project "E-Commerce App" updated',
          type: 'project',
          time: '1 hour ago',
          icon: FaProjectDiagram
        },
        {
          id: 3,
          action: 'New skill "React Native" added',
          type: 'skill',
          time: '3 hours ago',
          icon: FaCogs
        },
        {
          id: 4,
          action: 'Experience at "TechCorp" updated',
          type: 'experience',
          time: '1 day ago',
          icon: FaBriefcase
        }
      ]);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Projects',
      value: stats.projects,
      icon: FaProjectDiagram,
      color: 'from-blue-500 to-cyan-500',
      change: '+2 this month'
    },
    {
      title: 'Skills',
      value: stats.skills,
      icon: FaCogs,
      color: 'from-green-500 to-emerald-500',
      change: '+5 this month'
    },
    {
      title: 'Experiences',
      value: stats.experiences,
      icon: FaBriefcase,
      color: 'from-purple-500 to-pink-500',
      change: '+1 this month'
    },
    {
      title: 'Organizations',
      value: stats.organizations,
      icon: FaUsers,
      color: 'from-orange-500 to-red-500',
      change: 'No change'
    },
    {
      title: 'Contact Messages',
      value: stats.contacts,
      icon: FaEnvelope,
      color: 'from-indigo-500 to-purple-500',
      change: '+8 this week'
    },
    {
      title: 'Profile Views',
      value: stats.profileViews,
      icon: FaEye,
      color: 'from-pink-500 to-rose-500',
      change: '+15% this week'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="game-card p-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2 flex items-center">
              <FaTachometerAlt className="mr-3 text-game-primary" />
              Welcome back, {admin?.username}!
            </h1>
            <p className="text-gray-400">
              Here's what's happening with your portfolio today.
            </p>
          </div>
          <div className="text-right">
            <p className="text-gray-400 text-sm">Last login</p>
            <p className="text-white font-semibold">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="game-card p-6 group hover:scale-105 transition-transform duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${card.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="text-white text-xl" />
                </div>
                <FaChartLine className="text-gray-500 group-hover:text-game-primary transition-colors" />
              </div>
              
              <div>
                <h3 className="text-gray-400 text-sm font-medium mb-1">{card.title}</h3>
                <p className="text-2xl font-bold text-white mb-2">{card.value}</p>
                <p className="text-xs text-gray-500">{card.change}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="game-card p-6"
        >
          <h2 className="text-xl font-bold text-white mb-6 flex items-center">
            <FaClock className="mr-3 text-game-primary" />
            Recent Activity
          </h2>
          
          <div className="space-y-4">
            {recentActivity.map((activity) => {
              const Icon = activity.icon;
              return (
                <div key={activity.id} className="flex items-center space-x-4 p-3 rounded-lg bg-dark-700/30 hover:bg-dark-700/50 transition-colors">
                  <div className="w-10 h-10 bg-gradient-to-r from-game-primary to-game-secondary rounded-full flex items-center justify-center">
                    <Icon className="text-white text-sm" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white text-sm font-medium">{activity.action}</p>
                    <p className="text-gray-400 text-xs">{activity.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* System Status */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
          className="game-card p-6"
        >
          <h2 className="text-xl font-bold text-white mb-6 flex items-center">
            <FaShieldAlt className="mr-3 text-game-primary" />
            System Status
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-dark-700/30">
              <div className="flex items-center space-x-3">
                <FaServer className="text-blue-400" />
                <span className="text-white font-medium">API Server</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-400 text-sm">Online</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-lg bg-dark-700/30">
              <div className="flex items-center space-x-3">
                <FaCode className="text-purple-400" />
                <span className="text-white font-medium">Database</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-400 text-sm">Connected</span>
              </div>
            </div>
            
            <div className="border-t border-gray-700 pt-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-sm">Last Backup</span>
                <span className="text-white text-sm">{systemStatus.lastBackup}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="game-card p-6"
      >
        <h2 className="text-xl font-bold text-white mb-6">Quick Actions</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Add Project', icon: FaProjectDiagram, href: '/admin/projects/new' },
            { label: 'Update Profile', icon: FaUsers, href: '/admin/profile' },
            { label: 'Add Skill', icon: FaCogs, href: '/admin/skills' },
            { label: 'View Messages', icon: FaEnvelope, href: '/admin/contacts' }
          ].map((action) => {
            const Icon = action.icon;
            return (
              <a
                key={action.label}
                href={action.href}
                className="flex flex-col items-center p-4 rounded-lg bg-dark-700/30 hover:bg-dark-700/50 transition-colors group"
              >
                <Icon className="text-2xl text-game-primary group-hover:text-game-secondary transition-colors mb-2" />
                <span className="text-white text-sm font-medium text-center">{action.label}</span>
              </a>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
