// routes/productRoutes.js
const express = require('express');
const { addProduct, getProducts,updateProduct, deleteProduct, searchProducts, reduceProductQuantity } = require('../controllers/productController');
const router = express.Router();

router.post('/products', addProduct);
router.get('/products', getProducts);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);
router.get('/products/search', searchProducts);
router.put('/products/reduce/:productName', reduceProductQuantity);


module.exports = router;
