import CustomRouter from "../CustomRouter.js";
import passCallBack from "../../middlewares/passCallBack.mid.js";
import dao from "../../data/index.factory.js";
const { products } = dao;

class ProductsRouter extends CustomRouter {
    init() {
        this.read("/real", ["ADMIN", "PREM"], passCallBack("jwt"), (req, res, next) => {
            try {
                return res.render("real", { title: "REAL" });
            } catch (error) {
                next(error);
            }
        });

        this.read("/form", ["ADMIN", "PREM"], passCallBack("jwt"), (req, res, next) => {
            try {
                return res.render("form", { title: "CREATE A PRODUCT" });
            } catch (error) {
                next(error);
            }
        });

        this.read("/:pid", ["USER", "PREM","ADMIN"], async (req, res, next) => {// ESTABA PUBLIC
            try {
                const { pid } = req.params;
                const one = await products.readOne(pid);
                return res.render("detail", { product: one, title: one.title.toUpperCase() });
            } catch (error) {
                next(error);
            }
        });
    }
}

const productsRouter = new ProductsRouter();
export default productsRouter.getRouter();
