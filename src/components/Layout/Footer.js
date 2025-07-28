import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaGithub, 
  FaLinkedin, 
  FaInstagram, 
  FaTwitter,
  FaHeart,
  FaRocket
} from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: FaGithub, href: 'https://github.com/arel10', label: 'GitHub' },
    { icon: FaLinkedin, href: 'https://www.linkedin.com/in/afcha-arel-pratama-472721310/', label: 'LinkedIn' },
    { icon: FaInstagram, href: 'https://instagram.com/afchaarel', label: 'Instagram' },
    { icon: FaTwitter, href: 'https://twitter.com/afchaarel', label: 'Twitter' },
  ];

  const quickLinks = [
    { to: '/', label: 'Home' },
    { to: '/profile', label: 'About' },
    { to: '/projects', label: 'Projects' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <footer className="relative mt-20 bg-dark-800/50 backdrop-blur-sm border-t border-game-primary/30">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-cyber-grid bg-[size:30px_30px] opacity-10" />
      
      <div className="relative container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-neon-blue to-neon-purple rounded-lg flex items-center justify-center">
                <span className="text-white font-bold font-game">A</span>
              </div>
              <span className="text-lg font-bold font-game text-gradient">
                Afcha Arel Pratama
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Junior Full-Stack Developer passionate about creating innovative digital solutions 
              with modern technologies and game-inspired design.
            </p>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <FaRocket className="text-neon-blue" />
              <span>Always learning, always building</span>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-semibold text-neon-blue font-game">
              Quick Links
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {quickLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-gray-400 hover:text-neon-blue transition-colors duration-300 text-sm"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-semibold text-neon-blue font-game">
              Connect With Me
            </h3>
            <div className="flex space-x-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-dark-700/50 border border-game-primary/30 rounded-lg flex items-center justify-center text-gray-400 hover:text-neon-blue hover:border-game-primary hover:bg-game-primary/10 transition-all duration-300 hover:scale-110"
                    aria-label={social.label}
                  >
                    <Icon />
                  </a>
                );
              })}
            </div>
            <div className="text-sm text-gray-400">
              <p>📧 afchaarelpratama@gmail.com</p>
              <p>📱 +62 838-9614-0885</p>
            </div>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-8 pt-8 border-t border-game-primary/20 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0"
        >
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <span>© {currentYear} Afcha Arel Pratama. Made with</span>
          </div>
          
          <div className="flex items-center space-x-4 text-sm text-gray-400">
            <span>Built with React & Tailwind CSS</span>
            <div className="flex space-x-2">
              <div className="w-2 h-2 bg-neon-blue rounded-full animate-pulse" />
              <div className="w-2 h-2 bg-neon-purple rounded-full animate-pulse delay-300" />
              <div className="w-2 h-2 bg-neon-pink rounded-full animate-pulse delay-600" />
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
