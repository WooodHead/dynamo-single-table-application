import { orderServiceFactory } from '../../src/domain/orderService'
import { testDynamoClient } from '../awsTestClients'
import { testInvoice, testOrder, testOrderItem } from '../testFactories'

const service = orderServiceFactory(testDynamoClient)

describe('orders', () => {
  it('adds a new order without order id', async () => {
    const order = testOrder({ id: undefined })

    const result = await service.saveCustomerOrder(order)

    expect(result).toEqual({
      id: expect.any(String),
      customerId: order.customerId,
      date: order.date
    })
  })

  it('adds a new order with order id', async () => {
    const order = testOrder()

    const result = await service.saveCustomerOrder(order)

    expect(result).toEqual(order)
  })

  it('get order not found returns undefined', async () => {
    const result = await service.getCustomerOrderById(
      'this-order-id-does-not-exist',
      'this-customer-id-does-not-exist'
    )

    expect(result).toEqual(undefined)
  })

  it('edits an existing order', async () => {
    const order = testOrder()

    await service.saveCustomerOrder(order)
    const updated = await service.saveCustomerOrder({
      ...order,
      date: new Date().toISOString()
    })

    const result = await service.getCustomerOrderById(
      order.id!,
      order.customerId
    )

    expect(result).toEqual(updated)
  })

  it('saves an order invoice', async () => {
    await service.saveOrderInvoice(testInvoice())
  })

  it('saves an order invoice with no payments', async () => {
    await service.saveOrderInvoice(testInvoice({ payments: undefined }))
  })

  it('saves an order item', async () => {
    await service.saveOrderItem(testOrderItem())
  })
})
