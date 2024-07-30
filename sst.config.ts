import { SSTConfig } from "sst";
import { API } from "./stacks/MyStack.js";

export default {
  config(_input) {
    return {
      name: "app-poc",
      region: "eu-west-1",
    };
  },
  stacks(app) {
    app.stack(API);
  },
} satisfies SSTConfig;
