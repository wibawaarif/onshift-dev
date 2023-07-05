'use client'

import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'

const SignIn = () => {
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
        <div className='bg-[#FAFAFA] flex justify-center items-center h-screen w-screen'>
            <div className='flex flex-col items-center'>
                <Image height={27} width={110} alt='OnShift' src={'/static/images/onshift.svg'} />
                <p className='text-xl font-bold mt-6 mb-4'>Welcome back</p>

                <div className='flex justify-center items-center lg:w-[640px] lg:h-[581px] bg-white rounded-[10px]'>

                    <div className='lg:w-[483px] lg:h-[383px]'>

                        <div className='flex flex-col w-full'>
                            <p>Enter mail</p>
                            <input placeholder='Fayiz@elgroccer.com' className='border-[1px] border-black opacity-50 h-[48px] px-4 py-1' type='email' />
                        </div>

                        <div className='flex flex-col w-full lg:mt-[30px] lg:mb-[57px]'>
                            <div className='flex justify-between'>
                            <p>Password</p>
                            <p>Forgot Password?</p>
                            </div>
                            <input placeholder='Enter Password' className='border-[1px] border-black opacity-50 h-[48px] px-4 py-1' type='email' />
                        </div>

                        <button className='bg-stone-200 lg:w-full lg:h-[52px]'>Sign in</button>

                        <div className='flex justify-between lg:w-full lg:mt-[50px]'>
                        <button className='bg-stone-200 lg:w-[47.5%] lg:h-[52px]'>Continue with google</button>
                        <button className='bg-stone-200 lg:w-[47.5%] lg:h-[52px]'>Continue with facebook</button>
                        </div>

                    </div>

                </div>

                <Link className='text-sm mt-8' href='/signup'>You&apos;ve did/nt have a account? Sign up</Link>

            </div>

                {/* <form onSubmit={handleSubmit}>
                    <input className='text-black' type="email" placeholder='Email...' onChange={(e) => setEmail(e.target.value)} />
                    <input className='text-black' type="password" placeholder='Password...' onChange={(e) => setPassword(e.target.value)} />
                    <button >Log in</button>
                </form> */}
        </div>
    )
}

export default SignIn