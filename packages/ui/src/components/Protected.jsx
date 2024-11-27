import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Protected({ children }) {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const verifySession = async () => {
      try {
        // Ping the `/verify` route to check session
        const response = await axios.post('/api/v1/auth/verify');
        if (response.status === 200) {
          setIsAuthenticated(true);
        }
      } catch (error) {
        // If error, extract error message from response
        if (error.response && error.response.data && error.response.data.data) {
          console.log(error.response.data.data.message);
        } else {
          console.log('An unexpected error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    verifySession();
  }, [navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? children : null; // Render children only if authenticated
}

export default Protected;