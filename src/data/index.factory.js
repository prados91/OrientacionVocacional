import argsUtil from "../utils/args.utils.js";
import dbConnection from "../utils/dbConnection.utils.js";
import winstonLog from "../utils/logger/index.js";

const environment = argsUtil.env;

let dao = {};

switch (environment) {
    case "dev": //aqui iría dev para que se use FileSystem en modo desarrollo
        winstonLog.INFO("FS CONNECTED");
        const { default: productsFs } = await import("./fs/products.fs.js");
        const { default: usersFs } = await import("./fs/users.fs.js");
        dao = { products: productsFs, users: usersFs };
        break;

    default: // para modo producción se usaría MONGO
        dbConnection();
        const { default: productsMongo } = await import("./mongo/products.mongo.js");
        const { default: usersMongo } = await import("./mongo/users.mongo.js");
        dao = { products: productsMongo, users: usersMongo };
        break;
}

export default dao;
