import argsUtil from "../utils/args.utils.js";
import crypto from "crypto";

class ProductDTO {
    constructor(data) {
        argsUtil.env !== "prod" && (this._id = crypto.randomBytes(12).toString("hex"));
        this.title = data.title;
        this.category = data.category;
        this.photo = data.photo;
        this.price = data.price;
        this.stock = data.stock;
        this.owner_id = data.user_id;
        this.date = data.date || new Date();
        argsUtil.env !== "prod" && (this.updatedAt = new Date());
        argsUtil.env !== "prod" && (this.createdAt = new Date());
    }
}

export default ProductDTO;
