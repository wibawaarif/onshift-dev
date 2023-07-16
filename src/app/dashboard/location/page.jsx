"use client";

import { useState } from "react";
import { Input, Modal, message, ConfigProvider } from "antd";
import Image from "next/image";
import useSWR from 'swr';
import { useSession } from "next-auth/react";

const fetcher = ([url, token]) => fetch(url, { headers: { "authorization" : "Bearer " + token } }).then(res => res.json())

const Location = () => {
  const [locationModal, setLocationModal] = useState(false);
  const [form, setForm] = useState({
    name: '',
    address: '',
  })

  const session = useSession();

  let { data: locations, error, isLoading, mutate } = useSWR(["http://localhost:3000/api/locations", session.data.user.accessToken], fetcher)

  const addLocation = async () => {
    setLocationModal(false)
    await fetch('http://localhost:3000/api/locations', {
      method: "POST",
      body: JSON.stringify(form),
      headers: {
        "authorization" : "Bearer " + session.data.user.accessToken
      }
    });
    mutate([...locations, form]);

    message.success('Location created')
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#191407",
        },
      }}
    >
      <div className="flex-1 flex flex-col">
        <div className="h-[71px] flex justify-between items-center px-8 py-1 border-b-[1px] border-[#E5E5E3]">
          <div className="w-48 flex">
            <Input
              placeholder="Location name"
              className="rounded-sm"
              prefix={
                <Image width={20} height={20} src={"/static/svg/lup.svg"} />
              }
            />
          </div>
        </div>

        <div className="flex-1">
          <div className="px-8 py-8">
            <p className="text-2xl font-medium">Locations ({locations?.length})</p>

            {
              locations && locations.map((x, index) => (
                <div key={index} className="h-full w-full mt-6">
                <div className="w-[407px] h-[250px] border-[1px] border-[#E5E5E3]">
                  <div className="px-4 py-4 flex justify-between">
  
                    <div className="flex flex-col">
                      <p>{x.name}</p>
                      <p className="mt-2 text-xs font-light">{x.address}</p>
                      {/* <p className="mt-5">+1 212 435 6466</p> */}
                    </div>
  
                    <div>
                      <Image
                        className="hover:bg-[#E5E5E3] rotate-90 rounded-xl py-[1px] cursor-pointer transition duration-300"
                        width={20}
                        height={20}
                        alt="action-icon"
                        src={"/static/svg/action.svg"}
                      />
                    </div>
                  </div>
                </div>
              </div>
              ))
            }
          </div>
        </div>
      </div>

      {/* MODAL ADD NEW SHIFT / TIME OFF */}
      <Modal
        footer={[
          <button
            className="mr-3 hover:bg-[#E5E5E3] px-4 py-1 border-[1px] border-[#E5E5E3] rounded-sm"
            key="back"
            onClick={() => setShiftModal(false)}
          >
            CANCEL
          </button>,
          <button
            onClick={addLocation}
            className="bg-black text-white rounded-sm px-4 py-1 hover:opacity-80"
            key="submit"
          >
            CREATE
          </button>,
        ]}
        title="Create Location"
        open={locationModal}
        onCancel={() => setLocationModal(false)}
      >
        <div className="mt-4">
          <span className="text-xs font-semibold">LOCATION NAME</span>
          <Input
            onChange={e => setForm(prev => { return {...prev, name: e.target.value} })}
            className="rounded-none border-t-0 border-l-0 border-r-0"
            placeholder="e.g My Location"
          />
        </div>

        <div className="mt-4">
          <span className="text-xs font-semibold">ADDRESS</span>
          <Input
            onChange={e => setForm(prev => { return {...prev, address: e.target.value} })}
            className="rounded-none border-t-0 border-l-0 border-r-0"
            placeholder="e.g Silicon Valley B.320"
          />
        </div>
      </Modal>

      <button
        onClick={() => setLocationModal(true)}
        className="hover:opacity-80 transition duration-300 absolute bottom-10 right-10 w-[180px] h-[40px] bg-black text-white rounded-full text-[14px]"
      >
        + CREATE LOCATION
      </button>
    </ConfigProvider>
  );
};

export default Location;
