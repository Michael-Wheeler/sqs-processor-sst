import {
  StackContext,
  Api,
  Queue,
  Cron,
  Function,
  Config,
  Table,
} from "sst/constructs";

export function API({ stack }: StackContext) {
  const SECRET_KEY = new Config.Secret(stack, "SECRET_KEY");

  const table = new Table(stack, "accountState", {
    fields: {
      accountId: "string",
    },
    primaryIndex: { partitionKey: "accountId" },
  });

  const consumer = new Function(stack, "consumer", {
    handler: "packages/functions/src/consumer.handler",
    bind: [SECRET_KEY, table],
    nodejs: {
      format: "esm",
    },
  });

  const deadLetterQueue = new Queue(stack, "deadLetterQueue");

  const queue = new Queue(stack, "queue", {
    consumer: consumer,
    cdk: {
      queue: {
        deadLetterQueue: {
          queue: deadLetterQueue.cdk.queue,
          maxReceiveCount: 1,
        },
      },
    },
  });

  const producer = new Function(stack, "producer", {
    handler: "packages/functions/src/producer.handler",
    nodejs: {
      format: "esm",
    },
    bind: [queue],
  });

  new Cron(stack, "cron", {
    schedule: "rate(1 hour)",
    job: producer,
  });

  const api = new Api(stack, "api", {
    routes: {
      "GET /": "packages/functions/src/helloWorld.handler",
      "GET /produce": producer,
    },
  });

  stack.addOutputs({
    ApiEndpoint: api.url,
  });
}
