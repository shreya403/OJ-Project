import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleAuthProvider } from '../firebase';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/auth/register', { name, email, password });
      toast.success(response.data.message);
      navigate('/', { replace: true });
      //console.log(response.data);
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Failed to register. Please try again.');
    }
  };

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleAuthProvider);
      await axios.get('http://localhost:4000/sync-google-users');
      console.log('Login successful:', result);
      localStorage.setItem('token', result.user.accessToken);
      localStorage.setItem('user', JSON.stringify(result.user));
      localStorage.setItem('email', result.user.email);
      //console.log('Navigating to /');
      navigate('/', { replace: true });
    } catch (error) {
      console.log('Login failed:', error);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-100">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-purple-700 via-purple-800 to-purple-900 z-[-1]"></div>
      <div className="bg-white rounded-lg shadow-lg text-center p-8 max-w-md w-full">
        <div className="text-right">
          <button className="text-gray-400 hover:text-gray-600">
            <i className="fas fa-times"></i>
          </button>
        </div>
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Register</h1>
        <h2 className="text-lg font-normal mb-8 text-gray-600">Signup for a new account</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="text"
              placeholder="Username"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-12 px-4 border border-gray-300 rounded-md text-sm bg-gray-50 focus:outline-none focus:border-purple-400"
              required
            />
          </div>
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-12 px-4 border border-gray-300 rounded-md text-sm bg-gray-50 focus:outline-none focus:border-purple-400"
              required
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-12 px-4 border border-gray-300 rounded-md text-sm bg-gray-50 focus:outline-none focus:border-purple-400"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full h-12 bg-purple-600 text-white rounded-md text-lg hover:bg-purple-500 transition duration-300"
          >
            Register
          </button>
        </form>
        <div className="mt-6">
          <button
            type="button"
            onClick={loginWithGoogle}
            className="w-full h-12 border border-gray-300 rounded-md flex items-center justify-center text-sm hover:bg-gray-200 transition duration-300"
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/4/4a/Logo_2013_Google.png"
              alt="Google Logo"
              className="w-5 mr-2"
            />
            Continue with Google
          </button>
        </div>
        <p className="mt-6 text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-purple-600 hover:text-purple-500 transition duration-300">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;