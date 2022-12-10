import Response from "@codrjs/core/classes/Response";
import { Operation } from "@dylanbulmer/openapi/types/Route";
import codr from "../../../../class/codr";

export const POST: Operation =
  /* business middleware not expressible by OpenAPI documentation goes here */
  [
    // passport.authenticate("magiclink", { action: "requestToken" }),
    async function (req, res, next) {
      try {
        const result: Response<{ token: string } | undefined> =
          await codr.auth.signinWithEmail(
            codr.auth.generateCode({ email: req.body.email }),
          );
        res.status(200).json({ detail: { message: result.message } });
      } catch (e: any) {
        res.status(e?.status || 500).json({ detail: { message: e?.message } });
      }
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
