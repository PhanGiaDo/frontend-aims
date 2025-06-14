"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { formatCurrency } from "@/lib/utils"
import { getOrderTracking, formatTrackingStatus, getStatusColor, formatTrackingDate } from "@/lib/tracking-utils"
import type { OrderTrackingInfo } from "@/lib/tracking-types"
import { Search, Package, MapPin, Clock, Truck, Phone, Mail, User, Zap } from "lucide-react"
import OrderCancellation from "./order-cancellation"

export default function OrderTracking() {
  const [trackingCode, setTrackingCode] = useState("")
  const [orderInfo, setOrderInfo] = useState<OrderTrackingInfo | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showCancellation, setShowCancellation] = useState(false)
  const { toast } = useToast()

  const handleTrackOrder = async () => {
    if (!trackingCode.trim()) {
      toast({
        title: "Missing tracking code",
        description: "Please enter your order tracking code",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      const result = await getOrderTracking(trackingCode.trim().toUpperCase())
      if (result) {
        setOrderInfo(result)
        toast({
          title: "Order found",
          description: "Your order details have been loaded successfully",
        })
      } else {
        toast({
          title: "Order not found",
          description: "Please check your tracking code and try again",
          variant: "destructive",
        })
        setOrderInfo(null)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to track order. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleTrackOrder()
    }
  }

  const handleCancellationSuccess = () => {
    setShowCancellation(false)
    // Update order status to cancelled
    if (orderInfo) {
      setOrderInfo({
        ...orderInfo,
        current_status: "cancelled",
        can_cancel: false,
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Tracking Code Input */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Enter Tracking Code
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex gap-2 mt-1">
              <Input
                id="tracking-code"
                value={trackingCode}
                onChange={(e) => setTrackingCode(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
              />
              <Button onClick={handleTrackOrder} disabled={isLoading}>
                {isLoading ? "Tracking..." : "Track Order"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Order Information - Same layout as order confirmation */}
      {orderInfo && (
        <div className="max-w-4xl mx-auto">
          {/* Order Summary */}
          <div className="mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Order ID:</span>
                    <div className="text-muted-foreground">#{orderInfo.order_id}</div>
                  </div>
                  <div>
                    <span className="font-medium">Order Date:</span>
                    <div className="text-muted-foreground">{formatTrackingDate(orderInfo.order_date)}</div>
                  </div>
                  <div>
                    <span className="font-medium">Status:</span>
                    <div>
                      <Badge variant="outline" className={getStatusColor(orderInfo.current_status)}>
                        {formatTrackingStatus(orderInfo.current_status)}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <span className="font-medium">Payment Method:</span>
                    <div className="text-muted-foreground">
                      {orderInfo.order_details.payment_method === "credit_card"
                        ? "Credit Card"
                        : orderInfo.order_details.payment_method === "bank_transfer"
                          ? "Bank Transfer"
                          : "Cash on Delivery"}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Delivery Information */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Delivery Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <User className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <div className="font-medium">Recipient</div>
                      <div className="text-muted-foreground">Customer Name</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Phone className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <div className="font-medium">Phone</div>
                      <div className="text-muted-foreground">0912345678</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Mail className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <div className="font-medium">Email</div>
                      <div className="text-muted-foreground">customer@example.com</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <div className="font-medium">Delivery Address</div>
                      <div className="text-muted-foreground">{orderInfo.order_details.delivery_address}</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Clock className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <div className="font-medium">Order Status</div>
                      <div className="text-muted-foreground">
                        {orderInfo.current_status === "pending" && "Your order is being processed"}
                        {orderInfo.current_status === "approved" &&
                          "Your order has been approved and will be shipped soon"}
                        {orderInfo.current_status === "rejected" && "Your order has been rejected"}
                        {orderInfo.current_status === "cancelled" && "Your order has been cancelled"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orderInfo.order_details.items.map((item) => (
                  <div key={item.product_id} className="flex justify-between items-center py-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{item.title}</span>
                        {item.rush_order && (
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <Zap className="h-3 w-3" />
                            Rush
                          </Badge>
                        )}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {formatCurrency(item.price)} × {item.quantity}
                      </div>
                    </div>
                    <div className="font-semibold">{formatCurrency(item.price * item.quantity)}</div>
                  </div>
                ))}

                <Separator />

                {/* Order Totals */}
                <div className="space-y-2 pt-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>{formatCurrency(orderInfo.order_details.total_amount - 150000 - 22000)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>VAT (10%):</span>
                    <span>{formatCurrency(150000)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping Fee:</span>
                    <span>{formatCurrency(22000)}</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span>Total:</span>
                    <span>{formatCurrency(orderInfo.order_details.total_amount)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cancel Order Section */}
          {orderInfo.can_cancel && orderInfo.current_status === "pending" && (
            <div className="text-center mb-8">
              <Button variant="destructive" onClick={() => setShowCancellation(true)}>
                Cancel Order
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Order Cancellation Modal */}
      {showCancellation && orderInfo && (
        <OrderCancellation
          orderInfo={orderInfo}
          onClose={() => setShowCancellation(false)}
          onSuccess={handleCancellationSuccess}
        />
      )}
    </div>
  )
}
