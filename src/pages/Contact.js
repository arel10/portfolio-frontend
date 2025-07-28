import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import { 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt, 
  FaGithub, 
  FaLinkedin, 
  FaInstagram, 
  FaTwitter,
  FaPaperPlane,
  FaRocket
} from 'react-icons/fa';
import Card from '../components/UI/Card';
import Input from '../components/UI/Input';
import TextArea from '../components/UI/TextArea';
import Button from '../components/UI/Button';
import { contactAPI } from '../services/api';

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const contactInfo = [
    {
      icon: FaEnvelope,
      label: 'Email',
      value: 'afchaarelpratama@gmail.com',
      href: 'mailto:afchaarelpratama@gmail.com',
      color: 'text-neon-blue'
    },
    {
      icon: FaPhone,
      label: 'Phone',
      value: '+62 838-9614-0885',
      href: 'tel:+6283896140885',
      color: 'text-neon-green'
    },
    {
      icon: FaMapMarkerAlt,
      label: 'Location',
      value: 'Padang, Indonesia',
      href: null,
      color: 'text-neon-purple'
    }
  ];

  const socialLinks = [
    { icon: FaGithub, href: 'https://github.com', label: 'GitHub', color: 'hover:text-gray-400' },
    { icon: FaLinkedin, href: 'https://linkedin.com', label: 'LinkedIn', color: 'hover:text-blue-400' },
    { icon: FaInstagram, href: 'https://instagram.com', label: 'Instagram', color: 'hover:text-pink-400' },
    { icon: FaTwitter, href: 'https://twitter.com', label: 'Twitter', color: 'hover:text-blue-400' },
  ];

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await contactAPI.send(data);
      toast.success(response.data.message || 'Message sent successfully!');
      reset();
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to send message. Please try again.';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

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
              Let's Connect
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Ready to bring your ideas to life? Let's discuss your next project and create something amazing together!
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card glow className="relative overflow-hidden">
                {/* Animated Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-game-primary/5 to-game-secondary/5" />
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-blue via-neon-purple to-neon-pink" />
                
                <div className="relative z-10">
                  <div className="flex items-center space-x-3 mb-8">
                    <div className="w-12 h-12 bg-gradient-to-br from-game-primary to-game-secondary rounded-lg flex items-center justify-center">
                      <FaPaperPlane className="text-white text-xl" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold font-game text-gradient">
                        Send a Message
                      </h2>
                      <p className="text-gray-400 text-sm">
                        I'll get back to you within 24 hours
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit(onSubmit)} className="contact-form">
                    <Input
                      label="Your Name"
                      placeholder="Enter your full name"
                      {...register('name', { 
                        required: 'Name is required',
                        minLength: { value: 2, message: 'Name must be at least 2 characters' }
                      })}
                      error={errors.name?.message}
                    />

                    <Input
                      label="Email Address"
                      type="email"
                      placeholder="your.email@example.com"
                      {...register('email', { 
                        required: 'Email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Please enter a valid email address'
                        }
                      })}
                      error={errors.email?.message}
                    />

                    <TextArea
                      label="Your Message"
                      rows={6}
                      placeholder="Tell me about your project, ideas, or just say hello!"
                      {...register('message', { 
                        required: 'Message is required',
                        minLength: { value: 10, message: 'Message must be at least 10 characters' }
                      })}
                      error={errors.message?.message}
                    />

                    <Button
                      type="submit"
                      size="large"
                      loading={isSubmitting}
                      className="w-full group"
                    >
                      {isSubmitting ? (
                        'Sending Message...'
                      ) : (
                        <>
                          <FaRocket className="mr-2 group-hover:animate-bounce" />
                          Launch Message
                          <FaPaperPlane className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </Button>
                  </form>
                </div>
              </Card>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-8"
            >
              {/* Contact Details */}
              <Card>
                <h3 className="text-2xl font-bold font-game text-neon-blue mb-6">
                  Get in Touch
                </h3>
                <div className="space-y-6">
                  {contactInfo.map((info, index) => {
                    const Icon = info.icon;
                    const content = (
                      <div className="flex items-center space-x-4 p-4 rounded-lg hover:bg-dark-700/50 transition-colors duration-300">
                        <div className={`w-12 h-12 bg-dark-700 rounded-lg flex items-center justify-center ${info.color}`}>
                          <Icon className="text-xl" />
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-400 text-sm">{info.label}</p>
                          <p className="text-white font-semibold">{info.value}</p>
                        </div>
                      </div>
                    );

                    return info.href ? (
                      <motion.a
                        key={index}
                        href={info.href}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                        className="block"
                      >
                        {content}
                      </motion.a>
                    ) : (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                      >
                        {content}
                      </motion.div>
                    );
                  })}
                </div>
              </Card>

              {/* Social Media */}
              <Card>
                <h3 className="text-2xl font-bold font-game text-neon-purple mb-6">
                  Social Media
                </h3>
                <p className="text-gray-400 mb-6">
                  Connect with me on social media for updates and behind-the-scenes content
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {socialLinks.map((social, index) => {
                    const Icon = social.icon;
                    return (
                      <motion.a
                        key={index}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.8 + index * 0.1 }}
                        className={`flex items-center space-x-3 p-4 bg-dark-700/50 rounded-lg hover:bg-dark-700 transition-all duration-300 hover:scale-105 ${social.color}`}
                      >
                        <Icon className="text-xl" />
                        <span className="font-semibold">{social.label}</span>
                      </motion.a>
                    );
                  })}
                </div>
              </Card>

              {/* Availability Status */}
              <Card>
                <div className="flex items-center space-x-4">
                  <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse" />
                  <div>
                    <h4 className="text-lg font-bold text-white">Available for Work</h4>
                    <p className="text-gray-400 text-sm">
                      I'm currently available for freelance projects and full-time opportunities
                    </p>
                  </div>
                </div>
              </Card>

              {/* Response Time */}
              <Card className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-neon-blue to-neon-purple rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">⚡</span>
                </div>
                <h4 className="text-lg font-bold text-white mb-2">Quick Response</h4>
                <p className="text-gray-400 text-sm">
                  Average response time: 2-4 hours during business days
                </p>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
