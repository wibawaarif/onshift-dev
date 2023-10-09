"use client";

import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import { message, Input, Checkbox, ConfigProvider, Spin, Select } from "antd";
import { BsBuilding } from "react-icons/bs";
import { SlLocationPin } from "react-icons/sl";
import { MdKeyboardBackspace } from "react-icons/md";
import useSWR from "swr";
import PlaceComponent from "@/components/place-autocomplete/page";
import LoadingPage from "@/components/LoadingPage/page";

const fetcher = ([url, token]) =>
  fetch(url, { headers: { authorization: "Bearer " + token } }).then((res) =>
    res.json()
  );

const SignIn = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [address, setAddress] = useState(null);
  const [form, setForm] = useState({
    name: "",
    totalEmployees: "",
    industry: "",
    address: "",
  });
  const [latitude, setLatitude] = useState(24.432928);
  const [longitude, setLongitude] = useState(54.644539);
  const [messageApi, contextHolder] = message.useMessage();
  const [spin, setSpin] = useState(false);
  const searchParams = useSearchParams();
  const session = useSession();
  const router = useRouter();

  let { data: workspaces } = useSWR(
    [`/api/workspaces`, session?.data?.user?.accessToken],
    fetcher
  );

  if (session.status === "loading") {
    return <LoadingPage />;
  }

  if (session.status === "unauthenticated") {
    signOut({ callbackUrl: "/signin?message=Unauthorized" });
    return;
  }

  const onSearch = (value) => {

  };

  // Filter `option.label` match the user type `input`
  const filterOption = (input, option) =>
    (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  const addToSession = (workspace) => {
    session.update({
      workspace,
    })
    router.push('/dashboard/schedule')
  }

  const handleSubmit = async () => {
    setSpin(true);

    try {
      const data = await fetch(`/api/workspaces`, {
        method: "POST",
        body: JSON.stringify({
          ...form,
          address,
        }),
        headers: {
          authorization: "Bearer " + session?.data?.user?.accessToken,
        },
      });

      const res = await data.json();
      setSpin(false);

      if (res.error === "Workspace already exists") {
        message.error("Workspace already exists");
        return;
      }
      router.push("/dashboard/schedule");

      message.success("Workspace created");

    } catch (error) {
      console.error(error);
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
            <div className="h-[450px] w-[531px] flex items-center relative flex-col shadow-lg px-6 py-6">
              {(currentStep === 2 || currentStep === 3) && (
                <div
                  onClick={currentStep === 2 ? () => setCurrentStep(1) : () => setCurrentStep(2)}
                  className="absolute top-4 left-6 flex items-center h-8"
                >
                  <MdKeyboardBackspace />
                  <span className="ml-1 text-sm hover:underline hover:cursor-pointer">
                    Back
                  </span>
                </div>
              )}

              <p
                className={`text-3xl font-bold text-center ${
                  currentStep === 1 ? "mt-2" : "mt-8"
                }`}
              >
                {currentStep === 1
                  ? "My Workspaces"
                  : currentStep === 2
                  ? "Create Workspace"
                  : "Tell Us About Your Workspace"}
              </p>
              {currentStep !== 1 && (
                <p className="text-center text-sm w-96 mt-8 text-[#535a61]">
                  Creating a new workplace for your business is a piece of cake!
                  Just fill in the info below and you&apos;re good to go.
                </p>
              )}
              {currentStep === 1 ?
               (
                <div className="grid grid-cols-3 gap-4 w-full px-6 mt-6 h-[200px] overflow-y-auto">
                  {
                     workspaces?.length === 0 ? <div className="col-span-3 flex justify-center"><p className="text-stone-300">There is no any workspace yet!</p></div> : workspaces?.map((x, index) => 
                      <div key={index} className="w-32 h-48 flex flex-col items-center">
                      <Image
                        onClick={() => addToSession(x.name)}
                        className="cursor-pointer"
                        height={404}
                        width={559}
                        alt="OnShift"
                        src={"/static/img/workspace.png"}
                      />
                  <p className="text-black text-sm mt-2">{x?.name}</p>
                    </div>
                    )
                  }
                </div>
              ) : currentStep === 2 ? (
                <>
                  <div className="mt-6 w-full">
                    <span>Company Name</span>
                    <Input
                      onChange={(e) =>
                        setForm((prev) => {
                          return { ...prev, name: e.target.value };
                        })
                      }
                      prefix={<BsBuilding />}
                      placeholder="Enter your company name"
                      className="py-2"
                    />
                  </div>

                  <div className="mt-4 w-full">
                    <span>Workspace Address</span>
                    <PlaceComponent
                      address={address}
                      setAddress={setAddress}
                      setLatitude={setLatitude}
                      setLongitude={setLongitude}
                      style="w-full px-7 py-1 border-[1px] h-10 text-sm placeholder-[#bec1ca] rounded-[6px] border-[#E5E5E3]"
                    >
                      <SlLocationPin className="absolute top-3 left-[10px]" />
                    </PlaceComponent>
                  </div>
                </>
              ) : (
                <>
                  <div className="mt-6 w-full flex flex-col">
                    <span>Number of Employees</span>
                    <Select
                      showSearch
                      prefixCls="test"
                      placeholder="Select number of employees"
                      optionFilterProp="children"
                      className="h-10"
                      onChange={(value) =>
                        setForm((prev) => {
                          return { ...prev, totalEmployees: value };
                        })
                      }
                      onSearch={onSearch}
                      filterOption={filterOption}
                      options={[
                        {
                          value: "10",
                          label: "10",
                        },
                        {
                          value: "100",
                          label: "100",
                        },
                        {
                          value: "1000",
                          label: "1000",
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
                      onChange={(value) =>
                        setForm((prev) => {
                          return { ...prev, industry: value };
                        })
                      }
                      onSearch={onSearch}
                      filterOption={filterOption}
                      options={[
                        {
                          value: "agriculture",
                          label: "Agriculture",
                        },
                        {
                          value: "mining",
                          label: "Mining",
                        },
                        {
                          value: "trade",
                          label: "Trade",
                        },
                        {
                          value: "transport",
                          label: "Transport",
                        },
                        {
                          value: "finance",
                          label: "Finance",
                        },
                      ]}
                    />
                  </div>
                </>
              )}
              {currentStep === 1 ? (
                <button
                  onClick={() => setCurrentStep(2)
                  }
                  className="mt-8 w-full h-[50px] bg-[#000000FF] text-white rounded-[8px]"
                >
                  Create a New Workspace
                </button>
              ) : (
                <button
                  onClick={
                    currentStep === 2
                      ? () => setCurrentStep(3)
                      : () => handleSubmit()
                  }
                  className="mt-8 w-full h-[50px] bg-[#000000FF] text-white rounded-[8px]"
                >
                  {spin ? <Spin /> : "Start Scheduling"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default SignIn;
