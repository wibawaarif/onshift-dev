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
    if (!session.data.user.workspace) {
      router?.push("/accounts")
      return
    }
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
        callbackUrl: `/accounts`,
      });
    }
  };

  const redirectHome = () => {
    router.push('/')
  }

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

      <div onClick={() => redirectHome()} className="w-full h-12 px-28 cursor-pointer flex justify-center md:justify-normal lg:justify-normal items-center shadow-md">
        <p className="font-bold text-xl">onshift</p>
      </div>

      <div className="w-[90%] md:hidden lg:hidden h-full flex justify-center items-center">
          <div className="w-[531px] h-[520px] shadow-lg px-6 py-6">
            <p className="text-3xl font-bold text-left mt-2">Let&apos;s Get Started 🚀</p>
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
                className="mt-8 w-full h-[50px] text-white rounded-[8px] bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                {spin ? <Spin /> : "Continue"}
              </button>
              <p className="text-center mt-4">Or sign up with</p>
              <button
               onClick={() => {
                            signIn("google", {callbackUrl: '/dashboard/schedule' });
                          }}
              prefix={<GoogleOutlined />}
                className="mt-3 w-full h-[50px] bg-[#DB4437] text-white rounded-[8px]"
              >
                Sign up with Google
              </button>
            </ConfigProvider>
            <div className="text-center mt-4">
              <Link href="/signin">
                Already have an account?{" "}
                <span className="hover:underline text-blue-500">
                  Sign In
                </span>
              </Link>
            </div>
          </div>
        </div>

      <div className="hidden lg:flex md:flex-1 w-full">
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
            <p className="text-3xl font-bold text-left mt-2">Let&apos;s Get Started 🚀</p>
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
                className="mt-8 w-full h-[50px] text-white rounded-[8px] bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                {spin ? <Spin /> : "Continue"}
              </button>
              <p className="text-center mt-4">Or sign up with</p>
              <button
               onClick={() => {
                            signIn("google", {callbackUrl: '/dashboard/schedule' });
                          }}
              prefix={<GoogleOutlined />}
                className="mt-3 w-full h-[50px] bg-[#DB4437] text-white rounded-[8px]"
              >
                Sign up with Google
              </button>
            </ConfigProvider>
            <div className="text-center mt-4">
              <Link href="/signin">
                Already have an account?{" "}
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
  );
};

export default SignUpPage;
