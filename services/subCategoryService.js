const subCategoryModel = require('../models/subCategoryModel')
const slugify = require('slugify')
const asyncHandler = require('express-async-handler')
const ApiError = require('../utils/ApiError')

// @desc    Get Sub Categories
// @route   GET /api/v1/sub-categories
// @access  Public
exports.getSubCategories = asyncHandler(async (req, res) => {
    const page = Number(req.query.page)
    const limit = Number(req.query.limit)

    const skip = (page - 1) * limit

    const subCategories = await subCategoryModel.find()
        .skip(skip)
        .limit(limit)

    res.status(201).json({ data: subCategories })
})

// @desc    Get Sub Category
// @route   GET /api/v1/sub-categories/:id
// @access  Public
exports.getSubCategory = asyncHandler(async (req, res, next) => {
    const { id } = req.params

    const subCategory = await subCategoryModel.findById(id)

    if (!subCategory) {
        return next(new ApiError('Sub Category not Found', 404))
    }
    res.status(201).json({ data: subCategory })
})

// @desc    Create Sub Category
// @route   POST /api/v1/sub-categories
// @access  Private
exports.createSubCategory = asyncHandler(async (req, res) => {
    const { name, category } = req.body


    const newSubCategory = await subCategoryModel.create({
        name,
        slug: slugify(name),
        category
    })

    await newSubCategory.populate('category')
    res.status(201).json({ data: newSubCategory })
})

// @desc    Update Sub Category
// @route   PUT /api/v1/sub-categories/:id
// @access  Private
exports.updateSubCategory = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    const { name } = req.body

    const subCategory = await subCategoryModel.findByIdAndUpdate(
        id,
        { name, slug: slugify(name) },
        { new: true, runValidators: true }
    )

    if (!subCategory) {
        return next(new ApiError('Sub Category not Found', 404))
    }

    res.status(201).json({ data: subCategory })
})

// @desc    Delete Sub Category
// @route   DELETE /api/v1/sub-categories/:id
// @access  Private
exports.deleteSubCategory = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    const deletedSubCategory = await subCategoryModel.findByIdAndDelete(id)

    if (!deletedSubCategory) {
        return next(new ApiError('Sub Category not Found', 404))
    }

    res.status(201).json({ Msg: "Sub Category deleted Successfully" })
})