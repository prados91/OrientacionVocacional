import CustomRouter from "../CustomRouter.js";
import passport from "../../middlewares/passport.mid.js";
import passCallBack from "../../middlewares/passCallBack.mid.js";
import { register, login, signout, verifyAccount, me, recovery } from "../../controllers/sessions.controller.js";

class SessionsRouter extends CustomRouter {
    init() {
        this.create("/register", ["USER", "ADMIN", "PREM"], passCallBack("register"), register);
        this.create("/login", ["USER", "ADMIN", "PREM"], passCallBack("login"), login);
        this.create(
            "/google",
            ["USER", "ADMIN", "PREM"],
            passport.authenticate("google", { scope: ["email", "profile"] })
        );
        this.create("/signout", ["USER", "ADMIN", "PREM"], passCallBack("jwt"), signout);
        this.create("/verify", ["USER", "ADMIN", "PREM"], verifyAccount);
        this.create("/me", ["USER", "ADMIN", "PREM"], me);
        this.create("/recovery", ["USER", "ADMIN", "PREM"], recovery);
    }
}

let sessionsRouter = new SessionsRouter();
export default sessionsRouter.getRouter();
