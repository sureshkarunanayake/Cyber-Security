import { Box, TextField, Button, Typography } from '@mui/material';
import React, { useState} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function UpdateProduct() {
  const location = useLocation();
  const navigate = useNavigate();
  const { product } = location.state || {}; // Get the product data from state

  const [productName, setProductName] = useState(product?.productName || '');
  const [quantity, setQuantity] = useState(product?.quantity || '');
  const [price, setPrice] = useState(product?.price || '');

  const handleUpdate = async (event) => {
    event.preventDefault();

    const updatedProduct = {
      productName,
      quantity,
      price,
    };

    try {
      const response = await fetch(`http://localhost:5000/api/products/${product._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProduct),
      });

      if (response.ok) {
        alert('Product updated successfully!');
        setProductName('');
        setQuantity('');
        setPrice('');
        navigate('/product'); // Redirect back to the product list
      } else {
        console.error('Failed to update product');
        alert('Failed to update product');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <Box 
      component="form" 
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'left',
        padding: '50px',
        '& > :not(style)': { m: 1, width: '35ch' },
      }}
    >
      <Typography variant="h4" fontWeight={"bold"} fontFamily={"arial"} align='left'>
          Update Product
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
        onChange={(e) => setQuantity(e.target.value)}
      />
      <TextField 
        id="price" 
        label="Unit Price" 
        variant="outlined" 
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <Button variant="contained" color="primary" size="large" type='submit' onClick={handleUpdate}>
        Save
      </Button>
    </Box>
  )
}
