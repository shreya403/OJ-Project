import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import ProblemContext from './problemContext';
import { useNavigate } from 'react-router-dom';

const ProblemProvider = ({ children }) => {
  const [problems, setProblems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await Axios.get('http://localhost:8000/api/get-problem', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (
          response.data &&
          response.data.status === 'Success' &&
          Array.isArray(response.data.data.savedGetProblem)
        ) {
          setProblems(response.data.data.savedGetProblem);
        } else {
          console.error('API response does not contain an array of problems:', response.data);
        }
      } catch (error) {
        console.error('Error fetching problems:', error);
        if (error.response && error.response.status === 401) {
          navigate('/login');
        }
      }
    };

    fetchProblems();
  }, [navigate]);

  const addProblem = (newProblem) => {
    setProblems((prevProblems) => [...prevProblems, newProblem]);
  };


  return (
    <ProblemContext.Provider value={{ problems, addProblem }}>
      {children}
    </ProblemContext.Provider>
  );
};

export default ProblemProvider;
