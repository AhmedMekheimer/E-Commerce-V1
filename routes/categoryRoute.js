const express = require('express')
const { createCategory, getCategories, getCategory, updateCategory, deleteCategory } = require('../services/categoryService')
const { getCategoryValidator, updateCategoryValidator, deleteCategoryValidator, createCategoryValidator } = require('../validators/categoryValidator')

const router = express.Router()

router.route('/')
    .get(getCategories)
    .post(
        createCategoryValidator,
        createCategory
    )

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