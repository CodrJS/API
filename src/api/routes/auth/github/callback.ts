import Route from "@dylanbulmer/openapi/types/Route";
import passport from "../../../../utils/passport";

export const GET: Route.Operation =
  /* business middleware not expressible by OpenAPI documentation goes here */
  [
    passport.authenticate("github", { failureRedirect: "/login" }),
    function (req, res) {
      // Successful authentication, redirect home.
      res.redirect("/");
    },
  ];

// 3.0 specification
GET.apiDoc = {
  description: "Callback handler for GitHub. When GitHub redirects back to Codr, this endpoint will test the GitHub profile against the database and determine next steps.",
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
