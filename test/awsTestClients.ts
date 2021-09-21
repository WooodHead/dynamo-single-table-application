import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createDynamoClient } from '../src/dynamoClient'
import { DDB_TABLE, LOCAL_AWS_CONFIG } from '../src/constants'

export const testDynamoClient = createDynamoClient(
  new DocumentClient(LOCAL_AWS_CONFIG)
)

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const purgeAll = async () =>
  Promise.all([testDynamoClient.truncateTable(DDB_TABLE, 'pk', 'sk')])
