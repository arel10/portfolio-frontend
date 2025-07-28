import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaExternalLinkAlt, FaCode, FaStar, FaFilter } from 'react-icons/fa';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import { projectAPI } from '../services/api';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await projectAPI.getAll();
      setProjects(response.data.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const filters = [
    { key: 'all', label: 'All Projects' },
    { key: 'featured', label: 'Featured' },
    { key: 'completed', label: 'Completed' },
    { key: 'in-progress', label: 'In Progress' },
  ];

  const getFilteredProjects = () => {
    switch (filter) {
      case 'featured':
        return projects.filter(project => project.featured);
      case 'completed':
        return projects.filter(project => project.status === 'completed');
      case 'in-progress':
        return projects.filter(project => project.status === 'in-progress');
      default:
        return projects;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-400';
      case 'in-progress':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'planned':
        return 'bg-blue-500/20 text-blue-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return '✅';
      case 'in-progress':
        return '🔄';
      case 'planned':
        return '📋';
      default:
        return '❓';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  const filteredProjects = getFilteredProjects();

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
              My Projects
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              A collection of projects that showcase my journey as a developer, 
              from simple websites to complex web applications
            </p>
          </motion.div>

          {/* Filter Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-4 mb-12"
          >
            <div className="flex items-center space-x-2 text-neon-blue mb-4 md:mb-0">
              <FaFilter />
              <span className="font-semibold">Filter:</span>
            </div>
            {filters.map((filterOption) => (
              <button
                key={filterOption.key}
                onClick={() => setFilter(filterOption.key)}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  filter === filterOption.key
                    ? 'bg-gradient-to-r from-game-primary to-game-secondary text-white shadow-lg scale-105'
                    : 'bg-dark-800/50 text-gray-400 hover:text-white hover:bg-dark-700/70 border border-game-primary/30'
                }`}
              >
                {filterOption.label}
              </button>
            ))}
          </motion.div>

          {/* Projects Grid */}
          {filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="project-card"
                >
                  <Card hover glow className="h-full flex flex-col">
                    {/* Project Image */}
                    {project.image_url && (
                      <div className="w-full h-48 bg-dark-700 rounded-lg overflow-hidden mb-6 project-image">
                        <img
                          src={project.image_url}
                          alt={project.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    {/* Project Info */}
                    <div className="flex-1 space-y-4">
                      <div className="flex items-start justify-between">
                        <h3 className="text-xl font-bold text-white group-hover:text-neon-blue transition-colors">
                          {project.title}
                        </h3>
                        <div className="flex items-center space-x-2">
                          {project.featured && (
                            <div className="w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                              <FaStar className="text-white text-xs" />
                            </div>
                          )}
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold flex items-center space-x-1 ${getStatusColor(project.status)}`}>
                            <span>{getStatusIcon(project.status)}</span>
                            <span className="capitalize">{project.status}</span>
                          </span>
                        </div>
                      </div>

                      <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">
                        {project.description}
                      </p>

                      {/* Tech Stack */}
                      {project.tech_stack && Array.isArray(project.tech_stack) && project.tech_stack.length > 0 && (
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2 text-neon-blue">
                            <FaCode className="text-sm" />
                            <span className="text-sm font-semibold">Tech Stack:</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {project.tech_stack.map((tech, techIndex) => (
                              <span
                                key={techIndex}
                                className="px-2 py-1 bg-game-primary/20 text-neon-blue text-xs rounded-full font-medium"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Project Links */}
                    <div className="flex space-x-3 mt-6 pt-4 border-t border-game-primary/20">
                      {project.github_link && (
                        <a
                          href={project.github_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1"
                        >
                          <Button variant="outline" size="small" className="w-full">
                            <FaGithub className="mr-2" />
                            Code
                          </Button>
                        </a>
                      )}
                      {project.live_demo && (
                        <a
                          href={project.live_demo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1"
                        >
                          <Button size="small" className="w-full">
                            <FaExternalLinkAlt className="mr-2" />
                            Demo
                          </Button>
                        </a>
                      )}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="w-24 h-24 bg-dark-700 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaCode className="text-3xl text-gray-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-400 mb-4">
                No projects found
              </h3>
              <p className="text-gray-500">
                Try changing the filter or check back later for new projects.
              </p>
            </motion.div>
          )}

          {/* Stats Section */}
          {projects.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-20"
            >
              <Card className="text-center">
                <h3 className="text-2xl font-bold font-game text-gradient mb-6">
                  Project Statistics
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="space-y-2">
                    <div className="text-3xl font-bold text-neon-blue font-game">
                      {projects.length}
                    </div>
                    <div className="text-gray-400 text-sm">Total Projects</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-3xl font-bold text-neon-green font-game">
                      {projects.filter(p => p.status === 'completed').length}
                    </div>
                    <div className="text-gray-400 text-sm">Completed</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-3xl font-bold text-neon-yellow font-game">
                      {projects.filter(p => p.status === 'in-progress').length}
                    </div>
                    <div className="text-gray-400 text-sm">In Progress</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-3xl font-bold text-neon-purple font-game">
                      {projects.filter(p => p.featured).length}
                    </div>
                    <div className="text-gray-400 text-sm">Featured</div>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Projects;
