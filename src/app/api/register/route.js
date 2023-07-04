import { NextResponse } from "next/server";
import connect from "@/utils/db";
import bcrypt from 'bcrypt'
import User from '@/models/user'

export async function POST(req){
    try {
        await connect();

        const {username, email, password: pass} = await req.json()

        const isUserExist = await User.findOne({email})

        if(isUserExist){
            throw new Error("User already exists")
        }

        const hashedPassword = await bcrypt.hash(pass, 10)

        const newUser = await User.create({username, email, password: hashedPassword})

        const {password, ...user} = newUser._doc

        return new NextResponse(JSON.stringify(user), {status: 201})
    } catch (error) {
        return new NextResponse(JSON.stringify(error.message), {status: 500})
    }
}