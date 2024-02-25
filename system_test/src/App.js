// src/App.js
import React, { useState, useEffect } from "react";
import TestForm from "./components/testForm.tsx";
import TestResults from "./components/testResults.tsx";
import { faker } from "@faker-js/faker";

import { performPerformanceTest } from "./Tests/Performance_Evalutaion.ts";
import { performUnauthorizedTest } from "./Tests/Unauthorized_Access_Test.ts";
import { performScalabilityTest } from "./Tests/Scalability_Test.ts";

const generateDummyJsonData = (dataSizeInKb) => {
  // Define the structure of your JSON data here
  const data = [];
  while (JSON.stringify(data).length < dataSizeInKb * 1024) {
    data.push({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      flightNumber: faker.airline.flightNumber,
      number: faker.number.bigInt,
      address: {
        city: faker.location.city(),
        streetAddress: faker.location.streetAddress(),
        country: faker.location.country(),
      },
    });
  }
  return data;
};

const App = () => {
  const [results, setResults] = useState(null);
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("/data.json") // Adjust the path as needed.
      .then((response) => response.json())
      .then((data) => setData(data));
  }, []);

  const getDataBySize = (dataSizeInKb) => {
    const targetSize = dataSizeInKb * 1024; // Convert KB to bytes
    let currentSize = 0;
    const result = [];

    for (const item of data) {
      const itemSize = new TextEncoder().encode(JSON.stringify(item)).length;
      if (currentSize + itemSize > targetSize) break;
      result.push(item);
      currentSize += itemSize;
    }
    return result;
  };
  const handleTestSubmit = async ({ testType, dataLimit }) => {
    if (testType === "encryption") {
      const rawData = getDataBySize(dataLimit);
      const result = performPerformanceTest("testingitfortest", rawData);
      setResults(result);
    } else if (testType == "unauthorizedaccess") {
      const rawData = getDataBySize(dataLimit);
      const result = performUnauthorizedTest(
        "testingitfortest",
        "testingitforunauthorizedtest",
        rawData
      );
      setResults(result);
    } else if (testType == "scalability") {
      const rawData = getDataBySize(dataLimit);
      const result = await performScalabilityTest("testingitfortest", rawData);
      setResults(result);
    }
  };

  return (
    <div className="App">
      <h1>System Performance Testing</h1>
      <TestForm onTestSubmit={handleTestSubmit} />
      {results && <TestResults results={results} />}
    </div>
  );
};

export default App;
