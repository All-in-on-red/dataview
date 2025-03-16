"use client"
// side bar
import { SidebarInset, SidebarProvider} from "@/components/ui/sidebar"
import { AppSidebar, SidebarTrigger} from "@/components/sidebar/app-sidebar"
import { GenerateTable } from "./table"

import PyodideComponent_test from "./py"
import { PyodideProvider } from "@/components/pyodide/provider"

export default function Home() {
  return (
    <PyodideProvider>
    <div>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex">
            <SidebarTrigger />
            <div>This is the top bar!</div>
          </header>
          <div>
            <PyodideComponent_test/>
            <GenerateTable/>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
    </PyodideProvider>
  )
}