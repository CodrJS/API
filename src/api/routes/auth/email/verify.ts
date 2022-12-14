import Route from "@dylanbulmer/openapi/types/Route";
import codr from "../../../../class/codr";
import { JWT } from "@codrjs/core";
import { IUser } from "@codrjs/core/types/models/User";

export const GET: Route.Operation = async function (req, res, next) {
  const { token: accessToken } = req.query;
  try {
    const result = await codr.auth.signinWithEmail(accessToken as string);

    console.log(result);
    // save the token
    const user = result.details?.user as IUser;

    const token = JWT.generateToken(user);

    req.session.jwt = token;
    req.session.user = user;

    await req.session.save();

    // send home
    res.redirect("/");
  } catch (e: any) {
    res.status(e?.status || 500).json({ detail: { message: e } });
  }
};

// 3.0 specification
GET.apiDoc = {
  description: "Verify the authentication link.",
  tags: ["Authentication"],
  parameters: [
    {
      in: "query",
      name: "token",
      schema: {
        type: "string",
      },
      description: "The access token sent to the email.",
    },
  ],
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
