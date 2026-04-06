const { check } = require("express-validator");
const validatorMiddleware = require("../middlewares/validatorMiddleware");
const { mongoIdValidator } = require("./commonValidators");
// .escape() use a sanitizer, 
// which transforms special HTML characters with others that can be represented as text.
// To prevent XSS attacks (code injection)

exports.getCategoryValidator = mongoIdValidator
exports.deleteCategoryValidator = mongoIdValidator

exports.createCategoryValidator = [
    check('name').notEmpty().withMessage('Category Required')
        .bail()
        .isString().withMessage('Category must be a String')
        .bail()
        .isLength({ min: 3 }).withMessage('Category name is too short')
        .isLength({ max: 32 }).withMessage('Category name is too long'),
    check('image').optional().isString().withMessage('Image URL must be a String'),
    validatorMiddleware
]

exports.updateCategoryValidator = [
    check('id').isMongoId().escape().withMessage('Invalid Id Format'),
    check('name').optional()
        .isString().withMessage('Category must be a String')
        .bail()
        .isLength({ min: 3 }).withMessage('Category name is too short')
        .isLength({ max: 32 }).withMessage('Category name is too long'),
    check('image').optional()
        .isString().withMessage('Image URL must be a String'),
    validatorMiddleware
]
