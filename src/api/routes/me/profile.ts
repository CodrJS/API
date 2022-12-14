import Route from "@dylanbulmer/openapi/types/Route";
import Codr from "../../../class/codr";
import session from "../../../utils/session";
import { Response } from "@codrjs/core";

export const POST: Route.Operation =
  /* business middleware not expressible by OpenAPI documentation goes here */
  [
    session,
    async function (req, res, next) {
      const user = req.session.user;
      if (user === undefined) {
        return res.status(401).json(
          new Response({
            message: "Access is unauthorized.",
          }).toJSON(),
        );
      }

      let profile = await Codr.db.Profile(user).findOne({ userId: user._id });
      let update;

      if (profile === null) {
        // this feels hacky, but there's no create function on the Profile model
        profile = await Codr.db.Profile(user).model.create({
          userId: user._id,
          ...req.body,
        });
      } else {
        update = await profile.updateOne({ ...req.body });
      }

      res.status(update?.modifiedCount ? 200 : 500).json(
        new Response({
          message: update.modifiedCount
            ? "Profile updated"
            : "An error occurred while updating your profile.",
          details: update,
        }).toJSON(),
      );
    },
  ];

// 3.0 specification
POST.apiDoc = {
  description: "Update user profile",
  tags: ["Self Management"],
  requestBody: {
    content: {
      "application/json": {
        schema: {
          properties: {
            avatarUrl: {
              type: "string",
            },
            username: {
              type: "string",
              examples: ["JohnDoe"],
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
