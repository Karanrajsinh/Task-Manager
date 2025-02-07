"use client"
import * as React from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"
import {
  LayoutDashboard,
  Calendar as CalendarIcon,
  Folder,
  ClipboardList
} from "lucide-react"
import { cn } from "@/lib/utils"

interface NavItem {
  title: string;
  url: string;
  icon: React.ElementType;
}

const data: { navMain: NavItem[] } = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Calendar",
      url: "/dashboard/calendar",
      icon: CalendarIcon,
    },
    {
      title: "Projects",
      url: "/dashboard/project",
      icon: Folder,
    }
  ]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const { setOpenMobile } = useSidebar()

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <header className="flex items-center justify-center gap-2 p-4 mx-auto">
            <ClipboardList className="w-6 h-6" />
            <p className="text-xl font-semibold">Task Manager</p>
          </header>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="space-y-2">
          <SidebarMenu className="h-[80vh]">
            <div className="my-auto flex flex-col gap-8 justify-center items-center">
              {data.navMain.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.url
                return (
                  <SidebarMenuItem key={item.title} className="w-full">
                    <SidebarMenuButton
                      tooltip={item.title}
                      asChild
                      className={cn(
                        "w-full flex items-center justify-start mx-auto pl-16 gap-2 hover:bg-primary/25 hover:dark:bg-primary/20 py-6",
                        isActive && "bg-primary/10 dark:bg-primary/30 text-accent-foreground  "
                      )}
                    >
                      <Link
                        href={item.url}
                        className="flex items-center gap-2"
                        onClick={() => setOpenMobile(false)}
                      >
                        <Icon className="w-10 h-10" />
                        <span className="font-medium text-base">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </div>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}