const express = require('express');
const router = express.Router();
const ProductsController = require('../controllers/products');

router.route('/')
    .get(ProductsController.index)

router.route('/:productId')
    .get(ProductsController.product)

module.exports = router;