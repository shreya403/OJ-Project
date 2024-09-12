import React, { useContext, useState } from 'react';
import ProblemContext from './problemContext';
import { Link } from 'react-router-dom';
import { FaSort, FaSortUp, FaSortDown, FaTh, FaList } from 'react-icons/fa';
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
  width: 100vw;
  margin: 0;
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

const Button = styled.button`
  display: flex;
  align-items: center;
  background: #4a00e0;
  color: #fff;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: background 0.3s;
  &:hover {
    background: #8e2de2;
  }
  svg {
    margin-right: 0.5rem;
  }
`;

const TableContainer = styled.div`
  overflow-x: auto;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 0.5rem;
  background: #1f1f1f;
`;

const Table = styled.table`
  width: 100%;
  border-spacing: 0;
  background: #1f1f1f;
  color: #fff;
`;

const TableHead = styled.thead`
  background: #333;
`;

const TableHeadCell = styled.th`
  padding: 1rem;
  text-align: left;
  cursor: pointer;
  background: #2a2a2a;
  &:hover {
    background: #444;
  }
`;

const TableBody = styled.tbody``;

const TableRow = styled.tr`
  &:hover {
    background: #333;
  }
`;

const TableCell = styled.td`
  padding: 1rem;
  border-bottom: 1px solid #444;
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

const ProblemTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: #8e2de2;
`;

const ProblemDescription = styled.p`
  color: #c0c0c0;
  margin-bottom: 1rem;
`;

const Info = styled.div`
  display: flex;
  justify-content: space-between;
  color: #c0c0c0;
`;

const FetchProblem = () => {
  const { problems } = useContext(ProblemContext);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [viewMode, setViewMode] = useState('table');

  if (!problems || problems.length === 0) {
    return <Container><div className="text-2xl">Loading...</div></Container>;
  }

  const sortedProblems = [...problems].sort((a, b) => {
    if (sortConfig.key === null) return 0;
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getClassNamesFor = (name) => {
    if (!sortConfig.key) return;
    return sortConfig.key === name ? sortConfig.direction : undefined;
  };

  const getSortIcon = (name) => {
    if (!sortConfig.key || sortConfig.key !== name) return <FaSort />;
    if (sortConfig.direction === 'ascending') return <FaSortUp />;
    return <FaSortDown />;
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === 'table' ? 'grid' : 'table');
  };

  return (
    <Container>
      <TitleWrapper>
        <Title className='text-white'>Problem Set</Title>
        </TitleWrapper>
      <div className="flex justify-end mb-4">
        <Button onClick={toggleViewMode}>
          {viewMode === 'table' ? <FaTh /> : <FaList />}
          {viewMode === 'table' ? 'Grid View' : 'Table View'}
        </Button>
      </div>
      {viewMode === 'table' ? (
        <TableContainer>
          <Table>
            <TableHead>
              <tr>
                <TableHeadCell
                  className={getClassNamesFor('problemName')}
                  onClick={() => requestSort('problemName')}
                >
                  Problem Name {getSortIcon('problemName')}
                </TableHeadCell>
                <TableHeadCell
                  className={getClassNamesFor('marks')}
                  onClick={() => requestSort('marks')}
                >
                  Marks {getSortIcon('marks')}
                </TableHeadCell>
                <TableHeadCell
                  className={getClassNamesFor('submissions')}
                  onClick={() => requestSort('submissions')}
                >
                  Submissions {getSortIcon('submissions')}
                </TableHeadCell>
                <TableHeadCell
                  className={getClassNamesFor('difficulty')}
                  onClick={() => requestSort('difficulty')}
                >
                  Difficulty {getSortIcon('difficulty')}
                </TableHeadCell>
              </tr>
            </TableHead>
            <TableBody>
              {sortedProblems.map((problem) => (
                <TableRow key={problem._id}>
                  <TableCell>
                    <Link to={`/get-problem/${problem._id}`} className="text-decoration-none text-white hover:text-blue-500">
                      {problem.problemName}
                    </Link>
                  </TableCell>
                  <TableCell>{problem.marks}</TableCell>
                  <TableCell>{problem.submissions}</TableCell>
                  <TableCell>
                    <span className={`font-semibold ${
                      problem.difficulty === 'Easy' ? 'text-green-500' :
                      problem.difficulty === 'Medium' ? 'text-yellow-500' :
                      problem.difficulty === 'Hard' ? 'text-red-500' : ''
                    }`}>
                      {problem.difficulty}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Grid>
          {sortedProblems.map((problem) => (
            <GridItem key={problem._id}>
              <ProblemTitle>
                <Link to={`/get-problem/${problem._id}`} className="text-decoration-none text-white hover:text-blue-500">
                  {problem.problemName}
                </Link>
              </ProblemTitle>
              <ProblemDescription>{problem.description.slice(0, 100)}...</ProblemDescription>
              <Info>
                <span>
                  Difficulty: {' '}
                  <span className={`font-semibold ${
                    problem.difficulty === 'Easy' ? 'text-green-500' :
                    problem.difficulty === 'Medium' ? 'text-yellow-500' :
                    problem.difficulty === 'Hard' ? 'text-red-500' : ''
                  }`}>
                    {problem.difficulty}
                  </span>
                </span>
                <span>Submissions: {problem.submissions}</span>
                <span>Marks: {problem.marks}</span>
              </Info>
            </GridItem>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default FetchProblem;
