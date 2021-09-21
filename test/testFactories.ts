import { datatype, internet, lorem, address } from 'faker'

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

export const testAddress = (overrides: Partial<Address> = {}): Address => ({
  line1: address.streetAddress(),
  town: address.county(),
  city: address.city(),
  postcode: address.zipCode(),
  ...overrides
})

export const testWarehouse = (
  overrides: Partial<Warehouse> = {}
): Warehouse => ({
  id: datatype.uuid(),
  address: testAddress(),
  ...overrides
})
