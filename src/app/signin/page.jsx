"use client";

import { useSearchParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { message, Input, Checkbox, ConfigProvider, Spin } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import Link from "next/link";
import LoadingPage from "@/components/LoadingPage/page";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [messageApi, contextHolder] = message.useMessage();
  const [spin, setSpin] = useState(false);
  const [remember, setRemember] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();
  const session = useSession();

  useEffect(() => {
    if (searchParams.toString().split("=")[0] === "message") {
      message.error(searchParams.toString().split("=")[1].replace(/\+/g, " "));
    }
  }, [searchParams]);

  if (session.status === "loading") {
    return <LoadingPage />;
  }

  if (session.status === "authenticated") {
    if (!session.data.user.workspace) {
      router?.push("/accounts")
      return
    }
    router?.push("/dashboard/schedule");
    return;
  }

  const redirectHome = () => {
    router.push('/')
  }

  const handleForgotPassword = async () => {
    setSpin(true);

    if (email === "") {
      messageApi.open({
        type: "error",
        content: "Email cannot be empty",
      });
      return;
    }
    const response = await fetch("api/forgot-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
      }),
    });

    const data = await response.json();
    setSpin(false);
    if (data === "Email not found") {
      message.error(data);
      return;
    } else {
      message.success("Password Successfully Updated");
      setIsForgotPassword(false);
      clearFields();
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSpin(true);

    if (password === "" || email === "") {
      messageApi.open({
        type: "error",
        content: "Email or password cannot be empty",
      });
      return;
    }

    try {
      const res = await signIn(
        "credentials",
        {
          email,
          password,
          redirect: false,
        },
        { remember }
      );
      setSpin(false);
      if (res?.error == null) {
        router.push("/dashboard/schedule");
      } else {
        messageApi.open({
          type: "error",
          content: res?.error,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const clearFields = () => {
    setEmail("");
    setPassword("");
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

        <div onClick={() => redirectHome()} className="w-full cursor-pointer h-12 px-28 justify-center md:justify-normal lg:justify-normal flex items-center shadow-md">
          <p className="font-bold text-xl">onshift</p>
        </div>

        <div className="w-[90%] md:hidden lg:hidden h-full flex justify-center items-center">
            <div className={`${isForgotPassword ? 'h-[350px]' : 'h-[520px]'} w-[531px] shadow-lg px-6 py-6`}>
            <p className="text-3xl font-bold text-center mt-2">
                  {isForgotPassword ? "Forgot Password" : "Sign In"}
                </p>
              {isForgotPassword ? (
                <>
                                <div className="mt-6">
                  <span>Email</span>
                  <Input
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    value={email}
                    prefix={<MailOutlined />}
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
                    onClick={handleForgotPassword}
                    className="mt-5 w-full h-[50px] bg-[#000000FF] text-white rounded-[8px]"
                  >
                    {spin ? <Spin /> : "Reset Password"}
                  </button>
                </ConfigProvider>

                <div className="text-center mt-4">
              <div>
                Already have an account?{" "}
                <span onClick={() => setIsForgotPassword(false) & clearFields()} className="hover:underline hover:cursor-pointer text-blue-500">
                  Sign In
                </span>
              </div>
            </div>
                </>
              ) : (
                <>
                <div className="mt-6">
                  <span>Email</span>
                  <Input
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    value={email}
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

                <div className="flex justify-between mt-5">
                  <Checkbox
                    value={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                  >
                    Remember me
                  </Checkbox>

                  <span
                    onClick={() => setIsForgotPassword(true) & clearFields()}
                    className="hover:underline hover:cursor-pointer"
                  >
                    Forgot password?
                  </span>
                </div>

                <ConfigProvider
                  theme={{
                    token: {
                      colorPrimary: "#1677ff",
                    },
                  }}
                >
                  <button
                    onClick={handleSubmit}
                    className="mt-8 w-full h-[50px] bg-[#000000FF] text-white rounded-[8px]"
                  >
                    {spin ? <Spin /> : "Sign in"}
                  </button>
                </ConfigProvider>
                <div className="text-center mt-4">
                  <Link href="/signup">
                    Don&apos;t have an account yet?{" "}
                    <span className="hover:underline text-blue-500">
                      Create one.
                    </span>
                  </Link>
                </div>
              </>
              )}
            </div>
          </div>

        <div className="hidden md:flex lg:flex flex-1 w-full">
          <div className="bg-black w-1/2 h-full flex justify-center items-center">
            <Image
              height={404}
              width={559}
              alt="OnShift"
              src={"/static/img/onshift.png"}
            />
          </div>

          <div className="w-1/2 h-full flex justify-center items-center">
            <div className={`${isForgotPassword ? 'h-[350px]' : 'h-[520px]'} w-[531px] shadow-lg px-6 py-6`}>
            <p className="text-3xl font-bold text-center mt-2">
                  {isForgotPassword ? "Forgot Password" : "Sign In"}
                </p>
              {isForgotPassword ? (
                <>
                                <div className="mt-6">
                  <span>Email</span>
                  <Input
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    value={email}
                    prefix={<MailOutlined />}
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
                    onClick={handleForgotPassword}
                    className="mt-5 w-full h-[50px] bg-[#000000FF] text-white rounded-[8px]"
                  >
                    {spin ? <Spin /> : "Reset Password"}
                  </button>
                </ConfigProvider>

                <div className="text-center mt-4">
              <div>
                Already have an account?{" "}
                <span onClick={() => setIsForgotPassword(false) & clearFields()} className="hover:underline hover:cursor-pointer text-blue-500">
                  Sign In
                </span>
              </div>
            </div>
                </>
              ) : (
                <>
                <div className="mt-6">
                  <span>Email</span>
                  <Input
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    value={email}
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

                <div className="flex justify-between mt-5">
                  <Checkbox
                    value={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                  >
                    Remember me
                  </Checkbox>

                  <span
                    onClick={() => setIsForgotPassword(true) & clearFields()}
                    className="hover:underline hover:cursor-pointer"
                  >
                    Forgot password?
                  </span>
                </div>

                <ConfigProvider
                  theme={{
                    token: {
                      colorPrimary: "#1677ff",
                    },
                  }}
                >
                  <button
                    onClick={handleSubmit}
                    className="mt-8 w-full h-[50px] bg-[#000000FF] text-white rounded-[8px]"
                  >
                    {spin ? <Spin /> : "Sign in"}
                  </button>
                </ConfigProvider>
                <div className="text-center mt-4">
                  <Link href="/signup">
                    Don&apos;t have an account yet?{" "}
                    <span className="hover:underline text-blue-500">
                      Create one.
                    </span>
                  </Link>
                </div>
              </>
              )}
            </div>
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default SignIn;
