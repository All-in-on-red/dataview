import React, { useEffect } from 'react';
import { usePyodide } from './provider';
import { Button } from '../ui/button';

const PyodideComponent = () => {
  const { pyodide, runPython } = usePyodide();

  useEffect(() => {
    if (pyodide) {
      // Example: Get Python version
      const version = runPython(`
import sys
sys.version
def greet():
    return "Hello from python"
      `);
      console.log('Python version:', version);
    }
  }, [pyodide, runPython]);

  return (
    <div>
    Pyodide should be here
      {pyodide ? (
        <>
          <p>Pyodide is loaded!</p>
          <Button onClick={() => console.log(runPython('greet()'))}>
            Run Python Code
          </Button>
        </>
      ) : (
        <p>Loading Pyodide...</p>
      )}
    </div>
  );
};

export default PyodideComponent;