"use client"
import { Calendar, Home, Inbox, PanelRightCloseIcon, PanelRightOpenIcon, Search, Settings } from "lucide-react"
import React from "react";
import { cn } from "@/lib/utils"
import { Button } from "../ui/button"
import { useSidebar } from "../ui/sidebar"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { FilesSection } from "./filenav";

// Menu items.
const items = [
  {
    title: "Home",
    url: "#",
    icon: Home,
  },
  {
    title: "Inbox",
    url: "#",
    icon: Inbox,
  },
  {
    title: "Calendar",
    url: "#",
    icon: Calendar,
  },
  {
    title: "Search",
    url: "#",
    icon: Search,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
]

export function SidebarTrigger({
  className,
  onClick,
  children,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { toggleSidebar,state } = useSidebar()
  
  let sidebarStatusText;
  let sidebarStatusIcon;
  if (state === "expanded") {
    sidebarStatusText = "Open";
    sidebarStatusIcon = <PanelRightOpenIcon></PanelRightOpenIcon>
  } else {
    sidebarStatusText = "Closed";
    sidebarStatusIcon = <PanelRightCloseIcon></PanelRightCloseIcon>
  }
  
  

  return (
    <Button
      data-sidebar="trigger"
      data-slot="sidebar-trigger"
      variant="ghost"
      size="icon"
      className={cn("h-7 w-auto ml-5 mt-2 p-1", className)}
      onClick={(event) => {
        onClick?.(event)
        toggleSidebar()
      }}
      {...props}
    >
      {sidebarStatusIcon}
      <span className="sr-only">Toggle Sidebar</span>
      <span>{sidebarStatusText} Sidebar</span>
    </Button>
  )
}

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <FilesSection/>
        <SidebarGroup>
          <SidebarGroupLabel>Tools</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                      <SidebarMenuItem key={item.title}>
                          <SidebarMenuButton asChild>
                              <a href={item.url}>
                                  <item.icon/>
                                  <span>{item.title}</span>
                              </a>
                          </SidebarMenuButton>
                      </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}