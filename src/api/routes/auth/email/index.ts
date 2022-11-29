import { Operation } from "@dylanbulmer/openapi/types/Route";
import passport from "../../../../utils/passport";

export const POST: Operation =
  /* business middleware not expressible by OpenAPI documentation goes here */
  [
    passport.authenticate("magiclink", { action: "requestToken" }),
    function (req, res, next) {
      res.status(200).json({ detail: { message: "Check your email." } });
    },
  ];

// 3.0 specification
POST.apiDoc = {
  description: "Log into the server via a Magic Link.",
  tags: ["Authentication"],
  requestBody: {
    content: {
      "application/json": {
        schema: {
          required: ["user"],
          properties: {
            user: {
              type: "object",
              required: ["email"],
              properties: {
                email: {
                  type: "string",
                  examples: ["john.doe@example.com"],
                },
              },
            },
          },
        },
      },
    },
  },
  responses: {
    "200": {
      $ref: "#/components/responses/200",
    },
    "500": {
      $ref: "#/components/responses/500",
    },
    "503": {
      $ref: "#/components/responses/503",
    },
  },
};
