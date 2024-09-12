import React from 'react';
import FetchProblem from './fetchProblem'; // Import the FetchProblem component

const Problem = () => {
  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-12">
      <h1 className="text-3xl font-bold mb-4">Problems</h1>
      <div className="overflow-x-auto">
        {/* Render FetchProblem component here */}
        <FetchProblem />
      </div>
    </div>
  );
};

export default Problem;