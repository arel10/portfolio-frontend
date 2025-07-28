import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { 
  FaBriefcase, 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaSave,
  FaTimes,
  FaCalendarAlt,
  FaBuilding,
  FaMapMarkerAlt,
  FaExternalLinkAlt
} from 'react-icons/fa';
import Button from '../../components/UI/Button';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import api from '../../services/api';

const AdminExperiences = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      setLoading(true);
      const response = await api.get('/experiences');
      setExperiences(response.data.data || []);
    } catch (error) {
      console.error('Error fetching experiences:', error);
      setExperiences([]);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);
      
      let response;
      if (editingId) {
        response = await api.put(`/experiences/${editingId}`, data);
        setExperiences(experiences.map(exp => 
          exp.id === editingId ? response.data : exp
        ));
      } else {
        response = await api.post('/experiences', data);
        setExperiences([...experiences, response.data]);
      }
      
      resetForm();
      alert(editingId ? 'Experience updated successfully!' : 'Experience added successfully!');
    } catch (error) {
      console.error('Error saving experience:', error);
      alert('Error saving experience. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (experience) => {
    setEditingId(experience.id);
    setShowForm(true);
    
    // Populate form with experience data
    Object.keys(experience).forEach(key => {
      setValue(key, experience[key]);
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this experience?')) {
      return;
    }

    try {
      await api.delete(`/experiences/${id}`);
      setExperiences(experiences.filter(exp => exp.id !== id));
      alert('Experience deleted successfully!');
    } catch (error) {
      console.error('Error deleting experience:', error);
      alert('Error deleting experience. Please try again.');
    }
  };

  const resetForm = () => {
    reset();
    setEditingId(null);
    setShowForm(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Present';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-white mb-2 flex items-center">
            <FaBriefcase className="mr-3 text-game-primary" />
            Work Experience
          </h1>
          <p className="text-gray-400">
            Manage your professional work experience
          </p>
        </div>
        
        <Button
          onClick={() => setShowForm(!showForm)}
          variant="primary"
          className="flex items-center space-x-2"
        >
          <FaPlus />
          <span>Add Experience</span>
        </Button>
      </motion.div>

      {/* Add/Edit Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="game-card p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">
                {editingId ? 'Edit Experience' : 'Add New Experience'}
              </h2>
              <button
                onClick={resetForm}
                className="text-gray-400 hover:text-white"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white font-medium mb-2">
                    Job Title *
                  </label>
                  <input
                    {...register('role', { required: 'Job title is required' })}
                    className="game-input w-full"
                    placeholder="Software Developer"
                  />
                  {errors.role && (
                    <p className="text-red-400 text-sm mt-1">{errors.role.message}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-white font-medium mb-2">
                    Company *
                  </label>
                  <input
                    {...register('company_name', { required: 'Company is required' })}
                    className="game-input w-full"
                    placeholder="Tech Company Inc."
                  />
                  {errors.company_name && (
                    <p className="text-red-400 text-sm mt-1">{errors.company_name.message}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-white font-medium mb-2">
                    Location
                  </label>
                  <input
                    {...register('location')}
                    className="game-input w-full"
                    placeholder="City, Country"
                  />
                </div>
                
                <div>
                  <label className="block text-white font-medium mb-2">
                    Employment Type
                  </label>
                  <select
                    {...register('employment_type')}
                    className="game-input w-full"
                  >
                    <option value="">Select type</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Freelance">Freelance</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-white font-medium mb-2">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    {...register('start_date', { required: 'Start date is required' })}
                    className="game-input w-full"
                  />
                  {errors.start_date && (
                    <p className="text-red-400 text-sm mt-1">{errors.start_date.message}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-white font-medium mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    {...register('end_date')}
                    className="game-input w-full"
                  />
                  <p className="text-gray-400 text-xs mt-1">
                    Leave empty if currently working
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-white font-medium mb-2">
                  Description *
                </label>
                <textarea
                  {...register('description', { required: 'Description is required' })}
                  rows={4}
                  className="game-input w-full resize-none"
                  placeholder="Describe your role and responsibilities..."
                />
                {errors.description && (
                  <p className="text-red-400 text-sm mt-1">{errors.description.message}</p>
                )}
              </div>

              <div>
                <label className="block text-white font-medium mb-2">
                  Technologies Used
                </label>
                <input
                  {...register('technologies')}
                  className="game-input w-full"
                  placeholder="React, Node.js, MongoDB, etc. (comma-separated)"
                />
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-gray-700">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={resetForm}
                >
                  Cancel
                </Button>
                
                <Button
                  type="submit"
                  variant="primary"
                  disabled={submitting}
                  className="flex items-center space-x-2"
                >
                  {submitting ? (
                    <LoadingSpinner size="small" />
                  ) : (
                    <FaSave />
                  )}
                  <span>{submitting ? 'Saving...' : (editingId ? 'Update' : 'Add') + ' Experience'}</span>
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Experiences List */}
      <div className="space-y-4">
        {experiences.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="game-card p-8 text-center"
          >
            <FaBriefcase className="text-4xl text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No experiences yet</h3>
            <p className="text-gray-400 mb-4">Add your first work experience to get started.</p>
            <Button
              onClick={() => setShowForm(true)}
              variant="primary"
              className="flex items-center space-x-2 mx-auto"
            >
              <FaPlus />
              <span>Add Experience</span>
            </Button>
          </motion.div>
        ) : (
          experiences.map((experience, index) => (
            <motion.div
              key={experience.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="game-card p-6 hover:border-game-primary/50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-game-primary to-game-secondary rounded-lg flex items-center justify-center">
                      <FaBuilding className="text-white text-xl" />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-1">
                        {experience.title}
                      </h3>
                      <div className="flex items-center space-x-4 text-gray-400 mb-3">
                        <span className="flex items-center">
                          <FaBuilding className="mr-1" />
                          {experience.company}
                        </span>
                        {experience.location && (
                          <span className="flex items-center">
                            <FaMapMarkerAlt className="mr-1" />
                            {experience.location}
                          </span>
                        )}
                        <span className="flex items-center">
                          <FaCalendarAlt className="mr-1" />
                          {formatDate(experience.start_date)} - {formatDate(experience.end_date)}
                        </span>
                      </div>
                      
                      {experience.employment_type && (
                        <span className="inline-block px-3 py-1 bg-game-primary/20 text-game-primary text-sm rounded-full mb-3">
                          {experience.employment_type}
                        </span>
                      )}
                      
                      <p className="text-gray-300 mb-4 leading-relaxed">
                        {experience.description}
                      </p>
                      
                      {experience.technologies && (
                        <div className="flex flex-wrap gap-2">
                          {experience.technologies.split(',').map((tech, techIndex) => (
                            <span
                              key={techIndex}
                              className="px-2 py-1 bg-dark-700 text-gray-300 text-xs rounded border border-gray-600"
                            >
                              {tech.trim()}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => handleEdit(experience)}
                    className="p-2 text-gray-400 hover:text-game-primary transition-colors"
                    title="Edit experience"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(experience.id)}
                    className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                    title="Delete experience"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminExperiences;
