const slugify = require('slugify')
const asyncHandler = require('express-async-handler')
const ApiError = require('../utils/ApiError')
const brandModel = require('../models/brandModel')

// @desc    Get Brands
// @route   GET /api/v1/brands
// @access  Public
exports.getBrands = asyncHandler(async (req, res) => {
    // Using Params tab in Post Man (NEW)
    const page = Number(req.query.page)
    const limit = Number(req.query.limit)

    const skip = (page - 1) * limit

    const brands = await brandModel.find()
        .skip(skip)
        .limit(limit)

    res.status(201).json({ data: brands })
})

// @desc    Get Brand
// @route   GET /api/v1/brands/:id
// @access  Public
exports.getBrand = asyncHandler(async (req, res, next) => {
    const { id } = req.params

    const brand = await brandModel.findById(id)

    if (!brand) {
        return next(new ApiError('brand not Found', 404))
    }
    res.status(201).json({ data: brand })
})

// @desc    Create brand
// @route   POST /api/v1/brands
// @access  Private
exports.createBrand = asyncHandler(async (req, res) => {
    const name = req.body.name

    const newBrand = await brandModel.create({
        name,
        slug: slugify(name)
    })

    res.status(201).json({ data: newBrand })
})

// @desc    Update Brand
// @route   PUT /api/v1/brands/:id
// @access  Private
exports.updateBrand = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    const { name } = req.body

    let slug = undefined
    if (name) {
        slug = slugify(name)
    }

    const brand = await brandModel.findByIdAndUpdate(
        id,
        { name, slug },
        { new: true, runValidators: true }
    )

    if (!brand) {
        return next(new ApiError('brand not Found', 404))
    }

    res.status(201).json({ data: brand })
})

// @desc    Delete brand
// @route   DELETE /api/v1/brands/:id
// @access  Private
exports.deleteBrand = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    const deletedBrand = await brandModel.findByIdAndDelete(id)

    if (!deletedBrand) {
        return next(new ApiError('Brand not Found', 404))
    }

    res.status(201).json({ Msg: "Brand deleted Successfully" })
})