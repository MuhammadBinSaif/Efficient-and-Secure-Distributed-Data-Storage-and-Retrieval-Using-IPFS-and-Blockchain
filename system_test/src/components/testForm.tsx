// src/components/TestForm.js
import React, { useState } from "react";

const TestForm = ({ onTestSubmit }) => {
  const [testType, setTestType] = useState("encryption");
  const [dataLimit, setDataLimit] = useState(10);

  const handleSubmit = (e) => {
    e.preventDefault();
    onTestSubmit({ testType, dataLimit: parseInt(dataLimit, 10) });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Test Type:</label>
        <select value={testType} onChange={(e) => setTestType(e.target.value)}>
          <option value="encryption">Encryption</option>
          <option value="unauthorizedaccess">Unauthorized Access</option>
          <option value="scalability">Scalability</option>
        </select>
      </div>
      <div>
        <label>Data Limit:</label>
        <input
          type="number"
          value={dataLimit}
          onChange={(e) => setDataLimit(e.target.value)}
        />
      </div>
      <button type="submit">Run Test</button>
    </form>
  );
};

export default TestForm;
