const express = require('express');
const { submitCode, getSubmissions } = require('../controllers/submission');


const Submissionroute = express.Router();

// POST route to handle submission creation
Submissionroute.post('/submit', submitCode);

// GET route to fetch submission details
Submissionroute.get('/:problemId', getSubmissions);

module.exports = Submissionroute;