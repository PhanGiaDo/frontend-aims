// Delivery Information interface
export interface DeliveryInformation {
  delivery_id?: number
  name: string
  phone: string
  email: string
  address: string
  province: string
  shipping_message?: string
  shipping_fee: number
}

// Order interface
export interface Order {
  order_id?: number
  delivery_id: number
  total_before_vat: number
  total_after_vat: number
  status: string
  vat: number
}

// Order Line interface
export interface OrderLine {
  odline_id?: number
  order_id: number
  product_id: number
  status: string
  quantity: number
  total_fee: number
  rush_order_using: boolean
  delivery_time?: string
  instructions?: string
}

// Rush delivery information
export interface RushDeliveryInfo {
  product_id: number
  delivery_time: string
  instructions: string
}

// Checkout form data interface
export interface CheckoutFormData {
  deliveryInfo: Omit<DeliveryInformation, "delivery_id" | "shipping_fee">
  orderLines: Array<{
    product_id: number
    quantity: number
    rush_order_using: boolean
    instructions?: string
  }>
  rushDeliveryInfo: RushDeliveryInfo[]
  paymentMethod: "cod" | "momo" | "vnpay"
}

// Shipping calculation result
export interface ShippingCalculation {
  regularShipping: number
  rushShipping: number
  freeShippingDiscount: number
  totalShipping: number
  regularItemsTotal: number
  rushItemsTotal: number
  heaviestItemWeight: number
}

// Province options for Vietnam
export const VIETNAM_PROVINCES = [
  "An Giang",
  "Bà Rịa - Vũng Tàu",
  "Bắc Giang",
  "Bắc Kạn",
  "Bạc Liêu",
  "Bắc Ninh",
  "Bến Tre",
  "Bình Định",
  "Bình Dương",
  "Bình Phước",
  "Bình Thuận",
  "Cà Mau",
  "Cao Bằng",
  "Đắk Lắk",
  "Đắk Nông",
  "Điện Biên",
  "Đồng Nai",
  "Đồng Tháp",
  "Gia Lai",
  "Hà Giang",
  "Hà Nam",
  "Hà Tĩnh",
  "Hải Dương",
  "Hậu Giang",
  "Hòa Bình",
  "Hưng Yên",
  "Khánh Hòa",
  "Kiên Giang",
  "Kon Tum",
  "Lai Châu",
  "Lâm Đồng",
  "Lạng Sơn",
  "Lào Cai",
  "Long An",
  "Nam Định",
  "Nghệ An",
  "Ninh Bình",
  "Ninh Thuận",
  "Phú Thọ",
  "Quảng Bình",
  "Quảng Nam",
  "Quảng Ngãi",
  "Quảng Ninh",
  "Quảng Trị",
  "Sóc Trăng",
  "Sơn La",
  "Tây Ninh",
  "Thái Bình",
  "Thái Nguyên",
  "Thanh Hóa",
  "Thừa Thiên Huế",
  "Tiền Giang",
  "Trà Vinh",
  "Tuyên Quang",
  "Vĩnh Long",
  "Vĩnh Phúc",
  "Yên Bái",
  "Phú Yên",
  "Cần Thơ",
  "Đà Nẵng",
  "Hải Phòng",
  "Hà Nội",
  "TP Hồ Chí Minh",
]

// Time slots for rush delivery (2-hour windows)
export const RUSH_DELIVERY_TIME_SLOTS = [
  "08:00 - 10:00",
  "10:00 - 12:00",
  "12:00 - 14:00",
  "14:00 - 16:00",
  "16:00 - 18:00",
  "18:00 - 20:00",
]
