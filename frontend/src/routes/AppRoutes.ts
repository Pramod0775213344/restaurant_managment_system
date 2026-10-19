import type { AppRoute } from "@/types/Navigation"

export const appRoutes: Record<string, AppRoute> = {
  login: { title: "Login", description: "Sign in to FlowPilot.", path: "login" },
  overview: { title: "Dashboard", description: "IT help desk overview.", path: "overview" },
  "tickets/mine": { title: "My Tickets", description: "Track your support requests.", path: "tickets/mine" },
  "tickets/all": { title: "All Tickets", description: "Review every support request.", path: "tickets/all" },
  "tickets/create": { title: "Create Ticket", description: "Submit a new support request.", path: "tickets/create" },
  "agent/workspace": { title: "Agent Workspace", description: "Manage your assigned queue.", path: "agent/workspace" },
  "manager/console": { title: "Manager Console", description: "Monitor support operations.", path: "manager/console" },
  "admin/users": { title: "User Management", description: "Manage users and roles.", path: "admin/users" },
  users: { title: "User Management", description: "Manage users and roles.", path: "users" },
  menu: { title: "Menu Management", description: "Manage restaurant menu categories and items.", path: "menu" },
  table: { title: "Table Management", description: "Manage restaurant tables and their availability.", path: "table" },
  "admin/categories": { title: "Category Management", description: "Manage ticket categories.", path: "admin/categories" },
  notifications: { title: "Notifications", description: "Stay up to date with ticket activity.", path: "notifications" },
}
