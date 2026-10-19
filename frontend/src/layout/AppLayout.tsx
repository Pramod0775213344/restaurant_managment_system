import { useEffect } from "react"
import { useLocation, Outlet } from "react-router-dom"

import { AppHeader } from "@/layout/AppHeader"
import { AppSidebar } from "@/layout/AppSidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { appRoutes } from "@/routes/AppRoutes"


function AppLayout() {
    const { pathname } = useLocation()

    // Trap browser back button - push multiple sentinels so rapid double-click cannot escape
    useEffect(() => {
        // Push several sentinel entries so even multiple rapid back-clicks stay trapped
        for (let i = 0; i < 5; i++) {
            window.history.pushState(null, "", window.location.href)
        }

        const handlePopState = () => {
            // Immediately re-push sentinels after every back attempt
            for (let i = 0; i < 5; i++) {
                window.history.pushState(null, "", window.location.href)
            }
        }

        window.addEventListener("popstate", handlePopState)
        return () => window.removeEventListener("popstate", handlePopState)
    }, [])

    const currentRoute = pathname.replace(/^\/+/, "") || "overview"
    const route = appRoutes[currentRoute] ?? appRoutes.overview
    return (
        <SidebarProvider
            style={{ "--sidebar-width": "16rem", "--header-height": "3.5rem" } as React.CSSProperties}>
            <AppSidebar variant="inset" />
            <SidebarInset className="overflow-hidden">
                <AppHeader title={route.title} />
                <main className="dashboard-main">
                    <Outlet />
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}

export default AppLayout
