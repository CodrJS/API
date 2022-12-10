// initialize Codr

import { App } from "@codrjs/core";
import Authentication from "@codrjs/core/services/auth";

const app = new App({
  databaseUri: process.env.MONGODB_URI as string,
  instance: {
    name: "PERC_Lab",
    contact: {
      name: "Dylan Bulmer",
      email: "dylan@codrjs.com",
    },
  },
});

const auth = new Authentication(app);

export default {
  app,
  auth,
};
