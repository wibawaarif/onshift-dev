"use client"

import { useState, useEffect } from "react";
import { Input, Avatar, Modal, Select, Tabs, Checkbox } from "antd";
import { ConfigProvider } from "antd";
import Image from "next/image";


const PositionComponent = async () => {
  const listOfEmployees = [
    {
      employeeDetail: {
        name: "Arif Wibawa",
        totalHours: "12hr",
      },
      schedules: [
        {
          id: "h7yUg1iD4cSISD",
          name: "Austin",
          time: "1:00A - 5:00P",
          total: "7hrs",
        },
        {
          id: "DUvZnxWuK14co90ZlDQZ",
          name: "Jessie",
          time: "1am to 5pm",
          total: "89hrs",
        },
        {
          id: "4B58mk3Oi",
          name: "Irene",
          time: "11am to 7pm",
          total: "38hrs",
        },
        {
          id: "ss0IBd6bIvfn0",
          name: "Ernest",
          time: "11am to 5pm",
          total: "17hrs",
        },
        {
          id: "nO4wLQVEUOwRC",
          name: "Sallie",
          time: "12am to 10pm",
          total: "9hrs",
        },
        {
          id: "zsJS3WkAHEeXb7E4nMqs",
          name: "Isabelle",
          time: "12am to 10pm",
          total: "7hrs",
        },
        {
          id: "JYnaeCT6ZuXafu",
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
          id: "z2EnspI7zkLOkQU7yd",
          name: "Lettie",
          time: "10am to 2pm",
          total: "71hrs",
        },
        {
          id: "1QINY",
          name: "Blanche",
          time: "5am to 7pm",
          total: "91hrs",
        },
        {
          id: "ZzPfEddIP86G",
          name: "Alta",
          time: "11am to 9pm",
          total: "69hrs",
        },
        {
          id: "hbfFNEqsn430nXyf",
          name: "Linnie",
          time: "6am to 6pm",
          total: "88hrs",
        },
        {
          // name: "Genevieve",
          // time: "3am to 4pm",
          // total: "99hrs",
        },
        {
          id: "fZf6GnLVyrmImJ2nmbwp",
          name: "Genevieve",
          time: "5am to 6pm",
          total: "72hrs",
        },
        {
          id: "datxunAzma3K0EYa",
          name: "Craig",
          time: "12am to 1pm",
          total: "57hrs",
        },
      ],
    },
    {
      employeeDetail: {
        name: "Martin Lex",
        totalHours: "10hr",
      },
      schedules: [
        {},
        {},
        {
          id: "ZzPfEddIP86G",
          name: "Alta",
          time: "11am to 9pm",
          total: "69hrs",
        },
        {
          id: "hbfFNEqsn430nXyf",
          name: "Linnie",
          time: "6am to 6pm",
          total: "88hrs",
        },
        {
          // name: "Genevieve",
          // time: "3am to 4pm",
          // total: "99hrs",
        },
        {
          id: "fZf6GnLVyrmImJ2nmbwp",
          name: "Genevieve",
          time: "5am to 6pm",
          total: "72hrs",
        },
        {
          id: "datxunAzma3K0EYa",
          name: "Craig",
          time: "12am to 1pm",
          total: "57hrs",
        },
      ],
    },
  ];
  const [positionModal, setPositionModal] = useState(false);
  const [avatarColor, setAvatarColor] = useState("#FFFFFF");
  const [filterValue, setFilterValue] = useState("")
  const [filterList, setFilterList] = useState(listOfEmployees)
  const avatarHexColor = [
    "#FFFFFF",
    "#E5E5E3",
    "#A7A7A7",
    "#7D7D80",
    "#646466",
  ];
  const wageType = [{ value: "Hourly", label: "Hourly" }];


  useEffect(() => {
    const filteredList = listOfEmployees.filter(x => x.employeeDetail.name.toLowerCase().includes(filterValue.toLowerCase()))

    setFilterList(filteredList)

    }, [filterValue])

  const checklist = (
    <Image
      width={16}
      height={16}
      alt="checklist-icon"
      src={"/static/svg/checklist.svg"}
    />
  );

  const addPosition = () => {
    console.log("test");
  };

  const checkedEmployee = e => {
    console.log(e.target)
  }

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
                      alt="action-icon"
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
            CLOSE
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
        <Tabs
          defaultActiveKey="1"
          items={[
            {
              key: "1",
              label: "PROFILE",
              children: (
                <>
                  <div className="mt-1">
                    <span className="text-xs font-semibold">POSITION NAME</span>
                    <Input
                      className="rounded-none border-t-0 border-l-0 border-r-0"
                      placeholder="e.g Phlebotomist"
                    />
                  </div>

                  <div className="mt-4">
                    <span className="text-xs font-semibold">COLOR</span>
                    <div className="border-b-[1px] border-[#E5E5E3] flex py-2 mt-1">
                      {avatarHexColor.map((x, index) => (
                        <Avatar
                          key={index}
                          onClick={() => setAvatarColor(x)}
                          className={`flex mr-1 cursor-pointer justify-center items-center ${
                            x === "#FFFFFF"
                              ? "border-[1px] border-[#E5E5E3]"
                              : undefined
                          } bg-[${x}]`}
                          size={24}
                        >
                          {avatarColor === x && checklist}
                        </Avatar>
                      ))}
                    </div>
                  </div>

                  <div className="flex mt-4 justify-between">
                    <div className="w-[48%] flex flex-col">
                      <span className="text-xs font-semibold">WAGE TYPE</span>
                      <Select
                        placeholder="Select wage type"
                        className="mt-1"
                        options={wageType}
                      />
                    </div>
                    <div className="w-[48%] flex flex-col">
                      <span className="text-xs font-semibold">WAGE AMOUNT</span>
                      <Input
                        className="rounded-none border-t-0 border-l-0 border-r-0"
                        suffix="usd per hour"
                      />
                    </div>
                  </div>

                  <p className="mt-4 text-sm leading-tight">
                    *Default wage that is displayed in all employees profiles on
                    this position, until custom wage is specified
                  </p>
                </>
              ),
            },
            {
              key: "2",
              label: "EMPLOYEES",
              children: (
                <>
                <Input
                  onChange={(e) => e.preventDefault(setFilterValue(e.target.value))}
                  placeholder="Employee name"
                  className="rounded-sm"
                  prefix={
                    <Image width={20} height={20} src={"/static/svg/lup.svg"} />
                  }
                />
                <div className="mt-6">
                  {
                    filterList.map((x, index) => (
                      <div key={index} className="flex justify-between items-center h-[57px] border-t-[1px] border-[#E5E5E3]">
                      <Checkbox name={x.employeeDetail} onChange={checkedEmployee} className="font-semibold">{x.employeeDetail.name}</Checkbox>
                      <div className="hover:bg-[#E5E5E3] cursor-pointer rounded-full px-1 py-1">
                      <Image
                        width={20}
                        height={20}
                        alt="trash-logo"
                        src={"/static/svg/trash.svg"}
                      />
                      </div>
                  </div>
                    ))
                  }
                </div>
                </>
              ),
            },
          ]}
        />
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

export default PositionComponent;