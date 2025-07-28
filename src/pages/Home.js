import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaCode, 
  FaRocket, 
  FaGamepad, 
  FaDownload,
  FaArrowRight,
  FaGithub,
  FaLinkedin
} from 'react-icons/fa';
import Button from '../components/UI/Button';
import Card from '../components/UI/Card';
import { profileAPI, projectAPI } from '../services/api';

const Home = () => {
  const [profile, setProfile] = useState(null);
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [currentRole, setCurrentRole] = useState(0);

  const roles = [
    'Junior Developer',
    'Frontend Enthusiast', 
    'Backend Explorer',
    'Game UI Designer',
    'Problem Solver'
  ];

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => {
      setCurrentRole((prev) => (prev + 1) % roles.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      console.log('🔄 Fetching data from API...');
      
      // Fetch profile data with error handling
      try {
        const profileRes = await profileAPI.get();
        console.log('✅ Profile data:', profileRes.data);
        setProfile(profileRes.data.data);
      } catch (profileError) {
        if (profileError.response?.status === 404) {
          console.log('ℹ️ No profile data found, using default values');
          setProfile(null); // Will use default values in JSX
        } else {
          console.error('❌ Error fetching profile:', profileError);
        }
      }
      
      // Fetch projects data with error handling
      try {
        const projectsRes = await projectAPI.getFeatured();
        console.log('✅ Projects data:', projectsRes.data);
        setFeaturedProjects(projectsRes.data.data.slice(0, 3));
      } catch (projectsError) {
        console.error('❌ Error fetching projects:', projectsError);
        setFeaturedProjects([]); // Empty array if no projects
      }
      
      console.log('✅ Data fetch completed');
    } catch (error) {
      console.error('❌ Unexpected error fetching data:', error);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-20 h-20 border-2 border-neon-blue/30 rounded-lg animate-float" />
          <div className="absolute top-40 right-20 w-16 h-16 border-2 border-neon-purple/30 rounded-lg animate-float delay-1000" />
          <div className="absolute bottom-40 left-40 w-12 h-12 border-2 border-neon-pink/30 rounded-lg animate-float delay-2000" />
          <div className="absolute bottom-20 right-40 w-24 h-24 border-2 border-neon-green/30 rounded-lg animate-float delay-3000" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center space-x-2 text-neon-blue"
                >
                  <FaGamepad className="text-2xl animate-pulse" />
                  <span className="text-lg font-semibold">Welcome to my digital world</span>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-4xl md:text-6xl font-bold font-game"
                >
                  Hi, I'm{' '}
                  <span className="text-gradient">
                    {profile?.name || 'Afcha Arel Pratama'}
                  </span>
                </motion.h1>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-xl md:text-2xl text-gray-300 h-8"
                >
                  I'm a{' '}
                  <motion.span
                    key={currentRole}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="text-neon-blue font-semibold"
                  >
                    {roles[currentRole]}
                  </motion.span>
                </motion.div>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-lg text-gray-400 leading-relaxed max-w-lg"
                >
                  {profile?.bio || 
                    'Passionate about creating innovative digital solutions with modern web technologies and game-inspired user interfaces.'
                  }
                </motion.p>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-wrap gap-4"
              >
                <Link to="/projects">
                  <Button size="large" className="group">
                    <FaRocket className="mr-2 group-hover:animate-bounce" />
                    View My Work
                    <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                
                <Link to="/contact">
                  <Button variant="secondary" size="large">
                    <FaCode className="mr-2" />
                    Let's Connect
                  </Button>
                </Link>

                {profile?.resume_url && (
                  <a href={profile.resume_url} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="large">
                      <FaDownload className="mr-2" />
                      Download CV
                    </Button>
                  </a>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="flex items-center space-x-4"
              >
                <span className="text-gray-400">Follow me:</span>
                <div className="flex space-x-3">
                  <a
                    href="https://github.com/arel10"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 border border-game-primary/30 rounded-lg flex items-center justify-center text-gray-400 hover:text-neon-blue hover:border-game-primary hover:bg-game-primary/10 transition-all duration-300 hover:scale-110"
                  >
                    <FaGithub />
                  </a>
                  <a
                    href="https://www.linkedin.com/in/afcha-arel-pratama-472721310/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 border border-game-primary/30 rounded-lg flex items-center justify-center text-gray-400 hover:text-neon-blue hover:border-game-primary hover:bg-game-primary/10 transition-all duration-300 hover:scale-110"
                  >
                    <FaLinkedin />
                  </a>
                </div>
              </motion.div>
            </motion.div>

            {/* Avatar/Image */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex justify-center lg:justify-end"
            >
              <div className="relative">
                <div className="w-80 h-80 rounded-full bg-gradient-to-br from-game-primary to-game-secondary p-1 animate-pulse-slow">
                  <div className="w-full h-full rounded-full bg-dark-900 overflow-hidden">
                    {profile?.photo_url ? (
                      <img
                        src={profile.photo_url}
                        alt={profile.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-6xl font-bold text-gradient font-game">
                        AJ
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Floating Icons */}
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-neon-blue/20 rounded-full flex items-center justify-center animate-bounce-slow">
                  <FaCode className="text-2xl text-neon-blue" />
                </div>
                <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-neon-purple/20 rounded-full flex items-center justify-center animate-bounce-slow delay-1000">
                  <FaRocket className="text-2xl text-neon-purple" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-neon-blue rounded-full flex justify-center">
            <div className="w-1 h-3 bg-neon-blue rounded-full animate-bounce mt-2" />
          </div>
        </motion.div>
      </section>

      {/* Featured Projects Preview */}
      {featuredProjects.length > 0 && (
        <section className="py-20 relative">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold font-game text-gradient mb-4">
                Featured Projects
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Check out some of my latest work that showcases my skills and passion for development
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card hover glow className="h-full">
                    <div className="space-y-4">
                      {project.image_url && (
                        <div className="w-full h-48 bg-dark-700 rounded-lg overflow-hidden">
                          <img
                            src={project.image_url}
                            alt={project.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      
                      <div className="space-y-3">
                        <h3 className="text-xl font-bold text-neon-blue">
                          {project.title}
                        </h3>
                        <p className="text-gray-400 text-sm line-clamp-3">
                          {project.description}
                        </p>
                        
                        {project.tech_stack && Array.isArray(project.tech_stack) && (
                          <div className="flex flex-wrap gap-2">
                            {project.tech_stack.slice(0, 3).map((tech, techIndex) => (
                              <span
                                key={techIndex}
                                className="px-2 py-1 bg-game-primary/20 text-neon-blue text-xs rounded-full"
                              >
                                {tech}
                              </span>
                            ))}
                            {project.tech_stack.length > 3 && (
                              <span className="px-2 py-1 bg-gray-700 text-gray-400 text-xs rounded-full">
                                +{project.tech_stack.length - 3} more
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mt-12"
            >
              <Link to="/projects">
                <Button size="large">
                  View All Projects
                  <FaArrowRight className="ml-2" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>
      )}

      {/* Quick Stats */}
      <section className="py-20 bg-dark-800/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: 'Projects Completed', value: '10+', icon: FaRocket },
              { label: 'Technologies', value: '15+', icon: FaCode },
              { label: 'Years Learning', value: '2+', icon: FaGamepad },
              { label: 'Coffee Cups', value: '∞', icon: '☕' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-game-primary to-game-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  {typeof stat.icon === 'string' ? (
                    <span className="text-2xl">{stat.icon}</span>
                  ) : (
                    <stat.icon className="text-2xl text-white" />
                  )}
                </div>
                <div className="text-3xl font-bold text-neon-blue font-game mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-400 text-sm">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
