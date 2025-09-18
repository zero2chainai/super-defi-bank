import { errorResponse } from "../utils/response.js";

const errorHandler = (err, req, res, next) => {
    console.log("Error: ", err.message);

    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    return errorResponse(res, statusCode, message, err);
}

export default errorHandler;