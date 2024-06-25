import jwt from "jsonwebtoken";
import env from "./env.utils.js";

//const createToken = (data) => jwt.sign(data, env.SECRET, { expiresIn: 60 * 60 * 24 });
const createToken = (data, expiresIn) => jwt.sign(data, env.SECRET, expiresIn);

const verifyToken = (headers) => {
    const token = headers.token;
    if (!token) {
        const error = new Error("bad auth");
        error.statusCode = 401;
        throw error;
    }
    return jwt.verify(token, env.SECRET);
};

export { createToken, verifyToken };
