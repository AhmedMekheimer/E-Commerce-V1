const SubCategoryModel = require('../models/subCategoryModel')
const CategoryModel = require('../models/categoryModel')
const slugify = require('slugify')
const asyncHandler = require('express-async-handler')
const ApiError = require('../utils/ApiError')
const ApiFeatures = require('../utils/apiFeatures')
const { deleteOneFactory, updateOneFactory } = require('./handlersFactory')

exports.createFilter = (req, res, next) => {
    let filter = {}
    if (req.params.categoryId) {
        filter = { category: req.params.categoryId }
    }
    req.filter = filter
    next()
}

// @desc    Nested Route Get Sub Categories of a Specific Category
// @route   GET /api/v1/category/:categoryId/sub-categories
// @access  Public

// @desc    Get Sub Categories
// @route   GET /api/v1/sub-categories
// @access  Public
exports.getSubCategories = asyncHandler(async (req, res) => {
    // Building the mongoose query
    let apiFeatures = new ApiFeatures(SubCategoryModel.find(), req.query)
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
    let subCategories = await mongooseQuery
        .populate({ path: 'category', select: 'name -_id' })

    res.status(201).json({ paginationResult, TotalNumOfProducts: countDocuments, results: subCategories.length, data: subCategories });
})

// @desc    Get Sub Category
// @route   GET /api/v1/sub-categories/:id
// @access  Public
exports.getSubCategory = asyncHandler(async (req, res, next) => {
    const { id } = req.params

    const subCategory = await SubCategoryModel.findById(id).populate({
        path: 'category',
        select: 'name -_id'
    })

    if (!subCategory) {
        return next(new ApiError('Sub Category not Found', 404))
    }
    res.status(201).json({ data: subCategory })
})

// @desc    Nested Route Create Sub Category for a Specific Category
// @route   POST /api/v1/category/:categoryId/sub-categories
// @access  Private

// @desc    Create Sub Category
// @route   POST /api/v1/sub-categories
// @access  Private
exports.createSubCategory = asyncHandler(async (req, res, next) => {
    // Nested Route 
    if (!req.body.category) {
        req.body.category = req.params.categoryId
    }
    const { name, category } = req.body


    const newSubCategory = await SubCategoryModel.create({
        name,
        slug: slugify(name),
        category
    })

    await newSubCategory.populate({
        path: 'category',
        select: 'name -_id'
    })
    res.status(201).json({ data: newSubCategory })
})

// @desc    Update Sub Category
// @route   PUT /api/v1/sub-categories/:id
// @access  Private
exports.updateSubCategory = updateOneFactory(SubCategoryModel)

// @desc    Delete Sub Category
// @route   DELETE /api/v1/sub-categories/:id
// @access  Private
exports.deleteSubCategory = deleteOneFactory(SubCategoryModel)