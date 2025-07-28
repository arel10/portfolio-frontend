import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';

// Public Pages
import Layout from './components/Layout/Layout';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Experience from './pages/Experience';
import Skills from './pages/Skills';
import Organizations from './pages/Organizations';
import Projects from './pages/Projects';
import Contact from './pages/Contact';

// Admin Pages
import AdminLayout from './components/Admin/AdminLayout';
import AdminLogin from './pages/Admin/AdminLogin';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminProfile from './pages/Admin/AdminProfile';
import AdminExperiences from './pages/Admin/AdminExperiences';
import AdminSkills from './pages/Admin/AdminSkills';
import AdminOrganizations from './pages/Admin/AdminOrganizations';
import AdminProjects from './pages/Admin/AdminProjects';
import AdminContacts from './pages/Admin/AdminContacts';

// Protected Route Component
import ProtectedRoute from './components/ProtectedRoute';

// Test Component
import TestConnection from './TestConnection';

function App() {
  return (
    <AuthProvider>
      <Router 
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true
        }}
      >
        <div className="App">
          <Routes>
            {/* Test Routes */}
            <Route path="/test" element={<TestConnection />} />
            
            {/* Public Routes */}
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="profile" element={<Profile />} />
              <Route path="experience" element={<Experience />} />
              <Route path="skills" element={<Skills />} />
              <Route path="organizations" element={<Organizations />} />
              <Route path="projects" element={<Projects />} />
              <Route path="contact" element={<Contact />} />
            </Route>

            {/* Admin Login */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Protected Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }>
              <Route index element={<AdminDashboard />} />
              <Route path="profile" element={<AdminProfile />} />
              <Route path="experiences" element={<AdminExperiences />} />
              <Route path="skills" element={<AdminSkills />} />
              <Route path="organizations" element={<AdminOrganizations />} />
              <Route path="projects" element={<AdminProjects />} />
              <Route path="contacts" element={<AdminContacts />} />
            </Route>
          </Routes>

          {/* Toast notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1a1a2e',
                color: '#fff',
                border: '1px solid #4F46E5',
                borderRadius: '12px',
              },
              success: {
                iconTheme: {
                  primary: '#10B981',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#EF4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
