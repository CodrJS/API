// initialize Codr

import { App, Database, Authentication } from "@codrjs/core";

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

app.connect();

const auth = new Authentication(app);
const db = new Database(app);

const Codr = {
  app,
  db,
  auth,
};

export default Codr;
