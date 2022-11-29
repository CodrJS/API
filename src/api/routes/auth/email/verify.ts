import { Operation } from "@dylanbulmer/openapi/types/Route";
import passport from "../../../../utils/passport";

export const GET: Operation =
  /* business middleware not expressible by OpenAPI documentation goes here */
  [
    passport.authenticate("magiclink", {
      action: "acceptToken",
      successReturnToOrRedirect: "/",
      failureRedirect: "/login",
    }),
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
