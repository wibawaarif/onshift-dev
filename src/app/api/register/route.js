import { NextResponse } from "next/server";
import connect from "@/utils/db";
import bcrypt from 'bcrypt'
import User from '@/models/user'
import Team from '@/models/team'
import transporter from "@/utils/mail";
import path from 'path'
import Position from "@/models/position";
import { getServerSession } from "next-auth";
import { options } from "@/lib/options";

export async function POST(req){
    const session = await getServerSession(options)
    try {
        await connect();

        const {name, team, businessAddress, startDayOfWeek,  businessName, industry, totalEmployee, email, password: pass, type} = await req.json()

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
            console.log('1')
            throw new Error("Email already exist")
        }

        if(isUserExist && isUserExist.type === 'credentials' && type === 'google') {
            console.log('2')
            throw new Error("Email already exist")
        }

        if(isUserExist && type === 'google') {
            console.log('3')
            return new NextResponse(JSON.stringify(isUserExist), {status: 200})
        }

        if (type !== 'google') {
            console.log('4')
            const hashedPassword = await bcrypt.hash(pass, 10)

            const newUser = await User.create({name, startDayOfWeek, businessAddress, businessName, industry, totalEmployee, email, password: hashedPassword, type, onboarding: true})
            
            for (let i = 0; i < team.length; i++) {
                const position = await Position.create({name: team[i].position, user: email})
                await Team.create({name: team[i].team, position: position._id, user: email})
            }
    
            const {password, ...user} = newUser._doc
    
            // await transporter.sendMail(mailOptions);
            return new NextResponse(JSON.stringify(user), {status: 201})
        }

        const newUser = await User.create({name, email, type, onboarding: true})

        const {...user} = newUser._doc

        // await transporter.sendMail(mailOptions);

        return new NextResponse(JSON.stringify(user), {status: 201})
    } catch (error) {
        console.log(error)
        return new NextResponse(JSON.stringify(error.message), {status: 500})
    }
}