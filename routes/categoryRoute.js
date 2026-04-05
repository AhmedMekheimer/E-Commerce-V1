const express = require('express')
const { createCategory, getCategories, getCategory, updateCategory, deleteCategory } = require('../services/categoryService')

const { categorySchema } = require('../validators/categoryValidator')
const validate = require('../middlewares/validator')

const router = express.Router()

router.route('/').get(getCategories).post(validate(categorySchema), createCategory)
router.route('/:id').get(getCategory).put(updateCategory).delete(deleteCategory)
module.exports = router