import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import decode from '../../services/decode';
import { useParams } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';
import { FaPlay, FaPaperPlane, FaTerminal } from 'react-icons/fa'; // Import icons
import { format } from 'date-fns';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap CSS
import { BeatLoader } from 'react-spinners';

const notify = () => toast.dark('Solution Accepted!', {
  className: 'bg-success text-light',
  bodyClassName: 'text-center',
  progressClassName: 'bg-white',
});

const notify2 = () => toast.dark('Wrong Answer!', {
  className: 'bg-danger text-light',
  bodyClassName: 'text-center',
  progressClassName: 'bg-white',
});

const themeColor = 'blue'; // Set the theme color for your page

const initialCppCode = `//Write your C++ code here
#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!";
    return 0;
}`;

const initialPyCode = `# Write your Python code here
print("Hello, World!")`;

const getStatusClass = (result) => {
  return result === 'accepted' ? 'bg-green-200' : 'bg-red-200';
};

const CodePopup = ({ code, onClose }) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white p-4 rounded-md shadow-md w-3/4 max-w-lg">
        <pre className="overflow-auto max-h-80">{code}</pre>
        <button onClick={onClose} className="bg-gray-300 px-4 py-2 mt-4 rounded-md hover:bg-gray-400 focus:outline-none">
          Close
        </button>
      </div>
    </div>
  );
};



const SubmissionRow = ({ submission }) => {
  const statusClass = getStatusClass(submission.result);
  const [showCodePopup, setShowCodePopup] = useState(false);

  const handleViewCode = () => {
    setShowCodePopup(true);
  };

  const handleClosePopup = () => {
    setShowCodePopup(false);
  };

  return (
    <>
      <tr className={statusClass}>
        <td className="border px-4 py-2">{submission.userId ? submission.userId.name : 'Me'}</td>
        <td className="border px-4 py-2">{submission.language}</td>
        <td className="border px-4 py-2">{submission.result}</td>
        <td className="border px-4 py-2">{format(new Date(submission.createdAt), 'PPpp')}</td>
        <td className="border px-4 py-2">
          <button
            onClick={handleViewCode}
            className="bg-black hover:bg-blue-700 text-white py-2 px-4 rounded focus:outline-none"
          >
            View
          </button>
        </td>
      </tr>
      {showCodePopup && (
        <CodePopup code={submission.code} onClose={handleClosePopup} />
      )}
    </>
  );
};

const ProblemDetail = () => {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [code, setCode] = useState(initialCppCode); // Initial code set to C++
  const [input, setInput] = useState('');
  const [language, setLanguage] = useState('cpp');
  const [output, setOutput] = useState({ message: '', color: '' });
  const [activeTab, setActiveTab] = useState('input');
  const [consoleOpen, setConsoleOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('problem');
  const [userId, setUserId] = useState(null);
  const [allSubmissions, setAllSubmissions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        //console.log('Fetching problem with ID:', id);
        const response = await Axios.get(`http://localhost:8000/api/get-problem/${id}`);
        //console.log('API response:', response.data);

        setProblem(response.data.data.problem);
        setLoading(false);
      } catch (error) {
        //console.error('Error fetching problem:', error);
        setError('Error fetching problem data');
        setLoading(false);
      }
    };

    if (id) {
      fetchProblem();
    }
  }, [id]);

  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        const response = await Axios.get(`http://localhost:4000/api/submissions/${id}`);
        //console.log('API Submissions:', response.data);
  
        if (response.data.success) {
          const sortedSubmissions = response.data.submissions.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          setAllSubmissions(sortedSubmissions);
          console.log('Fetched Submissions:', sortedSubmissions);
        } else {
          //console.error('Failed to fetch submissions:', response.data);
        }
      } catch (error) {
        console.error('Error fetching submission:', error);
      }
    };
  
    if (id) {
      fetchSubmission();
    }
  }, [id]);

  

  const handleRun = async () => {
    const payload = {
      language,
      code,
      input
    };

    setIsLoading(true);
  
    try {
      const { data } = await Axios.post('http://localhost:4000/run', payload);
      //console.log("running /run request");
      //console.log(data);
      setOutput({ message: data.output, color: 'black' });
      setActiveTab('output');
      setConsoleOpen(true);
    } catch (error) {
      //console.log(error.response);
    }  finally{
      setIsLoading(false);
    }
  };

  const mySubmissions = allSubmissions.filter(submission => submission.userId === userId);
  console.log('My Submissions:', mySubmissions); // Debugging log

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem('token');
      const { userId } = decode(token);
      console.log("User ID:", userId);
      try {
        //console.log("Fetching users");
        const response = await Axios.get('http://localhost:8000/api/auth/getUser',{
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        //console.log('API User Response:', response.data);

        if (
          response.data &&
          response.data.status === 'Success' &&
          Array.isArray(response.data.data.savedGetUser)
        ) {
          setUserId(userId);
        } else {
          //console.error('API response does not contain users:', response.data);
        }
      } catch (error) {
        //console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  
  

  const handleSubmit = async () => {
    const token = localStorage.getItem('token');
    const { userId } = decode(token);

    const payload = {
      userId,
      problemId: id,
      language: 'cpp',
      code
    };
  
    //console.log("Submitting payload:", payload);
    
    setIsLoading(true);
    try {
      const { data } = await Axios.post('http://localhost:4000/api/submissions/submit', payload);
      //console.log(data);
      const verdictMessage = data.status === 'accepted' ? 'All hidden test cases passed!' : 'Some hidden test cases failed.';
      const verdictColor = data.status === 'accepted' ? 'green' : 'red';
      setOutput({ message: verdictMessage, color: verdictColor });
      setActiveTab('verdict');
      setConsoleOpen(true);
      if (data.status === 'accepted') {
        notify();
      }
      else{
        notify2();
      }
    } catch (error) {
      console.log(error.response);
    } finally{
      setIsLoading(false);
    }
  };

  const infoItems = [
    { label: 'Description', value: problem?.description },
    { label: 'Difficulty', value: problem?.difficulty },
    { label: 'Submissions', value: problem?.submissions },
    { label: 'Marks', value: problem?.marks },
    { label: 'Author', value: problem?.author },
    { label: 'Constraints', value: problem?.constraints },
    { label: 'Input Format', value: problem?.inputFormat },
    { label: 'Output Format', value: problem?.outputFormat },
    { label: 'Sample Input', value: problem?.sampleInput },
    { label: 'Sample Output', value: problem?.sampleOutput },
    { label: 'Explanation', value: problem?.explanation },
  ];

  const InfoItem = ({ label, value }) => (
    <div className="mb-4">
      <strong>{label}:</strong>
      <p>{value}</p>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <BeatLoader color="#0000ff" loading={loading} size={15} />
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!problem) {
    return <div>No problem data available</div>;
  }

  return (
    <div className="container mx-auto p-4 h-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
        <div className="problem-details p-4 bg-white rounded shadow-md overflow-auto">
          <div className="flex mb-4 border-b">
            <button
              className={`tab px-4 py-2 ${activeSection === 'problem' ? 'bg-blue-200 border-t border-r border-l rounded-t' : 'bg-gray-100'}`}
              onClick={() => setActiveSection('problem')}
            >
              Problem
            </button>
            <button
              className={`tab px-4 py-2 ${activeSection === 'mySubmissions' ? 'bg-blue-200 border-t border-r border-l rounded-t' : 'bg-gray-100'}`}
              onClick={() => setActiveSection('mySubmissions')}
            >
              My Submissions
            </button>
            <button
              className={`tab px-4 py-2 ${activeSection === 'allSubmissions' ? 'bg-blue-200 border-t border-r border-l rounded-t' : 'bg-gray-100'}`}
              onClick={() => setActiveSection('allSubmissions')}
            >
              All Submissions        
              </button>
      </div>

      {activeSection === 'problem' && (
          <>
            <InfoItem label="Description" value={problem?.description} />

            <div className="flex mb-0">
              <div className="flex-1 mr-4">
                <InfoItem label="Difficulty" value={problem?.difficulty} />
              </div>
              <div className="flex-1">
                <InfoItem label="Submissions" value={problem?.submissions} />
              </div>
            </div>

            <div className="flex mb-1">
              <div className="flex-1 mr-4">
                <InfoItem label="Marks" value={problem?.marks} />
              </div>
              <div className="flex-1">
                <InfoItem label="Author" value={problem?.author} />
              </div>
            </div>

            {infoItems.slice(5).map((item, index) => (
              <InfoItem key={index} label={item.label} value={item.value} />
            ))}
          </>
        )}

{activeSection === 'mySubmissions' && (
  <div>
    <h2 className="text-lg font-medium mb-2">My Submissions</h2>
    {mySubmissions.length === 0 ? (
      <p>No submissions found for this problem.</p>
    ) : (
      <table className="table-auto w-full border-collapse">
        <thead>
          <tr>
            <th className="border px-4 py-2">User</th>
            <th className="border px-4 py-2">Language</th>
            <th className="border px-4 py-2">Result</th>
            <th className="border px-4 py-2">Created At</th>
            <th className="border px-4 py-2">Code</th>
          </tr>
        </thead>
        <tbody>
          {mySubmissions.map(submission => (
            <SubmissionRow key={submission._id} submission={submission} userId={userId} />
          ))}
        </tbody>
      </table>
    )}
  </div>
)}


      {activeSection === 'allSubmissions' && (
        <div>
        <h2 className="text-xl font-bold mb-4">All Submissions</h2>
        <table className="table-auto w-full border-collapse border border-gray-200">
          <thead>
            <tr>
              <th className="border px-4 py-2">User Name</th>
              <th className="border px-4 py-2">Language</th>
              <th className="border px-4 py-2">Result</th>
              <th className="border px-4 py-2">Submission Date</th>
            </tr>
          </thead>
          <tbody>
            {allSubmissions.length > 0 ? (
              allSubmissions.map((submission, index) => (
                <SubmissionRow key={index} submission={submission} />
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4">No submissions available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      )}
    </div>

    <div className="coding-area p-4 bg-white rounded shadow-md flex flex-col h-full"><div className="flex items-center space-x-2 mb-0">
  <label className="text-gray-700 font-semibold">Language: </label>
  <select
    value={language}
    onChange={(e) => {
      setLanguage(e.target.value);
      setCode(e.target.value === 'cpp' ? initialCppCode : initialPyCode); // Set code template based on selected language
    }}
    className="px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
  >
    <option value="cpp">C++</option>
    <option value="py">Python</option>
  </select>
</div>
      <br />
      
        <ResizableBox
        width={600}
        height={470}
        minConstraints={[300, 200]}
        maxConstraints={[800, 600]}
        resizeHandles={['s', 'e', 'se']}
        >
        <div style={{ height: '100%', width: '100%' }}>
          <Editor
            height="100%"
            language={language} // Dynamically set language for the editor
            theme="vs-dark"
            value={code}
            onChange={(newValue) => setCode(newValue)}
            options={{
              inlineSuggest: true,
              fontSize: 16,
              formatOnType: true,
              autoClosingBrackets: 'always',
              minimap: { enabled: true },
            }}
          />
        </div>
        </ResizableBox>
        <div className={`mt-4 ${consoleOpen ? 'block' : 'hidden'} flex-grow`}>
  <div className="flex space-x-4 mb-2">
    <button
      className={`px-4 py-2 rounded-t-lg ${activeTab === 'input' ? 'bg-gray-200' : 'bg-gray-100'}`}
      onClick={() => setActiveTab('input')}
    >
      Input
    </button>
    <button
      className={`px-4 py-2 rounded-t-lg ${activeTab === 'output' ? 'bg-gray-200' : 'bg-gray-100'}`}
      onClick={() => setActiveTab('output')}
    >
      Output
    </button>
    <button
      className={`px-4 py-2 rounded-t-lg ${activeTab === 'verdict' ? 'bg-gray-200' : 'bg-gray-100'}`}
      onClick={() => setActiveTab('verdict')}
    >
      Verdict
    </button>
  </div>
  <div className="border rounded-b-lg p-2">
    {activeTab === 'input' && (
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter your input here"
        rows={5}
        className="w-full p-2 border rounded"
      />
    )}
    {activeTab === 'output' && (
      <pre className="w-full p-2 border rounded bg-gray-100">{output.message}</pre>
    )}
    {activeTab === 'verdict' && output && (
      <pre className={`w-full p-2 border rounded bg-gray-100 text-${output.color}-500`}>
        {output.message}
      </pre>
    )}
  </div>
</div>


    <div className="mt-4 flex space-x-4">
      <button
        onClick={() => setConsoleOpen(!consoleOpen)}
        className={`bg-black text-white py-2 px-4 rounded flex items-center space-x-2 hover:bg-${themeColor}-600 focus:outline-none focus:ring-2 focus:ring-${themeColor}-500 focus:ring-opacity-50`}
      >
        <FaTerminal />
        <span>{consoleOpen ? 'Close Console' : 'Open Console'}</span>
      </button>
      <button
        onClick={handleRun}
        className="bg-green-500 text-white py-2 px-4 rounded flex items-center space-x-2 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
        disabled={isLoading}
      >
        {isLoading ? <BeatLoader color="#ffffff" loading={isLoading} size={10} /> : <><FaPlay /><span>Run</span></>}
      </button>
      <button
        onClick={handleSubmit}
        className="bg-red-500 text-white py-2 px-4 rounded flex items-center space-x-2 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
        disabled={isLoading}
      >
        {isLoading ? <BeatLoader color="#ffffff" loading={isLoading} size={10} /> : <><FaPaperPlane /><span>Submit</span></>}
        
      </button>
        </div>
        </div>
        </div>
        <ToastContainer />
        </div>
        );
        };

export default ProblemDetail;
