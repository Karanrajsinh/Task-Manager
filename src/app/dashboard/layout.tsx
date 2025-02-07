
import { AppSidebar } from "@/components/app-sidebar"
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar"
import { ModeToggle } from "@/components/ui/themeToggle"
import {
    SignedIn,
    UserButton
} from '@clerk/nextjs'
import { ReactElement } from "react"

export default function Page({ children }: { children: ReactElement }) {
    return (

        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <header className="flex bg-secondary/5 h-16  justify-between items-center gap-2 border-b">
                    <div className="flex  items-center gap-2 px-3">
                        <SidebarTrigger />
                    </div>
                    <p className="font-bold ml-4">TASK MANAGER</p>
                    <div className="flex justify-center mr-4 lg:mr-10 items-center gap-4">
                        <ModeToggle />
                        <SignedIn>
                            <UserButton />
                        </SignedIn>
                    </div>
                </header>
                {children}
            </SidebarInset>
        </SidebarProvider>

    )
}

