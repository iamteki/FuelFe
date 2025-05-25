"use client"

import type React from "react"
import { BarChart3, Droplet, FileText, Home, MapPin, Settings, Truck } from "lucide-react"
import { DashboardLayout } from "@/components/layouts/dashboard-layout"

const navItems = [
  {
    title: "Dashboard",
    href: "/station-owner/dashboard",
    icon: Home,
  },
  {
    title: "My Stations",
    href: "/station-owner/dashboard/stations",
    icon: MapPin,
  },
  {
    title: "Fuel Inventory",
    href: "/station-owner/dashboard/inventory",
    icon: Droplet,
  },
  {
    title: "Transactions",
    href: "/station-owner/dashboard/transactions",
    icon: FileText,
  },
]

export default function StationOwnerDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <DashboardLayout
      navItems={navItems}
      portalName="Fuel Station Owner Portal"
      portalIcon={Droplet}
      portalColor="teal"
      gradientFrom="teal-500"
      gradientTo="emerald-600"
      userName="Sarah Johnson"
    >
      {children}
    </DashboardLayout>
  )
}
