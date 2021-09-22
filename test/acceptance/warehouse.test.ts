import { warehouseRepositoryFactory } from '../../src/domain/warehouseRepository'
import { testDynamoClient } from '../awsTestClients'
import {
  testAddress,
  testStockInventory,
  testWarehouse
} from '../testFactories'
import { createProducts, createWarehouses, promiseTimeout } from '../testUtils'

const repository = warehouseRepositoryFactory(testDynamoClient)

describe('warehouses', () => {
  it('adds a new warehouse without id', async () => {
    const warehouse = testWarehouse({ id: undefined })

    const result = await repository.saveWarehouse(warehouse)

    expect(result).toEqual({
      id: expect.any(String),
      address: warehouse.address
    })
  })

  it('adds a new warehouse with id', async () => {
    const warehouse = testWarehouse()

    const result = await repository.saveWarehouse(warehouse)

    expect(result).toEqual(warehouse)
  })

  it('get warehouse not found returns undefined', async () => {
    const result = await repository.getWarehouseById('this-id-does-not-exist')

    expect(result).toEqual(undefined)
  })

  it('edits an existing warehouse', async () => {
    const warehouse = testWarehouse()

    await repository.saveWarehouse(warehouse)
    const updated = await repository.saveWarehouse({
      ...warehouse,
      address: testAddress()
    })

    const result = await repository.getWarehouseById(warehouse.id!)

    expect(result).toEqual(updated)
  })

  it('saves stock items', async () => {
    await repository.saveWarehouseStock(testStockInventory())
  })

  it('gets stock inventory by product id', async () => {
    const warehouses = await createWarehouses(4)
    const products = await createProducts(10)

    const stockRecord1 = testStockInventory({
      productId: products[0].id,
      warehouseId: warehouses[0].id
    })
    const stockRecord2 = testStockInventory({
      productId: products[1].id,
      warehouseId: warehouses[0].id
    })
    const stockRecord3 = testStockInventory({
      productId: products[0].id,
      warehouseId: warehouses[1].id
    })
    const stockRecord4 = testStockInventory({
      productId: products[1].id,
      warehouseId: warehouses[1].id
    })
    const stockRecord5 = testStockInventory({
      productId: products[2].id,
      warehouseId: warehouses[2].id
    })

    const stockRecords = [
      stockRecord1,
      stockRecord2,
      stockRecord3,
      stockRecord4,
      stockRecord5
    ]

    await Promise.all([stockRecords.map(repository.saveWarehouseStock)])

    await promiseTimeout(200)

    const inventoryCheckProduct0 =
      await repository.getStockInventoryByProductId(products[0].id!)

    expect(inventoryCheckProduct0).toMatchObject([stockRecord1, stockRecord3])
  })
})
