import { omit } from 'ramda'
import { DynamoClient } from '../dynamoClient'
import { DDB_TABLE } from '../constants'
import { v4 as uuidv4 } from 'uuid'
import { addPrefix, removePrefix } from '../utils'

export const PRODUCT_PREFIX = 'p#'
const entityType = 'product'

const dynamoRecordToRecord = (record: any): Product => {
  const { pk, ...data } = record

  return omit(['sk', 'entityType'], {
    ...data,
    id: removePrefix(pk, PRODUCT_PREFIX)
  }) as Product
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const productServiceFactory = (client: DynamoClient) => {
  const getProductById = async (id: string): Promise<Product | undefined> =>
    client
      .getItem({
        TableName: DDB_TABLE,
        Key: {
          pk: addPrefix(id, PRODUCT_PREFIX),
          sk: addPrefix(id, PRODUCT_PREFIX)
        } as any
      })
      .then(({ Item }) => (Item ? dynamoRecordToRecord(Item) : undefined))

  const saveProduct = async ({
    id,
    price,
    name
  }: Product): Promise<Product> => {
    const _id = id ? removePrefix(id, PRODUCT_PREFIX) : uuidv4()

    const record = {
      pk: addPrefix(_id, PRODUCT_PREFIX),
      sk: addPrefix(_id, PRODUCT_PREFIX),
      price,
      name,
      entityType
    }

    await client.putItem(record, DDB_TABLE)

    return {
      id: _id,
      price,
      name
    }
  }

  return {
    getProductById,
    saveProduct
  }
}
