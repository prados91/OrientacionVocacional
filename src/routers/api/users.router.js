import CustomRouter from "../CustomRouter.js";
import {
    create,
    read,
    readOne,
    update,
    destroy,
    readByEmail,
    updateRole,
    verify,
} from "../../controllers/users.controller.js";

class UsersRouter extends CustomRouter {
    init() {
        this.create("/", ["ADMIN", "USER", "PREM"], create);
        this.read("/", ["ADMIN"], read);
        this.read("/:uid", ["USER", "PREM", "ADMIN"], readOne);
        this.update("/:uid", ["USER", "PREM"], update);
        this.destroy("/:uid", ["USER", "PREM"], destroy);
        this.read("/:email", ["ADMIN"], readByEmail);
        this.update("/premium/:uid", ["USER", "PREM"], updateRole);
        this.create("/:token", ["USER", "PREM", "ADMIN"], verify);
    }
}

const usersRouter = new UsersRouter();
export default usersRouter.getRouter();
