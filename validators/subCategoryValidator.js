const { check } = require("express-validator");
const validatorMiddleware = require("../middlewares/validatorMiddleware");
const { mongoIdValidator } = require("./commonValidators");

exports.getSubCategoryValidator = mongoIdValidator
exports.deleteSubCategoryValidator = mongoIdValidator

exports.createSubCategoryValidator = [
    check('name').notEmpty().withMessage('Category Required')
        .bail()
        .isString().withMessage('Category must be a String')
        .bail()
        .isLength({ min: 3 }).withMessage('Category name is too short')
        .isLength({ max: 32 }).withMessage('Category name is too long'),
    check('category').notEmpty().withMessage('Category Required')
        .bail()
        .isMongoId().escape().withMessage('Invalid Id Format for Category'),
    validatorMiddleware
]

exports.updateSubCategoryValidator = [
    check('id').isMongoId().escape().withMessage('Invalid Id Format'),
    check('name').optional()
        .isString().withMessage('Category must be a String')
        .bail()
        .isLength({ min: 3 }).withMessage('Category name is too short')
        .isLength({ max: 32 }).withMessage('Category name is too long'),
    check('category').optional().isMongoId().escape().withMessage('Invalid Id Format for Category'),
    validatorMiddleware
]
