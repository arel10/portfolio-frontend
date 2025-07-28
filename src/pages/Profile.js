import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaUser, 
  FaMapMarkerAlt, 
  FaEnvelope, 
  FaPhone, 
  FaCalendarAlt,
  FaDownload,
  FaCode,
  // FaGraduationCap
} from 'react-icons/fa';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import { profileAPI } from '../services/api';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await profileAPI.get();
      setProfile(response.data.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <Card className="text-center">
          <h2 className="text-2xl font-bold text-gray-400 mb-4">Profile not found</h2>
          <p className="text-gray-500">Please check back later.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16">
      {/* Header */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-6xl font-bold font-game text-gradient mb-6">
              About Me
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Get to know more about my journey, background, and what drives my passion for development
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Profile Image & Basic Info */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-1"
            >
              <Card glow className="text-center sticky top-24">
                {/* Profile Image */}
                <div className="relative mb-6">
                  <div className="w-48 h-48 mx-auto rounded-full bg-gradient-to-br from-game-primary to-game-secondary p-1">
                    <div className="w-full h-full rounded-full bg-dark-900 overflow-hidden">
                      {profile.photo_url ? (
                        <img
                          src={profile.photo_url}
                          alt={profile.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-gradient font-game">
                          {profile.name?.split(' ').map(n => n[0]).join('') || 'AJ'}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Status Indicator */}
                  <div className="absolute bottom-4 right-4 w-6 h-6 bg-green-500 rounded-full border-4 border-dark-900 animate-pulse" />
                </div>

                {/* Name & Title */}
                <h2 className="text-2xl font-bold font-game text-gradient mb-2">
                  {profile.name}
                </h2>
                <p className="text-neon-blue font-semibold mb-6">
                  {profile.title}
                </p>

                {/* Quick Actions */}
                <div className="space-y-3">
                  {profile.resume_url && (
                    <a href={profile.resume_url} target="_blank" rel="noopener noreferrer">
                      <Button size="small" className="w-full">
                        <FaDownload className="mr-2" />
                        Download CV
                      </Button>
                    </a>
                  )}
                  {profile.email && (
                    <a href={`mailto:${profile.email}`}>
                      <Button variant="secondary" size="small" className="w-full">
                        <FaEnvelope className="mr-2" />
                        Send Email
                      </Button>
                    </a>
                  )}
                </div>

                {/* Quick Stats */}
                <div className="mt-8 pt-6 border-t border-game-primary/20">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-neon-blue font-game">2+</div>
                      <div className="text-xs text-gray-400">Years Learning</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-neon-green font-game">10+</div>
                      <div className="text-xs text-gray-400">Projects</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-neon-purple font-game">15+</div>
                      <div className="text-xs text-gray-400">Technologies</div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Detailed Information */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="lg:col-span-2 space-y-8"
            >
              {/* Bio Section */}
              <Card>
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-neon-blue to-neon-purple rounded-lg flex items-center justify-center">
                    <FaUser className="text-white" />
                  </div>
                  <h3 className="text-2xl font-bold font-game text-gradient">Biography</h3>
                </div>
                <p className="text-gray-300 leading-relaxed text-lg">
                  {profile.bio || 'No biography available.'}
                </p>
              </Card>

              {/* Personal Details */}
              <Card>
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-neon-green to-neon-blue rounded-lg flex items-center justify-center">
                    <FaCalendarAlt className="text-white" />
                  </div>
                  <h3 className="text-2xl font-bold font-game text-gradient">Personal Details</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {profile.age && (
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-dark-700 rounded-lg flex items-center justify-center">
                        <FaCalendarAlt className="text-neon-blue text-sm" />
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Age</p>
                        <p className="text-white font-semibold">{profile.age} years old</p>
                      </div>
                    </div>
                  )}

                  {profile.location && (
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-dark-700 rounded-lg flex items-center justify-center">
                        <FaMapMarkerAlt className="text-neon-green text-sm" />
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Location</p>
                        <p className="text-white font-semibold">{profile.location}</p>
                      </div>
                    </div>
                  )}

                  {profile.email && (
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-dark-700 rounded-lg flex items-center justify-center">
                        <FaEnvelope className="text-neon-purple text-sm" />
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Email</p>
                        <p className="text-white font-semibold">{profile.email}</p>
                      </div>
                    </div>
                  )}

                  {profile.phone && (
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-dark-700 rounded-lg flex items-center justify-center">
                        <FaPhone className="text-neon-pink text-sm" />
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Phone</p>
                        <p className="text-white font-semibold">{profile.phone}</p>
                      </div>
                    </div>
                  )}
                </div>
              </Card>

              {/* What I Do */}
              <Card>
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-neon-purple to-neon-pink rounded-lg flex items-center justify-center">
                    <FaCode className="text-white" />
                  </div>
                  <h3 className="text-2xl font-bold font-game text-gradient">What I Do</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    {
                      title: 'Frontend Development',
                      description: 'Creating responsive and interactive user interfaces with React.js and modern CSS frameworks.',
                      icon: '🎨'
                    },
                    {
                      title: 'Backend Development', 
                      description: 'Building robust server-side applications with Node.js and Express.js.',
                      icon: '⚙️'
                    },
                    {
                      title: 'Database Design',
                      description: 'Designing efficient database schemas with MySQL and MongoDB.',
                      icon: '🗄️'
                    },
                    {
                      title: 'UI/UX Design',
                      description: 'Creating user-centered designs with tools like Figma and focus on user experience.',
                      icon: '🚀'
                    }
                  ].map((service, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 bg-dark-700/30 rounded-lg border border-game-primary/20 hover:border-game-primary/40 transition-colors"
                    >
                      <div className="text-3xl mb-3">{service.icon}</div>
                      <h4 className="text-lg font-bold text-neon-blue mb-2">{service.title}</h4>
                      <p className="text-gray-400 text-sm leading-relaxed">{service.description}</p>
                    </motion.div>
                  ))}
                </div>
              </Card>

              {/* Fun Facts */}
              <Card>
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-neon-yellow to-neon-orange rounded-lg flex items-center justify-center">
                    <span className="text-white text-xl">🎮</span>
                  </div>
                  <h3 className="text-2xl font-bold font-game text-gradient">Fun Facts</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    '🎮 Loves playing video games for UI inspiration',
                    '☕ Can\'t code without coffee',
                    '🌙 Night owl - most productive after 9 PM',
                    '📚 Always learning new technologies',
                    '🎵 Codes better with lo-fi music',
                    '🍕 Pizza is the ultimate debugging fuel'
                  ].map((fact, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center space-x-3 p-3 bg-dark-700/20 rounded-lg"
                    >
                      <span className="text-neon-blue">•</span>
                      <span className="text-gray-300">{fact}</span>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Profile;
