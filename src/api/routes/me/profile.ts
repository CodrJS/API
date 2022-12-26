import Route, { Operation } from "@dylanbulmer/openapi/types/Route";
import Codr from "../../../class/codr";
import { Response } from "@codrjs/core";

export const GET: Operation = async function (req, res, next) {
  const user = req.session.user;
  if (user === undefined) {
    res.status(401).json(
      new Response({
        message: "Access is unauthorized.",
      }).toJSON(),
    );
  } else if (user.flags.isAnonymous) {
    res.status(200).json(
      new Response({
        message: "User has no profile.",
      }).toJSON(),
    );
  } else {
    const profile = await Codr.db
      .Profile(user)
      .findOne({ user: user._id })
      .populate("user", "name email role");

    // console.log(profile);
    if (profile) {
      res.status(200).json(
        new Response({
          message: "",
          details: profile,
        }).toJSON(),
      );
    } else {
      // CREATE AN EMPTY PROFILE
      const name =
        (user.name?.preferred ? user.name.preferred : user.name?.first) +
        "" +
        user.name?.last?.charAt(0);
      await Codr.db.Profile(user).model.create({
        user: user._id,
        username: name,
      });

      // Get profile
      const profile = await Codr.db
        .Profile(user)
        .findOne({ user: user._id })
        .populate("user", "name email role");

      // send profile
      res.status(200).json(
        new Response({
          message: "",
          details: profile,
        }).toJSON(),
      );
    }
  }
};

export const PATCH: Route.Operation = async function (req, res, next) {
  const user = req.session.user;
  if (user === undefined) {
    return res.status(401).json(
      new Response({
        message: "Access is unauthorized.",
      }).toJSON(),
    );
  }

  let profile = await Codr.db.Profile(user).findOne({ user: user._id });
  let update;

  if (profile === null) {
    // this feels hacky, but there's no create function on the Profile model
    profile = await Codr.db.Profile(user).model.create({
      user: user._id,
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
};

// 3.0 specification
GET.apiDoc = {
  description: "Get user profile",
  tags: ["Self Management"],
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

// 3.0 specification
PATCH.apiDoc = {
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
