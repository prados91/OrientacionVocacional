import CustomRouter from "../CustomRouter.js";
import { create, read, readOne, update, destroy, readPrem } from "../../controllers/products.controller.js";

class ProductsRouter extends CustomRouter {
    init() {
        this.create("/", ["ADMIN", "PREM"], create);
        this.read("/", ["USER", "ADMIN", "PREM"], read); //ACA SOLO ESTABA PUBLIC
        this.read("/:pid", ["USER", "ADMIN", "PREM"], readOne); //ACÁ SOLO ESTABA PUBLIC
        this.read("/premium/me", ["PREM"], readPrem); //ACÁ SOLO ESTABA PUBLIC
        this.update("/:pid", ["ADMIN", "PREM"], update);
        this.destroy("/:pid", ["ADMIN", "PREM"], destroy);
    }
}

const productsRouter = new ProductsRouter();
export default productsRouter.getRouter();
