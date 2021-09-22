import { omit, pathOr } from 'ramda'
import { DynamoClient } from '../dynamoClient'
import { DDB_TABLE } from '../constants'
import { v4 as uuidv4 } from 'uuid'
import { addPrefix, removePrefix } from '../utils'
import { PRODUCT_PREFIX } from './productRepository'
import { QueryInput } from 'aws-sdk/clients/dynamodb'

export const WAREHOUSE_PREFIX = 'w#'
const entityType = 'warehouse'
const stockEntityType = 'warehouseStock'

const dynamoRecordToRecord = (record: any): Warehouse => {
  const { pk, ...data } = record

  return omit(['sk', 'entityType'], {
    ...data,
    id: removePrefix(pk, WAREHOUSE_PREFIX)
  }) as Warehouse
}

const dynamoRecordToStockInventoryRecord = (record: any): StockInventory => {
  const { pk, sk, ...data } = record

  return omit(['entityType'], {
    ...data,
    productId: removePrefix(pk, PRODUCT_PREFIX),
    warehouseId: removePrefix(sk, WAREHOUSE_PREFIX)
  }) as StockInventory
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const warehouseRepositoryFactory = (client: DynamoClient) => {
  const getWarehouseById = async (id: string): Promise<Warehouse | undefined> =>
    client
      .getItem({
        TableName: DDB_TABLE,
        Key: {
          pk: addPrefix(id, WAREHOUSE_PREFIX),
          sk: addPrefix(id, WAREHOUSE_PREFIX)
        } as any
      })
      .then(({ Item }) => (Item ? dynamoRecordToRecord(Item) : undefined))

  const saveWarehouse = async ({
    id,
    address
  }: Warehouse): Promise<Warehouse> => {
    const _id = id ? removePrefix(id, WAREHOUSE_PREFIX) : uuidv4()

    const record = {
      pk: addPrefix(_id, WAREHOUSE_PREFIX),
      sk: addPrefix(_id, WAREHOUSE_PREFIX),
      address,
      entityType
    }

    await client.putItem(record, DDB_TABLE)

    return {
      id: _id,
      address
    }
  }

  const saveWarehouseStock = async ({
    productId,
    warehouseId,
    quantity
  }: StockInventory) => {
    const record = {
      pk: addPrefix(productId, PRODUCT_PREFIX),
      sk: addPrefix(warehouseId, WAREHOUSE_PREFIX),
      quantity,
      entityType: stockEntityType
    }

    await client.putItem(record, DDB_TABLE)
  }

  const getStockInventoryByProductId = async (productId: string) =>
    client
      .query({
        TableName: DDB_TABLE,
        KeyConditionExpression: '#pk = :pk and begins_with (#sk, :sk)',
        ExpressionAttributeNames: {
          '#pk': 'pk',
          '#sk': 'sk'
        },
        ExpressionAttributeValues: {
          ':pk': addPrefix(productId, PRODUCT_PREFIX),
          ':sk': WAREHOUSE_PREFIX
        }
      } as QueryInput)
      .then(res =>
        pathOr<StockInventory[]>([], ['Items'], res).map(
          dynamoRecordToStockInventoryRecord
        )
      )

  return {
    getWarehouseById,
    saveWarehouse,
    saveWarehouseStock,
    getStockInventoryByProductId
  }
}
