import { Error, Response } from "@codrjs/core";
import { UserToken } from "@codrjs/core/types/classes/JWT";
import { IUser } from "@codrjs/core/types/models/User";
import Route from "@dylanbulmer/openapi/types/Route";
import Codr from "../../../class/codr";

export const PATCH: Route.Operation = async function (req, res, next) {
  const user = req.session.user;
  if (user === undefined) {
    return res.status(401).json(
      new Response({
        message: "Access is unauthorized.",
      }).toJSON(),
    );
  }

  const body = req.body;
  if (body.role) {
    // a user may not change their own role.
    delete body.role;
  }

  const userData = await Codr.db.User(user).findOne({ email: user.email });

  if (userData) {
    const update = await userData.updateOne({ ...req.body });

    // update JWT automatically here
    if (update.modifiedCount) {
      const { jwt, user } = Codr.auth.updateJWT(<string>req.session.jwt, {
        ...userData.toObject(),
        ...req.body,
      } as IUser);

      req.session.jwt = jwt;
      req.session.user = user as UserToken;

      await req.session.save();
    }

    res.status(update.modifiedCount ? 200 : 500).json(
      new Response({
        message: update.modifiedCount
          ? "User updated"
          : "An error occurred while updating your user.",
        details: update,
      }).toJSON(),
    );
  } else {
    res
      .status(400)
      .json(new Error({ status: 400, message: "User could not be found." }));
  }
};

// 3.0 specification
PATCH.apiDoc = {
  description: "Update user",
  tags: ["Self Management"],
  requestBody: {
    content: {
      "application/json": {
        schema: {
          properties: {
            name: {
              type: "object",
              properties: {
                first: {
                  type: "string",
                  examples: ["Jonathan"],
                },
                last: {
                  type: "string",
                  examples: ["Doe"],
                },
                preferred: {
                  type: "string",
                  examples: ["Jon"],
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
