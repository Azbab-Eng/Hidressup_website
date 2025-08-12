import mongoose from "mongoose";

const productSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref : 'User' //relation between the product and the user
    },
    name:{type : String,required: true },
    images:[{type : String,required:true }],
    description:{type : String,required: true},
    category:[{type : String,required: true}],
    sizes:[{type : String,required: true}],
    price:{type : Number,required: true},
    countInStock:{type : Number,required: true},
},{
    timestamps: true
})

const Product = mongoose.model('Product',productSchema)

export default Product
