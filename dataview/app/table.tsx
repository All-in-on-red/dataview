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

export function Test() {
    const {file,set} = useSelectedFile()
    const [Filecontent,setFileContent] = useState("")

    React.useEffect(() => {
        const stored = sessionStorage.getItem('csvFiles')
        if (stored) {
            const obj: { [key: string]: { name: string, content: string } } = JSON.parse(stored)
            if (file !== "") {
                setFileContent(obj[file].content)
            }
        }
    })

    return (
        <p>
            {file}
            {Filecontent}
        </p>
    )
}

export function GenerateTable(file:String){
    const [ content,setContent ]  = React.useState("");

    // Load CSV files from localStorage on mount
    React.useEffect(() => {
        const storedFiles = sessionStorage.getItem('csvFiles');
        if (storedFiles) {
            setContent(JSON.parse(storedFiles).file);
        }
    }, []);

    return(
        <Table>
            <TableHeader>
                
            </TableHeader>
            <TableBody>

            </TableBody>
        </Table>
    )
}