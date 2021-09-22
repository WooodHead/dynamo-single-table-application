import { invoiceRepositoryFactory } from '../../src/domain/invoiceRepository'
import { testDynamoClient } from '../awsTestClients'
import { testInvoice } from '../testFactories'

const repository = invoiceRepositoryFactory(testDynamoClient)

describe('invoices', () => {
  it('saves an order invoice', async () => {
    await repository.saveOrderInvoice(testInvoice())
  })

  it('saves an order invoice with no payments', async () => {
    await repository.saveOrderInvoice(testInvoice({ payments: undefined }))
  })

  it('gets an invoice by id', async () => {
    const expected = await repository.saveOrderInvoice(
      testInvoice({ id: undefined })
    )

    const invoice = await repository.getInvoiceById(expected.id!)

    expect(invoice).toEqual(expected)
  })
})
