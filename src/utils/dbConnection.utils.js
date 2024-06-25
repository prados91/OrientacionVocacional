import { connect } from "mongoose";
import env from "./env.utils.js";
import winstonLog from "../utils/logger/index.js";

const dbConnection = async () => {
    try {
        await connect(env.DB_LINK);
        winstonLog.INFO("Successful connection to the MONGO database.");
    } catch (error) {
        winstonLog.ERROR(error);
    }
};

export default dbConnection;
