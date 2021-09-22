import { omit, pathOr } from 'ramda'
import { DynamoClient } from '../dynamoClient'
import { DDB_TABLE } from '../constants'
import { v4 as uuidv4 } from 'uuid'
import { addPrefix, removePrefix } from '../utils'
import { ORDER_PREFIX } from './orderRepository'
import { QueryInput } from 'aws-sdk/clients/dynamodb'

const SHIPMENT_PREFIX = 's#'
const entityType = 'shipment'

const dynamoRecordToRecord = (record: any): Shipment => {
  const { pk, sk, ...data } = record

  return omit(['entityType'], {
    ...data,
    id: removePrefix(sk, SHIPMENT_PREFIX),
    orderId: removePrefix(pk, ORDER_PREFIX)
  }) as Shipment
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const shipmentRepositoryFactory = (client: DynamoClient) => {
  const saveOrderShipment = async ({
    id,
    orderId,
    address,
    type,
    date = new Date().toISOString()
  }: Shipment) => {
    const _id = id ? id : uuidv4()

    const record = {
      pk: addPrefix(orderId, ORDER_PREFIX),
      sk: addPrefix(_id, SHIPMENT_PREFIX),
      address,
      type,
      date,
      entityType
    }

    await client.putItem(record, DDB_TABLE)
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

  return {
    saveOrderShipment,
    getShipmentsByOrderId
  }
}
