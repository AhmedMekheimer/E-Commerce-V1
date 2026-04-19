const { check } = require("express-validator");
const validatorMiddleware = require("../middlewares/validatorMiddleware");
const { mongoIdValidator } = require("./commonValidators");
const subCategoryModel = require("../models/subCategoryModel");
const categoryModel = require("../models/categoryModel");
const brandModel = require("../models/brandModel");
const productModel = require("../models/productModel");

// 1. Define the shared logic in a reusable function
const productRules = (isUpdate = false) => {
    // Helper to apply .optional() dynamically
    const applyOptional = (rule) => (isUpdate ? rule.optional() : rule);

    return [
        // TITLE
        applyOptional(check('title').notEmpty().withMessage('Product Title Required'))
            .isLength({ min: 3 }).withMessage('Product Title is too short')
            .isLength({ max: 100 }).withMessage('Product Title is too long'),

        // DESCRIPTION
        applyOptional(check('description').notEmpty().withMessage('Product Description Required'))
            .isLength({ min: 20 }).withMessage('Product Description is too short')
            .isLength({ max: 2000 }).withMessage('Product Description is too long'),

        // CATEGORY
        applyOptional(check('category').notEmpty().withMessage('Category Required'))
            .isMongoId().escape().withMessage('Invalid Id Format for Category')
            .custom(async (category) => {
                if (!(await categoryModel.findById(category))) {
                    return Promise.reject(new Error(`No category found for the id: ${category}`))
                }
                return true;
            }),

        // SUBCATEGORIES (Array + Items)
        check('subCategories')
            .optional()
            .isArray().withMessage('subCategories must be an array')
            .customSanitizer((subCategoriesIds) => {
                // Remove duplicates and return the clean array
                return [...new Set(subCategoriesIds)];
            })
            .custom(async (subCategoriesIds, { req }) => {
                // Normal Route or Nested Route
                let categoryId = req.body.category || req.params.categoryId;

                if (!categoryId) {
                    if (!isUpdate) {
                        return Promise.reject(new Error("Category is required to validate subCategories when creating a product"));
                    }
                    else {
                        const product = await productModel.findById(req.params.id).select('category').lean()
                        if (product) {
                            categoryId = product.category
                        }
                        else {
                            return Promise.reject(new Error("Product Id doesn't exist"));
                        }
                    }
                }

                // We find all subcategories that are actually exist AND belong to the category
                const validSubCategories = await subCategoryModel.find({
                    category: categoryId,
                    _id: { $in: subCategoriesIds }
                })
                    .lean();

                // If the number of documents found in the DB is less than the number of IDs sent,
                // it means at least one subCategoryId either doesn't exist or doesn't belong to this category.
                if (validSubCategories.length !== subCategoriesIds.length) {
                    return Promise.reject(new Error(`One or more sub-categories do not belong to the selected category`));
                }

                return true;
            }),

        // BRAND
        check('brand')
            .optional()
            .isMongoId().escape().withMessage('Invalid Id Format for Brand')
            .custom(async (brand) => {
                if (!(await brandModel.findById(brand))) {
                    return Promise.reject(new Error(`No brand found for the id: ${brand}`))
                }
                return true;
            }),

        // COLORS (Array + Items)
        check('colors')
            .optional()
            .isArray().withMessage('Colors should be an array')
            .customSanitizer((colors) => {
                // Remove duplicates and return the clean array
                return [...new Set(colors)];
            }),
        check('colors.*')
            .optional()
            .isString().withMessage('Each color must be a string'),

        // PRICE
        applyOptional(check('price').notEmpty().withMessage('Product Price Required'))
            .isNumeric().withMessage('Product Price must be a number'),

        // PRICE AFTER DISCOUNT (With shared logic)
        check('priceAfterDiscount')
            .optional()
            .isNumeric().withMessage('Discount price must be a number')
            .custom((value, { req }) => {
                if (req.body.price && value >= req.body.price) {
                    return Promise.reject(new Error(`Discount price must be lower than original price`))
                }
                return true;
            }),

        // QUANTITY
        applyOptional(check('quantity').notEmpty().withMessage('Product Quantity Required'))
            .isNumeric().withMessage('Product Quantity must be a number'),

        // COVER IMAGE
        applyOptional(check('coverImage').notEmpty().withMessage('Product cover image is Required')),

        // IMAGES (Array + Items)
        check('images')
            .optional()
            .isArray().withMessage('Images should be an array'),
        check('images.*')
            .optional()
            .isString().withMessage('Each image path must be a string'),

        // RATINGS
        check('averageRating')
            .optional()
            .isFloat({ min: 1, max: 5 }).withMessage('Rating must be between 1.0 and 5.0'),
    ];
};

// 2. Export the Validators
exports.getProductValidator = mongoIdValidator;
exports.deleteProductValidator = mongoIdValidator;

// For CREATE: Call rules with false (default), adding the middleware at the end
exports.createProductValidator = [
    ...productRules(false),
    validatorMiddleware
];

// For UPDATE: Call rules with true, add the 'id' param check, and the middleware
exports.updateProductValidator = [
    check('id').isMongoId().escape().withMessage('Invalid Id Format'),
    ...productRules(true),
    validatorMiddleware
];