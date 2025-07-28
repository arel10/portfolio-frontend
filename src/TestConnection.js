import React, { useState, useEffect } from 'react';
import { profileAPI, projectAPI } from './services/api';

const TestConnection = () => {
  const [profileData, setProfileData] = useState(null);
  const [projectsData, setProjectsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const testAPI = async () => {
      try {
        console.log('🔄 Testing API connection...');
        
        const profileRes = await profileAPI.get();
        console.log('✅ Profile response:', profileRes.data);
        setProfileData(profileRes.data);
        
        const projectsRes = await projectAPI.getFeatured();
        console.log('✅ Projects response:', projectsRes.data);
        setProjectsData(projectsRes.data);
        
        setLoading(false);
      } catch (error) {
        console.error('❌ API Error:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    testAPI();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>API Connection Test</h1>
      
      <h2>Profile Data:</h2>
      <pre>{JSON.stringify(profileData, null, 2)}</pre>
      
      <h2>Projects Data:</h2>
      <pre>{JSON.stringify(projectsData, null, 2)}</pre>
    </div>
  );
};

export default TestConnection;
