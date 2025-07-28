import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const Layout = () => {
  return (
    <div className="min-h-screen bg-dark-900 relative overflow-x-hidden">
      {/* Background Grid */}
      <div className="fixed inset-0 bg-cyber-grid bg-[size:50px_50px] opacity-20 pointer-events-none" />
      
      {/* Floating Particles */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-2 h-2 bg-neon-blue rounded-full animate-pulse" />
        <div className="absolute top-40 right-20 w-1 h-1 bg-neon-pink rounded-full animate-pulse delay-1000" />
        <div className="absolute bottom-40 left-20 w-1.5 h-1.5 bg-neon-green rounded-full animate-pulse delay-2000" />
        <div className="absolute bottom-20 right-10 w-1 h-1 bg-neon-yellow rounded-full animate-pulse delay-3000" />
      </div>

      <Header />
      
      <main className="relative z-10">
        <Outlet />
      </main>
      
      <Footer />
    </div>
  );
};

export default Layout;
