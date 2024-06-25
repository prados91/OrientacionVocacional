import argsUtil from "../utils/args.utils.js";
import { createHash } from "../utils/hash.utils.js";
import crypto from "crypto";

class UserDTO {
    constructor(data) {
        argsUtil.env !== "prod" && (this._id = crypto.randomBytes(12).toString("hex"));
        this.name = data.name;
        this.lastName = data.lastName;
        this.email = data.email;
        this.password = createHash(data.password);
        this.role = data.role || "USER";
        this.photo = data.photo || "https://i.postimg.cc/wTgNFWhR/profile.png";
        this.age = data.age || 18;
        this.verified = data.verified || false;
        this.verifiedCode = crypto.randomBytes(12).toString("base64");
        argsUtil.env !== "prod" && (this.createdAt = new Date());
        argsUtil.env !== "prod" && (this.updatedAt = new Date());
    }
}

export default UserDTO;
