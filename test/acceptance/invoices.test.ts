import { invoiceRepositoryFactory } from '../../src/domain/invoiceRepository'
import { testDynamoClient } from '../awsTestClients'
import { testInvoice } from '../testFactories'
import { createCustomers, createOrders, promiseTimeout } from '../testUtils'

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

  it('gets all invoices by customer', async () => {
    const from = new Date().toISOString()

    const customers = await createCustomers(5)
    const customerId = customers[0].id!

    const invoice1 = testInvoice({ customerId })
    const invoice2 = testInvoice({ customerId })
    const invoice3 = testInvoice()
    const invoice4 = testInvoice()
    const invoice5 = testInvoice({ customerId })

    await repository.saveOrderInvoice(invoice1)
    await repository.saveOrderInvoice(invoice2)
    await repository.saveOrderInvoice(invoice3)
    await repository.saveOrderInvoice(invoice4)
    await repository.saveOrderInvoice(invoice5)

    await promiseTimeout(200)

    const to = new Date().toISOString()

    const results = await repository.getInvoicesByCustomerId(
      customerId,
      from,
      to
    )

    expect(results).toEqual(
      expect.arrayContaining([invoice1, invoice2, invoice5])
    )
  })
})
