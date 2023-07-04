'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useSession } from 'next-auth/react'


const Login = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const router = useRouter()
    const session = useSession();

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (password === '' || email === '') {
            toast.error("Fill all fields!")
            return
        }


        try {
            const res = await signIn('credentials', { email, password, redirect: false })

            if (res?.error == null) {
                router.push("/")
            } else {
                toast.error("Error occured while logging")
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div>
            <div>
                <h2>Log In</h2>
                <form onSubmit={handleSubmit}>
                    <input className='text-black' type="email" placeholder='Email...' onChange={(e) => setEmail(e.target.value)} />
                    <input className='text-black' type="password" placeholder='Password...' onChange={(e) => setPassword(e.target.value)} />
                    <button >Log in</button>
                </form>
            </div>
        </div>
    )
}

export default Login