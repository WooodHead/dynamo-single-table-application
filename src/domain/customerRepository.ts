import { omit } from 'ramda'
import { DynamoClient } from '../dynamoClient'
import { DDB_TABLE } from '../constants'
import { v4 as uuidv4 } from 'uuid'
import { addPrefix, removePrefix } from '../utils'

export const CUSTOMER_PREFIX = 'c#'
const entityType = 'customer'

const dynamoRecordToRecord = (record: any): Customer => {
  const { pk, ...data } = record

  return omit(['sk', 'entityType'], {
    ...data,
    id: removePrefix(pk, CUSTOMER_PREFIX)
  }) as Customer
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const customerRepositoryFactory = (client: DynamoClient) => {
  const getCustomerById = async (id: string): Promise<Customer | undefined> =>
    client
      .getItem({
        TableName: DDB_TABLE,
        Key: {
          pk: addPrefix(id, CUSTOMER_PREFIX),
          sk: addPrefix(id, CUSTOMER_PREFIX)
        } as any
      })
      .then(({ Item }) => (Item ? dynamoRecordToRecord(Item) : undefined))

  const saveCustomer = async ({
    id,
    email,
    name
  }: Customer): Promise<Customer> => {
    const _id = id ? removePrefix(id, CUSTOMER_PREFIX) : uuidv4()

    const record = {
      pk: addPrefix(_id, CUSTOMER_PREFIX),
      sk: addPrefix(_id, CUSTOMER_PREFIX),
      email,
      name,
      entityType
    }

    await client.putItem(record, DDB_TABLE)

    return {
      id: _id,
      email,
      name
    }
  }

  return {
    getCustomerById,
    saveCustomer
  }
}
