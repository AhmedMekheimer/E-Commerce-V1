const express = require('express');
const {
    getProducts,
    createProduct,
    getProduct,
    updateProduct,
    deleteProduct,
} = require('../services/productService');

const {
    createProductValidator,
    getProductValidator,
    updateProductValidator,
    deleteProductValidator,
} = require('../validators/productValidator');

const router = express.Router();

router.route('/')
    .get(getProducts)
    .post(
        createProductValidator,
        createProduct
    );

router.route('/:id')
    .get(
        getProductValidator,
        getProduct
    )
    .put(
        updateProductValidator,
        updateProduct
    )
    .delete(
        deleteProductValidator,
        deleteProduct
    );

module.exports = router;