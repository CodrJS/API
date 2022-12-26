import { Error, Response } from "@codrjs/core";
import { IUser, UserRoleType } from "@codrjs/core/types/models/User";
import Route from "@dylanbulmer/openapi/types/Route";
import Codr from "../../../class/codr";

export const POST: Route.Operation =
  /* business middleware not expressible by OpenAPI documentation goes here */
  async (req, res) => {
    // get user from session
    const user = req.session.user;

    // check if user is an admin
    if (user && user.role === "codr:admin") {
      // get users from request body
      const users = req.body.users as {
        email: string;
        role: UserRoleType;
        flags?: IUser["flags"];
        name?: IUser["name"];
        username: string;
      }[];

      // add users to database.
      const result = await Codr.admin.addUsers(user, users);

      // return response with or without errors
      if (result.details.errors.length) {
        res.status(500).json(
          new Response({
            message: "Some errors occured.",
            details: result.details,
          }),
        );
      } else {
        res.status(200).json(
          new Response({
            message: "OK",
            details: { users: result.details.users },
          }),
        );
      }
    } else {
      res.status(403).json(new Response({ message: "Unauthorized" }));
    }
  };

export const GET: Route.Operation = async (req, res) => {
  // get user from session
  const user = req.session.user;

  // check if user is an admin
  if (user && user.role === "codr:admin") {
    try {
      const users = await Codr.admin.getUsers(user);
      res.status(200).json(users);
      // @ts-ignore
    } catch (e: any) {
      const err: Error = e;
      res.status(err.status).json(err);
    }
  } else {
    res
      .status(403)
      .json(
        new Response({ message: "Unauthorized" }),
      );
  }
};

export const PATCH: Route.Operation = async (req, res) => {
  const user = req.session.user;

  if (user && user.role === "codr:admin") {
    const users = req.body.users as (Partial<IUser> & { _id: string })[];

    for (const user of users) {
      delete user.email;
      delete user.name;
      delete user.createdAt;
      delete user.updatedAt;
    }

    const result = await Codr.admin.updateUsers(user, users);

    if (result.details.errors.length) {
      res.status(500).json(
        new Response({
          message: "Some errors occured.",
          details: result.details,
        }),
      );
    } else {
      res.status(200).json(
        new Response({
          message: "OK",
          details: { users: result.details.users },
        }),
      );
    }
  } else {
    res
      .status(403)
      .json(
        new Response({ message: "Unauthorized" }),
      );
  }
};

// 3.0 specification
POST.apiDoc = {
  description: "Add users to Codr",
  tags: ["Administrative"],
  requestBody: {
    content: {
      "application/json": {
        schema: {
          properties: {
            users: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  email: {
                    type: "string",
                    examples: ["jon.doe@example.com"],
                  },
                  role: {
                    type: "string",
                    examples: ["codr:annotator"],
                  },
                  isAnonymous: {
                    type: "boolean",
                    examples: [false],
                  },
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
      content: {
        "application/json": {
          schema: {
            properties: {
              detail: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    examples: ["OK"],
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

// 3.0 specification
GET.apiDoc = {
  description: "Get all Codr users.",
  tags: ["Administrative"],
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
                  message: {
                    type: "string",
                    examples: ["OK"],
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
