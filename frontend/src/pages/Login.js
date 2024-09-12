import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux';
import { SetUser } from '../redux/AuthSlice';
import { post } from '../services/apiEndpoint';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleAuthProvider } from '../firebase';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-image: url('https://getwallpapers.com/wallpaper/full/c/1/6/6346.jpg'); // Replace with your background image URL
  background-size: cover;
  background-position: center;
  animation: ${fadeIn} 1s ease-in-out;
`;

const GradientOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(26, 26, 46, 0.8), rgba(22, 33, 62, 0.8), rgba(15, 52, 96, 0.8));
  z-index: -1;
`;

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 450px;
  margin: 0 auto;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 1.5rem;
`;

const ToggleButton = styled.button`
  width: 48%;
  padding: 0.75rem;
  background-color: ${({ active }) => (active ? '#6a0572' : '#e0e0e0')};
  color: ${({ active }) => (active ? '#fff' : '#000')};
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  &:hover {
    background-color: ${({ active }) => (active ? '#ab1c6b' : '#d0d0d0')};
  }
  transition: background-color 0.3s ease-in-out, color 0.3s ease-in-out;
`;

const Form = styled.div`
  width: 100%;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
  animation: ${fadeIn} 1.5s ease-in-out;
  position: relative;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #f9f9f9;
  font-size: 1rem;
  &:focus {
    border-color: #6a0572;
    outline: none;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 0.75rem;
  background-color: #6a0572;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  &:hover {
    background-color: #ab1c6b;
  }
  transition: background-color 0.3s ease-in-out;
`;

const SocialButton = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  color: #000;
  border: 1px solid #ccc;
  &:hover {
    background-color: #f1f1f1;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #999;
  &:hover {
    color: #333;
  }
`;

const Auth = () => {
  const user = useSelector((state) => state.Auth);
  //console.log(user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLogin, setIsLogin] = useState(true); // State to toggle between login and register forms

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await post('http://localhost:8000/api/auth/login', { email, password });
      const { data, status } = response;

      if (status === 200) {
        const { user, message, token } = data;
        navigate('/', { replace: true });
        toast.success(message);
        dispatch(SetUser(user));
        localStorage.setItem('email', email);
        localStorage.setItem('token', token); // Store the token in local storage
        //console.log('Email and token stored in local storage:', email, token);
      }
    } catch (error) {
      console.log('Login error:', error);
      toast.error('Failed to login. Please try again.');
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/auth/register', { name, email, password });
      toast.success('User successfully registered!');
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
    <Container>
      <ToastContainer />
      <GradientOverlay />
      <FormContainer>
        <ButtonContainer>
          <ToggleButton active={isLogin} onClick={() => setIsLogin(true)}>
            Login
          </ToggleButton>
          <ToggleButton active={!isLogin} onClick={() => setIsLogin(false)}>
            Signup
          </ToggleButton>
        </ButtonContainer>
        {isLogin ? (
          <Form>
            <CloseButton>
              <i className="fas fa-times"></i>
            </CloseButton>
            <Title>Login</Title>
            <form onSubmit={handleLoginSubmit}>
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Button type="submit">Log In</Button>
            </form>
            <div className="text-sm text-gray-600">
              <p>Forgot password? <Link to='/forgotPassword' style={{ color: '#6a0572' }}>Reset it here</Link></p>
            </div>
            <div className="or mb-4 text-sm font-bold text-gray-600 text-center">or</div>
            <SocialButton onClick={loginWithGoogle}>
              <img
                src="https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-1024.png"
                alt="Google Logo"
                style={{ width: '24px', marginRight: '8px' }}
              />
              Continue with Google
            </SocialButton>
          </Form>
        ) : (
          <Form>
            <CloseButton>
              <i className="fas fa-times"></i>
            </CloseButton>
            <Title>Register</Title>
            <form onSubmit={handleRegisterSubmit}>
              <Input
                type="text"
                placeholder="Username"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Button type="submit">Register</Button>
            </form>
            <div className="or mb-3 mt-3 text-sm font-bold text-gray-600 text-center">or</div>
            <SocialButton onClick={loginWithGoogle}>
              <img
                src="https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-1024.png"
                alt="Google Logo"
                style={{ width: '24px', marginRight: '8px' }}
              />
              Continue with Google
            </SocialButton>
            <p className="mt-6 text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" style={{ color: '#6a0572' }}>
                Login here
              </Link>
            </p>
          </Form>
        )}
      </FormContainer>
    </Container>
  );
};

export default Auth;
