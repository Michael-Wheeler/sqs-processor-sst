import { StackContext, Api, Queue } from "sst/constructs";

export function API({ stack }: StackContext) {
  const queue = new Queue(stack, "queue", {
  consumer: "packages/functions/src/consumer.handler",
});

  const api = new Api(stack, "api", {
    defaults: {
      function: {
        bind: [queue],
      },
    },
    routes: {
      "GET /": "packages/functions/src/helloWorld.handler",
      "GET /produce": "packages/functions/src/producer.handler",
    },
  });

  stack.addOutputs({
    ApiEndpoint: api.url,
  });
}
