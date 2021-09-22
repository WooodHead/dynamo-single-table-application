import { shipmentRepositoryFactory } from '../../src/domain/shipmentRepository'
import { testDynamoClient } from '../awsTestClients'
import { testShipment } from '../testFactories'
import { createOrders, promiseTimeout } from '../testUtils'

const repository = shipmentRepositoryFactory(testDynamoClient)

describe('shipments', () => {
  it('gets shipments by order id', async () => {
    const orders = await createOrders(10)

    const shipmentRecord1 = testShipment({
      orderId: orders[0].id
    })
    const shipmentRecord2 = testShipment({
      orderId: orders[1].id
    })
    const shipmentRecord3 = testShipment({
      orderId: orders[0].id
    })
    const shipmentRecord4 = testShipment({
      orderId: orders[1].id
    })
    const shipmentRecord5 = testShipment({
      orderId: orders[2].id
    })

    const shipmentRecords = [
      shipmentRecord1,
      shipmentRecord2,
      shipmentRecord3,
      shipmentRecord4,
      shipmentRecord5
    ]

    await Promise.all([shipmentRecords.map(repository.saveOrderShipment)])

    await promiseTimeout(200)

    const shipmentsForOrder1 = await repository.getShipmentsByOrderId(
      orders[0].id!
    )

    expect(shipmentsForOrder1).toEqual(
      expect.arrayContaining([shipmentRecord1, shipmentRecord3])
    )
  })
})
