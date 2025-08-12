import express from 'express';
const router = express.Router();
import {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  uploadImages,
} from '../controlers/productControler.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/')
  .get(getProducts)
  .post(protect, admin, uploadImages, createProduct);

router.route('/:id')
  .get(getProductById)
  .delete(protect, admin, deleteProduct)
  .put(protect, admin, uploadImages, updateProduct);

export default router;
