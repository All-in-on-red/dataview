import { loadPyodide, PyodideInterface } from "pyodide";
import { useEffect } from "react";


const PyodideComponent_test = () => {
    
    useEffect(()=>{
        async function setup() {
            const pyodide  = await loadPyodide({ indexURL: `${window.location.origin}/pyodide` }); 
            const define_func = async () => {
                pyodide.runPython(`
                def greet():
                    return "Hello world"
                `)
            }
            define_func()
            async function main() {
                console.log(pyodide.runPython("greet()"))
            }
            main()
            main()
        }
        setup()
    })
    return (
        <div> a </div>
    )
};

export default PyodideComponent_test;