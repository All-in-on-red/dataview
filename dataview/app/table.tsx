"use client"

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import React, { useEffect, useState } from "react";
import {useSelectedFile} from "@/components/sidebar/fileselect";
import { usePyodide } from "@/components/pyodide/provider";
import get_source from "@/components/pyodide/source";

export function DataTables() {      
    const {file,set} = useSelectedFile()
    const { pyodide, runPython } = usePyodide();
    const [py_source, setSource] = useState("")
    const [JsonStore,setJsonStore] = useState<{[key:string]:[{}]}>({})
    const [PropStore,setPropStore] = useState<{[key:string] : React.ReactElement[]}>({})

    React.useEffect(() => {
        const load = async () => {
            const source_file = await get_source("test.py")
            setSource(source_file)           
        }
        load()
    },[])

    React.useEffect(() => {
        const stored = sessionStorage.getItem('csvFiles')
        if (stored) {
            const obj: { [key: string]: { name: string, content: string } } = JSON.parse(stored)
            if (file !== "") {
                runPython(py_source.replace("#replace_here#",obj[file].content))

                let r = runPython("result()")
                const json = JSON.parse(r)

                setJsonStore((prev) => ({...prev,[file]:json}))

                setPropStore((prev) => {
                    if (!prev[file]) {
                        return { ...prev, [file]: [] };
                    }
                    return prev;
                });
            }
        }
    },[file])

    const batchSize = 5;
    
    useEffect(() => {
        if (file && JsonStore[file]) {
            const currentRows = PropStore[file] || [];
            const totalRows = JsonStore[file].length;

            // If there are still rows left to render...
            if (currentRows.length < totalRows) {
                const timer = setTimeout(() => {
                    const nextBatchData = JsonStore[file].slice(
                        currentRows.length,
                        currentRows.length + batchSize
                    );
                    // Create React elements for the next batch.
                    const nextBatchRows = nextBatchData.map((rowData, index) => (
                        <TableRow key={currentRows.length + index}>
                            {Object.keys(rowData).map((jsonKey) => (
                                <TableCell key={jsonKey}>{rowData[jsonKey]}</TableCell>
                            ))}
                        </TableRow>
                    ));
                    // Append the new rows using a functional state update.
                    setPropStore((prev) => ({
                        ...prev,
                        [file]: [...(prev[file] || []), ...nextBatchRows],
                    }));
                }, 0);
                return () => clearTimeout(timer);
            }
        }
    }, [file, JsonStore, PropStore]);

    function GenTable(key:any) {
        const json = JsonStore[key]
        const prop = PropStore[key]
        return ( <Table key={key}>
            <TableHeader>
                <TableRow>
                    {json && (
                        Object.keys(json[0]).map((key)=>(
                            <TableHead key={key}>{key}</TableHead>
                        ))
                    )}
                </TableRow>
            </TableHeader>
            <TableBody>
                {prop}
            </TableBody>
        </Table> )
    }
    
    return (
        <div>
            {
                Object.keys(JsonStore).map((key)=> GenTable(key))
            }
        </div>
    )
}