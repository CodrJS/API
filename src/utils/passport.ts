import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      callbackURL: `${process.env.HOST}${process.env.API_PATH}/auth/github/callback`,
    },
    function verify(
      accessToken: string,
      refreshToken: string,
      profile: any,
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

export default passport;
