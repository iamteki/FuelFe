import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AuthForm } from "@/components/auth/auth-form"
import { ArrowLeft, GaugeCircle } from "lucide-react"

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-slate-50 flex flex-col">
      <div className="container mx-auto px-4 py-6">
        <Link href="/" className="inline-flex items-center text-amber-600 hover:text-amber-800">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border border-slate-200 shadow-lg">
          <div className="h-2 bg-gradient-to-r from-amber-400 to-orange-500"></div>
          <CardHeader className="text-center">
            <div className="mx-auto bg-amber-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-2">
              <GaugeCircle className="h-8 w-8 text-amber-600" />
            </div>
            <CardTitle className="text-2xl">Administrator Portal</CardTitle>
            <CardDescription>Government employee access only</CardDescription>
          </CardHeader>
          <CardContent>
            <AuthForm
              redirectPath="/admin/dashboard"
              portalType="admin"
              primaryColor="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
