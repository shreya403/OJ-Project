import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import axios from 'axios';
import { useSelector } from 'react-redux';
import ProblemForm from '../problems/problemForm'; // Assuming ProblemForm is in the same directory
import { Link } from 'react-router-dom';

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
  padding: 0 7rem;
  background: linear-gradient(to bottom, #4facfe, #00f2fe);
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  animation: ${fadeIn} 0.5s ease-in-out;
  box-sizing: border-box;
`;

const ContentWrapper = styled.div`
  max-width: 768px;
  width: 100%;
  padding: 2rem;
  background: #ffffff;
  border-radius: 0.5rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  text-align: center;
  font-size: 2.5rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 2rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const Card = styled.div`
  background: #f0f0f0;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
  &:hover {
    transform: scale(1.05);
  }
`;

const CardTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 1rem;
`;

const CardDescription = styled.p`
  font-size: 1rem;
  color: #666;
  margin-bottom: 1rem;
`;

const Button = styled.button`
  display: block;
  width: 100%;
  padding: 0.75rem;
  background: #4a90e2;
  color: #fff;
  font-size: 1rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  text-align: center;
  transition: background 0.3s;
  &:hover {
    background: #357ab8;
  }
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
`;

const ListItem = styled.li`
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid #e0e0e0;
  &:last-child {
    border-bottom: none;
  }
`;

const ListItemText = styled.span`
  font-size: 1rem;
  color: #333;
`;

const ListItemDate = styled.span`
  font-size: 0.875rem;
  color: #999;
`;

const Footer = styled.div`
  margin-top: 2rem;
  text-align: center;
  color: #666;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
  font-size: 1rem;
`;

const Textarea = styled.textarea`
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
  font-size: 1rem;
`;

const Contest = () => {
  const [contest, setContest] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    problems: []
  });

  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = useSelector(state => state.Auth.user);

  const handleChange = (e) => {
    setContest({
      ...contest,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const contestData = {
      contestName: contest.name,
      description: contest.description,
      startDate: contest.startDate,
      endDate: contest.endDate,
      problems: contest.problems
    };
    //console.log("Submitting contest:", contestData); // Debugging
    try {
      const response = await axios.post('http://localhost:8000/api/contest', contestData, {
        withCredentials: true
      });
      //console.log("Response data:", response.data); // Debugging
      setContest({
        name: '',
        description: '',
        startDate: '',
        endDate: '',
        problems: []
      });
      fetchContests();
    } catch (error) {
      console.error("Error creating contest:", error);
    }
  };
  

  const fetchContests = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/get-contest');
      //console.log("Fetched contests:", response.data.contest); // Debugging
      setContests(response.data.contest);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching contests:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContests();
  }, []);

  const addProblemToContest = (problem) => {
    setContest((prevContest) => ({
      ...prevContest,
      problems: [...prevContest.problems, problem._id]
    }));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <ContentWrapper>
        <Title>Contest Page</Title>
        {user && user.role === 'admin' ? (
          <>
            <Form onSubmit={handleSubmit}>
              <Input
                type="text"
                name="name"
                value={contest.name}
                onChange={handleChange}
                placeholder="Contest Name"
                required
              />
              <Textarea
                name="description"
                value={contest.description}
                onChange={handleChange}
                placeholder="Contest Description"
              ></Textarea>
              <Input
                type="datetime-local"
                name="startDate"
                value={contest.startDate}
                onChange={handleChange}
                required
              />
              <Input
                type="datetime-local"
                name="endDate"
                value={contest.endDate}
                onChange={handleChange}
                required
              />
              <Button type="submit">Create Contest</Button>
            </Form>
            <ProblemForm onProblemAdd={addProblemToContest} /> {/* Include the ProblemForm component */}
          </>
        ) : (
          <Grid>
            <Card>
              <CardTitle>Upcoming Contests</CardTitle>
              {contests && contests.filter(c => new Date(c.startDate) > new Date()).map(contest => (
                <div key={contest._id}>
                  <CardTitle>{contest.name}</CardTitle>
                  <CardDescription>{contest.description}</CardDescription>
                  <ListItemDate>Start: {new Date(contest.startDate).toLocaleString()}</ListItemDate>
                  <ListItemDate>End: {new Date(contest.endDate).toLocaleString()}</ListItemDate>
                </div>
              ))}
            </Card>
            <Card>
              <CardTitle>Previous Contests</CardTitle>
              <List>
                {contests && contests.filter(c => new Date(c.endDate) < new Date()).map(contest => (
                  <ListItem key={contest._id}>
                    <ListItemText>{contest.name}</ListItemText>
                    <ListItemDate>End: {new Date(contest.endDate).toLocaleString()}</ListItemDate>
                  </ListItem>
                ))}
              </List>
            </Card>
          </Grid>
        )}
        <Footer>
          <p>Explore more contests and challenges!</p>
          <Link to="/all-contests" className='text-decoration-none'>View All Contests</Link>
        </Footer>
      </ContentWrapper>
    </Container>
  );
};

export default Contest;
