import { internet } from 'faker'
import { customerRepositoryFactory } from '../../src/domain/customerRepository'
import { testDynamoClient } from '../awsTestClients'
import { testCustomer } from '../testFactories'

const repository = customerRepositoryFactory(testDynamoClient)

describe('customers', () => {
  it('adds a new customer without id', async () => {
    const customer = testCustomer({ id: undefined })

    const result = await repository.saveCustomer(customer)

    expect(result).toEqual({
      id: expect.any(String),
      email: customer.email,
      name: customer.name
    })
  })

  it('adds a new customer with id', async () => {
    const customer = testCustomer()

    const result = await repository.saveCustomer(customer)

    expect(result).toEqual(customer)
  })

  it('get customer not found returns undefined', async () => {
    const result = await repository.getCustomerById('this-id-does-not-exist')

    expect(result).toEqual(undefined)
  })

  it('edits an existing customer', async () => {
    const customer = testCustomer()

    await repository.saveCustomer(customer)
    const updated = await repository.saveCustomer({
      ...customer,
      email: internet.email()
    })

    const result = await repository.getCustomerById(customer.id!)

    expect(result).toEqual(updated)
  })
})
