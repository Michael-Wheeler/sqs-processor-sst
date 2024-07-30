import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { SQSEvent } from "aws-lambda";
import { Config } from "sst/node/config";
import { Table } from "sst/node/table";

const db = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export async function handler(event: SQSEvent) {
  console.log(`Hello from consumer lambda`);
  const records: any[] = event.Records;

  const { accountId, sprn } = JSON.parse(records[0].body);
  const success = Math.random() * 100 < 50;
  await saveAccountState(accountId, success);

  console.log("%j", {
    source: "CONSUMER_LAMBDA",
    secretKey: Config.SECRET_KEY,
    accountId: accountId,
    sprn: sprn,
    success: success,
  });

  return success ? { statusCode: 200 } : { statusCode: 500 };
}

async function saveAccountState(
  accountId: string,
  success: boolean
): Promise<void> {
  const update = new UpdateCommand({
    TableName: Table.accountState.tableName,
    Key: {
      accountId: accountId,
    },
    UpdateExpression: "SET success = :success",
    ExpressionAttributeValues: {
      ":success": success,
    },
  });

  await db.send(update);
  return;
}
