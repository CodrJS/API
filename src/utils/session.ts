import { ironSession } from "iron-session/express";
import { JWT } from "@codrjs/core";

const session = ironSession({
  cookieName: "codr-session",
  password: process.env.SECRET as string,
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
});

// This is where we specify the typings of req.session.*
declare module "iron-session" {
  interface IronSessionData {
    user?: JWT.UserToken;
    jwt?: string;
  }
}

export default session;
