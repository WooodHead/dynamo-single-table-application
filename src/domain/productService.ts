import { omit } from 'ramda'
import { DynamoClient } from '../dynamoClient'
import { DDB_TABLE } from '../constants'
import { v4 as uuidv4 } from 'uuid'
import { addPrefix, removePrefix } from '../utils'

const PREFIX = 'p#'
const entityType = 'product'

const dynamoRecordToRecord = (record: any): Product => {
  const { pk, ...data } = record

  return omit(['sk', 'entityType'], {
    ...data,
    id: removePrefix(pk, PREFIX)
  }) as Product
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const productServiceFactory = (client: DynamoClient) => {
  const getProductById = async (id: string): Promise<Product | undefined> =>
    client
      .getItem({
        TableName: DDB_TABLE,
        Key: {
          pk: addPrefix(id, PREFIX),
          sk: addPrefix(id, PREFIX)
        } as any
      })
      .then(({ Item }) => (Item ? dynamoRecordToRecord(Item) : undefined))

  const saveProduct = async ({
    id,
    price,
    name
  }: Product): Promise<Product> => {
    const _id = id ? removePrefix(id, PREFIX) : uuidv4()

    const record = {
      pk: addPrefix(_id, PREFIX),
      sk: addPrefix(_id, PREFIX),
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
