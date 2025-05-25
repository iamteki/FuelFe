"use client"

import type React from "react"
import { Car, Droplet, FileText, GaugeCircle, Home, Users } from "lucide-react"
import { DashboardLayout } from "@/components/layouts/dashboard-layout"

const navItems = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: Home,
  },
  {
    title: "Vehicle Owners",
    href: "/admin/dashboard/vehicle-owners",
    icon: Car,
  },
  {
    title: "Fuel Stations",
    href: "/admin/dashboard/fuel-stations",
    icon: Droplet,
  },
  {
    title: "Quota Management",
    href: "/admin/dashboard/quota",
    icon: FileText,
  },
  {
    title: "Users",
    href: "/admin/dashboard/users",
    icon: Users,
  },
]

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <DashboardLayout
      navItems={navItems}
      portalName="Administrator Portal"
      portalIcon={GaugeCircle}
      portalColor="amber"
      gradientFrom="amber-500"
      gradientTo="orange-600"
      userName="Admin User"
    >
      {children}
    </DashboardLayout>
  )
}
