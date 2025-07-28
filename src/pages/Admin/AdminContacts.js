import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaEnvelope, 
  FaTrash, 
  FaEye,
  FaReply,
  FaTimes,
  FaSearch,
  FaFilter,
  FaCalendarAlt,
  FaUser,
  FaPhone,
  FaExternalLinkAlt
} from 'react-icons/fa';
import Button from '../../components/UI/Button';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import api from '../../services/api';

const AdminContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/contact');
      setContacts(response.data.data || []);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      setContacts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) {
      return;
    }

    try {
      await api.delete(`/contacts/${id}`);
      setContacts(contacts.filter(contact => contact.id !== id));
      alert('Message deleted successfully!');
      
      if (selectedContact && selectedContact.id === id) {
        setShowDetails(false);
        setSelectedContact(null);
      }
    } catch (error) {
      console.error('Error deleting contact:', error);
      alert('Error deleting message. Please try again.');
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await api.put(`/contacts/${id}`, { is_read: true });
      setContacts(contacts.map(contact => 
        contact.id === id ? { ...contact, is_read: true } : contact
      ));
      
      if (selectedContact && selectedContact.id === id) {
        setSelectedContact({ ...selectedContact, is_read: true });
      }
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const handleViewDetails = async (contact) => {
    setSelectedContact(contact);
    setShowDetails(true);
    
    if (!contact.is_read) {
      await handleMarkAsRead(contact.id);
    }
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'unread' && !contact.is_read) ||
                         (statusFilter === 'read' && contact.is_read);
    
    return matchesSearch && matchesStatus;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getUnreadCount = () => {
    return contacts.filter(contact => !contact.is_read).length;
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
            <FaEnvelope className="mr-3 text-game-primary" />
            Contact Messages
            {getUnreadCount() > 0 && (
              <span className="ml-3 px-2 py-1 bg-red-500 text-white text-sm rounded-full">
                {getUnreadCount()} new
              </span>
            )}
          </h1>
          <p className="text-gray-400">
            Manage and respond to contact form submissions
          </p>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="game-card p-4"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search messages..."
              className="game-input pl-10 w-full"
            />
          </div>
          
          {/* Status Filter */}
          <div className="flex items-center space-x-4">
            <FaFilter className="text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="game-input"
            >
              <option value="all">All Messages ({contacts.length})</option>
              <option value="unread">Unread ({getUnreadCount()})</option>
              <option value="read">Read ({contacts.length - getUnreadCount()})</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Messages List */}
      <div className="space-y-4">
        {filteredContacts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="game-card p-8 text-center"
          >
            <FaEnvelope className="text-4xl text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">
              {searchTerm || statusFilter !== 'all' ? 'No messages found' : 'No messages yet'}
            </h3>
            <p className="text-gray-400">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria.'
                : 'Contact form submissions will appear here.'
              }
            </p>
          </motion.div>
        ) : (
          filteredContacts.map((contact, index) => (
            <motion.div
              key={contact.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`game-card p-4 hover:border-game-primary/50 transition-colors cursor-pointer ${
                !contact.is_read ? 'border-blue-500/50 bg-blue-500/5' : ''
              }`}
              onClick={() => handleViewDetails(contact)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    !contact.is_read 
                      ? 'bg-gradient-to-br from-blue-500 to-blue-600' 
                      : 'bg-gradient-to-br from-game-primary to-game-secondary'
                  }`}>
                    <FaUser className="text-white text-sm" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-1">
                      <h3 className={`font-semibold ${!contact.is_read ? 'text-white' : 'text-gray-300'}`}>
                        {contact.name}
                      </h3>
                      <span className="text-gray-400 text-sm">{contact.email}</span>
                      {!contact.is_read && (
                        <span className="px-2 py-1 bg-blue-500 text-white text-xs rounded-full">
                          New
                        </span>
                      )}
                    </div>
                    
                    <p className={`text-sm mb-2 truncate ${!contact.is_read ? 'text-gray-300' : 'text-gray-400'}`}>
                      {contact.message}
                    </p>
                    
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span className="flex items-center">
                        <FaCalendarAlt className="mr-1" />
                        {formatDate(contact.created_at)}
                      </span>
                      {contact.phone && (
                        <span className="flex items-center">
                          <FaPhone className="mr-1" />
                          {contact.phone}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewDetails(contact);
                    }}
                    className="p-2 text-gray-400 hover:text-game-primary transition-colors"
                    title="View details"
                  >
                    <FaEye />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(contact.id);
                    }}
                    className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                    title="Delete message"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Message Details Modal */}
      <AnimatePresence>
        {showDetails && selectedContact && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowDetails(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="game-card p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Message Details</h2>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <FaTimes />
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Contact Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">Name</label>
                    <p className="text-white font-medium">{selectedContact.name}</p>
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">Email</label>
                    <div className="flex items-center space-x-2">
                      <p className="text-white">{selectedContact.email}</p>
                      <a
                        href={`mailto:${selectedContact.email}`}
                        className="text-game-primary hover:text-game-secondary"
                        title="Send email"
                      >
                        <FaExternalLinkAlt className="text-sm" />
                      </a>
                    </div>
                  </div>
                  {selectedContact.phone && (
                    <div>
                      <label className="block text-gray-400 text-sm mb-1">Phone</label>
                      <p className="text-white">{selectedContact.phone}</p>
                    </div>
                  )}
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">Date</label>
                    <p className="text-white">{formatDate(selectedContact.created_at)}</p>
                  </div>
                </div>
                
                {/* Message */}
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Message</label>
                  <div className="bg-dark-700/50 rounded-lg p-4 border border-gray-600">
                    <p className="text-white leading-relaxed whitespace-pre-wrap">
                      {selectedContact.message}
                    </p>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex items-center justify-between pt-6 border-t border-gray-700">
                  <Button
                    onClick={() => setShowDetails(false)}
                    variant="secondary"
                  >
                    Close
                  </Button>
                  
                  <div className="flex space-x-3">
                    <a
                      href={`mailto:${selectedContact.email}?subject=Re: Contact from Portfolio&body=Hi ${selectedContact.name},%0D%0A%0D%0AThank you for reaching out!%0D%0A%0D%0A`}
                      className="flex items-center space-x-2 px-4 py-2 bg-game-primary text-white rounded-lg hover:bg-game-secondary transition-colors"
                    >
                      <FaReply />
                      <span>Reply</span>
                    </a>
                    
                    <Button
                      onClick={() => {
                        handleDelete(selectedContact.id);
                        setShowDetails(false);
                      }}
                      variant="danger"
                      className="flex items-center space-x-2"
                    >
                      <FaTrash />
                      <span>Delete</span>
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminContacts;
