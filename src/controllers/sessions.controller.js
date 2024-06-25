import service from "../services/users.service.js";
import CustomError from "../utils/errors/CustomError.js";
import errors from "../utils/errors/errors.js";
import { createToken } from "../utils/token.utils.js";

class SessionsController {
    constructor() {
        this.service = service;
    }
    register = async (req, res, next) => {
        const { email, name, verifiedCode } = req.user;
        await this.service.register({ email, name, verifiedCode });
        try {
            return res.json({
                statusCode: 201,
                message: "Registered!",
            });
        } catch (error) {
            return next(error);
        }
    };
    login = async (req, res, next) => {
        try {
            return res
                .cookie(
                    "token",
                    req.token,
                    {
                        maxAge: 60 * 60 * 24 * 7,
                        httpOnly: true,
                        secure: true,
                        sameSite: "None", //ver si así funciona y esto es correcto
                    },
                    //{ expiresIn: 3600 }
                )
                .json({
                    statusCode: 200,
                    message: "Logged in!",
                });
        } catch (error) {
            return next(error);
        }
    };
    google = async (req, res, next) => {
        try {
            return res.success200("Logged in with Google!");
        } catch (error) {
            return next(error);
        }
    };
    github = async (req, res, next) => {
        try {
            return res.success200("Logged in with Github!");
        } catch (error) {
            return next(error);
        }
    };
    signout = async (req, res, next) => {
        try {
            return res.clearCookie("token").success200("Signed out!");
        } catch (error) {
            return next(error);
        }
    };
    verifyAccount = async (req, res, next) => {
        try {
            const { email, verifiedCode } = req.body;
            const user = await service.readByEmail(email);
            if (user.verifiedCode === verifiedCode) {
                await service.update(user._id, { verified: true });
                return res.json({
                    statusCode: 200,
                    message: "Verified user!",
                });
            } else {
                CustomError.new(errors.token);
            }
        } catch (error) {
            return next(error);
        }
    };
    badauth = (req, res, next) => {
        try {
            return res.error401();
        } catch (error) {
            return next(error);
        }
    };

    me = async (req, res, next) => {
        try {
            if (req.user) {
                const { email, role, photo, name, _id: id, lastName } = req.user;
                return res.success200({ email, role, photo, name, _id: id, lastName });
            } else {
                return res.error401();
            }
        } catch (error) {
            return next(error);
        }
    };
    recovery = async (req, res, next) => {
        try {
            const { email } = req.body;
            const user = await this.service.readByEmail(email);
            if (user) {
                const eToken = createToken({ user_id: user._id }, { expiresIn: 3600 }); //ACÁ EL TIEMPO VA EN SEGUNDOS
                await this.service.recovery(user, eToken);
                return res.json({
                    statusCode: 200,
                    message: "Email sent!",
                });
            } else {
                CustomError.new(errors.notFound);
            }
        } catch (error) {
            return next(error);
        }
    };
}

export default SessionsController;
const controller = new SessionsController();
const { register, login, signout, verifyAccount, me, recovery } = controller;
export { register, login, signout, verifyAccount, me, recovery };
