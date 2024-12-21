exports.handleSuccess = (res, statusCode, data) => {
    res.status(statusCode).json({
        status: 'success',
        data
    });
};

exports.handleError = (res, statusCode, message) => {
    res.status(statusCode).json({
        status: 'error',
        message
    });
};