"use client"

import { CardFooter } from "@/components/ui/card"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Share2 } from "lucide-react"
import { QRCodeGenerator } from "./client-components"

// Force static rendering
export const dynamic = "force-static"

export default function QRCodePage() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [isQRGenerated, setIsQRGenerated] = useState(false)

  const handleGenerateQR = () => {
    setIsGenerating(true)

    // Simulate API call
    setTimeout(() => {
      setIsGenerating(false)
      setIsQRGenerated(true)
    }, 1500)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-slate-800">QR Code</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <QRCodeGenerator />

        <Card className="border border-slate-200 shadow-sm hover:shadow-md transition-all">
          <CardHeader>
            <CardTitle>Your QR Code</CardTitle>
            <CardDescription>Valid for 10 minutes after generation</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center">
            {isQRGenerated ? (
              <div className="space-y-4 text-center">
                <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200">
                  <div className="w-48 h-48 mx-auto bg-gradient-to-r from-violet-500 to-purple-600 relative flex items-center justify-center">
                    {/* Simulated QR code */}
                    <div className="absolute inset-4 bg-white grid grid-cols-5 grid-rows-5 gap-1">
                      {Array.from({ length: 25 }).map((_, i) => (
                        <div key={i} className={`${Math.random() > 0.6 ? "bg-violet-600" : "bg-white"}`} />
                      ))}
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium">Toyota Corolla (ABC-1234)</p>
                  <p className="text-sm text-slate-500">5.0 L Petrol</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Expires: {new Date(Date.now() + 10 * 60 * 1000).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-slate-400">No QR code generated yet</div>
            )}
          </CardContent>
          {isQRGenerated && (
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                size="sm"
                className="text-violet-600 hover:text-violet-700 hover:bg-violet-50 border-violet-200"
              >
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-violet-600 hover:text-violet-700 hover:bg-violet-50 border-violet-200"
              >
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  )
}
