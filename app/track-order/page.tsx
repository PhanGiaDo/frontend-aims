import OrderTracking from "@/components/order-tracking"

export default function TrackOrderPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-2">Track Your Order</h1>
        <p className="text-muted-foreground text-center mb-8">
          Enter your order tracking code to view the latest status and details
        </p>
        <OrderTracking />
      </div>
    </div>
  )
}
