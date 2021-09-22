import { invoiceRepositoryFactory } from '../../src/domain/invoiceRepository'
import { testDynamoClient } from '../awsTestClients'
import { testInvoice } from '../testFactories'
import { createOrders, promiseTimeout } from '../testUtils'

const repository = invoiceRepositoryFactory(testDynamoClient)

describe('invoices', () => {
  it('saves an order invoice', async () => {
    await repository.saveOrderInvoice(testInvoice())
  })

  it('saves an order invoice with no payments', async () => {
    await repository.saveOrderInvoice(testInvoice({ payments: undefined }))
  })

  it('gets an invoice by invoice id', async () => {
    const expected = await repository.saveOrderInvoice(
      testInvoice({ id: undefined })
    )

    const invoice = await repository.getInvoiceById(expected.id!)

    expect(invoice).toEqual(expected)
  })

  it('gets an invoice by order id', async () => {
    const [order] = await createOrders(1)

    const expected = await repository.saveOrderInvoice(
      testInvoice({ id: undefined, orderId: order.id })
    )

    await promiseTimeout(500)

    const invoice = await repository.getInvoiceByOrderId(order.id!)

    expect(invoice).toEqual(expected)
  })
})
