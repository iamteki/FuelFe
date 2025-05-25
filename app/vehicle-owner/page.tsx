import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AuthForm } from "@/components/auth/auth-form"
import { ArrowLeft, Car } from "lucide-react"

export default function VehicleOwnerLoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 to-slate-50 flex flex-col">
      <div className="container mx-auto px-4 py-6">
        <Link href="/" className="inline-flex items-center text-violet-600 hover:text-violet-800">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border border-slate-200 shadow-lg">
          <div className="h-2 bg-gradient-to-r from-violet-400 to-purple-500"></div>
          <CardHeader className="text-center">
            <div className="mx-auto bg-violet-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-2">
              <Car className="h-8 w-8 text-violet-600" />
            </div>
            <CardTitle className="text-2xl">Vehicle Owner Portal</CardTitle>
            <CardDescription>Login or register to manage your fuel quota</CardDescription>
          </CardHeader>
          <CardContent>
            <AuthForm
              redirectPath="/vehicle-owner/dashboard"
              portalType="vehicle-owner"
              primaryColor="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
