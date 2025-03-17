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
import React, { useState } from "react";
import {useSelectedFile} from "@/components/sidebar/fileselect";
import { usePyodide } from "@/components/pyodide/provider";
import get_source from "@/components/pyodide/source";

export function GenerateTable(){
    const {file,set} = useSelectedFile()
    const [json,setJson] = useState()
    const { pyodide, runPython } = usePyodide();
    const [py_source, setSource] = useState("")

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
                // setFileContent(r)
                setJson(json)
            }
        }
    },[file])
    return(
        <Table>
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
                    {json && (
                        Object.keys(json).map((key)=>(
                            <TableRow key={key}>
                                {
                                    Object.keys(json[key]).map((json_entry)=>(
                                        <TableCell key={json_entry}>{json[key][json_entry]}</TableCell>
                                    ))
                                }
                            </TableRow>
                        ))
                    )}
            </TableBody>
        </Table>
    )
}