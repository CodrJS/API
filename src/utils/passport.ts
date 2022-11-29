import SigninTemplate from "class/Mail/Template/Signin";
import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
// @ts-ignore
import { Strategy as MagicLinkStrategy } from "passport-magic-link";
import Mail from "./mail";

const GitHub = passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      callbackURL: `${process.env.DOMAIN}/auth/github/callback`,
    },
    function verify(
      accessToken: string,
      refreshToken: string,
      profile,
      done: () => void,
    ) {
      console.log({ profile });
      // User.findOrCreate({ githubId: profile.id }, function (err, user) {
      //   return done(err, user);
      // });
      done();
    },
  ),
);

const MagicLink = passport.use(
  new MagicLinkStrategy(
    {
      secret: process.env.SECRET,
      userFields: ["email"],
      tokenField: "token",
      verifyUserAfterToken: true,
    },
    async function send(user: { email: string }, token: string) {
      const link = process.env["DOMAIN"] + "/auth/email/verify?token=" + token;
      const template = new SigninTemplate();
      return Mail.send(await template.html({ link }), {
        ...template.config,
        to: user.email,
      });
    },
    function verify(user: { email: string }) {
      // return User.findOrCreate({ email: user.email, name: user.name });
    },
  ),
);

export default passport;
