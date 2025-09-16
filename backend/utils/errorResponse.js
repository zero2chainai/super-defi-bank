export const errorResponse = (res, statusCode = 500, message, error = null) => {
    return res.status(statusCode).json({
        success: false,
        message,
        error
    });
}