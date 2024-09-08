import React, { useState } from 'react';
import { Box, TextField, Button, List, ListItem, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

export default function Bill() {
  const [productName, setProductName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [billItems, setBillItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  // Fetch product suggestions
  const fetchProductSuggestions = async (query) => {
    try {
      const response = await fetch(`http://localhost:5000/api/products/search?query=${query}`);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching product suggestions:', error);
    }
  };

  // Handle product name change
  const handleProductNameChange = (e) => {
    const value = e.target.value;
    setProductName(value);
    fetchProductSuggestions(value);
  };

  // Handle selecting a product from suggestions
  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    setProductName(product.productName);
    setPrice(product.price);
    setProducts([]); // Clear suggestions after selection
  };
  const handleQuantityChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) { // Only allows digits
      setQuantity(value);
    }
  };

  // Handle adding product to bill
  const handleAddProduct = () => {
    if (selectedProduct && quantity) {
      const amount = selectedProduct.price * quantity;
      const newItem = { productName: selectedProduct.productName, quantity, amount };
      setBillItems([...billItems, newItem]);
      setTotalAmount(totalAmount + amount);
      setQuantity('');
      setProductName('');
      setPrice('');
      setSelectedProduct(null);
    }
  };

  // Handle printing the bill and reducing product quantity in the database
  const handlePrintBill = async () => {
    try {
      for (const item of billItems) {
        const response = await fetch(`http://localhost:5000/api/products/reduce/${item.productName}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ quantity: item.quantity }), // Pass the quantity to be reduced
        });
  
        if (!response.ok) {
          console.error('Failed to update product quantity');
          alert('Failed to update product quantity');
        }
      }
      alert('Bill printed successfully and quantities updated!');
      setBillItems([]);
      setTotalAmount(0);
    } catch (error) {
      console.error('Error printing bill:', error);
      alert('Error printing bill');
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', padding: '20px' }}>
      <Box component="form" sx={{ display: 'flex', flexDirection: 'column', paddingRight: '50px' }}>
        <TextField 
          id="productName" 
          label="Product Name" 
          variant="outlined" 
          value={productName}
          onChange={handleProductNameChange}
        />
        <List>
          {products.map((product) => (
            <ListItem 
              button 
              key={product._id} 
              onClick={() => handleProductSelect(product)}
            >
              {product.productName}
            </ListItem>
          ))}
        </List>
        <Box sx={{ display: 'flex', gap: 2 }}>
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
            disabled // Disable direct input, price comes from selected product
          />
        </Box>
        <Button 
          variant="contained" 
          color="primary" 
          size="large" 
          type="button"
          onClick={handleAddProduct}
          sx={{ marginTop: 2 }}
        >
          Add
        </Button>
      </Box>

      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="h5">Bill Summary</Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Product Name</TableCell>
                <TableCell align="right">Quantity</TableCell>
                <TableCell align="right">Price</TableCell>
                <TableCell align="right">Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {billItems.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.productName}</TableCell>
                  <TableCell align="right">{item.quantity}</TableCell>
                  <TableCell align="right">{item.amount / item.quantity}</TableCell>
                  <TableCell align="right">{item.amount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Typography variant="h6" sx={{ marginTop: 2 }}>Total Amount: {totalAmount}</Typography>
        <Button 
          variant="contained" 
          color="secondary" 
          size="large" 
          sx={{ marginTop: 2 }}
          onClick={handlePrintBill}
        >
          Print Bill
        </Button>
      </Box>
    </Box>
  );
}
