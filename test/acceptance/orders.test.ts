import { orderRepositoryFactory } from '../../src/domain/orderRepository'
import { testDynamoClient } from '../awsTestClients'
import { testOrder, testOrderItem, testShipmentItem } from '../testFactories'

const repository = orderRepositoryFactory(testDynamoClient)

describe('orders', () => {
  it('adds a new order without order id', async () => {
    const order = testOrder({ id: undefined })

    const result = await repository.saveCustomerOrder(order)

    expect(result).toEqual({
      id: expect.any(String),
      customerId: order.customerId,
      date: order.date
    })
  })

  it('adds a new order with order id', async () => {
    const order = testOrder()

    const result = await repository.saveCustomerOrder(order)

    expect(result).toEqual(order)
  })

  it('get order not found returns undefined', async () => {
    const result = await repository.getCustomerOrderById(
      'this-order-id-does-not-exist',
      'this-customer-id-does-not-exist'
    )

    expect(result).toEqual(undefined)
  })

  it('edits an existing order', async () => {
    const order = testOrder()

    await repository.saveCustomerOrder(order)
    const updated = await repository.saveCustomerOrder({
      ...order,
      date: new Date().toISOString()
    })

    const result = await repository.getCustomerOrderById(
      order.id!,
      order.customerId
    )

    expect(result).toEqual(updated)
  })

  it('saves an order item', async () => {
    await repository.saveOrderItem(testOrderItem())
  })

  it('saves a shipment item', async () => {
    await repository.saveOrderShipmentItem(testShipmentItem())
  })
})
