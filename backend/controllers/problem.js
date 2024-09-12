const Problem = require("../models/ProblemModel");

const createProblem = async (req, res) => {
    try {
        const problemDescription = new Problem(req.body);
        const savedProblem = await problemDescription.save();
        res.status(201).json({
            status: 'Success',
            data: { problem: savedProblem }
        });
    } catch (err) {
        res.status(500).json({
            status: 'Failed',
            message: err.message
        });
    }
};

const getProblems = async (req, res) => {
    try {
        const savedGetProblem = await Problem.find({});
        res.status(200).json({
            status: 'Success',
            data: { savedGetProblem }
        });
    } catch (err) {
        res.status(500).json({
            status: 'Failed',
            message: err.message
        });
    }
};

const getProblembyID = async (req, res) => {
    try {
        const problem = await Problem.findById(req.params.id);
        if (!problem) {
            return res.status(404).json({
                status: 'Failed',
                message: 'Problem not found'
            });
        }
        res.status(200).json({
            status: 'Success',
            data: { problem }
        });
    } catch (err) {
        res.status(500).json({
            status: 'Failed',
            message: err.message
        });
    }
};

const updateProblem = async (req, res) => {
    try {
        const updatedProblem = await Problem.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        res.status(200).json({
            status: 'Success',
            data: { updatedProblem }
        });
    } catch (err) {
        res.status(500).json({
            status: 'Failed',
            message: err.message
        });
    }
};

const deleteProblem = async (req, res) => {
    try {
        await Problem.findByIdAndDelete(req.params.id);
        res.status(204).json({
            status: 'Success',
            data: {}
        });
    } catch (err) {
        res.status(500).json({
            status: 'Failed',
            message: err.message
        });
    }
};

module.exports = { createProblem, getProblems, updateProblem, deleteProblem, getProblembyID };