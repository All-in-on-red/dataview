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
import React from "react";


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