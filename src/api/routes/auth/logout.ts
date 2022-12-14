import Route from "@dylanbulmer/openapi/types/Route";
import session from "../../../utils/session";

export const GET: Route.Operation =
  /* business middleware not expressible by OpenAPI documentation goes here */
  [
    session,
    async function (req, res, next) {
      await req.session.destroy();
      res.redirect("/");
    },
  ];

// 3.0 specification
GET.apiDoc = {
  description: "Logout of an account",
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
