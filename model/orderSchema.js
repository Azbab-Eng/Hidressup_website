import mongoose from "mongoose";

const orderSchema = mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    },
    orderItems:[
        {
        name:{type:String,required:true},
        quantity:{type:Number,required:true},
        image:{type:String},
        price:{type:Number,required:true},
        product:{
            type:mongoose.Schema.Types.ObjectId,
            required:true,
            ref:'Product'
        }
    }
],deliveryAddress:{
    address:{type:String,required:true},
    city:{type:String,required:true},
    dprice:{type:Number,require:true,default:1000}
},
PaymentMethod:{type:String,required:true},

},
{timestamps:true})

const Order = mongoose.model('Order',orderSchema)

export default Order
