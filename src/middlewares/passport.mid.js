import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import { verifyHash } from "../utils/hash.utils.js";
import { createToken } from "../utils/token.utils.js";
import errors from "../utils/errors/errors.js";
import repository from "../repositories/users.rep.js";
const { SECRET } = process.env;

passport.use(
    "register",
    new LocalStrategy({ passReqToCallback: true, usernameField: "email" }, async (req, email, password, done) => {
        try {
            let one = await repository.readByEmail(email);
            if (one) {
                return done(null, false, errors.register);
            } else {
                const user = await repository.create(req.body);
                return done(null, user);
            }
        } catch (error) {
            return done(error);
        }
    })
);
passport.use(
    "login",
    new LocalStrategy({ passReqToCallback: true, usernameField: "email" }, async (req, email, password, done) => {
        try {
            const user = await repository.readByEmail(email);
            const verify = verifyHash(password, user.password);
            if (user?.verified && verify) {
                const token = createToken({ email, role: user.role, user_id: user._id }, { expiresIn: 60 * 60 * 24 });
                req.token = token;
                return done(null, user);
            } else {
                return done(null, false, errors.auth);
            }
        } catch (error) {
            return done(error);
        }
    })
);

passport.use(
    "jwt",
    new JwtStrategy(
        {
            secretOrKey: SECRET,
            jwtFromRequest: ExtractJwt.fromExtractors([(req) => req?.cookies["token"]]),
        },
        async (payload, done) => {
            try {
                const user = await repository.readByEmail(payload.email);
                if (user) {
                    user.password = "";
                    return done(null, user);
                } else {
                    return done(null, false, errors.forbidden);
                }
            } catch (error) {
                return done(error);
            }
        }
    )
);

export default passport;
