const { check } = require("express-validator");
const validatorMiddleware = require("../middlewares/validatorMiddleware");
const { mongoIdValidator } = require("./commonValidators");
// .escape() use a sanitizer, 
// which transforms special HTML characters with others that can be represented as text.
// To prevent XSS attacks (code injection)

exports.getBrandValidator = mongoIdValidator
exports.deleteBrandValidator = mongoIdValidator

exports.createBrandValidator = [
    check('name').notEmpty().withMessage('Brand Required')
        .bail()
        .isString().withMessage('Brand must be a String')
        .bail()
        .isLength({ min: 3 }).withMessage('Brand name is too short')
        .isLength({ max: 32 }).withMessage('Brand name is too long'),
    check('image').optional().isString().withMessage('Image URL must be a String'),
    validatorMiddleware
]

exports.updateBrandValidator = [
    check('id').isMongoId().escape().withMessage('Invalid Id Format'),
    check('name').optional()
        .isString().withMessage('Brand must be a String')
        .bail()
        .isLength({ min: 3 }).withMessage('Brand name is too short')
        .isLength({ max: 32 }).withMessage('Brand name is too long'),
    check('image').optional()
        .isString().withMessage('Image URL must be a String'),
    validatorMiddleware
]
