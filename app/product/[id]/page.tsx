import { notFound } from "next/navigation"
import ProductDetail from "@/components/product-detail"
import { fetchProductById } from "@/lib/utils"
import { Suspense } from "react"
import ProductDetailSkeleton from "@/components/product-detail-skeleton"

interface ProductPageProps {
  params: {
    id: string
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const productId = Number.parseInt(params.id)

  if (isNaN(productId)) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<ProductDetailSkeleton />}>
        <ProductDetailContent productId={productId} />
      </Suspense>
    </div>
  )
}

async function ProductDetailContent({ productId }: { productId: number }) {
  const product = await fetchProductById(productId)

  if (!product) {
    notFound()
  }

  return <ProductDetail product={product} />
}
