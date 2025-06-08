import type { DeliveryInformation, Order, OrderLine, CheckoutFormData, ShippingCalculation } from "./checkout-types"

// Calculate shipping fees based on new rules
export function calculateShippingFees(
  province: string,
  cartItems: Array<{
    product: any
    quantity: number
    selected: boolean
  }>,
  orderLines: Array<{
    product_id: number
    quantity: number
    rush_order_using: boolean
  }>,
): ShippingCalculation {
  const selectedItems = cartItems.filter((item) => item.selected)

  // Separate regular and rush items
  const regularItems = selectedItems.filter((item) => {
    const orderLine = orderLines.find((line) => line.product_id === item.product.product_id)
    return !orderLine?.rush_order_using
  })

  const rushItems = selectedItems.filter((item) => {
    const orderLine = orderLines.find((line) => line.product_id === item.product.product_id)
    return orderLine?.rush_order_using
  })

  // Calculate totals
  const regularItemsTotal = regularItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const rushItemsTotal = rushItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

  // Find heaviest item weight
  const heaviestItemWeight = selectedItems.reduce((max, item) => {
    return Math.max(max, item.product.weight)
  }, 0)

  // Calculate regular shipping
  let regularShipping = 0
  if (regularItems.length > 0) {
    regularShipping = calculateShippingByWeight(province, heaviestItemWeight)
  }

  // Calculate rush shipping
  let rushShipping = 0
  if (rushItems.length > 0) {
    const rushShippingBase = calculateShippingByWeight(province, heaviestItemWeight)
    rushShipping = rushShippingBase + 10000 // Additional 10,000 VND for rush delivery
  }

  // Calculate free shipping discount
  let freeShippingDiscount = 0
  if (regularItemsTotal > 100000) {
    freeShippingDiscount = Math.min(regularShipping, 25000)
  }

  const totalShipping = regularShipping + rushShipping - freeShippingDiscount

  return {
    regularShipping,
    rushShipping,
    freeShippingDiscount,
    totalShipping,
    regularItemsTotal,
    rushItemsTotal,
    heaviestItemWeight,
  }
}

// Calculate shipping by weight and province
function calculateShippingByWeight(province: string, weight: number): number {
  const isMajorCity = ["Hà Nội", "TP Hồ Chí Minh"].includes(province)

  if (isMajorCity) {
    // Hanoi/HCMC: 22,000 VND for first 3kg
    if (weight <= 3) {
      return 22000
    }
    // Additional 2,500 VND for each 0.5kg above 3kg
    const additionalWeight = weight - 3
    const additionalUnits = Math.ceil(additionalWeight / 0.5)
    return 22000 + additionalUnits * 2500
  } else {
    // Other provinces: 30,000 VND for first 0.5kg
    if (weight <= 0.5) {
      return 30000
    }
    // Additional 2,500 VND for each 0.5kg above 0.5kg
    const additionalWeight = weight - 0.5
    const additionalUnits = Math.ceil(additionalWeight / 0.5)
    return 30000 + additionalUnits * 2500
  }
}

// Create delivery information
export async function createDeliveryInformation(
  deliveryData: Omit<DeliveryInformation, "delivery_id">,
): Promise<number> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500))

  // This would be replaced with actual API call
  console.log("Creating delivery information:", deliveryData)

  // Return mock delivery_id
  return Math.floor(Math.random() * 10000) + 1
}

// Create order
export async function createOrder(orderData: Omit<Order, "order_id">): Promise<number> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500))

  // This would be replaced with actual API call
  console.log("Creating order:", orderData)

  // Return mock order_id
  return Math.floor(Math.random() * 10000) + 1
}

// Create order lines
export async function createOrderLines(orderLines: Omit<OrderLine, "odline_id">[]): Promise<number[]> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500))

  // This would be replaced with actual API call
  console.log("Creating order lines:", orderLines)

  // Return mock order line IDs
  return orderLines.map(() => Math.floor(Math.random() * 10000) + 1)
}

// Process complete checkout
export async function processCheckout(
  checkoutData: CheckoutFormData,
  cartItems: Array<{
    product: any
    quantity: number
    selected: boolean
  }>,
  totals: {
    subtotal: number
    vat: number
    total: number
  },
  shippingCalculation: ShippingCalculation,
): Promise<{ success: boolean; orderId?: number; error?: string; clearCart?: boolean }> {
  try {
    // Create delivery information
    const deliveryId = await createDeliveryInformation({
      ...checkoutData.deliveryInfo,
      shipping_fee: shippingCalculation.totalShipping,
    })

    // Create order (shipping fees are not subject to VAT)
    const orderId = await createOrder({
      delivery_id: deliveryId,
      total_before_vat: totals.subtotal + shippingCalculation.totalShipping,
      total_after_vat: totals.total + shippingCalculation.totalShipping,
      status: "pending",
      vat: totals.vat, // VAT only applies to products, not shipping
    })

    // Create order lines
    const selectedItems = cartItems.filter((item) => item.selected)
    const orderLinesData = checkoutData.orderLines.map((line) => {
      const cartItem = selectedItems.find((item) => item.product.product_id === line.product_id)
      const productTotal = cartItem ? cartItem.product.price * line.quantity : 0

      // Get rush delivery info if applicable
      const rushInfo = checkoutData.rushDeliveryInfo.find((info) => info.product_id === line.product_id)

      return {
        order_id: orderId,
        product_id: line.product_id,
        status: "pending",
        quantity: line.quantity,
        total_fee: productTotal,
        rush_order_using: line.rush_order_using,
        delivery_time: line.rush_order_using && rushInfo ? rushInfo.delivery_time : undefined,
        instructions: line.rush_order_using && rushInfo ? rushInfo.instructions : line.instructions,
      }
    })

    await createOrderLines(orderLinesData)

    return { success: true, orderId, clearCart: true }
  } catch (error) {
    console.error("Checkout error:", error)
    return { success: false, error: "Failed to process checkout" }
  }
}
