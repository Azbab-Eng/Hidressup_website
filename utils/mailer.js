import nodemailer from "nodemailer"
import { config } from "dotenv"

config()
const transport = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:process.env.EMAIL_ADDRESS,
        pass:process.env.EMAIL_PASSWORD
    }
})

const sendOtp = async (email,opt)=>{
    await transport.sendMail({
        from:process.env.EMAIL_ADDRESS,
        to:email,
        subject:"Email Verification OTP",
        text:`Your OTP is ${opt}`
    })
}

const generateOtp = ()=>
    Math.floor(100000 + Math.random() * 900000).toString()


console.log("Mailer is working Well" , generateOtp())

export  {sendOtp,generateOtp}