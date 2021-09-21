import { datatype, internet } from 'faker'

export const testCustomer = (overrides: Partial<Customer> = {}): Customer => ({
  id: datatype.uuid(),
  email: internet.email(),
  name: internet.userName(),
  ...overrides
})
