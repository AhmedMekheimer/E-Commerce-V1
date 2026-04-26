const CategoryModel = require('../models/categoryModel')
const slugify = require('slugify')
const asyncHandler = require('express-async-handler')
const ApiError = require('../utils/ApiError')
const ApiFeatures = require('../utils/apiFeatures')
const { deleteOneFactory, updateOneFactory } = require('./handlersFactory')

// @desc    Get Categories
// @route   GET /api/v1/categories
// @access  Public
exports.getCategories = asyncHandler(async (req, res) => {
    // Building the mongoose query
    let apiFeatures = new ApiFeatures(CategoryModel.find(), req.query)
    apiFeatures
        .search()
        .filter()

    // Counting after filters by executing a 'Cloned' query
    const countDocuments = await apiFeatures.mongooseQuery.clone().countDocuments()

    // Continue
    apiFeatures
        .sort()
        .fieldLimit()
        .paginate(countDocuments)

    const { mongooseQuery, paginationResult } = apiFeatures

    // Execute Original Query
    let categories = await mongooseQuery

    res.status(201).json({ paginationResult, TotalNumOfProducts: countDocuments, results: categories.length, data: categories });
})

// @desc    Get Category
// @route   GET /api/v1/categories/:id
// @access  Public
exports.getCategory = asyncHandler(async (req, res, next) => {
    const { id } = req.params

    const category = await CategoryModel.findById(id)

    if (!category) {
        return next(new ApiError('Category not Found', 404))
    }
    res.status(201).json({ data: category })
})

// @desc    Create Category
// @route   POST /api/v1/categories
// @access  Private
exports.createCategory = asyncHandler(async (req, res) => {
    const name = req.body.name

    const newCategory = await CategoryModel.create({
        name,
        slug: slugify(name)
    })

    res.status(201).json({ data: newCategory })
})

// @desc    Update Category
// @route   PUT /api/v1/categories/:id
// @access  Private
exports.updateCategory = updateOneFactory(CategoryModel)

// @desc    Delete Category
// @route   DELETE /api/v1/categories/:id
// @access  Private
exports.deleteCategory = deleteOneFactory(CategoryModel)