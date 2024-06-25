import CustomRouter from "../CustomRouter.js";

class SessionsRouter extends CustomRouter {
    init() {
        this.read("/register", ["USER", "PREM","ADMIN"], async (req, res, next) => {//ESTABA PUBLIC
            try {
                return res.render("register", { title: "REGISTER" });
            } catch (error) {
                return next(error);
            }
        });

        this.read("/login", ["ADMIN", "PREM", "USER"], async (req, res, next) => { //ESTABA PUBLIC EN VEZ DE USER
            try {
                return res.render("login", { title: "LOGIN" });
            } catch (error) {
                return next(error);
            }
        });
    }
}
const sessionsRouter = new SessionsRouter();
export default sessionsRouter.getRouter();
