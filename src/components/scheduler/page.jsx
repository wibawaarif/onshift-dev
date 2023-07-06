"use client";

import Image from "next/image";
import { Avatar } from "antd";

const SchedulerComponent = () => {
  const week = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const employees = [
    {
      employeeDetail: {
        name: "Arif Wibawa",
        totalHours: "12hr",
      },
      schedules: [
        {
          name: "Austin",
          time: "1am to 5pm",
          total: "7hrs",
        },
        {
          name: "Jessie",
          time: "1am to 5pm",
          total: "89hrs",
        },
        {
          name: "Irene",
          time: "11am to 7pm",
          total: "38hrs",
        },
        {
          name: "Ernest",
          time: "11am to 5pm",
          total: "17hrs",
        },
        {
          name: "Sallie",
          time: "12am to 10pm",
          total: "9hrs",
        },
        {
          name: "Isabelle",
          time: "12am to 10pm",
          total: "57hrs",
        },
        {
          name: "Etta",
          time: "8am to 7pm",
          total: "68hrs",
        },
      ],
    },
    {
      employeeDetail: {
        name: "John Doe",
        totalHours: "8hr",
      },
      schedules: [
        {
          name: "Lettie",
          time: "10am to 2pm",
          total: "71hrs",
        },
        {
          name: "Blanche",
          time: "5am to 7pm",
          total: "91hrs",
        },
        {
          name: "Alta",
          time: "11am to 9pm",
          total: "69hrs",
        },
        {
          name: "Linnie",
          time: "6am to 6pm",
          total: "88hrs",
        },
        {
          name: "Genevieve",
          time: "3am to 4pm",
          total: "99hrs",
        },
        {
          name: "Genevieve",
          time: "5am to 6pm",
          total: "72hrs",
        },
        {
          name: "Craig",
          time: "12am to 1pm",
          total: "57hrs",
        },
      ],
    },
    {
      employeeDetail: {
        name: "John Doe",
        totalHours: "8hr",
      },
      schedules: [
        {
          name: "Lettie",
          time: "10am to 2pm",
          total: "71hrs",
        },
        {
          name: "Blanche",
          time: "5am to 7pm",
          total: "91hrs",
        },
        {
          name: "Alta",
          time: "11am to 9pm",
          total: "69hrs",
        },
        {
          name: "Linnie",
          time: "6am to 6pm",
          total: "88hrs",
        },
        {
          name: "Genevieve",
          time: "3am to 4pm",
          total: "99hrs",
        },
        {
          name: "Genevieve",
          time: "5am to 6pm",
          total: "72hrs",
        },
        {
          name: "Craig",
          time: "12am to 1pm",
          total: "57hrs",
        },
      ],
    },
  ];

  return (
    <div className="flex justify-center">
      <div class="w-[75%] grid grid-cols-9">
        <div class="col-span-2 bg-[#F1F1F1] flex items-center px-4">
          <span className="text-slate-700">ALL EMPLOYEES</span>
        </div>

        {week.map((x) => {
          return (
            <div
              className="bg-[#DEDEDE] flex justify-center items-center h-[55px]"
              key={x}
            >
              <span className="text-slate-700">{x}</span>
            </div>
          );
        })}

        {employees.map((row, index) => (
          <>
            <div
              className="flex justify-center items-center col-span-2 bg-white h-[87px]"
              key={index}
            >
              <div className="flex justify-between p-4 h-full w-full">
                <div className="flex items-center">
                  <Avatar size={40} className="mr-2" />
                  <div className="flex flex-col justify-between">
                    <span>{row.employeeDetail.name}</span>
                    <span>{row.employeeDetail.totalHours}</span>
                  </div>
                </div>
                <Image
                  alt="action"
                  width={20}
                  height={20}
                  src={"/static/svg/action.svg"}
                />
              </div>
            </div>

            {row.schedules.map((dataItem, dataIndex) => (
              <div
                key={dataIndex}
                className={`flex flex-col py-2 px-3 col-span-1 ${
                  dataIndex === 0 ? "first-child" : ""
                } bg-[#F1F1F1] h-[87px]`}
              >
                <div className="flex flex-col h-full">
                  <span className="text-sm">{dataItem.time}</span>
                  <span className="text-xs">{dataItem.name}</span>
                </div>
                <div className="flex justify-between items-end h-full">
                  <span className="text-xs">{dataItem.total}</span>
                  <div className="flex">
                    <Image
                      alt="edit"
                      width={16}
                      height={16}
                      src={"/static/svg/edit.svg"}
                    />
                    <Image
                      alt="edit"
                      width={16}
                      height={16}
                      src={"/static/svg/copy.svg"}
                    />
                    <Image
                      alt="edit"
                      width={16}
                      height={16}
                      src={"/static/svg/trash.svg"}
                    />
                  </div>
                </div>
              </div>
            ))}
          </> 
        ))}

        <div className="col-span-9 bg-[#F9F9F9] h-[60px]">
          <div className="p-4 h-full w-full flex items-center bg-[#DEDEDE]">
            <button>+ Add Employee</button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SchedulerComponent;
