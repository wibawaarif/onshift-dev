"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { message, ConfigProvider, Input, Spin, Checkbox } from "antd";
import { MailOutlined, LockOutlined, GoogleOutlined } from "@ant-design/icons";

const SignUpPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [messageApi, contextHolder] = message.useMessage();
  const [spin, setSpin] = useState(false);

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
        callbackUrl: `/dashboard/schedule`,
      });
    }
  };

  return (
    <ConfigProvider
    theme={{
      token: {
        colorPrimary: "#191407",
      },
    }}
  >
    <div className="bg-[#FAFAFA] flex flex-col justify-center items-center h-screen w-screen">
      {contextHolder}

      <div className="w-full h-12 px-28 flex items-center shadow-md">
        <p className="font-bold text-xl">onshift</p>
      </div>

      <div className="flex flex-1 w-full">
        <div className="bg-black w-1/2 h-full flex justify-center items-center">
          <Image
            height={404}
            width={559}
            alt="OnShift"
            src={"/static/img/onshift.png"}
          />
        </div>

        <div className="w-1/2 h-full flex justify-center items-center">
          <div className="w-[531px] h-[520px] shadow-lg px-6 py-6">
            <p className="text-3xl font-bold text-left mt-2">Let's Get Started 🚀</p>
            <p className="mt-2">Create your account</p>

            <div className="mt-6">
              <span>Email</span>
              <Input
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                prefix={<MailOutlined />}
                className="py-2"
              />
            </div>

            <div className="mt-5">
              <span>Password</span>
              <Input.Password
                onChange={(e) => setPassword(e.target.value)}
                prefix={<LockOutlined />}
                placeholder="Enter your password"
                className="py-2"
              />
            </div>

            <ConfigProvider
              theme={{
                token: {
                  colorPrimary: "#1677ff",
                },
              }}
            >
              <button
                        onClick={() => createAccount()}
                className="mt-8 w-full h-[50px] bg-[#000000FF] text-white rounded-[8px]"
              >
                {spin ? <Spin /> : "Continue"}
              </button>
              <p className="text-center mt-4">Or sign up with</p>
              <button
              prefix={<GoogleOutlined />}
                className="mt-3 w-full h-[50px] bg-[#DB4437] text-white rounded-[8px]"
              >
                Sign up with Google
              </button>
            </ConfigProvider>
            <div className="text-center mt-4">
              <Link href="/signin">
                Already have an account yet?{" "}
                <span className="hover:underline text-blue-500">
                  Sign In
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </ConfigProvider>
    // <div className="flex w-screen h-screen">
    //   <div className="w-[50%] h-full bg-white flex flex-col justify-start items-center">
    //     <div className="flex justify-start w-[60%] pt-8">
    //       <Image
    //         height={27}
    //         width={130}
    //         alt="OnShift"
    //         src={"/static/svg/onshift.svg"}
    //       />
    //     </div>
    //     <div className="h-[80%] w-[60%] flex flex-col">
    //       <div className="flex flex-col w-full mt-16">
    //         <p className="text-3xl font-semibold">Sign Up</p>
    //       </div>

    //       <div className="w-full mt-10">
    //         <div className="flex flex-col w-full">
    //           <p>Name</p>
    //           <input
    //             onChange={(e) => setName(e.target.value)}
    //             placeholder="Enter name"
    //             className="border-[1px] mt-1 rounded-lg text-black border-black border-opacity-50 h-[48px] px-4 py-1"
    //             type="email"
    //           />
    //         </div>

    //         <div className="flex flex-col w-full mt-4">
    //           <p>Email</p>
    //           <input
    //             onChange={(e) => setEmail(e.target.value)}
    //             placeholder="Enter mail"
    //             className="border-[1px] mt-1 rounded-lg text-black border-black border-opacity-50 h-[48px] px-4 py-1"
    //             type="email"
    //           />
    //         </div>

    //         <div className="flex flex-col w-full mt-4">
    //           <p>Password</p>
    //           <input
    //             onChange={(e) => setPassword(e.target.value)}
    //             placeholder="Password"
    //             className="border-[1px] mt-1 rounded-lg text-black border-black border-opacity-50 h-[48px] px-4 py-1"
    //             type="password"
    //           />
    //         </div>
    //       </div>

    //       <button
    //         onClick={() => createAccount()}
    //         className="bg-[#1A3447] text-white mt-6 rounded-lg transtion duration-300 hover:opacity-80 border-2 border-black border-opacity-50 lg:w-full lg:h-[52px]"
    //       >
    //         Sign Up
    //       </button>

    //       <p className="text-sm mt-3 text-center">
    //         Already have an account?{" "}
    //         <Link
    //           className="hover:underline text-[#1A3447] font-bold"
    //           href="/signin"
    //         >
    //           {" "}
    //           Sign in
    //         </Link>
    //       </p>

    //       <Divider>or</Divider>

    //       <div className="flex h-[52px] justify-between w-full">
    //         <button
    //           onClick={() => {
    //             signIn("google", {
    //               callbackUrl: `/dashboard/schedule`,
    //             });
    //           }}
    //           className="bg-white rounded-md flex items-center justify-center text-black text-sm hover:bg-stone-100 transtion duration-300 border-2 border-black border-opacity-50 w-full"
    //         >
    //           <Image
    //             className="mr-2"
    //             height={40}
    //             width={40}
    //             alt="google"
    //             src={"/static/svg/google.svg"}
    //           />
    //           <span className="font-semibold">Continue with google</span>
    //         </button>
    //       </div>
    //     </div>
    //   </div>

    //   <div className="w-[50%] h-full bg-[#F8F8F8] flex flex-col justify-center items-center">
    //     <Image
    //       className="ml-24"
    //       height={600}
    //       width={600}
    //       alt="OnShift"
    //       src={"/static/svg/brand-illustration-1.svg"}
    //     />

    //     <div className="h-[7px] w-[425px] rounded-full bg-[#D9D9D9]" />
    //     <div className="h-[7px] w-[425px] rounded-full bg-[#D9D9D9] mt-[30px]" />
    //     <div className="h-[7px] w-[425px] rounded-full bg-[#D9D9D9] mt-[30px]" />
    //     <div className="h-[7px] w-[425px] rounded-full bg-[#D9D9D9] mt-[30px]" />
    //   </div>
    // </div>
  );
};

export default SignUpPage;
