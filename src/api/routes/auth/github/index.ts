import { Operation } from "@dylanbulmer/openapi/types/Route";
import passport from "../../../../utils/passport";

export const GET: Operation =
  /* business middleware not expressible by OpenAPI documentation goes here */
  [passport.authenticate("github", { scope: ["user:email"] })];

// 3.0 specification
GET.apiDoc = {
  description:
    "Log into the server via GitHub. **This API call cannot be tested via the documentation.** It returns a redirect to https://github.com/ for authentication.",
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
