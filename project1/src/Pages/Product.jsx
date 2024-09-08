import React, { useState, useEffect } from 'react';
import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function Product() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  // Fetch products from the backend
  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    fetchProducts();  // Fetch products when the component mounts
  }, []);

  const handleAddProductClick = () => {
    navigate('/add-product');
  };

  const handleUpdateProductClick = (product) => {
    navigate('/update-product', { state: { product } }); // Pass the product data to the update page
  };

  const handleDeleteProductClick = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: 'DELETE',
      });
  
      if (response.ok) {
        alert('Product deleted successfully!');
        fetchProducts(); // Refresh the product list after deletion
      } else {
        console.error('Failed to delete product');
        alert('Failed to delete product');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };  

  return (
    <Box sx={{ flexGrow: 1, textAlign: 'center', padding: '20px' }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, marginBottom: 4 }}>
        <Button variant="contained" color="primary" size="large" onClick={handleAddProductClick}>
          Add Product
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ marginTop: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Product Name</TableCell>
              <TableCell align="right">Quantity</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product._id}>
                <TableCell component="th" scope="row">
                  {product.productName}
                </TableCell>
                <TableCell align="right">{product.quantity}</TableCell>
                <TableCell align="right">{product.price}</TableCell>
                <TableCell align="center">
                  <Button 
                    variant="contained" 
                    color="secondary" 
                    size="small" 
                    onClick={() => handleUpdateProductClick(product)} // Pass product to handler
                    sx={{ marginRight: 1 }}
                  >
                    Update
                  </Button>
                  <Button 
                    variant="contained" 
                    color="error" 
                    size="small" 
                    onClick={() => handleDeleteProductClick(product._id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
