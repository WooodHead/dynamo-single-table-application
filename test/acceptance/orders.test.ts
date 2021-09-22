import { orderRepositoryFactory } from '../../src/domain/orderRepository'
import { testDynamoClient } from '../awsTestClients'
import { testOrder, testOrderItem, testShipmentItem } from '../testFactories'
import { createOrders, createProducts, promiseTimeout } from '../testUtils'

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

  it('get order items by order id', async () => {
    const orders = await createOrders(4)

    const orderItem1 = testOrderItem({ orderId: orders[0].id! })
    const orderItem2 = testOrderItem({ orderId: orders[0].id! })
    const orderItem3 = testOrderItem({ orderId: orders[1].id! })
    const orderItem4 = testOrderItem({ orderId: orders[1].id! })
    const orderItem5 = testOrderItem({ orderId: orders[2].id! })
    const orderItems = [
      orderItem1,
      orderItem2,
      orderItem3,
      orderItem4,
      orderItem5
    ]

    await Promise.all([orderItems.map(repository.saveOrderItem)])

    await promiseTimeout(200)

    const results = await repository.getOrderItemsByOrderId(orders[0].id!)

    expect(results).toEqual(expect.arrayContaining([orderItem1, orderItem2]))
  })

  it('get order items by product id', async () => {
    const from = new Date().toISOString()

    const orders = await createOrders(4)
    const products = await createProducts(10)
    const productId = products[0].id!

    const orderItem1 = testOrderItem({ orderId: orders[0].id!, productId })
    const orderItem2 = testOrderItem({ orderId: orders[0].id! })
    const orderItem3 = testOrderItem({ orderId: orders[1].id!, productId })
    const orderItem4 = testOrderItem({ orderId: orders[1].id! })
    const orderItem5 = testOrderItem({ orderId: orders[2].id!, productId })

    await repository.saveOrderItem(orderItem1)
    await repository.saveOrderItem(orderItem2)
    await repository.saveOrderItem(orderItem3)
    await repository.saveOrderItem(orderItem4)
    await repository.saveOrderItem(orderItem5)

    await promiseTimeout(200)

    const to = new Date().toISOString()

    const results = await repository.getOrderItemsByProductId(
      productId,
      from,
      to
    )

    expect(results).toEqual(
      expect.arrayContaining([orderItem1, orderItem3, orderItem5])
    )
  })

  it('saves a shipment item', async () => {
    await repository.saveOrderShipmentItem(testShipmentItem())
  })
})
