import User from "./models/user.model.js";
import Product from "./models/product.model.js";
import notFoundOne from "../../utils/notFoundOne.utils.js";
import { Types } from "mongoose";
import CustomError from "../../utils/errors/CustomError.js";
import errors from "../../utils/errors/errors.js";

class MongoManager {
    constructor(model) {
        this.model = model;
    }
    async create(data) {
        try {
            const one = await this.model.create(data);
            return one;
        } catch (error) {
            throw error;
        }
    }
    async read({ filter, options }) {
        try {
            const all = await this.model.paginate(filter, options);
            if (all.totalDocs === 0) {
                CustomError.new(errors.notFound);
            }
            return all;
        } catch (error) {
            throw error;
        }
    }
    async report(uid) {
        try {
            const report = await this.model.aggregate([
                { $match: { user_id: new Types.ObjectId(uid) } },
                {
                    $lookup: {
                        foreignField: "_id",
                        from: "products",
                        localField: "product_id",
                        as: "product_id",
                    },
                },
                { $replaceRoot: { newRoot: { $mergeObjects: [{ $arrayElemAt: ["$product_id", 0] }, "$$ROOT"] } } },
                { $set: { subTotal: { $multiply: ["$quantity", "$price"] } } },
                { $group: { _id: "$user_id", total: { $sum: "$subTotal" } } },
                { $project: { _id: 0, user_id: "$_id", total: "$total", currency: "USD", date: new Date() } },
                //{ $merge: { into: "bills" } }
            ]);
            return report;
        } catch (error) {
            throw error;
        }
    }
    async readOne(id) {
        try {
            const one = await this.model.findById(id).lean();
            notFoundOne(one);
            return one;
        } catch (error) {
            throw error;
        }
    }
    async readByEmail(email) {
        try {
            const one = await this.model.findOne({ email });
            //notFoundOne(one);
            return one;
        } catch (error) {
            throw error;
        }
    }
    async update(id, data) {
        try {
            const opt = { new: true };
            const one = await this.model.findByIdAndUpdate(id, data, opt);
            notFoundOne(one);
            return one;
        } catch (error) {
            throw error;
        }
    }
    async destroy(id) {
        try {
            const one = await this.model.findByIdAndDelete(id);
            notFoundOne(one);
            return one;
        } catch (error) {
            throw error;
        }
    }
    async destroyAll(id) {
        try {
            const all = await this.model.deleteMany({ user_id: id }).lean();
            return all;
        } catch (error) {
            throw error;
        }
    }
    async stats({ filter }) {
        try {
            let stats = await this.model.find(filter).explain("executionStats");
            stats = {
                quantity: stats.executionStats.nReturned,
                time: stats.executionStats.executionTimeMillis,
            };
            return stats;
        } catch (error) {
            throw error;
        }
    }
}

const products = new MongoManager(Product);
const users = new MongoManager(User);

export { products, users };

export default MongoManager;
