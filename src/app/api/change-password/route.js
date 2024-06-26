import { NextResponse } from "next/server";
import connect from "@/utils/db";
import bcrypt from 'bcrypt'
import User from '@/models/user'
import { getServerSession } from "next-auth";
import { options } from "@/lib/options";

export async function POST(req){
    const session = await getServerSession(options)

    if (!session) {
      return new Response(JSON.stringify({ error: "Unauthorized (wrong or expired token)" }), { status: 403 })
    }
    try {
        await connect();

        const {email, currentPassword, newPassword} = await req.json()

        const isUserExist = await User.findOne({email})

        if (!isUserExist) {
            throw new Error("Email not found")
        }

        const comparePass = await bcrypt.compare(currentPassword, isUserExist.password);

        if (!comparePass) {
          throw new Error("Wrong current password");
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10)

        isUserExist.password = hashedPassword
        isUserExist.save()

        return new NextResponse(JSON.stringify({info: "Password Successfully Updated"}), {status: 200})
    } catch (error) {
        return new NextResponse(JSON.stringify(error.message), {status: 500})
    }
}