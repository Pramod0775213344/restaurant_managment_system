"use client"

import * as React from "react"
import { Link, useLocation } from "react-router-dom"
import {
  IconChevronDown,
  type Icon,
} from "@tabler/icons-react"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"

export type NavItem = {
  title: string
  url: string
  icon?: Icon
  items?: { title: string; url: string }[]
}

export type NavGroup = {
  label: string
  items: NavItem[]
}

export function NavMain({ groups }: { groups: NavGroup[] }) {
  const [openItems, setOpenItems] = React.useState<Record<string, boolean>>({})
  const location = useLocation()

  const toggleItem = (title: string) => {
    setOpenItems((current) => {
      if (current[title]) {
        return {}
      }

      return { [title]: true }
    })
  }

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-3">
        {groups.map((group) => (
          <div key={group.label} className="flex flex-col gap-1">
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarMenu>
              {group.items.map((item) => {
                const hasSubItems = Boolean(item.items?.length)
                const isOpen = openItems[item.title] ?? false
                const ItemIcon = item.icon
                const isItemActive = location.pathname === item.url

                return (
                  <SidebarMenuItem key={item.title}>
                    {hasSubItems ? (
                      <SidebarMenuButton
                        tooltip={item.title}
                        onClick={() => toggleItem(item.title)}
                        aria-expanded={isOpen}
                      >
                        {ItemIcon && <ItemIcon />}
                        <span>{item.title}</span>
                        <IconChevronDown
                          className={`ml-auto size-4 transition-transform ${
                          isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </SidebarMenuButton>
                    ) : (
                      <SidebarMenuButton
                        tooltip={item.title}
                        isActive={isItemActive}
                        asChild
                      >
                        <Link to={item.url}>
                          {ItemIcon && <ItemIcon />}
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    )}
                    {hasSubItems && (
                      <div className={`submenu-collapse ${isOpen ? "is-open" : ""}`}>
                        <SidebarMenuSub>
                          {item.items?.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton
                                isActive={location.pathname === subItem.url}
                                render={<Link to={subItem.url} />}
                              >
                                <span>{subItem.title}</span>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </div>
                    )}
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </div>
        ))}
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
