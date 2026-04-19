const { check } = require("express-validator");
const validatorMiddleware = require("../middlewares/validatorMiddleware");
const { mongoIdValidator } = require("./commonValidators");

const brandRules = (isUpdate = false) => {
    const applyOptional = (rule) => (isUpdate ? rule.optional() : rule);

    return [
        applyOptional(check('name').notEmpty().withMessage('Brand Required'))
            .isString().withMessage('Brand must be a String')
            .isLength({ min: 3 }).withMessage('Brand name is too short')
            .isLength({ max: 32 }).withMessage('Brand name is too long'),
        
        check('image').optional()
            .isString().withMessage('Image URL must be a String'),
    ];
};

exports.getBrandValidator = mongoIdValidator;
exports.deleteBrandValidator = mongoIdValidator;

exports.createBrandValidator = [
    ...brandRules(false),
    validatorMiddleware
];

exports.updateBrandValidator = [
    check('id').isMongoId().escape().withMessage('Invalid Id Format'),
    ...brandRules(true),
    validatorMiddleware
];