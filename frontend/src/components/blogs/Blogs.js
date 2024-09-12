import React from 'react';
import styled, { keyframes } from 'styled-components';
import { FaExternalLinkAlt } from 'react-icons/fa';

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const Container = styled.div`
  width: 100vw;
  padding: 0 7rem; /* Add padding for left and right gap */
  background: #121212;
  min-height: 100vh;
  color: #fff;
  animation: ${fadeIn} 0.5s ease-in-out;
  box-sizing: border-box; /* Ensure padding is included in the total width */
`;

const TitleWrapper = styled.div`
  background: #121212; /* Ensure the background color is the same */
  padding-top: 3rem; /* Adjust this value to move the title down */
`;

const Title = styled.h2`
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 2rem;
  color: #c0c0c0;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const GridItem = styled.div`
  background: #1f1f1f;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
  &:hover {
    transform: scale(1.05);
  }
`;

const BlogTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: #8e2de2;
`;

const BlogDetails = styled.p`
  color: #c0c0c0;
  margin-bottom: 1rem;
`;

const Info = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #c0c0c0;
`;

const Icon = styled(FaExternalLinkAlt)`
  color: #8e2de2;
  cursor: pointer;
`;

const blogs = [
  { name: 'Two Sum', author: 'GFG', views: '525', link: 'https://www.geeksforgeeks.org/check-if-pair-with-given-sum-exists-in-array/' },
  { name: 'Coin Change', author: 'GFG', views: '201', link: 'https://www.geeksforgeeks.org/coin-change-dp-7/' },
  { name: 'Cumulative Sum', author: 'WorkTech', views: '652', link: 'https://workat.tech/problem-solving/approach/cs/cumulative-sum' },
  // Add more blog objects here
];

const Blog = () => {
  return (
    <Container>
      <TitleWrapper>
        <Title>Blog Page</Title>
      </TitleWrapper>
      <Grid>
        {blogs.map((blog, index) => (
          <GridItem key={index}>
            <BlogTitle>{blog.name}</BlogTitle>
            <BlogDetails>Author: {blog.author}</BlogDetails>
            <Info>
              <span>Views: {blog.views}</span>
              <a href={blog.link} target="_blank" rel="noopener noreferrer">
                <Icon />
              </a>
            </Info>
          </GridItem>
        ))}
      </Grid>
    </Container>
  );
};

export default Blog;
