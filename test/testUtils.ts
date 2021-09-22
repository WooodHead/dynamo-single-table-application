import { customerRepositoryFactory } from '../src/domain/customerRepository'
import { invoiceRepositoryFactory } from '../src/domain/invoiceRepository'
import { orderRepositoryFactory } from '../src/domain/orderRepository'
import { productRepositoryFactory } from '../src/domain/productRepository'
import { shipmentRepositoryFactory } from '../src/domain/shipmentRepository'
import { warehouseRepositoryFactory } from '../src/domain/warehouseRepository'
import { testDynamoClient } from './awsTestClients'
import {
  testCustomer,
  testInvoice,
  testOrder,
  testOrderItem,
  testProduct,
  testShipment,
  testWarehouse
} from './testFactories'

const warehouseRepository = warehouseRepositoryFactory(testDynamoClient)
const productRepository = productRepositoryFactory(testDynamoClient)
const orderRepository = orderRepositoryFactory(testDynamoClient)
const shipmentRepository = shipmentRepositoryFactory(testDynamoClient)
const invoiceRepository = invoiceRepositoryFactory(testDynamoClient)
const customerRepository = customerRepositoryFactory(testDynamoClient)

export const promiseTimeout = async (timeout: number): Promise<void> =>
  new Promise<void>(resolve => {
    setTimeout(resolve, timeout)
  })

export const createCustomers = async (quantity: number) => {
  const customers = [...Array(quantity)].map(_ => testCustomer())
  await Promise.all([customers.map(customerRepository.saveCustomer)])
  return customers
}

export const createWarehouses = async (quantity: number) => {
  const warehouses = [...Array(quantity)].map(_ => testWarehouse())
  await Promise.all([warehouses.map(warehouseRepository.saveWarehouse)])
  return warehouses
}

export const createProducts = async (quantity: number) => {
  const products = [...Array(quantity)].map(_ => testProduct())
  await Promise.all([products.map(productRepository.saveProduct)])
  return products
}

export const createOrderItems = async (quantity: number) => {
  const orderItems = [...Array(quantity)].map(_ => testOrderItem())
  await Promise.all([orderItems.map(orderRepository.saveOrderItem)])
  return orderItems
}

export const createInvoices = async (quantity: number) => {
  const invoices = [...Array(quantity)].map(_ => testInvoice())
  await Promise.all([invoices.map(invoiceRepository.saveOrderInvoice)])
  return invoices
}

export const createOrders = async (quantity: number) => {
  const orders = [...Array(quantity)].map(_ => testOrder())
  await Promise.all([orders.map(orderRepository.saveCustomerOrder)])
  return orders
}

export const createShipments = async (quantity: number) => {
  const shipments = [...Array(quantity)].map(_ => testShipment())
  await Promise.all([shipments.map(shipmentRepository.saveOrderShipment)])
  return shipments
}
