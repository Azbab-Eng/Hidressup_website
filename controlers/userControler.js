import asyncHandler from 'express-async-handler'
import generateToken from '../utils/generateToken.js'
import User from '../model/userSchema.js'
import {sendOtp,generateOtp} from '../utils/mailer.js'
import bcrypt from 'bcryptjs'
import { Router } from 'express'

// @desc Auth user & get token
// @route POST /api/users/login
// @access Public
const authUser = asyncHandler(async (req, res) => {
    
    const {email, password} = req.body

    try{
        const user = await User.findOne({email})
        if(!user) return res.status(400).json({message:"User not found \nGo to Register Page"})
        if(!user.isVerified) return res.status(403).json({message:"Please verify your Email first"})

        const isMatch = await bcrypt.compare(password,user.password)
        if(!isMatch) return res.status(400).json({message:"Invalid Password"})

            res.json({message:"Login Successful",
                _id: user._id,
                name: user.name,
                email: user.email,
                no: user.no,
                isAdmin: user.isAdmin,
                token:generateToken(user._id)
            })
    }catch(err){
        res.status(500).json({error:err.message})
    }
        
})



// @desc Register a new user
// @route POST /api/users
// @access Public
const registerUser = asyncHandler(async (req, res) => {
    
    const {name, email, password, no} = req.body

    try{
        const userExists = await User.findOne({ email })

        if(userExists){ res.status(400).json({message:'User already exists'})}
        const hashPassword = await bcrypt.hash(password,12)
        const otp = generateOtp()
        const otpExpiredAt = new Date(Date.now() + 10 * 60 * 1000)

        const user = await User.create({
            name,
            email,
            password:hashPassword,
            no,
            otp,
            otpExpiredAt
        })
        
        await sendOtp(email,otp)
        res.status(201).json({message:`OTP sent to your email : ${email}` })
    } catch(err){
        res.status(500).json({error:err.message})
    }
    
})

const verifyEmail = asyncHandler(async(req,res)=>{
    const {email,otp} = req.body

    try{
        const user = await User.findOne({email,otp})
        
        if(!user) return res.status(400).json({message:"Invalid OTP or Email"})
        if(user.otpExpiredAt < new Date()) return res.status(400).json({message:"OTP expired"})
        
            user.isVerified = true
            user.otp = null 
            user.otpExpiredAt = null
            await user.save()
            res.status(201).json({message:"Email Verification Successful "})
    }catch(err){
        res.status(500).json({error:err.message})
    }
})

// @desc Get user profile
// @route GET /api/users/profile
// @access Private
const getUserProfile = asyncHandler(async (req, res) => {
    // const userId = req.user._id
    // const user = await User.findById(userId).select('-password')
    const user = await User.findById(req.user._id)
    if(user){
        res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        no: user.no,
        isAdmin: user.isAdmin,
        
    })
    }else{
        res.status(404).json({error:"User not found"})
    }
    
})


// @desc Update user profile
// @route PUT /api/users/profile
// @access Private
const updateUserProfile = asyncHandler(async (req, res) => {
    
    const user = await User.findById(req.user._id)

    if(user){
        user.name = req.body.name || user.name
        user.email = req.body.email || user.email
        user.no = req.body.no || user.no
        if(req.body.password){
            user.password = req.body.password || user.password
        }

        const updatedUser = await user.save()
            res.json({
            _id: updatedUser._id,
             name: updatedUser.name,
             email: updatedUser.email,
             no: user.no,
             isAdmin: updatedUser.isAdmin,
             token:generateToken(updatedUser._id)
        })

    }else{
        res.status(404).json({error:"User not found"})
    }
    
    
})

// @desc Update user user
// @route PUT /api/users/:id
// @access Private/Admin

const updateUser = asyncHandler(async (req, res) => {
    
    const user = await User.findById(req.params.id)

    if(user){
        user.name = req.body.name || user.name
        user.email = req.body.email || user.email
        user.isAdmin = req.body.isAdmin
        user.no = req.body.no || user.no

        const updatedUser = await user.save()
            res.json({
            _id: updatedUser._id,
             name: updatedUser.name,
             email: updatedUser.email,
             isAdmin: updatedUser.isAdmin,
             no: updateUser.no
            
            })
    }else{
        res.status(404).json({error:"User not found"})
    }
    
    
})

// @desc Get All users
// @route GET /api/users
// @access Private/admin
const getUsers = asyncHandler(async (req, res) => {
    
    const users = await User.find({})
    res.json(users)

})
// @desc Get user by ID
// @route GET /api/users/:id
// @access Private/admin
const getUserByID = asyncHandler(async (req, res) => {
    
    const user = await User.findById(req.params.id).select('-password')
    if(user){
        res.json(user)
        console.log(user)
    }else{
        res.status(404).json({error:"User not found"})
    }

    
    
})
// @desc Delete User
// @route DELETE /api/users/:id
// @access Private/admin
const deleteUser = asyncHandler(async (req, res) => {
    
    const user = await User.findById(req.params.id)
    if(user){
        await user.remove()
        res.json({message : 'User removed'})
    }else{
        res.status(400).json({error:'User not found'})
    }
    
    
})


export {verifyEmail, authUser, getUserProfile, registerUser, updateUserProfile,getUsers,deleteUser,getUserByID,updateUser}
