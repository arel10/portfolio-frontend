import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { FaLock, FaUser, FaEye, FaEyeSlash, FaRocket } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import Card from '../../components/UI/Card';
import Input from '../../components/UI/Input';
import Button from '../../components/UI/Button';
// import Input from '../../components/UI/Input';


const AdminLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm();

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const result = await login(data);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 relative overflow-hidden flex items-center justify-center">
      {/* Background Grid */}
      <div className="fixed inset-0 bg-cyber-grid bg-[size:50px_50px] opacity-20 pointer-events-none" />
      
      {/* Floating Particles */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-2 h-2 bg-neon-blue rounded-full animate-pulse" />
        <div className="absolute top-40 right-20 w-1 h-1 bg-neon-pink rounded-full animate-pulse delay-1000" />
        <div className="absolute bottom-40 left-20 w-1.5 h-1.5 bg-neon-green rounded-full animate-pulse delay-2000" />
        <div className="absolute bottom-20 right-10 w-1 h-1 bg-neon-yellow rounded-full animate-pulse delay-3000" />
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-20 h-20 border-2 border-neon-blue/30 rounded-lg animate-float" />
        <div className="absolute top-40 right-20 w-16 h-16 border-2 border-neon-purple/30 rounded-lg animate-float delay-1000" />
        <div className="absolute bottom-40 left-40 w-12 h-12 border-2 border-neon-pink/30 rounded-lg animate-float delay-2000" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            {/* Logo */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 bg-gradient-to-r from-neon-blue to-neon-purple rounded-2xl flex items-center justify-center mx-auto mb-6"
            >
              <FaLock className="text-3xl text-white" />
            </motion.div>

            <h1 className="text-3xl md:text-4xl font-bold font-game text-gradient mb-4">
              Admin Portal
            </h1>
            <p className="text-gray-400">
              Access the administration panel to manage your portfolio
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card glow className="relative overflow-hidden">
              {/* Animated Border */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink" />
              
              <div className="relative z-10">
                <div className="flex items-center space-x-3 mb-8">
                  <div className="w-12 h-12 bg-gradient-to-br from-game-primary to-game-secondary rounded-lg flex items-center justify-center">
                    <FaUser className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      Admin Login
                    </h2>
                    <p className="text-gray-400 text-sm">
                      Enter your credentials to continue
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <Input
                    label="Username"
                    placeholder="Enter your username"
                    {...register('username', { 
                      required: 'Username is required',
                      minLength: { value: 3, message: 'Username must be at least 3 characters' }
                    })}
                    error={errors.username?.message}
                  />

                  <div className="relative">
                    <Input
                      label="Password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      {...register('password', { 
                        required: 'Password is required',
                        minLength: { value: 6, message: 'Password must be at least 6 characters' }
                      })}
                      error={errors.password?.message}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-9 text-gray-400 hover:text-neon-blue transition-colors"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>

                  <Button
                    type="submit"
                    size="large"
                    loading={isLoading}
                    className="w-full group"
                  >
                    {isLoading ? (
                      'Logging in...'
                    ) : (
                      <>
                        <FaRocket className="mr-2 group-hover:animate-bounce" />
                        Login to Dashboard
                      </>
                    )}
                  </Button>
                </form>

                {/* Demo Credentials Info */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="mt-8 p-4 bg-dark-700/30 rounded-lg border border-game-primary/20"
                >
                  <h4 className="text-sm font-semibold text-neon-blue mb-2">
                    Demo Credentials:
                  </h4>
                  <div className="text-sm text-gray-400 space-y-1">
                    <p><strong>Username:</strong> admin</p>
                    <p><strong>Password:</strong> admin123</p>
                  </div>
                </motion.div>

                {/* Security Notice */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                  className="mt-6 text-center"
                >
                  <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
                    <FaLock />
                    <span>Secure connection established</span>
                  </div>
                </motion.div>
              </div>
            </Card>
          </motion.div>

          {/* Back to Portfolio Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="text-center mt-8"
          >
            <a
              href="/"
              className="text-gray-400 hover:text-neon-blue transition-colors text-sm"
            >
              ← Back to Portfolio
            </a>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
