"use client"

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { message } from "antd";


const SignUpPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const router = useRouter();
  const session = useSession();

  if (session.status === "loading") {
    return <p>Loading...</p>;
  }

  if (session.status === "authenticated") {
    router?.push("/dashboard/schedule");
    return
  }

  const createAccount = async () => {

      const response = await fetch('api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, type: 'credentials' }),
      });

      const data = await response.json();

      if (data === 'Email already exist') {
        message.error(data)
        return
      } else {
        message.success('Account created')
        router.push('/signin')
      }
  }

  return (
    <div className="flex w-screen h-screen">
    <div className="w-[50%] h-full bg-[#F8F8F8] flex flex-col justify-center items-center">
      <Image
        className="ml-24"
        height={600}
        width={600}
        alt="OnShift"
        src={"/static/svg/brand-illustration-1.svg"}
      />

      <div className="h-[7px] w-[425px] rounded-full bg-[#D9D9D9]" />
      <div className="h-[7px] w-[425px] rounded-full bg-[#D9D9D9] mt-[30px]" />
      <div className="h-[7px] w-[425px] rounded-full bg-[#D9D9D9] mt-[30px]" />
      <div className="h-[7px] w-[425px] rounded-full bg-[#D9D9D9] mt-[30px]" />
    </div>

    <div className="w-[50%] h-full bg-white flex justify-center items-center">
      <div className="h-[80%] w-[70%] flex flex-col justify-between items-center">
        <Image
          height={27}
          width={110}
          alt="OnShift"
          src={"/static/svg/onshift.svg"}
        />

        <div className="flex flex-col w-full mt-14">
          <p className="text-2xl font-semibold">Get Started</p>
          <p className="mt-2">Sign up to continue</p>

          <div className="flex mt-6 h-[44px] justify-between w-full">
            <button className="bg-white flex items-center justify-center text-black text-sm hover:bg-stone-100 transtion duration-300 border-2 border-black border-opacity-50 w-[48%]">
              <Image
                className="mr-2"
                height={25}
                width={16}
                alt="google"
                src={"/static/svg/google.svg"}
              />
              Continue with google
            </button>
            <button className="bg-white flex items-center justify-center text-black text-sm hover:bg-stone-100 transtion duration-300 border-2 border-black border-opacity-50 w-[48%]">
              <Image
                className="mr-2"
                height={20}
                width={10}
                alt="google"
                src={"/static/svg/facebook.svg"}
              />
              Continue with facebook
            </button>
          </div>
        </div>

        <div className="w-full mt-12">
          <div className="flex flex-col w-full">
            <p>Enter mail</p>
            <input
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter mail"
              className="border-[1px] mt-1 rounded-lg text-black border-black border-opacity-50 h-[48px] px-4 py-1"
              type="email"
            />
          </div>

          <div className="flex flex-col w-full mt-8">
            <p>Password</p>
            <input
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="border-[1px] mt-1 rounded-lg text-black border-black border-opacity-50 h-[48px] px-4 py-1"
              type="password"
            />
          </div>
        </div>

        <button onClick={() => createAccount()} className="bg-stone-200 mt-16 rounded-lg transtion duration-300 opacity-70 hover:opacity-100 border-2 border-black border-opacity-50 lg:w-full lg:h-[52px]">
          Create Account
        </button>

        <p className="text-sm mt-8">
          You&apos;ve did/nt have a account?{" "}
          <Link className="hover:underline" href="/signin">
            {" "}
            Sign in
          </Link>
        </p>
      </div>
    </div>
  </div>
  );
};

export default SignUpPage;
