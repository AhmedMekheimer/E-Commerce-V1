const { check, body } = require("express-validator");
const validatorMiddleware = require("../middlewares/validatorMiddleware");
const { mongoIdValidator } = require("./commonValidators");
const slugify = require('slugify')

const categoryRules = (isUpdate = false) => {
    const applyOptional = (rule) => (isUpdate ? rule.optional() : rule);

    return [
        applyOptional(check('name').notEmpty().withMessage('Category Required'))
            .isString().withMessage('Category must be a String')
            .isLength({ min: 3 }).withMessage('Category name is too short')
            .isLength({ max: 32 }).withMessage('Category name is too long'),

        check('image').optional()
            .isString().withMessage('Image URL must be a String'),
    ];
};

exports.getCategoryValidator = mongoIdValidator;
exports.deleteCategoryValidator = mongoIdValidator;

exports.createCategoryValidator = [
    ...categoryRules(false),
    validatorMiddleware
];

exports.updateCategoryValidator = [
    check('id').isMongoId().escape().withMessage('Invalid Id Format'),
    body('name').custom((val, { req }) => {
        req.body.slug = slugify(val)
        return true
    }),
    ...categoryRules(true),
    validatorMiddleware
];