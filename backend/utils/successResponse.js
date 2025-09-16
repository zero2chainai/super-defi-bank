export const successResponse = (res, statusCose, message, data = {}) => {
    return res.status(statusCose).json({
        success: true,
        message,
        data
    });
}