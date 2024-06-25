import CustomRouter from "../CustomRouter.js";
import productsRouter from "./products.views.js";
import sessionsRouter from "./sessions.view.js";
import dao from "../../data/index.factory.js";
const { products } = dao;

class ViewsRouter extends CustomRouter {
    init() {
        this.router.use("/products", productsRouter);
        this.router.use("/sessions", sessionsRouter);
        this.read("/", ["USER", "PREM","ADMIN"], async (req, res, next) => {//ESTABA PUBLIC
            try {
                const options = {
                    limit: req.query.limit || 10,
                    page: req.query.page || 1,
                    sort: { title: 1 },
                    lean: true,
                };
                const filter = {};
                if (req.query.title) {
                    filter.title = new RegExp(req.query.title.trim(), "i");
                }
                if (req.query.sort === "desc") {
                    options.sort.title = "desc";
                }
                const all = await products.read({ filter, options });
                return res.render("index", {
                    products: all.docs,
                    next: all.nextPage,
                    prev: all.prevPage,
                    title: "Welcome to Basketball | Store",
                    filter: req.query.title,
                });
            } catch (error) {
                next(error);
            }
        });
    }
}

const viewsRouter = new ViewsRouter();
export default viewsRouter.getRouter();
