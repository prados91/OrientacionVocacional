import winstonLog from "../utils/logger/index.js";
const errorHandler = (error, req, res, next) => {
    if (!error.statusCode || error.statusCode === 500) {
        error.statusCode = 500;
        winstonLog.ERROR(error.message);
    } else {
        winstonLog.WARN(error.message);
    }
    return res.json({
        statusCode: error.statusCode,
        path: `${req.method} ${req.url}`,
        message: error.message,
    });
};

export default errorHandler;
