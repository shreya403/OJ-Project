import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Container = styled.div`
  padding: 2rem;
  background: #f9f9f9;
  min-height: 100vh;
`;

const Title = styled.h1`
  text-align: center;
  font-size: 2.5rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 2rem;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const TableHeader = styled.th`
  padding: 1rem;
  background: #4a90e2;
  color: #fff;
  text-align: left;
  font-size: 1rem;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background: #f2f2f2;
  }
`;

const TableCell = styled.td`
  padding: 1rem;
  font-size: 1rem;
  color: #333;
  text-align: left;
`;

const Loading = styled.div`
  text-align: center;
  font-size: 1.5rem;
  color: #333;
`;

const ErrorMessage = styled.div`
  text-align: center;
  font-size: 1.5rem;
  color: red;
`;

const BackButton = styled(Link)`
  display: inline-block;
  margin: 2rem auto;
  padding: 0.75rem 1.5rem;
  background: #4a90e2;
  color: #fff;
  text-align: center;
  text-decoration: none;
  font-size: 1rem;
  border-radius: 0.5rem;
  transition: background 0.3s;
  &:hover {
    background: #357ab8;
  }
`;

const AllContests = () => {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContests = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/get-contest');
        setContests(response.data.contest);
        setLoading(false);
      } catch (error) {
        setError('Error fetching contests');
        setLoading(false);
      }
    };

    fetchContests();
  }, []);

  if (loading) {
    return <Loading>Loading...</Loading>;
  }

  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }

  return (
    <Container>
      <Title>All Contests</Title>
      <Table>
        <thead>
          <tr>
            <TableHeader>Name</TableHeader>
            <TableHeader>Description</TableHeader>
            <TableHeader>Start Date</TableHeader>
            <TableHeader>End Date</TableHeader>
          </tr>
        </thead>
        <tbody>
          {contests.map(contest => (
            <TableRow key={contest._id}>
              <TableCell>{contest.name}</TableCell>
              <TableCell>{contest.description}</TableCell>
              <TableCell>{new Date(contest.startDate).toLocaleString()}</TableCell>
              <TableCell>{new Date(contest.endDate).toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </tbody>
      </Table>
      <BackButton to="/contest">Back to Contests</BackButton>
    </Container>
  );
};

export default AllContests;
