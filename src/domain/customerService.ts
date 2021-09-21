import { omit } from 'ramda'
import { DynamoClient } from '../clients/dynamoClient'
import { DDB_TABLE } from '../constants'
import { v4 as uuidv4 } from 'uuid'

const PREFIX = 'c#'

const removePrefix = (id: string): string => id.replace(PREFIX, '')
const addPrefix = (id: string): string => `${PREFIX}${removePrefix(id)}`

const dynamoRecordToRecord = (record: any): Customer => {
  const { pk, ...data } = record

  return omit(['sk', 'entityType'], {
    ...data,
    id: removePrefix(pk)
  }) as Customer
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const customerServiceFactory = (client: DynamoClient) => {
  const getCustomerById = async (id: string): Promise<Customer | undefined> =>
    client
      .getItem({
        TableName: DDB_TABLE,
        Key: {
          pk: addPrefix(id),
          sk: addPrefix(id)
        } as any
      })
      .then(({ Item }) => dynamoRecordToRecord(Item))

  const saveCustomer = async ({
    id,
    email,
    name
  }: Customer): Promise<Customer> => {
    const _id = id ? removePrefix(id) : uuidv4()

    const record = {
      pk: addPrefix(_id),
      sk: addPrefix(_id),
      email: email,
      name: name,
      entityType: 'customer'
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

export type CustomerService = ReturnType<typeof customerServiceFactory>
