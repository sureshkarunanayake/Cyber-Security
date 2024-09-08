const Product = require('../models/Product');
const { encrypt, decrypt } = require('../utils/encryptionUtil'); 


exports.addProduct = async (req, res) => {
    const { productName, quantity, price } = req.body;

    if (!productName || !quantity || !price) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const product = new Product({
            productName,
            quantity,
            price
        });

        const savedProduct = await product.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        console.error('Error adding product:', error.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

// exports.addProduct = async (req, res) => {
//     const { productName, quantity, price } = req.body;

//     if (!productName || !quantity || !price) {
//         return res.status(400).json({ message: 'All fields are required' });
//     }

//     try {
//         const encryptedProductName = encrypt(productName); // Encrypt only the product name

//         const product = new Product({
//             productName: encryptedProductName,  // Encrypted product name
//             quantity: quantity,                 // Plain text quantity
//             price: price                        // Plain text price
//         });

//         const savedProduct = await product.save();
//         res.status(201).json(savedProduct);
//     } catch (error) {
//         console.error('Error adding product:', error.message);
//         res.status(500).json({ message: 'Server Error' });
//     }
// };

// Retrieving and decrypting productName
exports.getProducts = async (req, res) => {
    try {
      const products = await Product.find();
      res.status(200).json(products.length ? products : []);
    } catch (error) {
      console.error('Error fetching products:', error.message);
      res.status(500).json({ message: 'Server Error' });
    }
  };

  
exports.updateProduct = async (req, res) => {
    const { id } = req.params;
    const { productName, quantity, price } = req.body;

    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            { productName, quantity, price },
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json(updatedProduct);
    } catch (error) {
        console.error('Error updating product:', error.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.deleteProduct = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedProduct = await Product.findByIdAndDelete(id);

        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.searchProducts = async (req, res) => {
    const { query } = req.query;

    try {
        const products = await Product.find({
            productName: { $regex: query, $options: 'i' } // Case-insensitive search
        });

        res.status(200).json(products);
    } catch (error) {
        console.error('Error searching products:', error.message);
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.reduceProductQuantity = async (req, res) => {
    try {
      const productName = req.params.productName; // Getting productName from route params
      const { quantity } = req.body; // Getting quantity from request body
  
      const product = await Product.findOne({ productName }); // Find the product by name
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
  
      if (product.quantity < quantity) {
        return res.status(400).json({ message: 'Insufficient product quantity' });
      }
  
      product.quantity -= quantity; // Reduce the quantity
      await product.save(); // Save the updated product
  
      res.json({ message: 'Product quantity updated', product }); // Respond with the updated product
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  };
  