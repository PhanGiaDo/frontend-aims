import type { OrderTrackingInfo, CancellationRequest } from "./tracking-types"

// Mock function to get order tracking information
export async function getOrderTracking(trackingCode: string): Promise<OrderTrackingInfo | null> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Validate tracking code format (should be like "AIMS-12345-ABC")
  const trackingCodeRegex = /^AIMS-\d{5}-[A-Z]{3}$/
  if (!trackingCodeRegex.test(trackingCode)) {
    return null
  }

  // Extract order ID from tracking code
  const orderIdMatch = trackingCode.match(/AIMS-(\d{5})-[A-Z]{3}/)
  if (!orderIdMatch) {
    return null
  }

  const orderId = Number.parseInt(orderIdMatch[1])

  // Mock tracking data with only 4 statuses
  const mockTrackingInfo: OrderTrackingInfo = {
    order_id: orderId,
    tracking_code: trackingCode,
    current_status: "pending",
    order_date: "2024-01-15T10:30:00Z",
    can_cancel: true, // Can only cancel if status is pending
    order_details: {
      total_amount: 1672000,
      payment_method: "credit_card",
      delivery_address: "123 Nguyen Hue Street, District 1, TP Hồ Chí Minh",
      items: [
        {
          product_id: 1,
          title: "Product 1",
          quantity: 1,
          price: 500000,
          rush_order: false,
        },
        {
          product_id: 2,
          title: "Product 2",
          quantity: 2,
          price: 500000,
          rush_order: true,
        },
      ],
    },
  }

  return mockTrackingInfo
}

// Mock function to cancel order (simplified - no reason required)
export async function cancelOrder(
  cancellationRequest: Pick<CancellationRequest, "order_id" | "tracking_code">,
): Promise<{
  success: boolean
  message: string
  refund_amount?: number
  refund_method?: string
  updated_status?: string
}> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // Validate tracking code
  const orderInfo = await getOrderTracking(cancellationRequest.tracking_code)
  if (!orderInfo) {
    return {
      success: false,
      message: "Invalid tracking code",
    }
  }

  // Check if order can be cancelled
  if (!orderInfo.can_cancel) {
    return {
      success: false,
      message: "This order cannot be cancelled as it has already been shipped",
    }
  }

  // Mock successful cancellation
  return {
    success: true,
    message: "Your order has been successfully cancelled. Refund will be processed within 3-5 business days.",
    refund_amount: orderInfo.order_details.total_amount,
    refund_method: orderInfo.order_details.payment_method === "credit_card" ? "Credit Card" : "Bank Transfer",
    updated_status: "cancelled",
  }
}

// Update formatTrackingStatus to only handle the 4 statuses
export function formatTrackingStatus(status: string): string {
  switch (status) {
    case "pending":
      return "Pending"
    case "approved":
      return "Approved"
    case "rejected":
      return "Rejected"
    case "cancelled":
      return "Cancelled"
    default:
      return status
  }
}

// Update getStatusColor to only handle the 4 statuses
export function getStatusColor(status: string): string {
  switch (status) {
    case "pending":
      return "bg-yellow-50 text-yellow-700 hover:bg-yellow-50"
    case "approved":
      return "bg-green-100 text-green-800"
    case "rejected":
      return "bg-red-100 text-red-800"
    case "cancelled":
      return "bg-gray-100 text-gray-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

// Format date for display
export function formatTrackingDate(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}
