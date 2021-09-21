import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { LOCAL_AWS_CONFIG } from '../constants'
import { createDynamoClient, DynamoClient } from './dynamoClient'

const dynamoInstance = Object.freeze(
  createDynamoClient(new DocumentClient(LOCAL_AWS_CONFIG))
)

export const getDynamoClient = (): DynamoClient => dynamoInstance
