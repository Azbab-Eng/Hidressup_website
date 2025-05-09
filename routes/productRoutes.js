import express from 'express'
const router = express.Router()
import {getProducts, getProductById, deleteProduct,createProduct,updateProduct,} from '../controlers/productControler.js'
import { protect,admin } from '../middleware/authMiddleware.js'


router.route('/').get(getProducts).post(protect,admin,createProduct)
router.route('/:id/reviews').post(protect,)
// createproductreview

router.route('/:id').get(getProductById).delete(protect,admin,deleteProduct).put(protect,admin,updateProduct)

console.log('Product Router is working well')

export default router