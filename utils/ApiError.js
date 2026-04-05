// @desc Create predicted/anticipated error
class ApiError extends Error {
    constructor(message, statusCode) {
        super(message)
        this.statusCode = statusCode
        this.status = `${statusCode}`.startsWith(4) ? 'fail' : 'error' //{400s are fail, 500s are error}
        this.operational = true
    }
}

module.exports = ApiError