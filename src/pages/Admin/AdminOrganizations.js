import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { 
  FaUsers, 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaSave,
  FaTimes,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaExternalLinkAlt,
  FaBuilding,
  FaCertificate
} from 'react-icons/fa';
import Button from '../../components/UI/Button';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import api from '../../services/api';

const AdminOrganizations = () => {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    try {
      setLoading(true);
      const response = await api.get('/organizations');
      setOrganizations(response.data.data || []);
    } catch (error) {
      console.error('Error fetching organizations:', error);
      setOrganizations([]);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);
      
      // Generate duration from dates
      if (data.start_date) {
        const startYear = new Date(data.start_date).getFullYear();
        const endYear = data.end_date ? new Date(data.end_date).getFullYear() : 'Present';
        data.duration = `${startYear} - ${endYear}`;
      } else {
        data.duration = 'Unknown';
      }
      
      let response;
      if (editingId) {
        response = await api.put(`/organizations/${editingId}`, data);
        setOrganizations(organizations.map(org => 
          org.id === editingId ? response.data : org
        ));
      } else {
        response = await api.post('/organizations', data);
        setOrganizations([...organizations, response.data]);
      }
      
      resetForm();
      alert(editingId ? 'Organization updated successfully!' : 'Organization added successfully!');
    } catch (error) {
      console.error('Error saving organization:', error);
      alert('Error saving organization. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (organization) => {
    setEditingId(organization.id);
    setShowForm(true);
    
    // Populate form with organization data
    Object.keys(organization).forEach(key => {
      setValue(key, organization[key]);
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this organization?')) {
      return;
    }

    try {
      await api.delete(`/organizations/${id}`);
      setOrganizations(organizations.filter(org => org.id !== id));
      alert('Organization deleted successfully!');
    } catch (error) {
      console.error('Error deleting organization:', error);
      alert('Error deleting organization. Please try again.');
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
            <FaUsers className="mr-3 text-game-primary" />
            Organizations
          </h1>
          <p className="text-gray-400">
            Manage your organization memberships and affiliations
          </p>
        </div>
        
        <Button
          onClick={() => setShowForm(!showForm)}
          variant="primary"
          className="flex items-center space-x-2"
        >
          <FaPlus />
          <span>Add Organization</span>
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
                {editingId ? 'Edit Organization' : 'Add New Organization'}
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
                    Organization Name *
                  </label>
                  <input
                    {...register('name', { required: 'Organization name is required' })}
                    className="game-input w-full"
                    placeholder="Tech Organization"
                  />
                  {errors.name && (
                    <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-white font-medium mb-2">
                    Role/Position *
                  </label>
                  <input
                    {...register('position', { required: 'Role is required' })}
                    className="game-input w-full"
                    placeholder="Member, Volunteer, etc."
                  />
                  {errors.position && (
                    <p className="text-red-400 text-sm mt-1">{errors.position.message}</p>
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
                    Website
                  </label>
                  <input
                    type="url"
                    {...register('website')}
                    className="game-input w-full"
                    placeholder="https://organization.com"
                  />
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
                    Leave empty if still active
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
                  placeholder="Describe your involvement and achievements..."
                />
                {errors.description && (
                  <p className="text-red-400 text-sm mt-1">{errors.description.message}</p>
                )}
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
                  <span>{submitting ? 'Saving...' : (editingId ? 'Update' : 'Add') + ' Organization'}</span>
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Organizations List */}
      <div className="space-y-4">
        {organizations.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="game-card p-8 text-center"
          >
            <FaUsers className="text-4xl text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No organizations yet</h3>
            <p className="text-gray-400 mb-4">Add your first organization to get started.</p>
            <Button
              onClick={() => setShowForm(true)}
              variant="primary"
              className="flex items-center space-x-2 mx-auto"
            >
              <FaPlus />
              <span>Add Organization</span>
            </Button>
          </motion.div>
        ) : (
          organizations.map((organization, index) => (
            <motion.div
              key={organization.id}
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
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-bold text-white">
                          {organization.name}
                        </h3>
                        {organization.website && (
                          <a
                            href={organization.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-game-primary hover:text-game-secondary"
                          >
                            <FaExternalLinkAlt className="text-sm" />
                          </a>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-4 text-gray-400 mb-3">
                        <span className="flex items-center">
                          <FaCertificate className="mr-1" />
                          {organization.role}
                        </span>
                        {organization.location && (
                          <span className="flex items-center">
                            <FaMapMarkerAlt className="mr-1" />
                            {organization.location}
                          </span>
                        )}
                        <span className="flex items-center">
                          <FaCalendarAlt className="mr-1" />
                          {formatDate(organization.start_date)} - {formatDate(organization.end_date)}
                        </span>
                      </div>
                      
                      <p className="text-gray-300 leading-relaxed">
                        {organization.description}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => handleEdit(organization)}
                    className="p-2 text-gray-400 hover:text-game-primary transition-colors"
                    title="Edit organization"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(organization.id)}
                    className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                    title="Delete organization"
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

export default AdminOrganizations;
