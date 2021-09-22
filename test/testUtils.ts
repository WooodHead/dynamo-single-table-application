import { productRepositoryFactory } from '../src/domain/productRepository'
import { warehouseRepositoryFactory } from '../src/domain/warehouseRepository'
import { testDynamoClient } from './awsTestClients'
import { testProduct, testWarehouse } from './testFactories'

const warehouseRepository = warehouseRepositoryFactory(testDynamoClient)
const productRepository = productRepositoryFactory(testDynamoClient)

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
