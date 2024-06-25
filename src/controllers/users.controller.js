import service from "../services/users.service.js";
import { createHash, verifyHash } from "../utils/hash.utils.js";
import CustomError from "../utils/errors/CustomError.js";
import errors from "../utils/errors/errors.js";
import { verifyToken } from "../utils/token.utils.js";

class UsersController {
    constructor() {
        this.service = service;
    }
    create = async (req, res, next) => {
        try {
            const data = req.body;
            const response = await this.service.create(data);
            return res.success201(response);
        } catch (error) {
            return next(error);
        }
    };
    read = async (req, res, next) => {
        try {
            const options = {
                limit: req.query.limit || 20,
                page: req.query.page || 1,
                sort: { title: 1 },
                lean: true,
            };
            const filter = {};
            if (req.query.email) {
                filter.email = new RegExp(req.query.email.trim(), "i");
            }
            if (req.query.sort === "desc") {
                options.sort.title = "desc";
            }
            const all = await this.service.read({ filter, options });
            return res.success200(all);
        } catch (error) {
            return next(error);
        }
    };
    readOne = async (req, res, next) => {
        try {
            const { uid } = req.params;

            const one = await this.service.readOne(uid);
            return res.success200(one);
        } catch (error) {
            return next(error);
        }
    };
    readByEmail = async (req, res, next) => {
        try {
            const { email } = req.params;
            const one = await this.service.readByEmail(email);
            return res.success200(one);
        } catch (error) {
            return next(error);
        }
    };
    update = async (req, res, next) => {
        try {
            const { uid } = req.params;
            const data = req.body;
            const { password } = data;
            const one = await this.service.readOne(uid);
            if (!one) {
                CustomError.new(errors.notFound);
            } else {
                if (password) {
                    const verify = verifyHash(password, one.password);
                    if (verify) {
                        CustomError.new(errors.equal);
                    } else {
                        const newPass = createHash(password);
                        const response = await this.service.update(uid, { password: newPass });
                        return res.success201(response);
                    }
                } else {
                    const response = await this.service.update(uid, data);
                    return res.success201(response);
                }
            }
        } catch (error) {
            return next(error);
        }
    };

    destroy = async (req, res, next) => {
        try {
            const { uid } = req.params;
            const response = await this.service.destroy(uid);
            return res.success200(response);
        } catch (error) {
            return next(error);
        }
    };
    updateRole = async (req, res, next) => {
        try {
            const { uid } = req.params;
            const one = await this.service.readOne(uid);
            const newRole = one.role === "PREM" ? "USER" : "PREM";
            const response = await this.service.update(uid, { role: newRole });
            return res.success200(response);
        } catch (error) {
            return next(error);
        }
    };
    verify = async (req, res, next) => {
        try {
            const eToken = verifyToken(req.params);
            if (eToken) {
                return res.json({ statusCode: 200, response: "Verified link", user_id: eToken.user_id });
            } else {
                return CustomError(errors.expired);
            }
        } catch (error) {
            return next(error);
        }
    };
}

export default UsersController;
const controller = new UsersController();
const { create, read, readOne, update, destroy, readByEmail, updateRole, verify } = controller;
export { create, read, readOne, update, destroy, readByEmail, updateRole, verify };
