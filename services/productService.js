const ProductModel = require('../models/productModel');
const slugify = require('slugify');
const asyncHandler = require('express-async-handler');
const ApiError = require('../utils/ApiError');
const { json } = require('node:stream/consumers');

// @desc    Get List of Products
// @route   GET /api/v1/products
// @access  Public
exports.getProducts = asyncHandler(async (req, res) => {
    // 1. Filtration
    // 1st: Only have the fields to filter on 
    let filtersObj = { ...req.query }
    const excludedFields = ['page', 'sort', 'limit', 'fields']
    excludedFields.forEach((field) => {
        delete filtersObj[field]
    })

    // Adding '$' operator in the query string
    // Note: Needed to add the extended query parser in the server
    let filtersStr = JSON.stringify(filtersObj)
    filtersStr = filtersStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    filtersObj = JSON.parse(filtersStr)
    console.log(filtersObj);

    // 2. Pagination
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    // Building the mongoose query
    const mongooseQuery = ProductModel.find(filtersObj)
        .skip(skip)
        .limit(limit)
        .populate({ path: 'category', select: 'name -_id' })
        .populate({ path: 'brand', select: 'name -_id' });

    // 3. Sorting
    if (req.query.sort) {
        // ?sort=price,-soldCounter -> price,-soldCounter -> price -soldCounter
        let sortBy = req.query.sort.split(',').join(' ')
        mongooseQuery.sort(sortBy)
    }
    else {
        mongooseQuery.sort('-createdAt')
    }

    // Execute Query
    const products = await mongooseQuery

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