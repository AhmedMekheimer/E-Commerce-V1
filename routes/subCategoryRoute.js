const express = require('express')
const { getSubCategories, createSubCategory, getSubCategory, updateSubCategory, deleteSubCategory } = require('../services/subCategoryService')
const { createSubCategoryValidator, getSubCategoryValidator, updateSubCategoryValidator, deleteSubCategoryValidator } = require('../validators/subCategoryValidator')

const router = express.Router()

router.route('/')
    .get(getSubCategories)
    .post(
        createSubCategoryValidator,
        createSubCategory
    )

router.route('/:id')
    .get(
        getSubCategoryValidator,
        getSubCategory
    )
    .put(
        updateSubCategoryValidator,
        updateSubCategory
    )
    .delete(
        deleteSubCategoryValidator,
        deleteSubCategory
    )


module.exports = router