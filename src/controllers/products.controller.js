import service from "../services/products.service.js";

class ProductsController {
    constructor() {
        this.service = service;
    }
    create = async (req, res, next) => {
        try {
            const data = req.body;
            data.user_id = req.user._id;
            const response = await this.service.create(data);
            return res.success201(response);
        } catch (error) {
            return next(error);
        }
    };
    read = async (req, res, next) => {
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

            if (req.user && req.user.role === "PREM") {
                filter.owner_id = { $ne: req.user._id };
            }

            const all = await this.service.read({ filter, options });
            return res.success200(all);
        } catch (error) {
            return next(error);
        }
    };
    readPrem = async (req, res, next) => {
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
            if (req.user && req.user.role === "PREM") {
                filter.owner_id = { $eq: req.user._id };
            }
            const all = await this.service.read({ filter, options });
            return res.success200(all);
        } catch (error) {
            return next(error);
        }
    };
    readOne = async (req, res, next) => {
        try {
            const { pid } = req.params;
            const one = await this.service.readOne(pid);
            return res.success200(one);
        } catch (error) {
            return next(error);
        }
    };
    update = async (req, res, next) => {
        try {
            const { pid } = req.params;
            const { _id } = req.user;
            const uid = _id.toString();
            const data = req.body;
            if (req.user.role === "PREM") {
                const one = await this.service.readOne(pid);
                const oid = one.owner_id.toString();
                if (oid !== uid) {
                    return res.error403();
                }
            }
            const response = await this.service.update(pid, data);
            return res.success200(response);
        } catch (error) {
            return next(error);
        }
    };
    destroy = async (req, res, next) => {
        try {
            const { pid } = req.params;
            const { _id } = req.user;
            const uid = _id.toString();
            if (req.user.role === "PREM") {
                const one = await this.service.readOne(pid);
                const oid = one.owner_id.toString();
                if (oid === uid) {
                    const response = await this.service.destroy(pid);
                    return res.success200(response);
                } else {
                    return res.error403();
                }
            } else {
                const response = await this.service.destroy(pid);
                return res.success200(response);
            }
        } catch (error) {
            return next(error);
        }
    };
}

export default ProductsController;
const controller = new ProductsController();
const { create, read, readOne, update, destroy, readPrem } = controller;
export { create, read, readOne, update, destroy, readPrem };
