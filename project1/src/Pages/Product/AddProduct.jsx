import { Box, TextField, Button, Typography, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import React, { useState, useEffect } from 'react';

export default function AddProduct() {

  const [productName, setProductName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
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

  const handleQuantityChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) { // Only allows digits
      setQuantity(value);
    }
  };

  const handlePriceChange = (e) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) { // Allows digits and a single decimal point
      setPrice(value);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const product = {
      productName,
      quantity,
      price,
    };

    try {
      const response = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Product added:', data);
        alert('Product added successfully!');
        // Optionally reset the form
        setProductName('');
        setQuantity('');
        setPrice('');
        fetchProducts();  // Refresh the product list
      } else {
        console.error('Failed to add product');
        alert('Failed to add product');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <Grid container spacing={4} sx={{ padding: '50px' }}>
      {/* Form Section */}
      <Grid item xs={12} md={6}>
        <Box 
          component="form" 
          sx={{
            display: 'flex',
            flexDirection: 'column',
            '& > :not(style)': { m: 1, width: '35ch' },
          }}
        >
          <Typography variant="h4" fontWeight={"bold"} fontFamily={"arial"} align='left'>
              Add Product
          </Typography>
          <TextField 
            id="productName" 
            label="Product Name" 
            variant="outlined" 
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
          />
          <TextField 
            id="quantity" 
            label="Quantity" 
            variant="outlined" 
            value={quantity}
            onChange={handleQuantityChange}
          />
          <TextField 
            id="price" 
            label="Unit Price" 
            variant="outlined" 
            value={price}
            onChange={handlePriceChange}
          />
          <Button variant="contained" color="primary" size="large" type='submit' onClick={handleSubmit}>
            Add
          </Button>
        </Box>
      </Grid>

      {/* Table Section */}
      <Grid item xs={12} md={6}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Product Name</TableCell>
                <TableCell align="right">Quantity</TableCell>
                <TableCell align="right">Price</TableCell>
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  )
}
