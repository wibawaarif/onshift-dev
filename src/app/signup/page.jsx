"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { message, Divider } from "antd";

const SignUpPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();
  const session = useSession();

  if (session.status === "loading") {
    return <p>Loading...</p>;
  }

  if (session.status === "authenticated") {
    router?.push("/dashboard/schedule");
    return;
  }

  const createAccount = async () => {
    const response = await fetch("api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        username: name,
        type: "credentials",
      }),
    });

    const data = await response.json();

    if (data === "Email already exist") {
      message.error(data);
      return;
    } else {
      message.success("Account created");
      await signIn("credentials", {
        email,
        password,
        callbackUrl: "https://onshift-dev.vercel.app/dashboard/schedule",
      });
    }
  };

  return (
    <div className="flex w-screen h-screen">
      <div className="w-[50%] h-full bg-white flex flex-col justify-start items-center">
        <div className="flex justify-start w-[60%] pt-8">
          <Image
            height={27}
            width={130}
            alt="OnShift"
            src={"/static/svg/onshift.svg"}
          />
        </div>
        <div className="h-[80%] w-[60%] flex flex-col">
          <div className="flex flex-col w-full mt-16">
            <p className="text-3xl font-semibold">Sign Up</p>
          </div>

          <div className="w-full mt-10">
            <div className="flex flex-col w-full">
              <p>Name</p>
              <input
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter name"
                className="border-[1px] mt-1 rounded-lg text-black border-black border-opacity-50 h-[48px] px-4 py-1"
                type="email"
              />
            </div>

            <div className="flex flex-col w-full mt-4">
              <p>Email</p>
              <input
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter mail"
                className="border-[1px] mt-1 rounded-lg text-black border-black border-opacity-50 h-[48px] px-4 py-1"
                type="email"
              />
            </div>

            <div className="flex flex-col w-full mt-4">
              <p>Password</p>
              <input
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="border-[1px] mt-1 rounded-lg text-black border-black border-opacity-50 h-[48px] px-4 py-1"
                type="password"
              />
            </div>
          </div>

          <button
            onClick={() => createAccount()}
            className="bg-[#1A3447] text-white mt-6 rounded-lg transtion duration-300 hover:opacity-80 border-2 border-black border-opacity-50 lg:w-full lg:h-[52px]"
          >
            Sign Up
          </button>

          <p className="text-sm mt-3 text-center">
            Already have an account?{" "}
            <Link
              className="hover:underline text-[#1A3447] font-bold"
              href="/signin"
            >
              {" "}
              Sign in
            </Link>
          </p>

          <Divider>or</Divider>

          <div className="flex h-[52px] justify-between w-full">
            <button
              onClick={() => {
                signIn("google", {
                  callbackUrl: "https://onshift-dev.vercel.app/dashboard/schedule",
                });
              }}
              className="bg-white rounded-md flex items-center justify-center text-black text-sm hover:bg-stone-100 transtion duration-300 border-2 border-black border-opacity-50 w-full"
            >
              <Image
                className="mr-2"
                height={40}
                width={40}
                alt="google"
                src={"/static/svg/google.svg"}
              />
              <span className="font-semibold">Continue with google</span>
            </button>
          </div>
        </div>
      </div>

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
    </div>
  );
};

export default SignUpPage;
