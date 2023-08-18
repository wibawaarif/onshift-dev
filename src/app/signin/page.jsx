"use client";

import { useSearchParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { message, Input, Checkbox, ConfigProvider, Spin } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import Link from "next/link";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [messageApi, contextHolder] = message.useMessage();
  const [spin, setSpin] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();
  const session = useSession();

  useEffect(() => {
    if (searchParams.toString().split("=")[0] === "message") {
      message.error(searchParams.toString().split("=")[1].replace(/\+/g, " "));
    }
  }, [searchParams]);

  if (session.status === "loading") {
    return <p>Loading...</p>;
  }

  if (session.status === "authenticated") {
    router?.push("/dashboard/schedule");
    return;
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
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
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
              <p className="text-3xl font-bold text-center mt-2">Sign in</p>

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

              <div className="flex justify-between mt-5">
                <Checkbox>Remember me</Checkbox>

                <span className="hover:underline hover:cursor-pointer">
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
                  Don't have an account yet?{" "}
                  <span className="hover:underline text-blue-500">
                    Create one.
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

export default SignIn;
