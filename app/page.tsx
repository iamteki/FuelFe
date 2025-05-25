import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronRight, Droplet, GaugeCircle, User } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 to-slate-50">
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="container mx-auto flex justify-between items-center py-4 px-4">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-r from-violet-500 to-purple-500 text-white p-2 rounded-lg">
              <Droplet className="h-6 w-6" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-500 to-purple-600">
              Fuel Quota Management
            </h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-12 px-4">
        <section className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-800 mb-4">Efficient Fuel Distribution</h2>
          <p className="text-lg text-slate-600 mb-8">
            A comprehensive solution to manage and monitor fuel distribution across the nation
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <Card className="border border-slate-200 shadow-md hover:shadow-lg transition-all bg-white overflow-hidden group">
              <div className="h-2 bg-gradient-to-r from-violet-400 to-purple-500"></div>
              <CardHeader className="text-center">
                <div className="mx-auto bg-violet-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-2 group-hover:bg-violet-200 transition-colors">
                  <User className="h-8 w-8 text-violet-600" />
                </div>
                <CardTitle>Vehicle Owners</CardTitle>
                <CardDescription>Register your vehicle and manage your fuel quota</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p>Access your fuel allocation, view usage history, and generate QR codes for fuel stations.</p>
              </CardContent>
              <CardFooter>
                <Button
                  asChild
                  className="w-full bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700"
                >
                  <Link href="/vehicle-owner">
                    Access Portal <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            <Card className="border border-slate-200 shadow-md hover:shadow-lg transition-all bg-white overflow-hidden group">
              <div className="h-2 bg-gradient-to-r from-teal-400 to-emerald-500"></div>
              <CardHeader className="text-center">
                <div className="mx-auto bg-teal-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-2 group-hover:bg-teal-200 transition-colors">
                  <Droplet className="h-8 w-8 text-teal-600" />
                </div>
                <CardTitle>Fuel Station Owners</CardTitle>
                <CardDescription>Register and manage your fuel stations</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p>Monitor fuel allocations, track distribution, and manage your station operations efficiently.</p>
              </CardContent>
              <CardFooter>
                <Button
                  asChild
                  className="w-full bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700"
                >
                  <Link href="/station-owner">
                    Access Portal <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            <Card className="border border-slate-200 shadow-md hover:shadow-lg transition-all bg-white overflow-hidden group">
              <div className="h-2 bg-gradient-to-r from-amber-400 to-orange-500"></div>
              <CardHeader className="text-center">
                <div className="mx-auto bg-amber-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-2 group-hover:bg-amber-200 transition-colors">
                  <GaugeCircle className="h-8 w-8 text-amber-600" />
                </div>
                <CardTitle>Administrators</CardTitle>
                <CardDescription>Government employee access only</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p>Comprehensive system management, monitoring, and reporting for authorized personnel.</p>
              </CardContent>
              <CardFooter>
                <Button
                  asChild
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700"
                >
                  <Link href="/admin">
                    Access Portal <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </section>

        <section className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-md">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="bg-gradient-to-r from-violet-500 to-purple-600 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4 text-white">
                <span className="text-xl font-bold">1</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Register</h3>
              <p className="text-slate-600">Create an account and register your vehicle or fuel station</p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="bg-gradient-to-r from-teal-500 to-emerald-600 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4 text-white">
                <span className="text-xl font-bold">2</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Verify</h3>
              <p className="text-slate-600">Your information will be verified by the system</p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4 text-white">
                <span className="text-xl font-bold">3</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Access</h3>
              <p className="text-slate-600">Access your quota and manage your fuel consumption</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-slate-900 text-white p-6">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="font-semibold">© 2025 Fuel Quota Management System</p>
              <p className="text-sm text-slate-400">A national initiative</p>
            </div>
            <div className="flex gap-6">
              <Link href="#" className="text-slate-300 hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link href="#" className="text-slate-300 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="text-slate-300 hover:text-white transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
