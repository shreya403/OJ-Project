const express = require('express');
const { generateFile } = require('./generateFile');
const { generateInputFile } = require('./generateInputFile');
const { executeCpp } = require('./executeCpp');
const { executePy } = require('./executePy');
const dotenv = require('dotenv');
const Problem = require('./models/ProblemModel');
const { DBConnection } = require('./database/db.js');
const Submission = require('./models/SubmissionModel');
const { listUsers } = require('./firebaseAdmin.js');
const cron = require('node-cron');
dotenv.config();
const app = express();
const cors = require('cors');
const PORT = process.env.SUBMISSION_PORT || 4000
const SubmissionRoutes = require('./routes/SubmissionRoute.js');
const AuthRoutes = require('./routes/Auth.js');

// Initialize database
DBConnection();
// Middleware
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'https://codeflowoj2.netlify.app'); // Replace with your frontend's origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', true);
    next();
  });
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth',AuthRoutes)
app.use('/api/submissions', SubmissionRoutes);

app.get('/', (req, res) => {
    res.json({
        online: "code-compiler"
    });
});

app.get('/keep-index-alive', (req, res) => {
    res.sendStatus(200);
});

cron.schedule('*/10 * * * *', () => {
    axios.get('https://oj-project-1.onrender.com/keep-index-alive')
      .then(response => {
        console.log('Keep-alive request sent successfully:', response.status);
      })
      .catch(error => {
        console.error('Error sending keep-alive request:', error);
      });
});

console.log('Keep-alive service for server.js started.');

app.post("/run", async (req, res) => {
    //console.log("running /run request");
    const { language = 'cpp', code, input } = req.body;
    if (code === undefined) {
        return res.status(404).json({ success: false, error: "Empty code!" });
    }

    try {
        const filePath = await generateFile(language, code);
        const inputPath = await generateInputFile(input);
        let output;
        if(language === "cpp"){
            output = await executeCpp(filePath, inputPath);
        }
        else{
            output = await executePy(filePath, inputPath);
        }
        
        res.json({ output });
    } catch (error) {
        res.status(500).json({ error: error });
    }
});

app.get('/sync-google-users', async (req, res) => {
    try {
      await listUsers();
      res.status(200).send('Users synchronized successfully');
    } catch (error) {
      res.status(500).send('Error synchronizing users: ' + error.message);
    }
  });

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
