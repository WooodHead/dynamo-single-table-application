import { omit, pathOr } from 'ramda'
import { DynamoClient } from '../dynamoClient'
import { DDB_TABLE } from '../constants'
import { v4 as uuidv4 } from 'uuid'
import { addPrefix, removePrefix } from '../utils'
import { ORDER_PREFIX } from './orderRepository'
import { QueryInput } from 'aws-sdk/clients/dynamodb'
import { WAREHOUSE_PREFIX } from './warehouseRepository'

const SHIPMENT_PREFIX = 's#'
const entityType = 'shipment'

const dynamoRecordToRecord = (record: any): Shipment => {
  const { pk, sk, gsi2_pk, ...data } = record

  return omit(['entityType', 'gsi1_pk', 'gsi1_sk', 'gsi2_sk'], {
    ...data,
    id: removePrefix(sk, SHIPMENT_PREFIX),
    warehouseId: removePrefix(gsi2_pk, WAREHOUSE_PREFIX),
    orderId: removePrefix(pk, ORDER_PREFIX)
  }) as Shipment
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const shipmentRepositoryFactory = (client: DynamoClient) => {
  const saveOrderShipment = async ({
    id,
    orderId,
    warehouseId,
    address,
    type,
    date = new Date().toISOString()
  }: Shipment) => {
    const _id = id ? id : uuidv4()

    const record = {
      pk: addPrefix(orderId, ORDER_PREFIX),
      sk: addPrefix(_id, SHIPMENT_PREFIX),
      gsi1_pk: addPrefix(_id, SHIPMENT_PREFIX),
      gsi1_sk: addPrefix(_id, SHIPMENT_PREFIX),
      gsi2_pk: addPrefix(warehouseId, WAREHOUSE_PREFIX),
      gsi2_sk: addPrefix(_id, SHIPMENT_PREFIX),
      address,
      type,
      date,
      entityType
    }

    await client.putItem(record, DDB_TABLE)

    return {
      id: _id,
      orderId,
      warehouseId,
      address,
      type,
      date
    }
  }

  const getShipmentsByOrderId = async (orderId: string) =>
    client
      .query({
        TableName: DDB_TABLE,
        KeyConditionExpression: '#pk = :pk and begins_with (#sk, :sk)',
        ExpressionAttributeNames: {
          '#pk': 'pk',
          '#sk': 'sk'
        },
        ExpressionAttributeValues: {
          ':pk': addPrefix(orderId, ORDER_PREFIX),
          ':sk': SHIPMENT_PREFIX
        }
      } as QueryInput)
      .then(res =>
        pathOr<Shipment[]>([], ['Items'], res).map(dynamoRecordToRecord)
      )

  const getShipmentByShipmentId = async (
    shipmentId: string
  ): Promise<Shipment | undefined> =>
    client
      .query({
        TableName: DDB_TABLE,
        IndexName: 'gsi1',
        KeyConditionExpression: '#gsi1_pk = :gsi1_pk and #gsi1_sk = :gsi1_sk',
        ExpressionAttributeNames: {
          '#gsi1_pk': 'gsi1_pk',
          '#gsi1_sk': 'gsi1_sk'
        },
        ExpressionAttributeValues: {
          ':gsi1_pk': addPrefix(shipmentId, SHIPMENT_PREFIX),
          ':gsi1_sk': addPrefix(shipmentId, SHIPMENT_PREFIX)
        }
      } as QueryInput)
      .then(res => {
        const record = pathOr<Shipment | undefined>(
          undefined,
          ['Items', '0'],
          res
        )
        return record ? dynamoRecordToRecord(record) : undefined
      })

  const getShipmentByWarehouseId = async (
    warehouseId: string
  ): Promise<Shipment | undefined> =>
    client
      .query({
        TableName: DDB_TABLE,
        IndexName: 'gsi2',
        KeyConditionExpression:
          '#gsi2_pk = :gsi2_pk and begins_with (#gsi2_sk, :gsi2_sk)',
        ExpressionAttributeNames: {
          '#gsi2_pk': 'gsi2_pk',
          '#gsi2_sk': 'gsi2_sk'
        },
        ExpressionAttributeValues: {
          ':gsi2_pk': addPrefix(warehouseId, WAREHOUSE_PREFIX),
          ':gsi2_sk': SHIPMENT_PREFIX
        }
      } as QueryInput)
      .then(res => {
        const record = pathOr<Shipment | undefined>(
          undefined,
          ['Items', '0'],
          res
        )
        return record ? dynamoRecordToRecord(record) : undefined
      })

  return {
    saveOrderShipment,
    getShipmentsByOrderId,
    getShipmentByShipmentId,
    getShipmentByWarehouseId
  }
}
