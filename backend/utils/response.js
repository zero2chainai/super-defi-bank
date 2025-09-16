export const successResponse = (res, message, data = {}) => {
    return res.status(200).json({
        success: true,
        message,
        data
    });
}

export const errorResponse = (res, statusCode = 500, message, error = null) => {
    return res.status(statusCode).json({
        success: false,
        message,
        error
    });
}