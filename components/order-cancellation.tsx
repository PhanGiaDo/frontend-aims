"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { formatCurrency } from "@/lib/utils"
import { cancelOrder } from "@/lib/tracking-utils"
import type { OrderTrackingInfo } from "@/lib/tracking-types"
import { AlertTriangle, RefreshCw } from "lucide-react"

interface OrderCancellationProps {
  orderInfo: OrderTrackingInfo
  onClose: () => void
  onSuccess: () => void
}

export default function OrderCancellation({ orderInfo, onClose, onSuccess }: OrderCancellationProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const { toast } = useToast()

  const handleCancelOrder = async () => {
    setIsProcessing(true)

    try {
      const cancellationRequest = {
        order_id: orderInfo.order_id,
        tracking_code: orderInfo.tracking_code,
      }

      const result = await cancelOrder(cancellationRequest)

      if (result.success) {
        toast({
          title: "Order cancelled successfully",
          description: result.message,
        })
        onSuccess()
      } else {
        toast({
          title: "Cancellation failed",
          description: result.message,
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel order. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            Cancel Order
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to cancel order #{orderInfo.order_id}? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Refund Information */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Refund Information
            </h4>
            <div className="text-sm text-blue-800 space-y-1">
              <p>
                Refund amount:{" "}
                <span className="font-semibold">{formatCurrency(orderInfo.order_details.total_amount)}</span>
              </p>
              <p>
                Refund method:{" "}
                {orderInfo.order_details.payment_method === "credit_card" ? "Credit Card" : "Bank Transfer"}
              </p>
              <p>Processing time: 3-5 business days</p>
              <p className="text-xs">Note: Only pending orders can be cancelled</p>
            </div>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={onClose} disabled={isProcessing}>
            Keep Order
          </Button>
          <Button variant="destructive" onClick={handleCancelOrder} disabled={isProcessing}>
            {isProcessing ? "Cancelling..." : "Cancel Order"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
