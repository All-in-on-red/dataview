// side bar
import { SidebarInset, SidebarProvider} from "@/components/ui/sidebar"
import { AppSidebar, SidebarTrigger} from "@/components/sidebar/app-sidebar"
import { TableDemo } from "./table"

export default function Home() {
  return (
    <div>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <SidebarTrigger />
          <TableDemo />
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}