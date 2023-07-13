"use client";

import { ConfigProvider } from "antd";
import FilterComponent from "@/components/filter/page";
import { Input, Table, Popover, Modal } from "antd";
import Image from "next/image";
import { useState } from "react";

const Employee = () => {
  const text = <span>Title</span>;

  const content = data => (
    <div>
    <button onClick={() => deleteEmployee(data)} className="hover:bg-blue-300 py-1 px-2 rounded-lg">Delete</button>
  </div>
  )
  

  const filterExamples = [
    {
      name: "LOCATIONS / (DESELECT ALL)",
      options: ["Anaheim", "Santa Barbara"],
    },
    {
      name: "POSITIONS / (DESELECT ALL)",
      options: [
        "Surgical Tech",
        "Dentist",
        "Nurse Practitioner",
        "Phlebotomist",
      ],
    },
    {
      name: "ROLE / (DESELECT ALL)",
      options: ["Administrator", "Employee"],
    },
    {
      name: "STATUS / (DESELECT ALL)",
      options: ["Not invited", "Pending Approval", "Invited", "Joined"],
    },
  ];

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Position",
      dataIndex: "position",
    },
    {
      title: "Location",
      dataIndex: "location",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
    },
    {
      title: "Status",
      dataIndex: "status",
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (_, record) => <div>
      <Popover placement="bottomLeft" content={content(record)} trigger="click">
        <Image className="hover:bg-[#E5E5E3] rounded-xl py-[1px] cursor-pointer transition duration-300" width={20} height={20} src={"/static/svg/action.svg"} />
      </Popover>
      </div>,
    },
  ];

  const data = [
    {
      key: "1",
      name: "John Brown",
      position: "Dentis",
      location: "New York",
      email: "john.brown@gmail.com",
      phone: "+93 943 0234",
      status: "Invited",
    },
    {
      key: "2",
      name: "Jim Green",
      position: "Nurse Practitioner",
      location: "London",
      phone: "+73 943 0234",
      email: "jim.green@gmail.com",
      status: "Joined",
    },
    {
      key: "3",
      name: "Joe Black",
      position: "Surgical Technologist",
      location: "Sydney",
      phone: "+41 943 0234",
      email: "joe@gmail.com",
      status: "Not Invited",
    },
  ];

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [employeeModal, setEmployeeModal] = useState(false);
  const [action, setAction] = useState(false);

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const addEmployee = () => {
    console.log('test');
  }

  const deleteEmployee = data => {
    console.log('data', data)
  }
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#191407",
        },
      }}
    >
      <div className="flex flex-1">
        <div className="w-[202px] border-r-[1px] border-[#E5E5E3] overflow-y-auto h-[720px]">
          <FilterComponent allFilterList={filterExamples} />
        </div>

        <div className="flex-1 flex flex-col">
          <div className="h-[71px] flex justify-between items-center px-4 py-1 border-b-[1px] border-[#E5E5E3]">
            <div className="w-48 flex">
              <Input
                placeholder="Employee name"
                className="rounded-sm"
                prefix={
                  <Image width={20} height={20} src={"/static/svg/lup.svg"} />
                }
              />
            </div>

            <div className="w-max flex">
              <button className="hover:bg-[#E5E5E3] mr-3 duration-300 px-2 py-1 border-[1px] border-[#E5E5E5]">
                Import / Export
              </button>
              <button className="hover:bg-[#E5E5E3] mr-3 duration-300 px-2 py-1 border-[1px] border-[#E5E5E5]">
                Share link to join
              </button>
            </div>
          </div>

          <div className="flex-1">
            <ConfigProvider
              theme={{
                token: {
                  colorPrimary: "#1890ff",
                },
              }}
            >
              <Table
                columns={columns}
                dataSource={data}
                rowSelection={rowSelection}
                title={() => (
                  <div className="py-2">
                    <p className="text-2xl">Employees</p>
                  </div>
                )}
              />
            </ConfigProvider>
          </div>
        </div>
        <Modal
          footer={[
            <button
              className="mr-3 hover:bg-[#E5E5E3] px-4 py-1 border-[1px] border-[#E5E5E3] rounded-sm"
              key="back"
              onClick={() => setEmployeeModal(false)}
            >
              CANCEL
            </button>,
            <button
              className="bg-black text-white rounded-sm px-4 py-1 hover:opacity-80"
              key="submit"
            >
              CONFIRM
            </button>,
          ]}
          title="Delete Employee"
          open={employeeModal}
          onOk={addEmployee}
          onCancel={() => setEmployeeModal(false)}
        > 
          <p>Are you sure want to delete this data ?</p>

        </Modal>
        
        <button
          onClick={() => setEmployeeModal(true)}
          className="hover:opacity-80 transition duration-300 absolute bottom-10 right-10 w-[180px] h-[40px] bg-black text-white rounded-full text-[14px]"
        >
          + CREATE EMPLOYEE
        </button>
      </div>
    </ConfigProvider>
  );
};

export default Employee;
