import React, { useEffect } from 'react';
import { usePyodide } from '@/components/pyodide/provider';
import { Button } from '@/components/ui/button';

const PyodideComponent = () => {
  const { pyodide, runPython } = usePyodide();

  useEffect(() => {
    if (pyodide) {
      // Example: Get Python version
      runPython(`
import pandas
import json
import numpy as np
def greet():
    return np.random.random_sample()
      `);
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