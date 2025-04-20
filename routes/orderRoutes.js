import express from 'express'
const router = express.Router()
import { addorderitems, GetMyOrders, getOrderById, GetOrders, } from '../controlers/orderControler.js'
import {protect,admin} from '../middleware/authMiddleware.js'

// updateOrderToPaid
// updateOrderToDelivered

router.route('/').post(protect,addorderitems).get(protect,admin,GetOrders)
router.route('/myorders').get(protect,GetMyOrders) 

router.route('/:id').get(protect,getOrderById) 
router.route('/:id/pay').put(protect) 

router.route('/:id/deliver').put(protect,admin,) 

console.log('Order Router is working well')

export default router