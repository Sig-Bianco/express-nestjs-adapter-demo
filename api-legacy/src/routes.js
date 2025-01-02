const express = require('express');
const router = express.Router();
const appService = require('./appService');

router.get('/products', (req, res) => {
  const result = appService.getProducts();
  res.status(200).json(result);
});

router.post('/product', (req, res) => {
  const { input } = req.body;
  const result = appService.createProduct(input);
  res.status(200).json(result);
});

router.put('/product', (req, res) => {
  const { input } = req.body;
  const result = appService.updateProduct(input);
  res.status(200).json(result);
});

module.exports = router;
