import { orderRepositoryFactory } from '../src/domain/orderRepository'
import { productRepositoryFactory } from '../src/domain/productRepository'
import { shipmentRepositoryFactory } from '../src/domain/shipmentRepository'
import { warehouseRepositoryFactory } from '../src/domain/warehouseRepository'
import { testDynamoClient } from './awsTestClients'
import {
  testOrder,
  testProduct,
  testShipment,
  testWarehouse
} from './testFactories'

const warehouseRepository = warehouseRepositoryFactory(testDynamoClient)
const productRepository = productRepositoryFactory(testDynamoClient)
const orderRepository = orderRepositoryFactory(testDynamoClient)
const shipmentRepository = shipmentRepositoryFactory(testDynamoClient)

export const promiseTimeout = async (timeout: number): Promise<void> =>
  new Promise<void>(resolve => {
    setTimeout(resolve, timeout)
  })

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

export const createOrders = async (quantity: number) => {
  const order = [...Array(quantity)].map(_ => testOrder())
  await Promise.all([order.map(orderRepository.saveCustomerOrder)])
  return order
}

export const createShipments = async (quantity: number) => {
  const shipments = [...Array(quantity)].map(_ => testShipment())
  await Promise.all([shipments.map(shipmentRepository.saveOrderShipment)])
  return shipments
}
