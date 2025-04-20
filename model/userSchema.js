import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    name:{type:String,required :true},
    email:{type:String,required:true,unique:true },
    password:{type:String,required:true},
    no:{type:Number,required:true},
    isAdmin:{type:Boolean,required:true,default:false},
    isVerified:{type:Boolean,required:true,default:false},
    otp:{type:String},
    otpExpiredAt:{type:Date}
},
{ timestamps:true })



const User = mongoose.model("User",userSchema)
export default User
