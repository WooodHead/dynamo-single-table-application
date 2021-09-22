declare type Customer = {
  id?: string
  email: string
  name: string
}

declare type Product = {
  id?: string
  price: number
  name: string
}

declare type Address = {
  line1: string
  line2?: string
  town: string
  city: string
  postcode: string
}

declare type Warehouse = {
  id?: string
  address: Address
}

declare type Order = {
  id?: string
  customerId: string
  date?: string
}

declare type StockInventory = {
  productId: string
  warehouseId: string
  quantity: number
}

declare type PaymentType = 'voucher' | 'mastercard' | 'paypal' | 'visa' | 'amex'

declare type Payment = {
  type: PaymentType
  amount: number
}

declare type Invoice = {
  id?: string
  orderId: string
  payments: Payment[]
  amount: number
  date?: string
}

declare type OrderItem = {
  productId: string
  orderId: string
  price: number
  quantity: number
}

declare type ShipmentType = 'express' | 'normal'

declare type Shipment = {
  id?: string
  orderId: string
  type: ShipmentType
  address: Address
  date: string
}

declare type ShipmentItem = {
  id?: string
  orderId: string
  productId: string
  shipmentId: string
  quantity: number
}
