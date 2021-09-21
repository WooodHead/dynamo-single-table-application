import { datatype } from 'faker'
import { productServiceFactory } from '../src/domain/productService'
import { testDynamoClient } from './awsTestClients'
import { testProduct } from './testFactories'

const service = productServiceFactory(testDynamoClient)

describe('products', () => {
  it('adds a new product without id', async () => {
    const product = testProduct({ id: undefined })

    const result = await service.saveProduct(product)

    expect(result).toEqual({
      id: expect.any(String),
      price: product.price,
      name: product.name
    })
  })

  it('adds a new product with id', async () => {
    const product = testProduct()

    const result = await service.saveProduct(product)

    expect(result).toEqual(product)
  })

  it('get product not found returns undefined', async () => {
    const result = await service.getProductById('this-id-does-not-exist')

    expect(result).toEqual(undefined)
  })

  it('edits an existing product', async () => {
    const product = testProduct()

    await service.saveProduct(product)
    const updated = await service.saveProduct({
      ...product,
      price: datatype.number()
    })

    const result = await service.getProductById(product.id!)

    expect(result).toEqual(updated)
  })
})
