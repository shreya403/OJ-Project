import { createContext } from 'react';

const ProblemContext = createContext({
  problems: [],
  addProblem: () => {},
  setProblems: () => {}, // Add setProblems function
});

export default ProblemContext;