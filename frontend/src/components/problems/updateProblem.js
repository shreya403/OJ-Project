import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const UpdatedProblem = () => {
  const { id } = useParams();

  const [problemName, setProblemName] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [submissions, setSubmissions] = useState(0);
  const [marks, setMarks] = useState(0);
  const [author, setAuthor] = useState('');
  const [constraints, setConstraints] = useState('');
  const [inputFormat, setInputFormat] = useState('');
  const [outputFormat, setOutputFormat] = useState('');
  const [sampleInput, setSampleInput] = useState('');
  const [sampleOutput, setSampleOutput] = useState('');
  const [explanation, setExplanation] = useState('');
  const [hiddenTestCases, setHiddenTestCases] = useState([
    { input: '', expectedOutput: '' }
  ]);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/get-problem/${id}`);
        const problemData = response.data.data;

        setProblemName(problemData.problemName);
        setDescription(problemData.description);
        setDifficulty(problemData.difficulty);
        setSubmissions(problemData.submissions);
        setMarks(problemData.marks);
        setAuthor(problemData.author);
        setConstraints(problemData.constraints);
        setInputFormat(problemData.inputFormat);
        setOutputFormat(problemData.outputFormat);
        setSampleInput(problemData.sampleInput);
        setSampleOutput(problemData.sampleOutput);
        setExplanation(problemData.explanation);
        setHiddenTestCases(problemData.hiddenTestCases || [{ input: '', expectedOutput: '' }]);
      } catch (error) {
        console.error('Error fetching problem details:', error);
      }
    };

    if (id) {
      fetchProblem();
    }
  }, [id]);

  const updProblem = async (e) => {
    e.preventDefault();

    const updatedProblem = {
      problemName,
      description,
      difficulty,
      submissions,
      marks,
      author,
      constraints,
      inputFormat,
      outputFormat,
      sampleInput,
      sampleOutput,
      explanation,
      hiddenTestCases
    };

    try {
      const response = await axios.put(`http://localhost:8000/update-problem/${id}`, updatedProblem);
      // console.log('Problem updated successfully:', response.data);
    } catch (error) {
      console.error('Error updating problem:', error);
    }
  };

  const handleAddTestCase = () => {
    setHiddenTestCases([...hiddenTestCases, { input: '', expectedOutput: '' }]);
  };

  const handleTestCaseChange = (index, field, value) => {
    const updatedTestCases = [...hiddenTestCases];
    updatedTestCases[index][field] = value;
    setHiddenTestCases(updatedTestCases);
  };

  return (
    <div className="max-w-full mx-auto p-6 bg-white rounded-md shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Update Problem</h2>
      <form onSubmit={updProblem} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="problemName" className="block text-sm font-medium text-gray-700">Problem Name</label>
          <input
            type="text"
            id="problemName"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={problemName}
            onChange={(e) => setProblemName(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700">Difficulty</label>
          <select
            id="difficulty"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
          >
            <option value="">Select Difficulty</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>

        <div>
          <label htmlFor="submissions" className="block text-sm font-medium text-gray-700">Submissions</label>
          <input
            type="number"
            id="submissions"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={submissions}
            onChange={(e) => setSubmissions(parseInt(e.target.value))}
          />
        </div>

        <div>
          <label htmlFor="marks" className="block text-sm font-medium text-gray-700">Marks</label>
          <input
            type="number"
            id="marks"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={marks}
            onChange={(e) => setMarks(parseInt(e.target.value))}
          />
        </div>

        <div>
          <label htmlFor="author" className="block text-sm font-medium text-gray-700">Author</label>
          <input
            type="text"
            id="author"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            id="description"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="constraints" className="block text-sm font-medium text-gray-700">Constraints</label>
          <textarea
            id="constraints"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={constraints}
            onChange={(e) => setConstraints(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="inputFormat" className="block text-sm font-medium text-gray-700">Input Format</label>
          <textarea
            id="inputFormat"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={inputFormat}
            onChange={(e) => setInputFormat(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="outputFormat" className="block text-sm font-medium text-gray-700">Output Format</label>
          <textarea
            id="outputFormat"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={outputFormat}
            onChange={(e) => setOutputFormat(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="sampleInput" className="block text-sm font-medium text-gray-700">Sample Input</label>
          <textarea
            id="sampleInput"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={sampleInput}
            onChange={(e) => setSampleInput(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="sampleOutput" className="block text-sm font-medium text-gray-700">Sample Output</label>
          <textarea
            id="sampleOutput"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={sampleOutput}
            onChange={(e) => setSampleOutput(e.target.value)}
          />
        </div>

        <div className="md:col-span-2">
          <label htmlFor="explanation" className="block text-sm font-medium text-gray-700">Explanation</label>
          <textarea
            id="explanation"
            className="mt-1 block w-full px-3 py-2

 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={explanation}
            onChange={(e) => setExplanation(e.target.value)}
          />
        </div>

        <div className="md:col-span-2">
          <h3 className="text-lg font-medium text-gray-700 mb-2">Hidden Test Cases</h3>
          {hiddenTestCases.map((testCase, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor={`input${index}`} className="block text-sm font-medium text-gray-700">Input</label>
                <textarea
                  id={`input${index}`}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={testCase.input}
                  onChange={(e) => handleTestCaseChange(index, 'input', e.target.value)}
                />
              </div>

              <div>
                <label htmlFor={`expectedOutput${index}`} className="block text-sm font-medium text-gray-700">Expected Output</label>
                <textarea
                  id={`expectedOutput${index}`}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={testCase.expectedOutput}
                  onChange={(e) => handleTestCaseChange(index, 'expectedOutput', e.target.value)}
                />
              </div>
            </div>
          ))}
          <button type="button" onClick={handleAddTestCase} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
            Add Hidden Test Case
          </button>
        </div>

        <div className="md:col-span-2 text-center">
          <button type="submit" className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
            Update Problem
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdatedProblem;