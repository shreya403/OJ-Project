import React from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const CoursesContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #1a1a2e, #16213e, #0f3460);
  animation: ${fadeIn} 0.5s ease-in-out;
  color: #fff;
`;

const CoursesTitle = styled.h1`
  font-size: 3rem;
  text-align: center;
  background: linear-gradient(45deg, #6a0572, #ab1c6b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: ${fadeIn} 2s ease-in-out;
`;

const Courses = () => {
  //console.log("This is courses");
  return (
    <CoursesContainer>
      <CoursesTitle>Coming Soon! Stay Tuned</CoursesTitle>
    </CoursesContainer>
  );
};

export default Courses;
