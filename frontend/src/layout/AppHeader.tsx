import {
  Bell,
  CalendarCheck,
  ChevronDown,
  CreditCard,
  LogOut,
  Menu,
  Plus,
  Search,
  Settings,
  ShoppingBag,
  UserCircle,
  UtensilsCrossed,
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import { toast } from "sonner"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SidebarTrigger } from "@/components/ui/sidebar"

const notifications = [
  {
    title: "New order received", detail: "Table 5 ordered 2 Chicken Kottu and 1 Fried Rice", time: "2 min ago", icon: <Bell />,
  },
  {
    title: "Table reservation", detail: "Ms. Jane booked a table for 4 at 7:30 PM", time: "3 min ago", icon: <CalendarCheck />,
  },
  {
    title: "Order ready to serve", detail: "Order #1042 is ready at the kitchen counter", time: "5 min ago", icon: <UtensilsCrossed />,
  },
  {
    title: "Takeaway order", detail: "Mr. John placed a takeaway order, pickup in 20 min", time: "8 min ago", icon: <ShoppingBag />,
  },
  {
    title: "Payment received", detail: "Table 3 paid Rs. 4,500 by card", time: "10 min ago", icon: <CreditCard />,
  },
]

export function AppHeader({ title }: { title: string }) {
  const navigate = useNavigate()
  const { user: authUser, logout } = useAuth()

  const user = {
    name: authUser?.name || "Admin User",
    email: authUser?.email || "admin@flowpilot.com",
    avatar: "/user.png",
  }

  const handleLogout = () => {
    const logoutPromise = logout().then(
      () =>
        new Promise<void>((resolve) => {
          setTimeout(() => {
            navigate("/login", { replace: true })
            resolve()
          }, 350)
        })
    )

    toast.promise(logoutPromise, {
      loading: "Signing out...",
      success: "Signed out successfully!",
      error: "Failed to sign out. Please try again.",
    })
  }

  return (
    <header className="dashboard-header">
      <div className="header-left">
        <SidebarTrigger variant="ghost" size="icon-sm" aria-label="Toggle sidebar">
          <Menu className="size-4" />
        </SidebarTrigger>
        <span className="header-divider" />
        <div className="header-context">
          <span className="header-kicker">Workspace</span>
          <span className="header-title">{title}</span>
        </div>
      </div>
      <div className="header-actions">
        <button className="header-search" type="button" aria-label="Search">
          <Search className="size-4" />
          <span>Search</span>
          <kbd>Ctrl K</kbd>
        </button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="icon-button notification-button" type="button" aria-label="Open notifications">
              <Bell className="size-4" />
              <span className="notification-dot" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="notification-menu" align="end">
            <div className="notification-menu-header">
              <strong>Notifications</strong>
              <span>5 new updates</span>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {notifications.map((notification) => (
                <DropdownMenuItem className="notification-item" key={notification.title}>
                  <span className="notification-item-dot" />
                  <span className="notification-item-content">
                    <strong>{notification.title}</strong>
                    <small>{notification.detail}</small>
                    <time>{notification.time}</time>
                  </span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="notification-see-more"
              onClick={() => navigate("/notifications")}
            >
              See more notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <button className="outline-button" type="button" onClick={() => navigate("/orders/pos")}>
          <Plus className="size-4" /> New Order
        </button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="profile-trigger" type="button" aria-label="Open user menu">
              <Avatar className="profile-avatar">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>KP</AvatarFallback>
              </Avatar>
              <span className="profile-name">{user.name}</span>
              <ChevronDown className="size-3.5" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="profile-menu" align="end">
            <DropdownMenuLabel className="profile-menu-label">
              <Avatar className="profile-menu-avatar">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>KP</AvatarFallback>
              </Avatar>
              <span>
                <strong>{user.name}</strong>
                <small>{user.email}</small>
              </span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => navigate("/admin/users")}>
                <UserCircle className="size-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/admin/users")}>
                <Settings className="size-4" />
                Account settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/admin/users")}>
                <CreditCard className="size-4" />
                Billing
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onClick={handleLogout} className="cursor-pointer">
              <LogOut className="size-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
