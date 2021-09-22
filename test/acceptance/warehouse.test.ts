import { warehouseRepositoryFactory } from '../../src/domain/warehouseRepository'
import { testDynamoClient } from '../awsTestClients'
import {
  testAddress,
  testStockInventory,
  testWarehouse
} from '../testFactories'

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
})
