import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AuthForm } from "@/components/auth/auth-form"
import { ArrowLeft, Droplet } from "lucide-react"

export default function StationOwnerLoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-slate-50 flex flex-col">
      <div className="container mx-auto px-4 py-6">
        <Link href="/" className="inline-flex items-center text-teal-600 hover:text-teal-800">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border border-slate-200 shadow-lg">
          <div className="h-2 bg-gradient-to-r from-teal-400 to-emerald-500"></div>
          <CardHeader className="text-center">
            <div className="mx-auto bg-teal-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-2">
              <Droplet className="h-8 w-8 text-teal-600" />
            </div>
            <CardTitle className="text-2xl">Fuel Station Owner Portal</CardTitle>
            <CardDescription>Login or register to manage your fuel stations</CardDescription>
          </CardHeader>
          <CardContent>
            <AuthForm
              redirectPath="/station-owner/dashboard"
              portalType="station-owner"
              primaryColor="bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
