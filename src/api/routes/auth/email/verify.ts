import Email from "@codrjs/core/classes/Email";
import Response from "@codrjs/core/classes/Response";
import { Operation } from "@dylanbulmer/openapi/types/Route";
import codr from "../../../../class/codr";

export const GET: Operation =
  /* business middleware not expressible by OpenAPI documentation goes here */
  [
    async function (req, res, next) {
      const { token: accessToken } = req.query;
      try {
        const result: Response<{ token: string } | undefined> =
          await codr.auth.signinWithEmail(accessToken as string);
        res.status(200).json(result);
      } catch (e: any) {
        res.status(e?.status || 500).json({ detail: { message: e?.message } });
      }
    },
  ];

// 3.0 specification
GET.apiDoc = {
  description: "Verify the authentication link.",
  tags: ["Authentication"],
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
