import { omit } from 'ramda'
import { DynamoClient } from '../dynamoClient'
import { DDB_TABLE } from '../constants'
import { v4 as uuidv4 } from 'uuid'
import { addPrefix, removePrefix } from '../utils'

const PREFIX = 'w#'
const entityType = 'warehouse'

const dynamoRecordToRecord = (record: any): Warehouse => {
  const { pk, ...data } = record

  return omit(['sk', 'entityType'], {
    ...data,
    id: removePrefix(pk, PREFIX)
  }) as Warehouse
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const warehouseServiceFactory = (client: DynamoClient) => {
  const getWarehouseById = async (id: string): Promise<Warehouse | undefined> =>
    client
      .getItem({
        TableName: DDB_TABLE,
        Key: {
          pk: addPrefix(id, PREFIX),
          sk: addPrefix(id, PREFIX)
        } as any
      })
      .then(({ Item }) => (Item ? dynamoRecordToRecord(Item) : undefined))

  const saveWarehouse = async ({
    id,
    address
  }: Warehouse): Promise<Warehouse> => {
    const _id = id ? removePrefix(id, PREFIX) : uuidv4()

    const record = {
      pk: addPrefix(_id, PREFIX),
      sk: addPrefix(_id, PREFIX),
      address,
      entityType
    }

    await client.putItem(record, DDB_TABLE)

    return {
      id: _id,
      address
    }
  }

  return {
    getWarehouseById,
    saveWarehouse
  }
}
