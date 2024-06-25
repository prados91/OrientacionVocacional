import passport from "./passport.mid.js";
import CustomError from "../utils/errors/CustomError.js";
import errors from "../utils/errors/errors.js";

export default (strategy) => {
    return async (req, res, next) => {
        try {
            passport.authenticate(strategy, (err, user, info) => {
                if (err) {
                    return next(err);
                }
                if (!user) {
                    CustomError.new({
                        message: info.message || errors.auth.message,
                        statusCode: info.statusCode || errors.auth.statusCode,
                    });
                }
                req.user = user;
                return next();
            })(req, res, next);
        } catch (error) {
            return next(error);
        }
    };
};
