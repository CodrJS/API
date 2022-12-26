import Route from "@dylanbulmer/openapi/types/Route";
import Codr from "../../class/codr";

export const GET: Route.Operation =
  /* business middleware not expressible by OpenAPI documentation goes here */
  (req, res) => {
    res
      .status(200)
      .json({
        detail: {
          state: "up",
          mongo: Codr.app.mongoIsConnected ? "connected" : "disconnected",
        },
      });
  };

// 3.0 specification
GET.apiDoc = {
  description: "Check the server status",
  tags: ["System"],
  responses: {
    "200": {
      $ref: "#/components/responses/200",
      content: {
        "application/json": {
          schema: {
            properties: {
              detail: {
                type: "object",
                properties: {
                  state: {
                    type: "string",
                    examples: ["up"],
                  },
                  mongo: {
                    type: "string",
                    examples: ["connected"],
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};
