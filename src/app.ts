import express, { Express, Request, Response } from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

import v1 from "./api";
import { Error } from "./class/Error";

const app: Express = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(bodyParser.json());
app.use(morgan("short"));

app.get("/", (req: Request, res: Response) => {
  res.send(`Express + TypeScript Server.<br/><br/>Navigate to <a href="/v1/docs">/v1/docs</a> to view the documentation.`);
});

/**
 * Initialize 'v1' api and 'v1' api error handler.
 */
app.use("/api/v1", v1);
app.use(((err, req, res, next) => {
  // if headers are already sent, let express handler the error
  if (res.headersSent) {
    return next(err);
  }

  // if the path is for the API, have it handle the error
  if (req.path.startsWith("/api/v1")) {
    return v1.get("errorHandler")(err, req, res, next);
  }

  // if all fails, send the error to express
  return next(err);
}) as express.ErrorRequestHandler);

/**
 * Error not handled? Send a 404.
 */
app.use((req, res, next) => {
  // catch 404 errors?
  const err = new Error({ status: 404, message: `Not found: ${req.path}` });

  // if the path is for API v1, have v1 handler the error
  if (req.path.startsWith("/api/v1")) {
    return v1.get("errorHandler")(err, req, res, next);
  } else {
    return res.json(err);
  }
});

app.listen(port, () => {
  console.log(`⚡️ [server]: Server is running at https://localhost:${port}`);
});

export default app;
