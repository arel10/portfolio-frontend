import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaBriefcase, FaCalendarAlt, FaBuilding } from 'react-icons/fa';
import Card from '../components/UI/Card';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import { experienceAPI } from '../services/api';

const Experience = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      setLoading(true);
      const response = await experienceAPI.getAll();
      setExperiences(response.data.data);
    } catch (error) {
      console.error('Error fetching experiences:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Present';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short' 
    });
  };

  const calculateDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date();
    
    const months = (end.getFullYear() - start.getFullYear()) * 12 + 
                   (end.getMonth() - start.getMonth());
    
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    
    if (years === 0) {
      return `${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
    } else if (remainingMonths === 0) {
      return `${years} year${years !== 1 ? 's' : ''}`;
    } else {
      return `${years} year${years !== 1 ? 's' : ''} ${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <LoadingSpinner size="large" />
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
              Work Experience
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              My professional journey and the experiences that have shaped my development skills
            </p>
          </motion.div>

          {experiences.length > 0 ? (
            <div className="max-w-4xl mx-auto">
              {/* Timeline */}
              <div className="relative">
                {/* Timeline Line */}
                <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-neon-blue via-neon-purple to-neon-pink rounded-full hidden md:block" />

                {experiences.map((experience, index) => (
                  <motion.div
                    key={experience.id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.2 }}
                    className="relative mb-12 md:ml-20"
                  >
                    {/* Timeline Dot */}
                    <div className="absolute -left-20 top-6 w-4 h-4 bg-gradient-to-r from-neon-blue to-neon-purple rounded-full border-4 border-dark-900 hidden md:block" />
                    
                    {/* Current Position Indicator */}
                    {experience.is_current && (
                      <div className="absolute -left-[88px] top-3 w-6 h-6 bg-green-500 rounded-full animate-pulse hidden md:block">
                        <div className="absolute inset-2 bg-green-400 rounded-full" />
                      </div>
                    )}

                    <Card hover glow className="relative overflow-hidden">
                      {/* Background Pattern */}
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-game-primary/10 to-transparent rounded-full -translate-y-16 translate-x-16" />
                      
                      <div className="relative z-10">
                        {/* Header */}
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <div className="w-12 h-12 bg-gradient-to-br from-game-primary to-game-secondary rounded-lg flex items-center justify-center">
                                <FaBriefcase className="text-white text-xl" />
                              </div>
                              <div>
                                <h3 className="text-xl md:text-2xl font-bold text-white">
                                  {experience.role}
                                </h3>
                                <div className="flex items-center space-x-2 text-neon-blue">
                                  <FaBuilding className="text-sm" />
                                  <span className="font-semibold">{experience.company_name}</span>
                                </div>
                              </div>
                            </div>

                            {/* Current Position Badge */}
                            {experience.is_current && (
                              <div className="inline-flex items-center space-x-2 bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-semibold mb-4">
                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                                <span>Current Position</span>
                              </div>
                            )}
                          </div>

                          {/* Date & Duration */}
                          <div className="text-right space-y-2">
                            <div className="flex items-center justify-end space-x-2 text-gray-400">
                              <FaCalendarAlt className="text-sm" />
                              <span className="text-sm">
                                {formatDate(experience.start_date)} - {formatDate(experience.end_date)}
                              </span>
                            </div>
                            <div className="text-sm text-neon-purple font-semibold">
                              {calculateDuration(experience.start_date, experience.end_date)}
                            </div>
                          </div>
                        </div>

                        {/* Description */}
                        {experience.description && (
                          <div className="space-y-4">
                            <h4 className="text-lg font-semibold text-neon-blue">
                              Key Responsibilities & Achievements
                            </h4>
                            <p className="text-gray-300 leading-relaxed">
                              {experience.description}
                            </p>
                          </div>
                        )}

                        {/* Skills Used (mock data for now) */}
                        <div className="mt-6 pt-6 border-t border-game-primary/20">
                          <h5 className="text-sm font-semibold text-gray-400 mb-3">
                            Technologies & Skills Used:
                          </h5>
                          <div className="flex flex-wrap gap-2">
                            {/* Mock skills - in real app, this would come from API */}
                            {index === 0 && ['React.js', 'Node.js', 'MySQL', 'Express.js', 'Git'].map((skill, skillIndex) => (
                              <span
                                key={skillIndex}
                                className="px-3 py-1 bg-game-primary/20 text-neon-blue text-sm rounded-full font-medium"
                              >
                                {skill}
                              </span>
                            ))}
                            {index === 1 && ['JavaScript', 'HTML5', 'CSS3', 'React.js', 'Figma'].map((skill, skillIndex) => (
                              <span
                                key={skillIndex}
                                className="px-3 py-1 bg-game-secondary/20 text-neon-green text-sm rounded-full font-medium"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <Card className="max-w-md mx-auto">
                <div className="w-24 h-24 bg-dark-700 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FaBriefcase className="text-3xl text-gray-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-400 mb-4">
                  No experience data available
                </h3>
                <p className="text-gray-500">
                  Experience information will be displayed here once available.
                </p>
              </Card>
            </motion.div>
          )}

          {/* Career Goals */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-20"
          >
            <Card className="text-center">
              <h3 className="text-2xl font-bold font-game text-gradient mb-6">
                Career Goals & Aspirations
              </h3>
              <p className="text-gray-400 leading-relaxed max-w-3xl mx-auto mb-8">
                I'm constantly striving to grow as a developer and contribute to meaningful projects. 
                My goal is to become a full-stack expert while staying current with emerging technologies 
                and best practices in software development.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <div className="w-16 h-16 bg-gradient-to-br from-neon-blue to-neon-purple rounded-full flex items-center justify-center mx-auto">
                    <span className="text-2xl">🎯</span>
                  </div>
                  <h4 className="text-lg font-bold text-neon-blue">Short Term</h4>
                  <p className="text-gray-400 text-sm">
                    Master advanced React patterns and TypeScript
                  </p>
                </div>
                
                <div className="space-y-3">
                  <div className="w-16 h-16 bg-gradient-to-br from-neon-green to-neon-blue rounded-full flex items-center justify-center mx-auto">
                    <span className="text-2xl">🚀</span>
                  </div>
                  <h4 className="text-lg font-bold text-neon-green">Medium Term</h4>
                  <p className="text-gray-400 text-sm">
                    Lead development projects and mentor junior developers
                  </p>
                </div>
                
                <div className="space-y-3">
                  <div className="w-16 h-16 bg-gradient-to-br from-neon-purple to-neon-pink rounded-full flex items-center justify-center mx-auto">
                    <span className="text-2xl">⭐</span>
                  </div>
                  <h4 className="text-lg font-bold text-neon-purple">Long Term</h4>
                  <p className="text-gray-400 text-sm">
                    Become a technical architect and innovate in web technologies
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Experience;
