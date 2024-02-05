import { NextResponse } from "next/server";
import connect from "@/utils/db";
import bcrypt from 'bcrypt'
import User from '@/models/user'
import transporter from "@/utils/mail";
import { getServerSession } from "next-auth";
import { options } from "@/lib/options";

export async function POST(req){
    const session = await getServerSession(options)

    if (!session) {
      return new Response(JSON.stringify({ error: "Unauthorized (wrong or expired token)" }), { status: 403 })
    }
    try {
        await connect();

        const {email} = await req.json()

        const isUserExist = await User.findOne({email})

        if (!isUserExist) {
            throw new Error("Email not found")
        }

        const newPassword = Math.random().toString(36).slice(-8)
        const hashedPassword = await bcrypt.hash(newPassword, 10)

        isUserExist.password = hashedPassword
        isUserExist.save()

        const mailOptions = {
            from: "onshift.dev@gmail.com",
            to: email,
            subject: "Welcome to OnShift",
            html: `<p>Dear ${email.split('@')[0]},</p>
            <p>Your password has been successfully reset. Please find your new password below:</p>
            <p>New Password: ${newPassword}</p>
            <br/>
            Please ensure that you keep this password secure and do not share it with anyone.
            <br/>
            If you did not request this password reset, please contact our support team immediately.
            <br/>
            <br/>
            Thank you,
            <br/>
            Onshift Team
            `
        }

        await transporter.sendMail(mailOptions);

        return new NextResponse(JSON.stringify({info: "Password Successfully Updated"}), {status: 200})
    } catch (error) {
        return new NextResponse(JSON.stringify(error.message), {status: 500})
    }
}