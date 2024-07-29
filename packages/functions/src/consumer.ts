import { SQSEvent } from "aws-lambda";

export async function handler(event: SQSEvent) {
  const records: any[] = event.Records;

  await sleep(1000);

  console.log(`Hello from consumer lambda`);
  console.log(`Message processed in consumer: "${records[0].body}"`);

  return { statusCode: 200 };
}

function sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
