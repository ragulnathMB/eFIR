import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create the Auth Context
const AuthContext = createContext();

// AuthProvider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Stores the authenticated user's data
  const [loading, setLoading] = useState(true); // Indicates whether user data is being loaded

  const fetchUser = async () => {
    try {
      const response = await axios.get('http://localhost:5000/protected', { withCredentials: true });
      setUser(response.data);
      console.log(response.data);
      console.log('user set');
    } catch (error) {
      setUser(null); // Clear user data if not authenticated
    } finally {
      setLoading(false); // Set loading to false after fetching user data
    }
  };
  useEffect(() => {
    // Automatically fetch authenticated user data when the component mounts
    fetchUser();
  }, []);
  

  // Login function
  const login = async (credentials) => {
    try {
      console.log(credentials);
      const response = await axios.post('http://localhost:5000/admin/login', credentials, { withCredentials: true });
      await fetchUser();
      return response.data.role; // Save the logged-in user data
    } catch (error) {
      console.error('Login error:', error.response?.data?.message || error.message);
      throw error; // Rethrow the error for the calling component to handle
    }
  };
  const userlogin = async (credentials) => {
    try {
      console.log(credentials);
      const response = await axios.post('http://localhost:5000/login', credentials, { withCredentials: true });
      await fetchUser();
      return response.data.role; // Save the logged-in user data
    } catch (error) {
      console.error('Login error:', error.response?.data?.message || error.message);
      throw error; // Rethrow the error for the calling component to handle
    }
  };

  // Register function
  const register = async (data) => {
    try {
      const response = await axios.post('http://localhost:5000/register', data, { withCredentials: true });
      console.log(response);
      await fetchUser(); // Save the registered user data
    } catch (error) {
      console.error('Register error:', error.response?.data?.message || error.message);
      throw error; // Rethrow the error for the calling component to handle
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await axios.post('http://localhost:5000/logout', {}, { withCredentials: true });
      setUser(null); // Clear the user data
    } catch (error) {
      console.error('Logout error:', error.response?.data?.message || error.message);
      throw error; // Rethrow the error for the calling component to handle
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Show a loading state while user data is being fetched
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout,userlogin }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the Auth Context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
