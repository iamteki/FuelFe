"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Bell, ChevronDown, LogOut, Menu, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

interface NavItem {
  title: string
  href: string
  icon: React.ElementType
}

interface DashboardLayoutProps {
  children: React.ReactNode
  navItems: NavItem[]
  portalName: string
  portalIcon: React.ElementType
  portalColor: string
  gradientFrom: string
  gradientTo: string
  userName?: string
}

export function DashboardLayout({
  children,
  navItems,
  portalName,
  portalIcon: PortalIcon,
  portalColor,
  gradientFrom,
  gradientTo,
  userName = "User",
}: DashboardLayoutProps) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)
  const pathname = usePathname()

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="container mx-auto px-0 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2 pl-2">
            <div className={`bg-gradient-to-r from-${gradientFrom} to-${gradientTo} text-white p-2 rounded-lg`}>
              <PortalIcon className="h-5 w-5" />
            </div>
            <h1 className="text-lg font-bold">{portalName}</h1>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="text-slate-600 hover:text-slate-900 hover:bg-slate-100">
              <Bell className="h-5 w-5" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                >
                  <User className="h-5 w-5" />
                  <span className="hidden md:inline">{userName}</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Sheet open={isMobileNavOpen} onOpenChange={setIsMobileNavOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className={`bg-white border-r-0`}>
                <div className="flex flex-col h-full">
                  <div className="flex items-center gap-2 mb-8 mt-4">
                    <div className={`bg-gradient-to-r from-${gradientFrom} to-${gradientTo} text-white p-2 rounded-lg`}>
                      <PortalIcon className="h-5 w-5" />
                    </div>
                    <h2 className="text-lg font-bold">{portalName}</h2>
                  </div>

                  <nav className="flex-1">
                    <ul className="space-y-2">
                      {navItems.map((item) => (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                              pathname === item.href
                                ? `bg-gradient-to-r from-${gradientFrom} to-${gradientTo} text-white`
                                : "text-slate-600 hover:bg-slate-100"
                            }`}
                            onClick={() => setIsMobileNavOpen(false)}
                          >
                            <item.icon className="h-5 w-5" />
                            <span>{item.title}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </nav>

                  <div className="mt-auto mb-8">
                    <Link
                      href="/"
                      className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
                    >
                      <LogOut className="h-5 w-5" />
                      <span>Log out</span>
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex flex-1">
        {/* Sidebar (desktop only) */}
        <aside className="hidden md:block w-64 bg-white border-r border-slate-200">
          <nav className="p-4 h-full">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                      pathname === item.href
                        ? `bg-gradient-to-r from-${gradientFrom} to-${gradientTo} text-white`
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 bg-slate-50">
          <div className="container mx-auto p-6">{children}</div>
        </main>
      </div>
    </div>
  )
}
