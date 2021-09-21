import { datatype, internet, lorem } from 'faker'

export const testCustomer = (overrides: Partial<Customer> = {}): Customer => ({
  id: datatype.uuid(),
  email: internet.email(),
  name: internet.userName(),
  ...overrides
})

export const testProduct = (overrides: Partial<Product> = {}): Product => ({
  id: datatype.uuid(),
  name: lorem.words(2),
  price: datatype.number(),
  ...overrides
})
