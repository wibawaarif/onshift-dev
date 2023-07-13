"use client";

import { useState } from "react";
import { Input, Avatar, Modal } from "antd";
import { ConfigProvider } from "antd";
import Image from "next/image";

const Position = () => {
  const [positionModal, setPositionModal] = useState(false);

  const addPosition = () => {
    console.log("test");
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
              placeholder="Position name"
              className="rounded-sm"
              prefix={
                <Image width={20} height={20} src={"/static/svg/lup.svg"} />
              }
            />
          </div>
        </div>

        <div className="flex-1">
          <div className="px-8 py-8">
            <p className="text-2xl font-medium">Positions (1)</p>

            <div className="h-full w-full mt-6">
              <div className="w-[300px] h-[97px] border-[1px] border-[#E5E5E3]">
                <div className="px-4 py-4 flex justify-between">
                  <div>
                    <Avatar />
                  </div>

                  <div className="flex flex-col">
                    <p>Surgical Technologist</p>
                    <p className="mt-2 text-xs font-light">10 EMPLOYEES</p>
                  </div>

                  <div>
                    <Image
                      className="hover:bg-[#E5E5E3] rotate-90 rounded-xl py-[1px] cursor-pointer transition duration-300"
                      width={20}
                      height={20}
                      src={"/static/svg/action.svg"}
                    />
                  </div>
                </div>
              </div>
            </div>
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
            className="bg-black text-white rounded-sm px-4 py-1 hover:opacity-80"
            key="submit"
          >
            CREATE
          </button>,
        ]}
        title="Create Position"
        open={positionModal}
        onOk={addPosition}
        onCancel={() => setPositionModal(false)}
      >
        <div className="mt-4">
          <span className="text-xs font-semibold">POSITION NAME</span>
          <Input
            className="rounded-none border-t-0 border-l-0 border-r-0"
            placeholder="e.g Phlebotomist"
          />
        </div>
      </Modal>

      <button
        onClick={() => setPositionModal(true)}
        className="hover:opacity-80 transition duration-300 absolute bottom-10 right-10 w-[180px] h-[40px] bg-black text-white rounded-full text-[14px]"
      >
        + CREATE POSITION
      </button>
    </ConfigProvider>
  );
};

export default Position;
