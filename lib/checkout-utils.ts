import type { DeliveryInformation, CheckoutFormData, ShippingCalculation } from "./checkout-types"

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
    rush_order: boolean // Changed from rush_order_using to rush_order
  }>,
): ShippingCalculation {
  const selectedItems = cartItems.filter((item) => item.selected)

  // Separate regular and rush items
  const regularItems = selectedItems.filter((item) => {
    const orderLine = orderLines.find((line) => line.product_id === item.product.product_id)
    return !orderLine?.rush_order // Changed from rush_order_using to rush_order
  })

  const rushItems = selectedItems.filter((item) => {
    const orderLine = orderLines.find((line) => line.product_id === item.product.product_id)
    return orderLine?.rush_order // Changed from rush_order_using to rush_order
  })

  // Rest of the function remains the same...
  const regularItemsTotal = regularItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const rushItemsTotal = rushItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

  const heaviestItemWeight = selectedItems.reduce((max, item) => {
    return Math.max(max, item.product.weight)
  }, 0)

  let regularShipping = 0
  if (regularItems.length > 0) {
    regularShipping = calculateShippingByWeight(province, heaviestItemWeight)
  }

  let rushShipping = 0
  if (rushItems.length > 0) {
    const rushShippingBase = calculateShippingByWeight(province, heaviestItemWeight)
    rushShipping = rushShippingBase + 10000
  }

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

// Process complete checkout - simplified to only handle delivery info
export async function processCheckout(
  checkoutData: CheckoutFormData,
  shippingCalculation: ShippingCalculation,
): Promise<{ success: boolean; orderId?: number; error?: string; clearCart?: boolean }> {
  try {
    // Create delivery information with shipping fee
    const deliveryId = await createDeliveryInformation({
      ...checkoutData.deliveryInfo,
      shipping_fee: shippingCalculation.totalShipping,
    })

    // Send order data to backend for Order and OrderLine creation
    const orderPayload = {
      delivery_id: deliveryId,
      status: checkoutData.status,
      total_after_VAT: checkoutData.total_after_VAT + shippingCalculation.totalShipping,
      total_before_VAT: checkoutData.total_before_VAT + shippingCalculation.totalShipping,
      vat: checkoutData.vat,
      orderLineList: checkoutData.orderLineList,
    }

    // This would be the actual API call to backend
    console.log("Sending order payload to backend:", orderPayload)

    // Simulate backend order creation
    const orderId = Math.floor(Math.random() * 10000) + 1
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return { success: true, orderId, clearCart: true }
  } catch (error) {
    console.error("Checkout error:", error)
    return { success: false, error: "Failed to process checkout" }
  }
}
