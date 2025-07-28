import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUsers, FaCalendarAlt, FaStar, FaHandsHelping, FaAward } from 'react-icons/fa';
import Card from '../components/UI/Card';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import { organizationAPI } from '../services/api';

const Organizations = () => {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    try {
      setLoading(true);
      const response = await organizationAPI.getAll();
      setOrganizations(response.data.data);
    } catch (error) {
      console.error('Error fetching organizations:', error);
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

  const getOrganizationIcon = (name) => {
    if (name.toLowerCase().includes('google')) return '🟦';
    if (name.toLowerCase().includes('himpunan') || name.toLowerCase().includes('mahasiswa')) return '🎓';
    if (name.toLowerCase().includes('tech') || name.toLowerCase().includes('developer')) return '💻';
    return '🏢';
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
              Organizations & Leadership
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              My involvement in various organizations and communities that have shaped my leadership skills 
              and collaborative experience
            </p>
          </motion.div>

          {organizations.length > 0 ? (
            <>
              {/* Organizations Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
                {organizations.map((org, index) => (
                  <motion.div
                    key={org.id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.2 }}
                  >
                    <Card hover glow className="h-full relative overflow-hidden">
                      {/* Background Pattern */}
                      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-game-primary/10 to-transparent rounded-full -translate-y-20 translate-x-20" />
                      
                      <div className="relative z-10">
                        {/* Header */}
                        <div className="flex items-start space-x-4 mb-6">
                          <div className="w-16 h-16 bg-gradient-to-br from-game-primary to-game-secondary rounded-xl flex items-center justify-center text-3xl">
                            {getOrganizationIcon(org.name)}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-white mb-2">
                              {org.name}
                            </h3>
                            <div className="space-y-1">
                              <div className="flex items-center space-x-2 text-neon-blue">
                                <FaStar className="text-sm" />
                                <span className="font-semibold">{org.position}</span>
                              </div>
                              <div className="flex items-center space-x-2 text-gray-400">
                                <FaCalendarAlt className="text-sm" />
                                <span className="text-sm">{org.duration}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Description */}
                        {org.description && (
                          <div className="space-y-4">
                            <h4 className="text-lg font-semibold text-neon-purple">
                              Role & Contributions
                            </h4>
                            <p className="text-gray-300 leading-relaxed">
                              {org.description}
                            </p>
                          </div>
                        )}

                        {/* Skills Gained */}
                        <div className="mt-6 pt-6 border-t border-game-primary/20">
                          <h5 className="text-sm font-semibold text-gray-400 mb-3">
                            Skills & Experience Gained:
                          </h5>
                          <div className="flex flex-wrap gap-2">
                            {/* Mock skills based on organization type */}
                            {org.name.toLowerCase().includes('himpunan') && 
                              ['Leadership', 'Event Management', 'Team Coordination', 'Public Speaking'].map((skill, skillIndex) => (
                                <span
                                  key={skillIndex}
                                  className="px-3 py-1 bg-game-primary/20 text-neon-blue text-sm rounded-full font-medium"
                                >
                                  {skill}
                                </span>
                              ))
                            }
                            {org.name.toLowerCase().includes('google') && 
                              ['Workshop Organization', 'Technical Mentoring', 'Community Building', 'Project Management'].map((skill, skillIndex) => (
                                <span
                                  key={skillIndex}
                                  className="px-3 py-1 bg-game-secondary/20 text-neon-green text-sm rounded-full font-medium"
                                >
                                  {skill}
                                </span>
                              ))
                            }
                          </div>
                        </div>

                        {/* Achievement Badge */}
                        <div className="absolute top-4 right-4">
                          <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                            <FaAward className="text-white text-sm" />
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Leadership Philosophy */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-20"
              >
                <Card className="text-center">
                  <h3 className="text-2xl font-bold font-game text-gradient mb-6">
                    Leadership Philosophy
                  </h3>
                  <p className="text-gray-400 leading-relaxed max-w-3xl mx-auto mb-8">
                    Through my involvement in various organizations, I've learned that great leadership 
                    isn't about having all the answers—it's about empowering others, fostering collaboration, 
                    and creating an environment where everyone can contribute their best work.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-3">
                      <div className="w-16 h-16 bg-gradient-to-br from-neon-blue to-neon-purple rounded-full flex items-center justify-center mx-auto">
                        <FaHandsHelping className="text-2xl text-white" />
                      </div>
                      <h4 className="text-lg font-bold text-neon-blue">Collaboration</h4>
                      <p className="text-gray-400 text-sm">
                        Building bridges between team members and fostering inclusive decision-making
                      </p>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="w-16 h-16 bg-gradient-to-br from-neon-green to-neon-blue rounded-full flex items-center justify-center mx-auto">
                        <FaUsers className="text-2xl text-white" />
                      </div>
                      <h4 className="text-lg font-bold text-neon-green">Mentorship</h4>
                      <p className="text-gray-400 text-sm">
                        Helping others grow by sharing knowledge and providing guidance
                      </p>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="w-16 h-16 bg-gradient-to-br from-neon-purple to-neon-pink rounded-full flex items-center justify-center mx-auto">
                        <FaStar className="text-2xl text-white" />
                      </div>
                      <h4 className="text-lg font-bold text-neon-purple">Innovation</h4>
                      <p className="text-gray-400 text-sm">
                        Encouraging creative thinking and embracing new approaches to challenges
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <Card className="max-w-md mx-auto">
                <div className="w-24 h-24 bg-dark-700 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FaUsers className="text-3xl text-gray-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-400 mb-4">
                  No organization data available
                </h3>
                <p className="text-gray-500">
                  Organization information will be displayed here once available.
                </p>
              </Card>
            </motion.div>
          )}

          {/* Community Involvement */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Card>
              <h3 className="text-2xl font-bold font-game text-gradient mb-6 text-center">
                Community Involvement & Values
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="text-lg font-bold text-neon-blue flex items-center space-x-2">
                    <span>🌟</span>
                    <span>Core Values</span>
                  </h4>
                  <ul className="space-y-3 text-gray-300">
                    <li className="flex items-start space-x-3">
                      <span className="w-2 h-2 bg-neon-blue rounded-full mt-2 flex-shrink-0" />
                      <span><strong>Integrity:</strong> Always doing the right thing, even when no one is watching</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <span className="w-2 h-2 bg-neon-green rounded-full mt-2 flex-shrink-0" />
                      <span><strong>Growth Mindset:</strong> Embracing challenges as opportunities to learn</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <span className="w-2 h-2 bg-neon-purple rounded-full mt-2 flex-shrink-0" />
                      <span><strong>Collaboration:</strong> Believing that we achieve more together than alone</span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-4">
                  <h4 className="text-lg font-bold text-neon-purple flex items-center space-x-2">
                    <span>🎯</span>
                    <span>Future Goals</span>
                  </h4>
                  <ul className="space-y-3 text-gray-300">
                    <li className="flex items-start space-x-3">
                      <span className="w-2 h-2 bg-neon-blue rounded-full mt-2 flex-shrink-0" />
                      <span>Start a tech community for aspiring developers</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <span className="w-2 h-2 bg-neon-green rounded-full mt-2 flex-shrink-0" />
                      <span>Mentor more junior developers in their career journey</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <span className="w-2 h-2 bg-neon-purple rounded-full mt-2 flex-shrink-0" />
                      <span>Organize workshops on modern web development</span>
                    </li>
                  </ul>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Organizations;
