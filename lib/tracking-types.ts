// Order tracking status
export type TrackingStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "out_for_delivery"
  | "delivered"
  | "cancelled"
  | "refunded"

// Tracking event
export interface TrackingEvent {
  id: number
  status: TrackingStatus
  description: string
  timestamp: string
  location?: string
}

// Order tracking information
export interface OrderTrackingInfo {
  order_id: number
  tracking_code: string
  current_status: TrackingStatus
  order_date: string
  estimated_delivery: string
  can_cancel: boolean
  tracking_events: TrackingEvent[]
  order_details: {
    total_amount: number
    payment_method: string
    delivery_address: string
    items: Array<{
      product_id: number
      title: string
      quantity: number
      price: number
      rush_order: boolean
    }>
  }
}

// Cancellation request
export interface CancellationRequest {
  order_id: number
  tracking_code: string
  reason: string
}
