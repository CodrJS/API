import express from "express";
import path from "path";
import { Error } from "@codrjs/core";
import { initialize } from "@dylanbulmer/openapi";
import apiDoc from "./api-doc";
import session from "../utils/session";
// import passport from "../utils/passport";

const app = express();
app.use(session);
// app.use(passport.initialize());
// app.use(passport.session());

initialize({
  app,
  api: {
    doc: apiDoc,
    routes: path.join(__dirname, "routes"),
    expose: false,
  },
  ui: {
    enable: true,
    // url: "/docs/elements"
  },
}).catch(console.error);

const ErrorHandler: express.ErrorRequestHandler = (err: Error, req, res) => {
  return res.status(err.status).json({
    detail: {
      message: err.message,
    },
  });
};

app.set("errorHandler", ErrorHandler);

export default app;
