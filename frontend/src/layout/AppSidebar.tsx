"use client"

import * as React from "react"
import { Link } from "react-router-dom"
import {
  IconDashboard,
  IconShoppingCart,
  IconToolsKitchen2,
  IconBuildingStore,
  IconBook2,
  IconCreditCard,
  IconBox,
  IconTruck,
  IconChartBar,
  IconUsers,
  IconShieldCheck,
  IconSettings,
} from "@tabler/icons-react"

import { NavMain, type NavGroup } from "@/components/sidebar/NavMain"
import { NavUser } from "@/components/sidebar/NavUser"
import { useAuth } from "@/context/AuthContext"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const navGroups: NavGroup[] = [
  {
    label: "Main",
    items: [
      {
        title: "Dashboard",
        url: "/overview",
        icon: IconDashboard
      },
    ],
  },
  {
    label: "Operations",
    items: [
      {
        title: "Orders",
        url: "/orders",
        icon: IconShoppingCart,
        items: [
          { title: "All Orders", url: "/orders/all" },
          { title: "New Order / POS", url: "/orders/pos" },
          { title: "Order History", url: "/orders/history" },
        ],
      },
      {
        title: "Kitchen",
        url: "/kitchen",
        icon: IconToolsKitchen2,
        items: [
          { title: "Kitchen Display", url: "/kitchen/display" },
          { title: "Preparing Orders", url: "/kitchen/preparing" },
          { title: "Ready Orders", url: "/kitchen/ready" },
        ],
      },
      {
        title: "Tables",
        url: "/table",
        icon: IconBuildingStore,
      },
    ],
  },
  {
    label: "Menu & Payments",
    items: [
      {
        title: "Menu",
        url: "/menu",
        icon: IconBook2,

      },
      {
        title: "Payments",
        url: "/payments",
        icon: IconCreditCard,
        items: [
          { title: "All Payments", url: "/payments/all" },
          { title: "Pending Payments", url: "/payments/pending" },
          { title: "Payment History", url: "/payments/history" },
        ],
      },
    ],
  },
  {
    label: "Inventory",
    items: [
      {
        title: "Inventory",
        url: "/inventory",
        icon: IconBox,
        items: [
          { title: "Ingredients", url: "/inventory/ingredients" },
          { title: "Stock Movements", url: "/inventory/stock-movements" },
          { title: "Recipes", url: "/inventory/recipes" },
          { title: "Low Stock", url: "/inventory/low-stock" },
        ],
      },
      {
        title: "Suppliers & Purchases",
        url: "/suppliers",
        icon: IconTruck,
        items: [
          { title: "Suppliers", url: "/suppliers/list" },
          { title: "Purchase Orders", url: "/suppliers/purchase-orders" },
          { title: "Receive Stock", url: "/suppliers/receive-stock" },
        ],
      },
    ],
  },
  {
    label: "Analytics",
    items: [
      {
        title: "Reports",
        url: "/reports",
        icon: IconChartBar,
        items: [
          { title: "Sales Reports", url: "/reports/sales" },
          { title: "Top-Selling Items", url: "/reports/top-selling" },
          { title: "Inventory Reports", url: "/reports/inventory" },
        ],
      },
    ],
  },
  {
    label: "Administration",
    items: [
      {
        title: "User Management",
        url: "/users",
        icon: IconUsers,
      },
      {
        title: "Roles & Permissions",
        url: "/roles",
        icon: IconShieldCheck,
        items: [
          { title: "Roles", url: "/admin/roles/list" },
          { title: "Permissions", url: "/admin/roles/permissions" },
        ],
      },
      {
        title: "Settings",
        url: "/settings",
        icon: IconSettings,
        items: [
          { title: "Restaurant Settings", url: "/settings/restaurant" },
          { title: "Profile", url: "/settings/profile" },
          { title: "Change Password", url: "/settings/change-password" },
        ],
      },
    ],
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user: authUser } = useAuth()

  const user = {
    name: authUser?.name || "Admin User",
    email: authUser?.email || "admin@flowpilot.com",
    avatar: "/user.png",
  }
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="p-1.5! hover:bg-transparent data-[active=true]:bg-transparent">
              <Link to="/overview">
                <img
                  src="/restaurant-icon.png"
                  alt="IT Help Desk"
                  className="h-10 w-10 object-contain object-left"
                />

              </Link>
              <span className="text-lg font-semibold text-gray-800" style={{ letterSpacing: "0.08em" }}>
                Aura Dine
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain groups={navGroups} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
