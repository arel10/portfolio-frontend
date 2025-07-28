import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Card from '../components/UI/Card';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import { skillAPI } from '../services/api';

const Skills = () => {
  const [skillsData, setSkillsData] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      setLoading(true);
      const response = await skillAPI.getGrouped();
      setSkillsData(response.data.data);
    } catch (error) {
      console.error('Error fetching skills:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { key: 'all', label: 'All Skills', color: 'from-neon-blue to-neon-purple' },
    { key: 'frontend', label: 'Frontend', color: 'from-blue-500 to-cyan-500' },
    { key: 'backend', label: 'Backend', color: 'from-green-500 to-emerald-500' },
    { key: 'database', label: 'Database', color: 'from-orange-500 to-red-500' },
    { key: 'tools', label: 'Tools', color: 'from-purple-500 to-pink-500' },
    { key: 'other', label: 'Other', color: 'from-gray-500 to-slate-500' },
  ];

  const getSkillIcon = (skillName) => {
    const iconMap = {
      'JavaScript': '💛',
      'React.js': '⚛️',
      'HTML5': '🧡',
      'CSS3': '💙',
      'Tailwind CSS': '🌊',
      'Node.js': '💚',
      'Express.js': '🚂',
      'MySQL': '🗄️',
      'MongoDB': '🍃',
      'Git': '🔀',
      'VS Code': '📝',
      'Figma': '🎨',
    };
    return iconMap[skillName] || '⚡';
  };

  const getFilteredSkills = () => {
    if (selectedCategory === 'all') {
      return Object.entries(skillsData).reduce((acc, [category, skills]) => {
        acc[category] = skills;
        return acc;
      }, {});
    }
    return { [selectedCategory]: skillsData[selectedCategory] || [] };
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
              Skills & Technologies
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              My technical arsenal - constantly evolving and expanding with each project I tackle
            </p>
          </motion.div>

          {/* Category Filter */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-4 mb-12"
          >
            {categories.map((category) => (
              <button
                key={category.key}
                onClick={() => setSelectedCategory(category.key)}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  selectedCategory === category.key
                    ? `bg-gradient-to-r ${category.color} text-white shadow-lg scale-105`
                    : 'bg-dark-800/50 text-gray-400 hover:text-white hover:bg-dark-700/70 border border-game-primary/30'
                }`}
              >
                {category.label}
              </button>
            ))}
          </motion.div>

          {/* Skills Grid */}
          <div className="space-y-12">
            {Object.entries(getFilteredSkills()).map(([category, skills], categoryIndex) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: categoryIndex * 0.1 }}
                className="space-y-6"
              >
                {selectedCategory === 'all' && (
                  <div className="text-center">
                    <h2 className="text-2xl md:text-3xl font-bold font-game text-neon-blue capitalize mb-2">
                      {category} Skills
                    </h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-neon-blue to-neon-purple mx-auto rounded-full" />
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {skills.map((skill, skillIndex) => (
                    <motion.div
                      key={skill.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: (categoryIndex * 0.1) + (skillIndex * 0.05) }}
                    >
                      <Card hover glow className="skill-card">
                        <div className="flex items-center space-x-4 mb-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-game-primary to-game-secondary rounded-lg flex items-center justify-center text-2xl">
                            {skill.icon || getSkillIcon(skill.name)}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-white">
                              {skill.name}
                            </h3>
                            <p className="text-sm text-gray-400 capitalize">
                              {skill.category}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-neon-blue font-game">
                              {skill.level}%
                            </div>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="progress-bar mb-4">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${skill.level}%` }}
                            transition={{ 
                              duration: 1.5, 
                              delay: (categoryIndex * 0.1) + (skillIndex * 0.05) + 0.5,
                              ease: "easeOut"
                            }}
                            className="progress-fill"
                          />
                        </div>

                        {/* Skill Level Description */}
                        <div className="text-center">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            skill.level >= 80 
                              ? 'bg-green-500/20 text-green-400'
                              : skill.level >= 60
                              ? 'bg-yellow-500/20 text-yellow-400'
                              : skill.level >= 40
                              ? 'bg-orange-500/20 text-orange-400'
                              : 'bg-red-500/20 text-red-400'
                          }`}>
                            {skill.level >= 80 
                              ? 'Expert'
                              : skill.level >= 60
                              ? 'Proficient'
                              : skill.level >= 40
                              ? 'Intermediate'
                              : 'Beginner'
                            }
                          </span>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Skills Summary */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-20"
          >
            <Card className="text-center">
              <h3 className="text-2xl font-bold font-game text-gradient mb-4">
                Continuous Learning Journey
              </h3>
              <p className="text-gray-400 leading-relaxed mb-6">
                I believe in the power of continuous learning and staying updated with the latest technologies. 
                Every project is an opportunity to grow and improve my skills.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <div className="flex items-center space-x-2 text-neon-blue">
                  <span className="w-2 h-2 bg-neon-blue rounded-full animate-pulse" />
                  <span className="text-sm">Currently Learning: Next.js</span>
                </div>
                <div className="flex items-center space-x-2 text-neon-purple">
                  <span className="w-2 h-2 bg-neon-purple rounded-full animate-pulse" />
                  <span className="text-sm">Next Goal: TypeScript Master</span>
                </div>
                <div className="flex items-center space-x-2 text-neon-green">
                  <span className="w-2 h-2 bg-neon-green rounded-full animate-pulse" />
                  <span className="text-sm">Exploring: Mobile Development</span>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Skills;
