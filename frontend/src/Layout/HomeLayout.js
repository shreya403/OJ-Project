// components/HomeLayout.js

import React from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/dashboard/Navbar';
import backgroundImage from './ode.png';

const HomeLayout = ({ currentPage, handleLogout, navigate, children }) => {
  const location = useLocation();
  const isHomePage = location.pathname === '/'; // Check if it's the home page
  const user = useSelector((state) => state.Auth.user);
  const userName = user?.name || 'Coder'; // Fallback name if user is not logged in
  const googleUser = JSON.parse(localStorage.getItem('user'));
  
  // Determine the welcome message based on the presence of googleUser
  const welcomeMessage = googleUser ? `Welcome, ${googleUser.displayName}` : `Welcome, ${userName}`;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { delay: 0.3, duration: 0.6 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { delay: 0.3, duration: 0.6 } },
  };

  return (
    <>
      <Navbar currentPage={currentPage} handleSignOut={handleLogout} navigate={navigate} />
      
      {isHomePage && (
        <motion.div
          className="home-container"
          style={{
            backgroundImage: `url(${backgroundImage})`, // Add your background image URL here
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            color: 'white',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <div className="max-w-4xl mx-auto px-4 py-8 text-center">
            <motion.div className="welcome-section bg-gray-900 bg-opacity-50 rounded-lg shadow-lg p-6 mb-6" variants={cardVariants}>
              <h2 className="text-5xl font-bold mb-4">{welcomeMessage}</h2>
              <p className="text-xl mb-6">Make it work, make it right, make it fast</p>
              <button className="practice-btn bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" onClick={() => navigate('/get-problem')}>Practice</button>
              {user && user.role === 'admin' && (
                <button className="admin-btn bg-blue-700 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded ml-2" onClick={() => navigate('/admin')}>Go To Admin</button>
              )}
            </motion.div>
          </div>
        </motion.div>
      )}

      {/* Render children for dynamic content */}
      {children}
    </>
  );
};

export default HomeLayout;