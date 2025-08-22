import asyncHandler from 'express-async-handler';
import Product from '../model/productSchema.js';
import multer from 'multer';
import path from 'path';

// Storage setup
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });

// Middleware export for route use
const uploadImages = upload.array('images', 3);

// @desc Fetch all products
const getProducts = asyncHandler(async (req, res) => {
  const { Cg, filter, from, to, keyword: search } = req.query;

  const keyword = search
    ? { name: { $regex: search, $options: 'i' } }
    : {};

  if (Cg) {
    const products = await Product.find({ category: Cg });
    return res.json(products);
  }

  if (filter) {
    let sortBy;
    switch (filter) {
      case 'date':
        sortBy = 'createdAt';
        break;
      case 'highprice':
        sortBy = 'price';
        break;
      case 'lowprice':
        sortBy = '-price';
        break;
      default:
        sortBy = null;
    }

    const products = await Product.find().sort(sortBy);
    return res.json(products);
  }

  if (from && to) {
    const products = await Product.find({
      $and: [{ price: { $gte: from } }, { price: { $lte: to } }],
    });
    return res.json(products);
  }

  const products = await Product.find({ ...keyword });
  res.json(products);
});

// @desc Get single product
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc Delete a product
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    await product.deleteOne();
    res.json({ message: 'Product Removed' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc Create product
const createProduct = asyncHandler( async (req, res) => {
  const {
    name,
    price,
    description,
    sizes,
    category,
    countInStock,
  } = req.body;

  const parsedSizes = typeof sizes === 'string' ? JSON.parse(sizes) : sizes;
  const parsedCategory = typeof category === 'string' ? JSON.parse(category) : category;

  const images = req.files?.map(file => `${req.protocol}://${req.get("host")}/uploads/${file.filename}`) || [];
//   const images = req.files?.map(file => file.path) || [];

  const product = new Product({
    user: req.user,
    name,
    price,
    description,
    sizes: parsedSizes,
    category: parsedCategory,
    countInStock,
    images,
  });

  if (product) {
    console.log(product.images)
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } else {
    res.status(400).json({ error: 'Product not provided' });
  }
});

// @desc Update product
const updateProduct = asyncHandler(async (req, res) => {
  const {
    name,
    price,
    description,
    category,
    sizes,
    countInStock,
  } = req.body;

  const parsedSizes = typeof sizes === 'string' ? JSON.parse(sizes) : sizes;
  const parsedCategory = typeof category === 'string' ? JSON.parse(category) : category;

  const images = req.files?.map(file => `uploads/${file.filename}`);

  const product = await Product.findById(req.params.id);
  if (product) {
    product.name = name || product.name;
    product.price = price || product.price;
    product.description = description || product.description;
    product.category = parsedCategory || product.category;
    product.sizes = parsedSizes || product.sizes;
    product.countInStock = countInStock || product.countInStock;
    if (images && images.length > 0) {
      product.images = images;
    }

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

export {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  uploadImages,
};
