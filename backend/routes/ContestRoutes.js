const express = require('express');
const { createContest, getContest, getContestById, updateContest, deleteContest } = require('../controllers/contest');
const { isAdmin } = require('../middleware/verifyToken');

const ContestRoutes = express.Router();

ContestRoutes.post("/contest", createContest);
ContestRoutes.get('/get-contest', getContest);
ContestRoutes.get('/get-contest/:id', getContestById);
ContestRoutes.patch('/update-contest/:id', isAdmin, updateContest);
ContestRoutes.delete('/delete-contest/:id', isAdmin, deleteContest);

module.exports = ContestRoutes;