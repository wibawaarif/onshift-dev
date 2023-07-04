import NextAuth from "next-auth";
import CredentialsProvider from 'next-auth/providers/credentials'
import User from "@/models/user";
import { signJwtToken } from "@/lib/jwt";
import bcrypt from 'bcrypt'
import connect from "@/utils/db";

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            type: 'credentials',
            credentials: {
                username: {label: 'Email', type: 'text', placeholder: 'John Doe'},
                password: {label: 'Password', type: 'password'}
            },
            async authorize(credentials, req){
                const {email, password} = credentials
                await connect();
                                
                const user = await User.findOne({ email })

                if(!user){
                    throw new Error("User not found")
                }

                const comparePass = await bcrypt.compare(password, user.password)

                if(!comparePass){
                    throw new Error("Invalid credentials")
                } else {
                    const {password, ...currentUser} = user._doc

                    const accessToken = signJwtToken(currentUser, {expiresIn: '6d'})
                    console.log('accessToken', accessToken)

                    return {
                        ...currentUser,
                        accessToken
                    }
                }
            }
        })
    ],
    pages: {
        signIn: '/login'
    },
    callbacks: {
        async jwt({token, user}){
            if(user){
                token.accessToken = user.accessToken
                token._id = user._id
            }

            return token
        },
        async session({session, token}){
            if(token){
                session.user._id = token._id
                session.user.accessToken = token.accessToken
            }

            return session
        }
    },
    secret: process.env.JWT_SECRET,
})

export {handler as GET, handler as POST}
