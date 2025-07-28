import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { 
  FaProjectDiagram, 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaSave,
  FaTimes,
  FaGithub,
  FaExternalLinkAlt,
  FaCode,
  FaImage,
  FaUpload,
  FaCalendarAlt
} from 'react-icons/fa';
import Button from '../../components/UI/Button';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import api from '../../services/api';

const AdminProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await api.get('/projects');
      setProjects(response.data.data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);
      
      let response;
      if (editingId) {
        response = await api.put(`/projects/${editingId}`, data);
        setProjects(projects.map(project => 
          project.id === editingId ? response.data : project
        ));
      } else {
        response = await api.post('/projects', data);
        setProjects([...projects, response.data]);
      }
      
      resetForm();
      alert(editingId ? 'Project updated successfully!' : 'Project added successfully!');
    } catch (error) {
      console.error('Error saving project:', error);
      alert('Error saving project. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (project) => {
    setEditingId(project.id);
    setShowForm(true);
    setImagePreview(project.image_url);
    
    // Populate form with project data
    Object.keys(project).forEach(key => {
      setValue(key, project[key]);
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) {
      return;
    }

    try {
      await api.delete(`/projects/${id}`);
      setProjects(projects.filter(project => project.id !== id));
      alert('Project deleted successfully!');
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Error deleting project. Please try again.');
    }
  };

  const resetForm = () => {
    reset();
    setEditingId(null);
    setShowForm(false);
    setImagePreview(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setValue('image_url', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
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
            <FaProjectDiagram className="mr-3 text-game-primary" />
            Projects
          </h1>
          <p className="text-gray-400">
            Manage your portfolio projects and showcases
          </p>
        </div>
        
        <Button
          onClick={() => setShowForm(!showForm)}
          variant="primary"
          className="flex items-center space-x-2"
        >
          <FaPlus />
          <span>Add Project</span>
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
                {editingId ? 'Edit Project' : 'Add New Project'}
              </h2>
              <button
                onClick={resetForm}
                className="text-gray-400 hover:text-white"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Project Image */}
              <div>
                <label className="block text-white font-medium mb-2">
                  Project Image
                </label>
                <div className="flex items-center space-x-4">
                  <div className="w-32 h-20 rounded-lg overflow-hidden bg-dark-700 flex items-center justify-center border-2 border-dashed border-gray-600">
                    {imagePreview ? (
                      <img 
                        src={imagePreview} 
                        alt="Project preview" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <FaImage className="text-gray-500 text-2xl" />
                    )}
                  </div>
                  <label className="flex items-center space-x-2 px-4 py-2 bg-game-primary/20 text-game-primary rounded-lg cursor-pointer hover:bg-game-primary/30 transition-colors">
                    <FaUpload />
                    <span>Upload Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white font-medium mb-2">
                    Project Title *
                  </label>
                  <input
                    {...register('title', { required: 'Project title is required' })}
                    className="game-input w-full"
                    placeholder="E-Commerce Website"
                  />
                  {errors.title && (
                    <p className="text-red-400 text-sm mt-1">{errors.title.message}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-white font-medium mb-2">
                    Category
                  </label>
                  <select
                    {...register('category')}
                    className="game-input w-full"
                  >
                    <option value="">Select category</option>
                    <option value="Web Development">Web Development</option>
                    <option value="Mobile App">Mobile App</option>
                    <option value="Desktop App">Desktop App</option>
                    <option value="API/Backend">API/Backend</option>
                    <option value="Game Development">Game Development</option>
                    <option value="Data Science">Data Science</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-white font-medium mb-2">
                    GitHub URL
                  </label>
                  <input
                    type="url"
                    {...register('github_url')}
                    className="game-input w-full"
                    placeholder="https://github.com/username/project"
                  />
                </div>
                
                <div>
                  <label className="block text-white font-medium mb-2">
                    Live Demo URL
                  </label>
                  <input
                    type="url"
                    {...register('demo_url')}
                    className="game-input w-full"
                    placeholder="https://project-demo.com"
                  />
                </div>
                
                <div>
                  <label className="block text-white font-medium mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    {...register('start_date')}
                    className="game-input w-full"
                  />
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
                  placeholder="Describe your project, its features, and your role..."
                />
                {errors.description && (
                  <p className="text-red-400 text-sm mt-1">{errors.description.message}</p>
                )}
              </div>

              <div>
                <label className="block text-white font-medium mb-2">
                  Technologies Used *
                </label>
                <input
                  {...register('technologies', { required: 'Technologies are required' })}
                  className="game-input w-full"
                  placeholder="React, Node.js, MongoDB, etc. (comma-separated)"
                />
                {errors.technologies && (
                  <p className="text-red-400 text-sm mt-1">{errors.technologies.message}</p>
                )}
              </div>

              <div>
                <label className="block text-white font-medium mb-2">
                  Key Features
                </label>
                <textarea
                  {...register('features')}
                  rows={3}
                  className="game-input w-full resize-none"
                  placeholder="• User authentication&#10;• Real-time messaging&#10;• Payment integration"
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
                  <span>{submitting ? 'Saving...' : (editingId ? 'Update' : 'Add') + ' Project'}</span>
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="col-span-full game-card p-8 text-center"
          >
            <FaProjectDiagram className="text-4xl text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No projects yet</h3>
            <p className="text-gray-400 mb-4">Add your first project to get started.</p>
            <Button
              onClick={() => setShowForm(true)}
              variant="primary"
              className="flex items-center space-x-2 mx-auto"
            >
              <FaPlus />
              <span>Add Project</span>
            </Button>
          </motion.div>
        ) : (
          projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="game-card p-0 overflow-hidden hover:border-game-primary/50 transition-colors group"
            >
              {/* Project Image */}
              <div className="w-full h-48 bg-dark-700 relative overflow-hidden">
                {project.image ? (
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FaCode className="text-4xl text-gray-500" />
                  </div>
                )}
                
                {/* Action Buttons Overlay */}
                <div className="absolute top-2 right-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleEdit(project)}
                    className="p-2 bg-black/70 text-white rounded-lg hover:bg-game-primary transition-colors"
                    title="Edit project"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="p-2 bg-black/70 text-white rounded-lg hover:bg-red-500 transition-colors"
                    title="Delete project"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
              
              {/* Project Info */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-bold text-white group-hover:text-game-primary transition-colors">
                    {project.title}
                  </h3>
                  {project.category && (
                    <span className="px-2 py-1 bg-game-primary/20 text-game-primary text-xs rounded-full">
                      {project.category}
                    </span>
                  )}
                </div>
                
                <p className="text-gray-400 text-sm mb-3 line-clamp-2">
                  {project.description}
                </p>
                
                {/* Technologies */}
                {project.technologies && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {project.technologies.split(',').slice(0, 3).map((tech, techIndex) => (
                      <span
                        key={techIndex}
                        className="px-2 py-1 bg-dark-700 text-gray-300 text-xs rounded border border-gray-600"
                      >
                        {tech.trim()}
                      </span>
                    ))}
                    {project.technologies.split(',').length > 3 && (
                      <span className="px-2 py-1 bg-dark-700 text-gray-300 text-xs rounded border border-gray-600">
                        +{project.technologies.split(',').length - 3}
                      </span>
                    )}
                  </div>
                )}
                
                {/* Project Links */}
                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    {project.github_url && (
                      <a
                        href={project.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-gray-400 hover:text-white transition-colors"
                        title="View source code"
                      >
                        <FaGithub />
                      </a>
                    )}
                    {project.demo_url && (
                      <a
                        href={project.demo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-gray-400 hover:text-game-primary transition-colors"
                        title="View live demo"
                      >
                        <FaExternalLinkAlt />
                      </a>
                    )}
                  </div>
                  
                  {project.start_date && (
                    <span className="text-gray-500 text-xs">
                      {formatDate(project.start_date)}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminProjects;
