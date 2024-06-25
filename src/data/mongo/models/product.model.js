import { model, Schema, Types } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const collection = "products";
const schema = new Schema(
    {
        title: { type: String, required: true },
        category: { type: String, required: true },
        photo: { type: String, default: "https://i.postimg.cc/rmgbCmG5/default-Product-Image.jpg" },
        price: { type: Number, default: 10 },
        stock: { type: Number, default: 1000 },
        owner_id: { type: Types.ObjectId, ref: "users" },
    },
    { timestamps: true }
);

schema.plugin(mongoosePaginate);

const Product = model(collection, schema);
export default Product;
