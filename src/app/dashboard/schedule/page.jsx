"use client";

import SchedulerComponent from "@/components/scheduler/page";
import { Radio, Modal, Tabs, ConfigProvider, DatePicker, TimePicker } from "antd";
import { useState } from "react";
import "./style.css";
const Scheduler = () => {
  const [type, setType] = useState("week");
  const [shiftModal, setShiftModal] = useState(false);

  const addShift = () => {
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
      <div className="flex flex-col flex-1">
        <div className="border-b-[1px] border-[#E5E5E3] h-[71px]"></div>

        <div className="flex flex-1">
          <div className="h-full w-[202px] border-r-[1px] border-[#E5E5E3]"></div>

          <div className="flex-1">
            <SchedulerComponent type={type} />
          </div>
        </div>

        {/* <Radio.Group onChange={(e) => setType(e.target.value)} defaultValue="week" buttonStyle="solid">
      <Radio.Button value="day">Day</Radio.Button>
      <Radio.Button value="week">Week</Radio.Button>
      <Radio.Button value="month">Month</Radio.Button>
    </Radio.Group> */}

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
          title="Create New Shift"
          open={shiftModal}
          onOk={addShift}
          onCancel={() => setShiftModal(false)}
        >
          <Tabs
            defaultActiveKey="1"
            items={[
              {
                key: "1",
                label: "CREATE SHIFT",
                children: <div>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold">DATE</span>
                    <DatePicker className="w-full mt-1" />
                  </div>

                  <div className="flex mt-4 justify-between">
                    <div className="w-[48%] " >
                    <span className="text-xs font-semibold">START SHIFT</span>
                  <TimePicker className="w-full"  />
                  </div>
                  <div className="w-[48%]" >
                  <span className="text-xs font-semibold">FINISH SHIFT</span>
                  <TimePicker className="w-full"  />
                  </div>
                  </div>
                </div>,
              },
              {
                key: "2",
                label: "CREATE TIME OFF",
                children: <div>
                  <DatePicker />
                </div>,
              },
            ]}
          />
        </Modal>

        <button
          onClick={() => setShiftModal(true)}
          className="hover:opacity-80 transition duration-300 absolute bottom-10 right-10 w-[220px] h-[40px] bg-black text-white rounded-full text-[14px]"
        >
          + CREATE SHIFT / TIME OFF
        </button>
      </div>
    </ConfigProvider>
  );
};

export default Scheduler;
