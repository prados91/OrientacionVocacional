import env from "../env.utils.js";

const persistence = env.MODE || "PROD";

let winstonLog;

switch (persistence) {
    case "PROD":
        const { default: winstonProd } = await import("./winstonProd.utils.js");
        winstonLog = winstonProd;
        break;
    default:
        const { default: winstonDev } = await import("./winstonDev.utils.js");
        winstonLog = winstonDev;
        break;
}

export default winstonLog;
