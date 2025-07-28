import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { 
  FaCogs, 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaSave,
  FaTimes,
  // FaCode,
  // FaStar,
  // FaChartBar
} from 'react-icons/fa';
import Button from '../../components/UI/Button';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import api from '../../services/api';

const AdminSkills = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm();

  const watchLevel = watch('level', 1);

  const categories = [
    'Frontend',
    'Backend',
    'Database',
    'DevOps',
    'Mobile',
    'Design',
    'Tools',
    'Other'
  ];

  const skillLevels = [
    { value: 1, label: 'Beginner', color: 'text-red-400' },
    { value: 2, label: 'Basic', color: 'text-orange-400' },
    { value: 3, label: 'Intermediate', color: 'text-yellow-400' },
    { value: 4, label: 'Advanced', color: 'text-blue-400' },
    { value: 5, label: 'Expert', color: 'text-green-400' }
  ];

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      setLoading(true);
      const response = await api.get('/skills');
      setSkills(response.data.data || []);
    } catch (error) {
      console.error('Error fetching skills:', error);
      setSkills([]);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);
      
      let response;
      if (editingId) {
        response = await api.put(`/skills/${editingId}`, data);
        setSkills(skills.map(skill => 
          skill.id === editingId ? response.data : skill
        ));
      } else {
        response = await api.post('/skills', data);
        setSkills([...skills, response.data]);
      }
      
      resetForm();
      alert(editingId ? 'Skill updated successfully!' : 'Skill added successfully!');
    } catch (error) {
      console.error('Error saving skill:', error);
      alert('Error saving skill. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (skill) => {
    setEditingId(skill.id);
    setShowForm(true);
    
    // Populate form with skill data
    Object.keys(skill).forEach(key => {
      setValue(key, skill[key]);
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this skill?')) {
      return;
    }

    try {
      await api.delete(`/skills/${id}`);
      setSkills(skills.filter(skill => skill.id !== id));
      alert('Skill deleted successfully!');
    } catch (error) {
      console.error('Error deleting skill:', error);
      alert('Error deleting skill. Please try again.');
    }
  };

  const resetForm = () => {
    reset();
    setEditingId(null);
    setShowForm(false);
  };

  const filteredSkills = selectedCategory === 'all' 
    ? skills 
    : skills.filter(skill => skill.category === selectedCategory);

  const getSkillIcon = (category) => {
    const icons = {
      'Frontend': '🎨',
      'Backend': '⚙️',
      'Database': '🗄️',
      'DevOps': '🚀',
      'Mobile': '📱',
      'Design': '🎨',
      'Tools': '🔧',
      'Other': '💡'
    };
    return icons[category] || '💡';
  };

  const getLevelColor = (level) => {
    return skillLevels.find(l => l.value === level)?.color || 'text-gray-400';
  };

  const getLevelLabel = (level) => {
    return skillLevels.find(l => l.value === level)?.label || 'Unknown';
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
            <FaCogs className="mr-3 text-game-primary" />
            Skills Management
          </h1>
          <p className="text-gray-400">
            Manage your technical skills and expertise levels
          </p>
        </div>
        
        <Button
          onClick={() => setShowForm(!showForm)}
          variant="primary"
          className="flex items-center space-x-2"
        >
          <FaPlus />
          <span>Add Skill</span>
        </Button>
      </motion.div>

      {/* Category Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="game-card p-4"
      >
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedCategory === 'all'
                ? 'bg-game-primary text-white'
                : 'bg-dark-700 text-gray-400 hover:text-white hover:bg-dark-600'
            }`}
          >
            All Skills ({skills.length})
          </button>
          {categories.map(category => {
            const count = skills.filter(skill => skill.category === category).length;
            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2 ${
                  selectedCategory === category
                    ? 'bg-game-primary text-white'
                    : 'bg-dark-700 text-gray-400 hover:text-white hover:bg-dark-600'
                }`}
              >
                <span>{getSkillIcon(category)}</span>
                <span>{category} ({count})</span>
              </button>
            );
          })}
        </div>
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
                {editingId ? 'Edit Skill' : 'Add New Skill'}
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
                    Skill Name *
                  </label>
                  <input
                    {...register('name', { required: 'Skill name is required' })}
                    className="game-input w-full"
                    placeholder="React.js"
                  />
                  {errors.name && (
                    <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-white font-medium mb-2">
                    Category *
                  </label>
                  <select
                    {...register('category', { required: 'Category is required' })}
                    className="game-input w-full"
                  >
                    <option value="">Select category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {getSkillIcon(category)} {category}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="text-red-400 text-sm mt-1">{errors.category.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-white font-medium mb-2">
                  Skill Level: {getLevelLabel(parseInt(watchLevel))} *
                </label>
                <div className="space-y-3">
                  <input
                    type="range"
                    min="1"
                    max="5"
                    {...register('level', { required: 'Level is required' })}
                    className="w-full h-2 bg-dark-700 rounded-lg appearance-none slider"
                  />
                  <div className="flex justify-between text-sm">
                    {skillLevels.map(level => (
                      <span
                        key={level.value}
                        className={`${level.color} ${
                          parseInt(watchLevel) === level.value ? 'font-bold' : ''
                        }`}
                      >
                        {level.label}
                      </span>
                    ))}
                  </div>
                </div>
                {errors.level && (
                  <p className="text-red-400 text-sm mt-1">{errors.level.message}</p>
                )}
              </div>

              <div>
                <label className="block text-white font-medium mb-2">
                  Description
                </label>
                <textarea
                  {...register('description')}
                  rows={3}
                  className="game-input w-full resize-none"
                  placeholder="Brief description of your experience with this skill..."
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
                  <span>{submitting ? 'Saving...' : (editingId ? 'Update' : 'Add') + ' Skill'}</span>
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSkills.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="col-span-full game-card p-8 text-center"
          >
            <FaCogs className="text-4xl text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">
              {selectedCategory === 'all' ? 'No skills yet' : `No ${selectedCategory} skills`}
            </h3>
            <p className="text-gray-400 mb-4">
              Add your first skill to get started.
            </p>
            <Button
              onClick={() => setShowForm(true)}
              variant="primary"
              className="flex items-center space-x-2 mx-auto"
            >
              <FaPlus />
              <span>Add Skill</span>
            </Button>
          </motion.div>
        ) : (
          filteredSkills.map((skill, index) => (
            <motion.div
              key={skill.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="game-card p-4 hover:border-game-primary/50 transition-colors group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-game-primary to-game-secondary rounded-lg flex items-center justify-center text-lg">
                    {getSkillIcon(skill.category)}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-game-primary transition-colors">
                      {skill.name}
                    </h3>
                    <p className="text-gray-400 text-sm">{skill.category}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleEdit(skill)}
                    className="p-1.5 text-gray-400 hover:text-game-primary transition-colors"
                    title="Edit skill"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(skill.id)}
                    className="p-1.5 text-gray-400 hover:text-red-400 transition-colors"
                    title="Delete skill"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
              
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-sm font-medium ${getLevelColor(skill.level)}`}>
                    {getLevelLabel(skill.level)}
                  </span>
                  <span className="text-gray-400 text-xs">
                    {skill.level}/5
                  </span>
                </div>
                <div className="w-full bg-dark-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-game-primary to-game-secondary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(skill.level / 5) * 100}%` }}
                  />
                </div>
              </div>
              
              {skill.description && (
                <p className="text-gray-300 text-sm leading-relaxed">
                  {skill.description}
                </p>
              )}
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminSkills;
