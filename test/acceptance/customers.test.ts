import { internet } from 'faker'
import { customerServiceFactory } from '../../src/domain/customerService'
import { testDynamoClient } from '../awsTestClients'
import { testCustomer } from '../testFactories'

const service = customerServiceFactory(testDynamoClient)

describe('customers', () => {
  it('adds a new customer without id', async () => {
    const customer = testCustomer({ id: undefined })

    const result = await service.saveCustomer(customer)

    expect(result).toEqual({
      id: expect.any(String),
      email: customer.email,
      name: customer.name
    })
  })

  it('adds a new customer with id', async () => {
    const customer = testCustomer()

    const result = await service.saveCustomer(customer)

    expect(result).toEqual(customer)
  })

  it('get customer not found returns undefined', async () => {
    const result = await service.getCustomerById('this-id-does-not-exist')

    expect(result).toEqual(undefined)
  })

  it('edits an existing customer', async () => {
    const customer = testCustomer()

    await service.saveCustomer(customer)
    const updated = await service.saveCustomer({
      ...customer,
      email: internet.email()
    })

    const result = await service.getCustomerById(customer.id!)

    expect(result).toEqual(updated)
  })
})
