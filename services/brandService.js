const slugify = require('slugify')
const asyncHandler = require('express-async-handler')
const ApiError = require('../utils/ApiError')
const BrandModel = require('../models/brandModel')
const ApiFeatures = require('../utils/apiFeatures')
const { deleteOneFactory } = require('./handlersFactory')

// @desc    Get Brands
// @route   GET /api/v1/brands
// @access  Public
exports.getBrands = asyncHandler(async (req, res) => {
    // Building the mongoose query
    let apiFeatures = new ApiFeatures(BrandModel.find(), req.query)
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
    let brands = await mongooseQuery

    res.status(201).json({ paginationResult, TotalNumOfProducts: countDocuments, results: brands.length, data: brands });
})

// @desc    Get Brand
// @route   GET /api/v1/brands/:id
// @access  Public
exports.getBrand = asyncHandler(async (req, res, next) => {
    const { id } = req.params

    const brand = await BrandModel.findById(id)

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

    const newBrand = await BrandModel.create({
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

    const brand = await BrandModel.findByIdAndUpdate(
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
exports.deleteBrand = deleteOneFactory(BrandModel)