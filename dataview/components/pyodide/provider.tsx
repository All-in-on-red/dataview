import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { loadPyodide, PyodideInterface } from 'pyodide';

interface PyodideContextProps {
  pyodide: PyodideInterface | null;
  runPython: (code: string) => any;
}

const PyodideContext = createContext<PyodideContextProps | undefined>(undefined);

export const PyodideProvider = ({ children }: { children: ReactNode }) => {
  const [pyodide, setPyodide] = useState<PyodideInterface | null>(null);

  useEffect(() => {
    const initPyodide = async () => {
      const py = await loadPyodide({ indexURL: `${window.location.origin}/pyodide` });
      await py.loadPackage("micropip");
      const micropip = py.pyimport("micropip");
      await micropip.install('numpy');
      await micropip.install('pandas');
      setPyodide(py)
    };

    // Load Pyodide only once when the provider mounts
    initPyodide();
  }, []);

  const runPython = (code: string) => {
    if (!pyodide) {
      throw new Error('Pyodide is not loaded yet.');
    }
    return pyodide.runPython(code);
  };

  return (
    <PyodideContext.Provider value={{ pyodide, runPython }}>
      {children}
    </PyodideContext.Provider>
  );
};

//subscribes to the context to access the top level provider
export const usePyodide = (): PyodideContextProps => {
  const context = useContext(PyodideContext);
  if (context === undefined) {
    throw new Error('usePyodide must be used within a PyodideProvider');
  }
  return context;
};