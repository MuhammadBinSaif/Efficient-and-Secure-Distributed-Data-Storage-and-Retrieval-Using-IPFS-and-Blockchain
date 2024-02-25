// src/components/TestResults.js
import React from "react";

const TestResults = ({ results }) => {
  return (
    <div>
      <h3>Test Results:</h3>
      <pre>{JSON.stringify(results, null, 2)}</pre>
    </div>
  );
};

export default TestResults;
