import winstonLog from "../utils/logger/index.js";

const pathHandler = (req, res, next) => {
    const response = `${req.method} ${req.url} not found endpoint`;
    winstonLog.WARN(response);
    return res.json({
        statusCode: 404,
        path: `${req.method} ${req.url}`,
        message: `not found endpoint`,
    });
};

export default pathHandler;
