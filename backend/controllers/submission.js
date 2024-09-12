const Problem = require('../models/ProblemModel');
const Submission = require('../models/SubmissionModel');
const { generateFile } = require('../generateFile');
const { generateInputFile } =  require('../generateInputFile');
const { executeCpp } = require('../executeCpp');
const { executePy } = require('../executePy');

const submitCode = async (req, res) => {
    
    const { userId, language = 'cpp', code, problemId } = req.body;
    if (!code || !problemId) {
        return res.status(400).json({ success: false, error: "Code or problem ID is missing!" });
    }

    try {
        // Fetch hidden test cases for the specified problem ID
        const problem = await Problem.findById(problemId);
        if (!problem) {
            return res.status(404).json({ success: false, error: 'Problem not found' });
        }

        const hiddenTestCases = problem.hiddenTestCases;
        const filePath = await generateFile(language, code);
        const results = [];

        for (const testCase of hiddenTestCases) {
            const inputPath = await generateInputFile(testCase.input);
            let output;

            try {
                if (language === 'cpp') {
                    output = await executeCpp(filePath, inputPath);
                } else if (language === 'py') {
                    output = await executePy(filePath, inputPath);
                } else {
                    return res.status(400).json({ success: false, error: "Unsupported language" });
                }
            } catch (execError) {
                return res.status(500).json({ success: false, error: `Error executing code: ${execError.message}` });
            }

            const isCorrect = output.trim() === testCase.expectedOutput.trim();
            results.push({ input: testCase.input, expectedOutput: testCase.expectedOutput, actualOutput: output, isCorrect });
        }

        const allCorrect = results.every(result => result.isCorrect);
        const result = allCorrect ? 'accepted' : 'wrong answer';

        // Save the submission
        const submission = new Submission({
            userId, 
            problemId, 
            code, 
            language, 
            result
        });
        await submission.save();

        res.json({ status: result, results });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getSubmissions = async (req, res) => {
    const { problemId } = req.params;

    try {
        const submissions = await Submission.find({ problemId }).populate('userId', 'name');
        res.json({ success: true, submissions });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { submitCode, getSubmissions };
