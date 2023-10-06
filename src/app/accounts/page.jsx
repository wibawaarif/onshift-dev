"use client";

import { useSearchParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { message, Input, Checkbox, ConfigProvider, Spin, Select } from "antd";
import { BsBuilding } from "react-icons/bs"
import { SlLocationPin } from "react-icons/sl"
import { MdKeyboardBackspace } from "react-icons/md"
import Link from "next/link";
import PlaceComponent from "@/components/place-autocomplete/page";
import LoadingPage from "@/components/LoadingPage/page";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [address, setAddress] = useState(null);
  const [latitude, setLatitude] = useState(24.432928);
  const [longitude, setLongitude] = useState(54.644539);
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
    return <LoadingPage />;
  }

  if (session.status === "authenticated") {
    router?.push("/dashboard/schedule");
    return;
  }

  const onChange = (value) => {
    console.log(`selected ${value}`);
  };
  const onSearch = (value) => {
    console.log('search:', value);
  };
  
  // Filter `option.label` match the user type `input`
  const filterOption = (input, option) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

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
        console.log(res); // Acc
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
            <div className="h-[450px] w-[531px] flex items-center relative flex-col shadow-lg px-6 py-6">
              {
                currentStep === 2 && 
                <div onClick={() => setCurrentStep(1)} className="absolute top-4 left-6 flex items-center h-8">
                <MdKeyboardBackspace />
                  <span className="ml-1 text-sm hover:underline hover:cursor-pointer">Back</span>
                </div>
              }

            <p className={`text-3xl font-bold text-center ${currentStep === 1 ? 'mt-2' : 'mt-8'}`}>
              {
                currentStep === 1 ? "Create Workspace" : "Tell Us About Your Workspace"
              }
                </p>
              <p className="text-center text-sm w-96 mt-8 text-[#535a61]">Creating a new workplace for your business is a piece of cake! Just fill in the info below and you&apos;re good to go.</p>
              {
                currentStep === 1 ? 
                <>
                <div className="mt-6 w-full">
                  <span>Company Name</span>
                  <Input
                    onChange={(e) => setEmail(e.target.value)}
                    prefix={<BsBuilding />}
                    placeholder="Enter your company name"
                    value={email}
                    className="py-2"
                  />
                </div>

                <div className="mt-4 w-full">
                  <span>Workspace Address</span>
                  <PlaceComponent address={address} setAddress={setAddress} setLatitude={setLatitude} setLongitude={setLongitude} style="w-full px-7 py-1 border-[1px] h-10 text-sm placeholder-[#bec1ca] rounded-[6px] border-[#E5E5E3]" >
                  <SlLocationPin className="absolute top-3 left-[10px]" />
                  </PlaceComponent>
                </div>
              </> :   <>
                <div className="mt-6 w-full flex flex-col">
                  <span>Number of Employees</span>
                  <Select
                    showSearch
                    prefixCls="test"
                    placeholder="Select number of employees"
                    optionFilterProp="children"
                    className="h-10"
                    onChange={onChange}
                    onSearch={onSearch}
                    filterOption={filterOption}
                    options={[
                      {
                        value: 'jack',
                        label: 'Jack',
                      },
                      {
                        value: 'lucy',
                        label: 'Lucy',
                      },
                      {
                        value: 'tom',
                        label: 'Tom',
                      },
                    ]}
                  />
                </div>

                <div className="mt-4 w-full flex flex-col">
                  <span>Industry</span>
                  <Select
                    showSearch
                    placeholder="Select industry"
                    optionFilterProp="children"
                    className="h-10"
                    onChange={onChange}
                    onSearch={onSearch}
                    filterOption={filterOption}
                    options={[
                      {
                        value: 'jack',
                        label: 'Jack',
                      },
                      {
                        value: 'lucy',
                        label: 'Lucy',
                      },
                      {
                        value: 'tom',
                        label: 'Tom',
                      },
                    ]}
                  />
                </div>
              </>
              }
                <button
                        onClick={currentStep === 1 ? () => setCurrentStep(2) : () => setCurrentStep(1)}
                className="mt-8 w-full h-[50px] bg-[#000000FF] text-white rounded-[8px]"
              >
                Start Scheduling
              </button>
            </div>
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default SignIn;
