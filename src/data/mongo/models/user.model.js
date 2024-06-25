import { model, Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const collection = "users";
const schema = new Schema(
    {
        name: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true, index: true, unique: true },
        password: { type: String, required: true },
        role: { type: String, default: "USER", enum: ["USER", "ADMIN", "PREM"] },
        verified: { type: Boolean, default: false },
        verifiedCode: { type: String, required: true },
        photo: {
            type: String,
            default: "https://i.postimg.cc/wTgNFWhR/profile.png",
        },
    },
    { timestamps: true }
);

schema.plugin(mongoosePaginate);

const User = model(collection, schema);
export default User;
