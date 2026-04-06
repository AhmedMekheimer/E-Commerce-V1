const { check } = require("express-validator");
const validatorMiddleware = require("../middlewares/validatorMiddleware");

exports.mongoIdValidator = [
    check('id').isMongoId().escape().withMessage('Invalid Id Format'),
    validatorMiddleware
]