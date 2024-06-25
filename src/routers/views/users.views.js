import CustomRouter from "../CustomRouter.js";
import dao from "../data/index.factory.js";
const { users } = dao;

export default class UsersRouter extends CustomRouter {
    init() {
        this.read("/", ["ADMIN", "PREM", "USER"], async (req, res, next) => { //estaba PUBLIC
            try {
                const all = await users.read({});
                return res.render("register", { users: all, title: "USERS" });
            } catch (error) {
                next(error);
            }
        });
        this.read("/new", ["ADMIN", "PREM", "USER"], (req, res, next) => {//ESTABA PUBLIC
            try {
                return res.render("new", { title: "NEW" });
            } catch (error) {
                next(error);
            }
        });
    }
}
z;
