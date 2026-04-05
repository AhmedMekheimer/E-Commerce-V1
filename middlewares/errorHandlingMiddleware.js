const errorHandlingMiddleware = (err, req, res, next) => {
    // status could be 400s or 500s
    // handle if it was from ApiError called or not (you might miss calling it)
    err.statusCode = err.statusCode || 500
    err.status = err.status || 'unexpected error'

    if (process.env.NODE_ENV === 'development') {
        sendErrorInDev(err, res)
    } else {
        sendErrorInProd(err, res)
    }
}

const sendErrorInDev = (err, res) => {
    return res.status(err.statusCode).json({
        error: err,
        status: err.status,
        message: err.message,
        stack: err.stack
    });
}

const sendErrorInProd = (err, res) => {
    return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
    });
}

module.exports = errorHandlingMiddleware