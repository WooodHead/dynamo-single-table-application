import { omit } from 'ramda'
import { DynamoClient } from '../dynamoClient'
import { DDB_TABLE } from '../constants'
import { v4 as uuidv4 } from 'uuid'
import { addPrefix, removePrefix } from '../utils'
import { CUSTOMER_PREFIX } from './customerRepository'
import { PRODUCT_PREFIX } from './productRepository'

export const ORDER_PREFIX = 'o#'
const SHIPMENT_PREFIX = 's#'
const SHIPMENT_ITEM_PREFIX = 'd#'
const entityType = 'order'
const orderItemEntityType = 'orderItem'
const shipmentEntityType = 'shipment'
const shipmentItemEntityType = 'shipmentItem'

const dynamoRecordToRecord = (record: any): Order => {
  const { pk, sk, ...data } = record

  return omit(['sk', 'entityType'], {
    ...data,
    id: removePrefix(pk, ORDER_PREFIX),
    customerId: removePrefix(sk, CUSTOMER_PREFIX)
  }) as Order
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const orderRepositoryFactory = (client: DynamoClient) => {
  const getCustomerOrderById = async (
    orderId: string,
    customerId: string
  ): Promise<Order | undefined> =>
    client
      .getItem({
        TableName: DDB_TABLE,
        Key: {
          pk: addPrefix(orderId, ORDER_PREFIX),
          sk: addPrefix(customerId, CUSTOMER_PREFIX)
        } as any
      })
      .then(({ Item }) => (Item ? dynamoRecordToRecord(Item) : undefined))

  const saveCustomerOrder = async ({
    id,
    date = new Date().toISOString(),
    customerId
  }: Order): Promise<Order> => {
    const _id = id ? removePrefix(id, ORDER_PREFIX) : uuidv4()
    const _customerId = removePrefix(customerId, CUSTOMER_PREFIX)

    const record = {
      pk: addPrefix(_id, ORDER_PREFIX),
      sk: addPrefix(_customerId, CUSTOMER_PREFIX),
      date,
      entityType
    }

    await client.putItem(record, DDB_TABLE)

    return {
      id: _id,
      customerId: _customerId,
      date
    }
  }

  const saveOrderItem = async ({
    productId,
    orderId,
    price,
    quantity
  }: OrderItem) => {
    const record = {
      pk: addPrefix(orderId, ORDER_PREFIX),
      sk: addPrefix(productId, PRODUCT_PREFIX),
      price,
      quantity,
      entityType: orderItemEntityType
    }

    await client.putItem(record, DDB_TABLE)
  }

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
      entityType: shipmentEntityType
    }

    await client.putItem(record, DDB_TABLE)
  }

  const saveOrderShipmentItem = async ({
    id,
    orderId,
    productId,
    shipmentId,
    quantity
  }: ShipmentItem) => {
    const _id = id ? id : uuidv4()

    const record = {
      pk: addPrefix(orderId, ORDER_PREFIX),
      sk: addPrefix(_id, SHIPMENT_ITEM_PREFIX),
      productId,
      shipmentId,
      quantity,
      entityType: shipmentItemEntityType
    }

    await client.putItem(record, DDB_TABLE)
  }

  return {
    getCustomerOrderById,
    saveCustomerOrder,
    saveOrderItem,
    saveOrderShipment,
    saveOrderShipmentItem
  }
}
