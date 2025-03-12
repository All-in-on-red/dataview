// side bar
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/sidebar/app-sidebar"

export default function Home() {
  return (
    <div>
      <SidebarProvider>
        <AppSidebar />
        <SidebarTrigger></SidebarTrigger>
      </SidebarProvider>
    </div>
  )
}