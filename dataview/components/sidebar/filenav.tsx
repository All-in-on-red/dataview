"use client"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@radix-ui/react-collapsible";
import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSubButton} from "../ui/sidebar";
import { ChevronRight, File, Folder, FolderClosed, Search, Upload } from "lucide-react";
import React from "react";
import { Separator } from "@/components/ui/separator"

function LoadedFiles(){
    const [isOpen, setIsOpen] = React.useState(true)
    const [csvFiles, setCsvFiles] = React.useState<{ [key: string]: { name: string, content: string } }>({});

    // Load CSV files from localStorage on mount
    React.useEffect(() => {
        const handleStorageUpdate = () => {
            const storedFiles = sessionStorage.getItem('csvFiles');
            if (storedFiles) {
                setCsvFiles(JSON.parse(storedFiles));
            }
        };

        handleStorageUpdate() // Call once to load files already in session storage
        // Add event listener for custom event
        window.addEventListener('sessionStorageUpdated', handleStorageUpdate);

        // Cleanup event listener on component unmount
        return () => {
            window.removeEventListener('sessionStorageUpdated', handleStorageUpdate);
        };
            
    }, []);
    
    return ( 
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="group/collapsible group-data-[collapsible=icon]:hidden">
        <CollapsibleTrigger asChild>
            <SidebarMenuItem>
                <SidebarMenuButton tooltip="Files">
                    <FolderClosed/>
                    <span>Loaded Files</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
            </SidebarMenuItem>
        </CollapsibleTrigger>
        <CollapsibleContent>
            <SidebarMenuItem>
                {/*  add more of this for files*/}
                {
                    Object.entries(csvFiles).map(([key,value]) => {
                        return (
                            <SidebarMenuSubButton key={key}>
                                <File />
                                <span>{value.name}</span>
                            </SidebarMenuSubButton>
                        )
                    })
                }
            </SidebarMenuItem>
        </CollapsibleContent>
    </Collapsible> 
    )
}

function FolderTree(
    { folder, addCSVFile, path = "" , className=""}: { 
        folder: FileSystemDirectoryHandle;
        addCSVFile: (file: { path: string; name: string; content: string  }) => void;
        path:string;
        className?:String}) {
    const [entries, setEntries] = React.useState<FileSystemHandle[]>([]);
    const [open, setOpen] = React.useState(false);

    const currentPath = path === "" ? `/${folder.name}` : `${path}/${folder.name}`

    const handleLoadCSV = async (fileHandle: FileSystemFileHandle) => {
        try {
            const file = await fileHandle.getFile();
            const text = await file.text();
            const fullPath = `${currentPath}/${file.name}`;
            addCSVFile({path:fullPath, name: file.name, content: text }); // Adds or updates without duplicates
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
        <Collapsible open={open} onOpenChange={setOpen} className={className}>
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
                                className="group/collapsible group-data-[collapsible=icon]:hidden"
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
                        return <FolderTree folder={entry} key={entry.name} path={currentPath} addCSVFile={addCSVFile} className={ "group/collapsible group-data-[collapsible=icon]:hidden" }/>
                    }
                    return null;
                })}
            </CollapsibleContent>
        </Collapsible>
    );
}

function FileBrowser(){
    const [folderHandle, setFolderHandle] = React.useState<FileSystemDirectoryHandle | null>(null);
    const [csvFiles, setCsvFiles] = React.useState<{ [key: string]: { name: string, content: string } }>({});

    // Load CSV files from localStorage on mount
    React.useEffect(() => {
        const storedFiles = sessionStorage.getItem('csvFiles');
        if (storedFiles) {
            setCsvFiles(JSON.parse(storedFiles));
        }
    }, []);

    // Function to add/update CSV files (ensures uniqueness)
    const addCSVFile = (file: {path:string; name: string; content: string }) => {
        setCsvFiles((prevFiles) => {
            const updatedFiles = { ...prevFiles, [file.path]: { name: file.name, content: file.content}};
            sessionStorage.setItem('csvFiles', JSON.stringify(updatedFiles)); // Save to localStorage
            return updatedFiles;
        });
        
        // Dispatch custom event
        const event = new Event('sessionStorageUpdated');
        window.dispatchEvent(event);
    };

    // Function to delete a specific file
    const removeCSVFile = (filePath: string) => {
        setCsvFiles((prevFiles) => {
            const updatedFiles = { ...prevFiles };
            delete updatedFiles[filePath];
            sessionStorage.setItem('csvFiles', JSON.stringify(updatedFiles));
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
            <div>
                <Separator/>
                <SidebarMenuButton onClick={chooseFolder}>
                    <Search />
                    Open Folder
                </SidebarMenuButton>
                <Separator/>
                {folderHandle && (<FolderTree folder={folderHandle} addCSVFile={addCSVFile}/>)}
            </div>
        </SidebarMenuItem>
    )
}

export function FilesSection(){
    return (
        <SidebarGroup>
            <SidebarGroupLabel>Files</SidebarGroupLabel>
            <SidebarGroupContent>
                <SidebarMenu>
                    <LoadedFiles/>
                    <Separator className="invisible"/>
                    <FileBrowser/>
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    )   
}