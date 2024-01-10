import { NextResponse } from "next/server";
import connect from "@/utils/db";
import bcrypt from 'bcrypt'
import User from '@/models/user'
import transporter from "@/utils/mail";
import path from 'path'

export async function POST(req){
    try {
        await connect();

        const {username, email, password: pass, type} = await req.json()

        const isUserExist = await User.findOne({email})

        const mailOptions = {
            from: "onshift.dev@gmail.com",
            to: email,
            subject: "Welcome to OnShift",
            html: `<p>Dear ${email.split('@')[0]},</p>
            <p>We are thrilled to have you as a new member of our community. OnShift is a powerful platform that helps you manage your shifts and stay organized with ease.</p>
            <p>We hope that OnShift will simplify your work life and provide you with a seamless experience. If you have any questions or need assistance, our support team is here to help.</p>
            <p>Once again, welcome aboard! We look forward to helping you make the most of your work schedule.</p>
            <br/><br/>
            Onshift Team
            `
        }


        if(isUserExist && type === 'credentials'){
            throw new Error("Email already exist")
        }

        if(isUserExist && isUserExist.type === 'credentials' && type === 'google') {
            throw new Error("Email already exist")
        }

        if(isUserExist && type === 'google') {
            return new NextResponse(JSON.stringify(isUserExist), {status: 200})
        }

        if (type !== 'google') {
            const hashedPassword = await bcrypt.hash(pass, 10)

            const newUser = await User.create({username, email, password: hashedPassword, type, onboarding: true})
    
            const {password, ...user} = newUser._doc
    
            await transporter.sendMail(mailOptions);
            return new NextResponse(JSON.stringify(user), {status: 201})
        }

        const newUser = await User.create({username, email, type, onboarding: true})

        const {...user} = newUser._doc

        await transporter.sendMail(mailOptions);

        return new NextResponse(JSON.stringify(user), {status: 201})
    } catch (error) {
        return new NextResponse(JSON.stringify(error.message), {status: 500})
    }
}