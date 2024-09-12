const express = require('express');
const { createProblem, getProblems, updateProblem, deleteProblem ,getProblembyID } = require('../controllers/problem');
const { authenticateUser } = require('../middleware/verifyToken');

const ProblemRoutes = express.Router();

ProblemRoutes.post("/problem", createProblem);
ProblemRoutes.get('/get-problem', authenticateUser, getProblems);
ProblemRoutes.get('/get-problem/:id', getProblembyID);
ProblemRoutes.patch('/update-problem/:id', updateProblem);
ProblemRoutes.delete('/delete-problem/:id', deleteProblem);

module.exports = ProblemRoutes;
