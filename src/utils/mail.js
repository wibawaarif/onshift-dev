import nodemailer from 'nodemailer'

// initialize nodemailer
const transporter = nodemailer.createTransport(
    {
        service: 'gmail',
        auth:{
            user: 'onshift.dev@gmail.com',
            pass: 'xcczdwudjrxqbzcn'
        }
    }
);

export default transporter;