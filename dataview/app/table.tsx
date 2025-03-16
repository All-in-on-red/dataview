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

export function GenerateTable(){
    const {file,set} = useSelectedFile()
    const [json,setJson] = useState()
    const { pyodide, runPython } = usePyodide();

    React.useEffect(() => {
        const stored = sessionStorage.getItem('csvFiles')
        if (stored) {
            const obj: { [key: string]: { name: string, content: string } } = JSON.parse(stored)
            if (file !== "") {
                runPython(`
from io import StringIO
import pandas as pd

file = """#replace_here#"""
# file = open("data.csv").read()
TESTDATA = StringIO(file)

sep = ","
if ";" in file:
    sep = ";"

df = pd.read_csv(TESTDATA, sep=sep)
def result():
    return df.head().to_json(orient='records')
                `.replace("#replace_here#",obj[file].content))

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
                                        <TableCell>{json[key][json_entry]}</TableCell>
                                    ))
                                }
                            </TableRow>
                        ))
                    )}
            </TableBody>
        </Table>
    )
}