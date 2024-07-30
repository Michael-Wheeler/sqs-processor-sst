import { SendMessageCommand, SQSClient } from "@aws-sdk/client-sqs";
import { SQSEvent } from "aws-lambda";
import { Queue } from "sst/node/queue";

const sqs = new SQSClient({});

export async function handler(event: SQSEvent) {
  let i = 1;
  while (i < 10) {
    const accountId = "id-" + Math.random() * 1000000;
    const sprn = "sprn-" + Math.random() * 1000000;

    const command = new SendMessageCommand({
      QueueUrl: Queue.queue.queueUrl,
      MessageBody: JSON.stringify({
        accountId: accountId,
        sprn: sprn,
      }),
    });

    console.log("%j", {
      source: "PRODUCER_LAMBDA",
      accountId: accountId,
      sprn: sprn,
    });

    sqs.send(command);
    i++;
  }

  return {
    statusCode: 200,
    body: `Successfully added to the queue`,
  };
}
