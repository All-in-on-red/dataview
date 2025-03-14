"use client"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@radix-ui/react-collapsible";
import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSubButton, SidebarRail } from "../ui/sidebar";
import { ChevronRight, File, Folder, Search, Upload } from "lucide-react";
import React from "react";
import { Input } from "../ui/input";
import { Label } from "@radix-ui/react-label";

function LoadedFiles(){
    const [isOpen, setIsOpen] = React.useState(false)
    return ( 
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="group/collapsible group-data-[collapsible=icon]:hidden">
        <CollapsibleTrigger asChild>
            <SidebarMenuItem>
                <SidebarMenuButton tooltip="Files">
                    <span>Loaded Files</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
            </SidebarMenuItem>
        </CollapsibleTrigger>
        <CollapsibleContent>
            <SidebarMenuItem>
                {/*  add more of this for files*/}
                <SidebarMenuSubButton>
                    {File && <File />}
                    <span>Hello world</span>
                </SidebarMenuSubButton>
            </SidebarMenuItem>
        </CollapsibleContent>
    </Collapsible> 
    )
}

function AddFileButton() {
    function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
        const files = event.target.files;
        if (files && files.length > 0) {
            const file = files[0]; // Only process the first file (can be adjusted)

            // Read file content
            const reader = new FileReader();
            reader.onload = (e) => {
                console.log("File Content:", e.target?.result); // Do something with the file content
            };
            reader.readAsText(file); // Reads as text (for CSVs)

            // Clear the input field after reading the file
            event.target.value = "";
        }
    }

    return (<SidebarMenuItem key="Add File">
        <SidebarMenuButton asChild type="submit">
            <Label htmlFor="files">
                <Upload />
                <span>Add File</span>
            </Label>
        </SidebarMenuButton>
        <Input className="hidden" id="files" type="file" accept=".csv" onChange={handleFileChange} multiple></Input>
    </SidebarMenuItem>)
}


function FolderTree(
    { folder, addCSVFile, }: { folder: FileSystemDirectoryHandle; addCSVFile: (file: { name: string; content: string }) => void; 
}) {
    const [entries, setEntries] = React.useState<FileSystemHandle[]>([]);
    const [open, setOpen] = React.useState(false);

    const handleLoadCSV = async (fileHandle: FileSystemFileHandle) => {
        try {
            const file = await fileHandle.getFile();
            const text = await file.text();
            addCSVFile({ name: file.name, content: text }); // Adds or updates without duplicates
        } catch (error) {
            console.error('Error loading CSV:', error);
        }
    };

    // When the collapsible is open, load its entries (CSV files and directories)
    React.useEffect(() => {
        if (open) {
            const loadEntries = async () => {
                const newEntries: FileSystemHandle[] = [];
                for await (const entry of folder.values()) {
                    // Only include CSV files and directories
                    if (entry.kind === 'file' && entry.name.toLowerCase().endsWith('.csv')) {
                        newEntries.push(entry);
                    } else if (entry.kind === 'directory') {
                        newEntries.push(entry);
                    }
                }
                setEntries(newEntries);
            };
            loadEntries();
        }
    }, [open, folder]);

    return (
        <Collapsible open={open} onOpenChange={setOpen}>
            <CollapsibleTrigger asChild>
                <SidebarMenuButton>
                    <Folder />
                    {folder.name}
                    <ChevronRight className={`ml-auto transition-transform duration-200 ${open ? 'rotate-90' : ''}`} />
                </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent className="pl-4">
                {entries.map((entry) => {
                    if (entry.kind === 'file') {
                        // For CSV files, use an anchor tag as a placeholder
                        return (
                            <SidebarMenuButton
                                key={entry.name}
                                onMouseUp={(e) => e.stopPropagation()}
                                onMouseDown={(e) => e.stopPropagation()}
                                onClick={(event) => {
                                    event.stopPropagation(); // Prevent the click from bubbling up
                                    handleLoadCSV(entry as FileSystemHandle);
                                }}
                            >
                                <File />
                                {entry.name}
                            </SidebarMenuButton>
                        );
                    } else if (entry.kind === 'directory') {
                        // Recursively render child folders
                        return <FolderTree folder={entry} key={entry.name} />
                    }
                    return null;
                })}
            </CollapsibleContent>
        </Collapsible>
    );
}

function FileBrowser(){
    const [isOpen, setIsOpen] = React.useState(true)
    const [folderHandle, setFolderHandle] = React.useState<FileSystemDirectoryHandle | null>(null);
    const [csvFiles, setCsvFiles] = React.useState<{ [key: string]: string }>({});

    // Load CSV files from localStorage on mount
    React.useEffect(() => {
        const storedFiles = sessionStorage.getItem('csvFiles');
        if (storedFiles) {
            setCsvFiles(JSON.parse(storedFiles));
        }
    }, []);

    // Function to add/update CSV files (ensures uniqueness)
    const addCSVFile = (file: { name: string; content: string }) => {
        setCsvFiles((prevFiles) => {
            const updatedFiles = { ...prevFiles, [file.name]: file.content };
            sessionStorage.setItem('csvFiles', JSON.stringify(updatedFiles)); // Save to localStorage
            return updatedFiles;
        });
    };

    // Function to delete a specific file
    const removeCSVFile = (fileName: string) => {
        setCsvFiles((prevFiles) => {
            const updatedFiles = { ...prevFiles };
            delete updatedFiles[fileName]; // Remove from object
            sessionStorage.setItem('csvFiles', JSON.stringify(updatedFiles)); // Update localStorage
            return updatedFiles;
        });
    };
    
    async function chooseFolder() {
        try {
            const dirHandle = await window.showDirectoryPicker();
            setFolderHandle(dirHandle);
            // If you need persistent storage, consider using IndexedDB here.
        } catch (error) {
            console.error('Folder selection cancelled or failed:', error);
        }
    }
    

    return (
        <SidebarMenuItem>
            <Collapsible open={isOpen} onOpenChange={setIsOpen} className="group/collapsible">
                <div style={{
                    display: "flex",
                    flexDirection: "row"
                }}>
                    <SidebarMenuButton style={{ width: "87%" }} onClick={chooseFolder}>
                        <Search />
                        Open Folder
                    </SidebarMenuButton>
                    <CollapsibleTrigger asChild>
                        <SidebarMenuButton style={{ width: "13%", margin: "0" }}>
                            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                        </SidebarMenuButton>
                    </CollapsibleTrigger>
                </div>
                <CollapsibleContent>
                    {folderHandle && (<FolderTree folder={folderHandle} addCSVFile={addCSVFile}/>)}
                </CollapsibleContent>
            </Collapsible>
        </SidebarMenuItem>
    )
}

export function FilesSection(){
    return (
        <SidebarGroup>
            <SidebarGroupLabel>Files</SidebarGroupLabel>
            <SidebarGroupContent>
                <SidebarMenu>
                    <AddFileButton/>
                    <LoadedFiles/>
                    <FileBrowser/>
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    )   
}