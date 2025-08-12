import nodemailer from 'nodemailer'
import { config } from 'dotenv'
import express from 'express'
const app = express()
config()
const transporter = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:process.env.EMAIL_ADDRESS,
        pass:process.env.EMAIL_PASSWORD
    }
})

transporter.verify((error,success)=>{
    if(error)console.log(error)
    else console.log("Ready to send")
})


app.post("/sending",async (req,res)=>{
    await sendMail()
    res.send("Mail has sent")
})


const PORT = process.env.PORT || 8000
app.listen(PORT,console.log(`App is running in ${PORT}`))