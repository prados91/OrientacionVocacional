import CustomError from "./errors/CustomError.js";
import errors from "./errors/errors.js";

function notFoundOne(one) {
    if (!one) {
        CustomError.new(errors.notFound)
    }
}

export default notFoundOne;
