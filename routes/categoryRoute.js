const express = require('express')
const { createCategory, getCategories, getCategory, updateCategory, deleteCategory } = require('../services/categoryService')
const { getCategoryValidator, updateCategoryValidator, deleteCategoryValidator, createCategoryValidator } = require('../validators/categoryValidator')
const subCategoryRoute = require('./subCategoryRoute')

const router = express.Router()

router.route('/')
    .get(getCategories)
    .post(
        createCategoryValidator,
        createCategory
    )

router.use('/:categoryId/sub-categories', subCategoryRoute)

router.route('/:id')
    .get(
        getCategoryValidator,
        getCategory
    )
    .put(
        updateCategoryValidator,
        updateCategory
    )
    .delete(
        deleteCategoryValidator,
        deleteCategory
    )


module.exports = router