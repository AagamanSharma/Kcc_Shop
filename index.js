const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/shopkcc')
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

/* -------------------- SCHEMAS & MODELS -------------------- */

// Category Schema
const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,}, { timestamps: true });

const Category = mongoose.model('Category', categorySchema);

// Product Schema
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: Number,
  description: String,
  imageUrl: { type: String, default: '' }, // 🖼️ Added field for product image
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' }, // Relation
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
 

/* -------------------- CATEGORY ROUTES -------------------- */

// Get all categories
app.get('/categories', async (req, res) => {
  const categories = await Category.find();
  res.json(categories);
});

// Get single category by ID
app.get('/categories/:id', async (req, res) => {
const category = await Category.findById(req.params.id);
  res.json(category);
});

// Add new category
app.post('/categories', async (req, res) => {
  const category = new Category(req.body);
  await category.save();
  res.json(category);
});

// Update category
app.put('/categories/:id', async (req, res) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(category);
});

// Delete category
app.delete('/categories/:id', async (req, res) => {
  await Category.findByIdAndDelete(req.params.id);
  res.json({ message: 'Category deleted' });
});

/* -------------------- PRODUCT ROUTES -------------------- */


// Get all products (with category info)
app.get('/products', async (req, res) => {
  const products = await Product.find().populate('category');
  res.json(products);
});

// Get single product
app.get('/products/:id', async (req, res) => {
  const product = await Product.findById(req.params.id).populate('category');
  res.json(product);
});

// ✅ Get products by category ID
app.get('/products/category/:categoryId', async (req, res) => {
  try {
    const products = await Product.find({ category: req.params.categoryId }).populate('category');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products by category', error });
  }
});

// Add new product
app.post('/products', async (req, res) => {
  const product = new Product(req.body);
  await product.save();
  res.json(product);
});

// Update product
app.put('/products/:id', async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(product);
});

// Delete product
app.delete('/products/:id', async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: 'Product deleted' });
});

/* -------------------- SERVER -------------------- */

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));

