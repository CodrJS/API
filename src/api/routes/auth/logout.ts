import Route from "@dylanbulmer/openapi/types/Route";

export const GET: Route.Operation = async function (req, res, next) {
  await req.session.destroy();
  res.redirect("/");
};

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
