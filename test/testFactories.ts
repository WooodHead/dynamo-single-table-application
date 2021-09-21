import { datatype, internet, lorem, address } from 'faker'
import { paymentTypes } from '../src/types'

export const testCustomer = (overrides: Partial<Customer> = {}): Customer => ({
  id: datatype.uuid(),
  email: internet.email(),
  name: internet.userName(),
  ...overrides
})

export const testProduct = (overrides: Partial<Product> = {}): Product => ({
  id: datatype.uuid(),
  name: lorem.words(2),
  price: datatype.number(),
  ...overrides
})

export const testAddress = (overrides: Partial<Address> = {}): Address => ({
  line1: address.streetAddress(),
  town: address.county(),
  city: address.city(),
  postcode: address.zipCode(),
  ...overrides
})

export const testWarehouse = (
  overrides: Partial<Warehouse> = {}
): Warehouse => ({
  id: datatype.uuid(),
  address: testAddress(),
  ...overrides
})

export const testOrder = (overrides: Partial<Order> = {}): Order => ({
  id: datatype.uuid(),
  customerId: datatype.uuid(),
  date: new Date().toISOString(),
  ...overrides
})

export const testStockInventory = (
  overrides: Partial<StockInventory> = {}
): StockInventory => ({
  productId: datatype.uuid(),
  warehouseId: datatype.uuid(),
  quantity: datatype.number(100),
  ...overrides
})

export const testPaymentType = (): PaymentType =>
  paymentTypes[Math.floor(Math.random() * paymentTypes.length)]

export const testPayment = (overrides: Partial<Payment> = {}): Payment => ({
  type: testPaymentType(),
  amount: datatype.number(),
  ...overrides
})

export const testInvoice = (overrides: Partial<Invoice> = {}): Invoice => ({
  id: datatype.uuid(),
  orderId: datatype.uuid(),
  payments: [testPayment()],
  amount: datatype.number(),
  date: new Date().toISOString(),
  ...overrides
})
