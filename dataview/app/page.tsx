// side bar
import { SidebarInset, SidebarProvider} from "@/components/ui/sidebar"
import { AppSidebar, SidebarTrigger} from "@/components/sidebar/app-sidebar"
import { TableDemo } from "./table_sample"

export default function Home() {
  return (
    <div>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex">
            <SidebarTrigger />
            <div>This is the top bar!</div>
          </header>
          <div>
            <TableDemo />
            <p>This is the main content</p>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}