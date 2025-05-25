"use client"

import type React from "react"
import { Car, FileText, Home, QrCode } from "lucide-react"
import { DashboardLayout } from "@/components/layouts/dashboard-layout"

const navItems = [
  {
    title: "Dashboard",
    href: "/vehicle-owner/dashboard",
    icon: Home,
  },
  {
    title: "My Vehicles",

    href: "/vehicle-owner/dashboard/vehicles",
    icon: Car,
  },
  {
    title: "QR Code",
    href: "/vehicle-owner/dashboard/qr-code",
    icon: QrCode,
  },
  {
    title: "Usage History",
    href: "/vehicle-owner/dashboard/history",
    icon: FileText,
  },
]

export default function VehicleOwnerDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <DashboardLayout
      navItems={navItems}
      portalName="Vehicle Owner Portal"
      portalIcon={Car}
      portalColor="violet"
      gradientFrom="violet-500"
      gradientTo="purple-600"
      userName="John Doe"
    >
      {children}
    </DashboardLayout>
  )
}
