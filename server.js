import env from "./src/utils/env.utils.js";
import express from "express";
import morgan from "morgan";
import { engine } from "express-handlebars";
import cookieParser from "cookie-parser";
import cors from "cors";
import compression from "express-compression";

import router from "./src/routers/index.router.js";
import errorHandler from "./src/middlewares/errorHandler.js";
import pathHandler from "./src/middlewares/pathHandler.js";
import __dirname from "./utils.js";

import winstonLog from "./src/utils/logger/index.js";
import winston from "./src/middlewares/winston.js";

import swaggerOptions from "./src/config/swagger.js";
import swaggerJSDoc from "swagger-jsdoc";
import { serve, setup } from "swagger-ui-express";

// Server
const server = express();
const PORT = env.PORT || 8080;
const ready = () => {
    winstonLog.INFO(`Server ready on port ${PORT}`);
};
const specs = swaggerJSDoc(swaggerOptions);
server.listen(PORT, ready);
// Views
server.engine("handlebars", engine());
server.set("view engine", "handlebars");
server.set("views", `${__dirname}/src/views`);

// MIDDLEWARES
server.use("/api/docs", serve, setup(specs));
server.use(cookieParser(env.SECRET_KEY));
server.use(cors({ origin: true, credentials: true }));
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(morgan("dev"));
server.use(winston);
server.use(express.static("public"));
server.use(compression({ brotli: { enabled: true, zlib: {} } }));

// Endpoints
server.use("/", router);
server.use(errorHandler);
server.use(pathHandler);
