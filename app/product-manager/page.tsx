"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import ProductManagerDashboard from "@/components/product-manager-dashboard"

export default function ProductManagerPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && (!user || user.role !== "product_manager")) {
      router.push("/login")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div>Loading...</div>
      </div>
    )
  }

  if (!user || user.role !== "product_manager") {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ProductManagerDashboard />
    </div>
  )
}
