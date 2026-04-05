const CategoryModel = require('../models/categoryModel')
const slugify = require('slugify')
const asyncHandler = require('express-async-handler')
const ApiError = require('../utils/ApiError')

// @desc    Get Categories
// @route   GET /api/v1/categories
// @access  Public
exports.getCategories = asyncHandler(async (req, res) => {
    // Using Params tab in Post Man (NEW)
    const page = Number(req.query.page)
    const limit = Number(req.query.limit)

    const skip = (page - 1) * limit

    const categories = await CategoryModel.find()
        .skip(skip)
        .limit(limit)

    res.status(201).json({ data: categories })
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
exports.updateCategory = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    const { name } = req.body

    const category = await CategoryModel.findByIdAndUpdate(
        id,
        { name, slug: slugify(name) },
        { new: true, runValidators: true }
    )

    if (!category) {
        return next(new ApiError('Category not Found', 404))
    }

    res.status(201).json({ data: category })
})

// @desc    Delete Category
// @route   DELETE /api/v1/categories/:id
// @access  Private
exports.deleteCategory = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    const deletedCategory = await CategoryModel.findByIdAndDelete(id)

    if (!deletedCategory) {
        return next(new ApiError('Category not Found', 404))
    }

    res.status(201).json({ Msg: "Category deleted Successfully" })
})