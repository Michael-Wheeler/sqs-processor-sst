import { SendMessageCommand, SQSClient } from "@aws-sdk/client-sqs";
import { SQSEvent } from "aws-lambda";
import { Queue } from "sst/node/queue";

const sqs = new SQSClient({});

export async function handler(event: SQSEvent) {
  const command = new SendMessageCommand({
    QueueUrl: Queue.queue.queueUrl,
    MessageBody: "Hello from the producer lambda!",
  });

  let i = 1;
  while (i < 1000) {
    sqs.send(command);
    i++;
  }

  return {
    statusCode: 200,
    body: `Successfully added to the queue`,
  };
}
