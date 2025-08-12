import nodemailer from 'nodemailer'

const transport = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:process.env.EMAIL_ADDRESS,
        pass:process.env.EMAIL_PASSWORD
    }
})

const sendMail = async ()=>{
    await transport.sendMail({
        from:process.env.EMAIL_ADDRESS,
        to:'babalolaatalltech2@gmail.com',
        subject:"Email Verification OTP",
        text:`Your OTP is 1234`
    })
}

export {sendMail}