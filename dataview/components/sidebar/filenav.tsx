import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@radix-ui/react-collapsible";
import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSubButton } from "../ui/sidebar";
import { ChevronRight, File, Search, Upload } from "lucide-react";
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

function FileBrowser(){
    const [isOpen, setIsOpen] = React.useState(true)
    return (
        <SidebarMenuItem>
            <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                <div style={{
                    display: "flex",
                    flexDirection: "row"
                }}>
                    <SidebarMenuButton style={{ width: "87%" }}>
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
                    <SidebarMenuSubButton>
                        {File && <File />}
                        <span>Hello world</span>
                    </SidebarMenuSubButton>
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