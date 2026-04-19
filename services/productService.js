const ProductModel = require('../models/productModel');
const slugify = require('slugify');
const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/ApiError');

// @desc    Get List of Products
// @route   GET /api/v1/products
// @access  Public
exports.getProducts = asyncHandler(async (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    const products = await ProductModel.find({})
        .skip(skip)
        .limit(limit)
        .populate({ path: 'category', select: 'name -_id' })
        .populate({ path: 'brand', select: 'name -_id' });

    res.status(201).json({ results: products.length, page, data: products });
});

// @desc    Get Specific Product
// @route   GET /api/v1/products/:id
// @access  Public
exports.getProduct = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const product = await ProductModel.findById(id)
        .populate({ path: 'category', select: 'name -_id' })
        .populate({ path: 'brand', select: 'name -_id' });

    if (!product) {
        return next(new ApiError('Product not Found', 404));
    }
    res.status(201).json({ data: product });
});

// @desc    Create Product
// @route   POST /api/v1/products
// @access  Private
exports.createProduct = asyncHandler(async (req, res, next) => {
    if (req.body.title) {
        req.body.slug = slugify(req.body.title);
    }

    const newProduct = await ProductModel.create(req.body);

    await newProduct.populate(
        [{
            path: 'category',
            select: 'name -_id'
        },
        {
            path: 'brand',
            select: 'name -_id'
        }])
    res.status(201).json({ data: newProduct });
});

// @desc    Update Product
// @route   PUT /api/v1/products/:id
// @access  Private
exports.updateProduct = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    if (req.body.title) {
        req.body.slug = slugify(req.body.title);
    }

    const product = await ProductModel.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
    });

    // Will not happen
    if (!product) {
        return next(new ApiError('Product not Found', 404));
    }
    res.status(201).json({ data: product });
});

// @desc    Delete Product
// @route   DELETE /api/v1/products/:id
// @access  Private
exports.deleteProduct = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const deletedProduct = await ProductModel.findByIdAndDelete(id);

    if (!deletedProduct) {
        return next(new ApiError('Product not Found', 404));
    }
    res.status(201).json({ msg: "Product deleted Successfully" });
});