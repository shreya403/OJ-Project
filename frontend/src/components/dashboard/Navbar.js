import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaAngleDown, FaPlus, FaEdit, FaBook, FaTrophy, FaBlog, FaClipboardList } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import logo from '../dashboard/Logo.png';
import { Logout } from '../../redux/AuthSlice';
import { toast } from 'react-toastify';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';
import { post } from '../../services/apiEndpoint';
import './Navbar.css';

const Navbar = ({ currentPage }) => {
  const user = useSelector(state => state.Auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleSignOut = async () => {
    try {
      const response = await post('/api/auth/logout');
      await signOut(auth);
      if (response.status === 200) {
        dispatch(Logout());
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('email'); 
        navigate('/login');
        toast.success('Successfully logged out');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdate = () => {
    navigate('/update-problem');
  };

  return (
    <nav className="bg-gradient-to-r from-gray-900 to-black px-6 py-2 flex justify-between items-center shadow-lg">
      <Link to="/" className="flex items-center">
        <img className="h-12 w-auto transform transition-transform duration-300 hover:scale-110" src={logo} alt="Your Company Logo" />
      </Link>
      <div className="flex space-x-4 items-center ml-4">
        <Link
          to="/get-problem"
          className={`text-decoration-none text-white hover:text-gray-300 transition duration-300 px-2 py-1 rounded ${currentPage === 'get-problem' ? 'bg-purple-900' : ''}`}
        >
          <FaClipboardList className="inline-block mr-1" /> Problems
        </Link>
        <Link
          to="/course"
          className={`text-decoration-none text-white hover:text-gray-300 transition duration-300 px-2 py-1 rounded ${currentPage === 'course' ? 'bg-purple-900' : ''}`}
        >
          <FaBook className="inline-block mr-1" /> Courses
        </Link>
        <Link
          to="/contest"
          className={`text-decoration-none text-white hover:text-gray-300 transition duration-300 px-2 py-1 rounded ${currentPage === 'contest' ? 'bg-purple-900' : ''}`}
        >
          <FaTrophy className="inline-block mr-1" /> Compete
        </Link>
        <Link
          to="/blog"
          className={`text-decoration-none text-white hover:text-gray-300 transition duration-300 px-2 py-1 rounded ${currentPage === 'blog' ? 'bg-purple-900' : ''}`}
        >
          <FaBlog className="inline-block mr-1" /> Blogs
        </Link>
        {user && user.role === 'admin' && (
          <>
            <Link
              to="/problem/new"
              className={`text-decoration-none text-white hover:text-gray-300 transition duration-300 px-2 py-1 rounded ${currentPage === 'new' ? 'bg-purple-900' : ''}`}
            >
              <FaPlus className="inline-block mr-1" /> Add Problem
            </Link>
            <button
              onClick={handleUpdate}
              className="text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-md transition duration-300 flex items-center"
            >
              <FaEdit className="inline-block mr-1" /> Update Problem
            </button>
          </>
        )}
      </div>
      <div className="relative cursor-pointer" onClick={toggleDropdown}>
        <FaUser className="text-white mr-6 hover:text-gray-300 transition duration-300" />
        {showDropdown && (
          <div className="absolute right-0 mt-2 bg-gray-800 rounded shadow-md z-10 animate-dropdown">
            <ul className="p-2">
              <li className="text-white hover:bg-gray-700 p-2  rounded cursor-pointer transition duration-200">
                <Link className='text-decoration-none text-white' to="/profile">Profile</Link>
              </li>
              <li className="text-white hover:bg-gray-700 p-2 rounded cursor-pointer transition duration-200" onClick={handleSignOut}>
                Sign Out
              </li>
            </ul>
          </div>
        )}
        <FaAngleDown className={`absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 transition duration-300 ${showDropdown ? 'rotate-180' : ''}`} />
      </div>
    </nav>
  );
};

export default Navbar;
