import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { 
  FaUser, 
  FaSave, 
  FaEdit, 
  FaImage,
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaInstagram,
  FaGlobe,
  FaUpload
} from 'react-icons/fa';
import Button from '../../components/UI/Button';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import api from '../../services/api';

const AdminProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get('/profile');
      if (response.data.data) {
        setProfile(response.data.data);
        reset(response.data.data);
        setAvatarPreview(response.data.data.photo_url);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      // If no profile exists, enable editing mode
      setIsEditing(true);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setSubmitting(true);
      
      let response;
      if (profile) {
        // Backend profile endpoint uses PUT /profile (not /profile/:id)
        response = await api.put('/profile', data);
      } else {
        response = await api.post('/profile', data);
      }
      
      setProfile(response.data.data);
      setIsEditing(false);
      
      // Show success message (you can implement toast notifications)
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
        setValue('photo_url', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-white mb-2 flex items-center">
            <FaUser className="mr-3 text-game-primary" />
            Profile Management
          </h1>
          <p className="text-gray-400">
            Update your personal information and social links
          </p>
        </div>
        
        {!isEditing && profile && (
          <Button
            onClick={() => setIsEditing(true)}
            variant="primary"
            className="flex items-center space-x-2"
          >
            <FaEdit />
            <span>Edit Profile</span>
          </Button>
        )}
      </motion.div>

      {/* Profile Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="game-card p-6"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Avatar Section */}
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-game-primary to-game-secondary flex items-center justify-center">
                {avatarPreview ? (
                  <img 
                    src={avatarPreview} 
                    alt="Avatar" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FaUser className="text-white text-4xl" />
                )}
              </div>
              
              {isEditing && (
                <label className="absolute bottom-0 right-0 w-10 h-10 bg-game-primary rounded-full flex items-center justify-center cursor-pointer hover:bg-game-secondary transition-colors">
                  <FaUpload className="text-white text-sm" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-2">Profile Picture</h3>
              <p className="text-gray-400 text-sm">
                Upload a professional photo. Recommended size: 400x400px
              </p>
            </div>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-white font-medium mb-2">
                Full Name *
              </label>
              <input
                {...register('name', { required: 'Name is required' })}
                disabled={!isEditing}
                className="game-input w-full"
                placeholder="Your full name"
              />
              {errors.name && (
                <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-white font-medium mb-2">
                Title *
              </label>
              <input
                {...register('title', { required: 'Title is required' })}
                disabled={!isEditing}
                className="game-input w-full"
                placeholder="e.g., Junior Programmer"
              />
              {errors.title && (
                <p className="text-red-400 text-sm mt-1">{errors.title.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-white font-medium mb-2">
                Email *
              </label>
              <input
                type="email"
                {...register('email', { 
                  required: 'Email is required',
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: 'Invalid email address'
                  }
                })}
                disabled={!isEditing}
                className="game-input w-full"
                placeholder="your.email@example.com"
              />
              {errors.email && (
                <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>
            
            <div>
              <label className="block text-white font-medium mb-2">
                Phone
              </label>
              <input
                {...register('phone')}
                disabled={!isEditing}
                className="game-input w-full"
                placeholder="+1 (555) 123-4567"
              />
            </div>
            
            <div>
              <label className="block text-white font-medium mb-2">
                Location
              </label>
              <input
                {...register('location')}
                disabled={!isEditing}
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
                disabled={!isEditing}
                className="game-input w-full"
                placeholder="https://yourwebsite.com"
              />
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-white font-medium mb-2">
              Bio *
            </label>
            <textarea
              {...register('bio', { required: 'Bio is required' })}
              disabled={!isEditing}
              rows={4}
              className="game-input w-full resize-none"
              placeholder="Tell us about yourself..."
            />
            {errors.bio && (
              <p className="text-red-400 text-sm mt-1">{errors.bio.message}</p>
            )}
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <FaGlobe className="mr-2 text-game-primary" />
              Social Links
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <FaGithub className="text-gray-400 text-xl" />
                <input
                  {...register('github')}
                  disabled={!isEditing}
                  className="game-input flex-1"
                  placeholder="GitHub username"
                />
              </div>
              
              <div className="flex items-center space-x-3">
                <FaLinkedin className="text-blue-400 text-xl" />
                <input
                  {...register('linkedin')}
                  disabled={!isEditing}
                  className="game-input flex-1"
                  placeholder="LinkedIn profile URL"
                />
              </div>
              
              <div className="flex items-center space-x-3">
                <FaTwitter className="text-blue-400 text-xl" />
                <input
                  {...register('twitter')}
                  disabled={!isEditing}
                  className="game-input flex-1"
                  placeholder="Twitter username"
                />
              </div>
              
              <div className="flex items-center space-x-3">
                <FaInstagram className="text-pink-400 text-xl" />
                <input
                  {...register('instagram')}
                  disabled={!isEditing}
                  className="game-input flex-1"
                  placeholder="Instagram username"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {isEditing && (
            <div className="flex items-center justify-between pt-6 border-t border-gray-700">
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setIsEditing(false);
                  reset(profile);
                  setAvatarPreview(profile?.avatar);
                }}
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
                <span>{submitting ? 'Saving...' : 'Save Profile'}</span>
              </Button>
            </div>
          )}
        </form>
      </motion.div>
    </div>
  );
};

export default AdminProfile;
