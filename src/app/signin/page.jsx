"use client";

import { useSearchParams ,useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { message } from "antd";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [messageApi, contextHolder] = message.useMessage();


  const searchParams = useSearchParams()
  const router = useRouter();
  const session = useSession();

  useEffect(() => {
    if (searchParams.toString().split("=")[0] === 'message') {
      message.error(searchParams.toString().split("=")[1].replace(/\+/g, " "))
    }

  }, [searchParams])

  if (session.status === "loading") {
    return <p>Loading...</p>;
  }


  if (session.status === "authenticated") {
    router?.push("/dashboard/schedule");
    return
  }


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password === "" || email === "") {
      messageApi.open({
        type: "error",
        content: "Email or password cannot be empty",
      });
      return;
    }

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error == null) {
        router.push("/dashboard/schedule");
      } else {
        messageApi.open({
          type: "error",
          content: "Invalid credentials",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-[#FAFAFA] flex justify-center items-center h-screen w-screen">
      {contextHolder}
      <div className="flex flex-col items-center">
        <Image
          height={27}
          width={110}
          alt="OnShift"
          src={"/static/svg/onshift.svg"}
        />
        <p className="text-xl font-bold mt-6 mb-4">Welcome back</p>

        <div className="flex justify-center items-center border-2 border-[#E5E5E3] lg:w-[640px] lg:h-[581px] bg-white rounded-[10px]">
          <div className="lg:w-[483px] lg:h-[383px]">
            <div className="flex flex-col w-full">
              <p>Enter mail</p>
              <input
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Fayiz@elgroccer.com"
                className="border-[1px] text-black border-black border-opacity-50 h-[48px] px-4 py-1"
                type="email"
              />
            </div>

            <div className="flex flex-col w-full lg:mt-[30px] lg:mb-[57px]">
              <div className="flex justify-between">
                <p>Password</p>
                <p className="hover:underline text-sm cursor-pointer">
                  Forgot Password?
                </p>
              </div>
              <input
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Password"
                className="border-[1px] text-black border-black border-opacity-50 h-[48px] px-4 py-1"
                type="password"
              />
            </div>

            <button
              onClick={handleSubmit}
              className="bg-stone-200 transtion duration-300 opacity-70 hover:opacity-100 border-2 border-black border-opacity-50 lg:w-full lg:h-[52px]"
            >
              Sign in
            </button>

            <div className="flex justify-between lg:w-full lg:mt-[50px]">
              <button
                onClick={() => {
                  signIn("google", { callbackUrl: 'http://localhost:3000/dashboard/schedule' });
                }}
                className="bg-white flex items-center justify-center text-black text-sm hover:bg-stone-100 transtion duration-300 border-2 border-black border-opacity-50 lg:w-[47.5%] lg:h-[52px]"
              >
                <Image
                  className="mr-2"
                  height={25}
                  width={16}
                  alt="google"
                  src={"/static/svg/google.svg"}
                />
                Continue with google
              </button>
              <button className="bg-white flex items-center justify-center text-black text-sm hover:bg-stone-100 transtion duration-300 border-2 border-black border-opacity-50 lg:w-[47.5%] lg:h-[52px]">
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
        </div>

        <p className="text-sm mt-8">
          You&apos;ve did/nt have a account?{" "}
          <Link className="hover:underline" href="/signup">
            {" "}
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
