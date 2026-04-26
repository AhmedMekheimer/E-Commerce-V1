const { check, body } = require("express-validator");
const validatorMiddleware = require("../middlewares/validatorMiddleware");
const { mongoIdValidator } = require("./commonValidators");
const categoryModel = require("../models/categoryModel");
const slugify = require('slugify')

const subCategoryRules = (isUpdate = false) => {
    const applyOptional = (rule) => (isUpdate ? rule.optional() : rule);

    return [
        // NAME
        // Note: Preserved your specific update message 'Category Can not be Empty'
        applyOptional(check('name').notEmpty().withMessage(isUpdate ? 'Category Can not be Empty' : 'Category Required'))
            .isString().withMessage('Category must be a String')
            .isLength({ min: 3 }).withMessage('Category name is too short')
            .isLength({ max: 32 }).withMessage('Category name is too long'),

        // CATEGORY ID
        applyOptional(check('category').notEmpty().withMessage('Category Required'))
            .isMongoId().escape().withMessage('Invalid Id Format for Category')
            .custom(async (category) => {
                const categoryDoc = await categoryModel.findById(category);
                if (!categoryDoc) {
                    return Promise.reject(new Error(`No category found for the id: ${category}`));
                }
                return true;
            }),
    ];
};

exports.getSubCategoryValidator = mongoIdValidator;
exports.deleteSubCategoryValidator = mongoIdValidator;

exports.createSubCategoryValidator = [
    ...subCategoryRules(false),
    validatorMiddleware
];

exports.updateSubCategoryValidator = [
    check('id').isMongoId().escape().withMessage('Invalid Id Format'),
    body('name').custom((val, { req }) => {
        req.body.slug = slugify(val)
        return true
    }),
    ...subCategoryRules(true),
    validatorMiddleware
];