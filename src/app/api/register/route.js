import { NextResponse } from "next/server";
import connect from "@/utils/db";
import bcrypt from 'bcrypt'
import User from '@/models/user'

export async function POST(req){
    try {
        await connect();

        const {username, email, password: pass, type} = await req.json()

        const isUserExist = await User.findOne({email})

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
            console.log('mauksaajsf');
            const hashedPassword = await bcrypt.hash(pass, 10)

            const newUser = await User.create({username, email, password: hashedPassword, type})
    
            const {password, ...user} = newUser._doc
    
            return new NextResponse(JSON.stringify(user), {status: 201})
        }

        const newUser = await User.create({username, email, type})
        console.log('test', newUser);
        const {...user} = newUser._doc

        return new NextResponse(JSON.stringify(user), {status: 201})
    } catch (error) {
        return new NextResponse(JSON.stringify(error.message), {status: 500})
    }
}