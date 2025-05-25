import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Vehicle Owner Portal | Fuel Quota Management System",
  description: "Manage your vehicle fuel quota and usage",
}

export default function VehicleOwnerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="min-h-screen">{children}</div>
}
