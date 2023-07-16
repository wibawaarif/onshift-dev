"use client";

import FilterComponent from "@/components/filter/page";
import { ConfigProvider, Input, Table, Popover, Modal, Select, Radio, message } from "antd";
import Image from "next/image";
import { useState } from "react";
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import useSWR from 'swr';
import { useSession } from "next-auth/react";

const fetcher = ([url, token]) => fetch(url, { headers: { "authorization" : "Bearer " + token } }).then(res => res.json())

const Employee = () => {
  const session = useSession();

  const { data: employees, error, isLoading, mutate } = useSWR(["http://localhost:3000/api/employees", session.data.user.accessToken], fetcher)

  const [modalType, setModalType] = useState('');

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
      render: (_, record) => <div>
        {record.position ? record.position : '-'}
      </div>
    },
    {
      title: "Location",
      dataIndex: "location",
      render: (_, record) => <div>
      {record.location ? record.location : '-'}
    </div>
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Phone",
      dataIndex: "phoneNumber",
      render: (_, record) => <div>
        {`+${record.phoneNumber}`}
      </div>
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (_, record) => <div>
        {record.status? record.status: '-'}
      </div>
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

  const [form, setForm] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    timezone: '',
    role: 'Employee',
  })
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

  const addEmployee = async () => {
    setEmployeeModal(false)
    await fetch('http://localhost:3000/api/employees', {
      method: "POST",
      body: JSON.stringify(form),
      headers: {
        "authorization" : "Bearer " + session.data.user.accessToken
      }
    });
    mutate([...employees, form]);

    message.success('Position created')
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
                dataSource={employees}
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
              onClick={modalType === 'add' ? addEmployee : modalType === 'edit' ? editEmployee : deleteEmployee}
              className="bg-black text-white rounded-sm px-4 py-1 hover:opacity-80"
              key="submit"
            >
              CONFIRM
            </button>,
          ]}
          title={`${modalType === 'add' ? 'Create Employee' : modalType === 'edit' ? 'Edit Employee' : 'Delete Employee'}`}
          open={employeeModal}
          onCancel={() => setEmployeeModal(false)}
        > 

        {
          modalType === 'add' && (
            <div className="mt-4 mb-4">
            <div>
              <span className="text-xs font-semibold">FULL NAME</span>
              <Input
                onChange={e => setForm(prev => { return {...prev, name: e.target.value} })}
                className="rounded-none border-t-0 border-l-0 border-r-0"
                placeholder="e.g John Doe"
              />
            </div>

            <div className="mt-3">
              <span className="text-xs font-semibold">EMAIL</span>
              <Input
                onChange={e => setForm(prev => { return {...prev, email: e.target.value} })}
                className="rounded-none border-t-0 border-l-0 border-r-0"
                placeholder="company@gmail.com" 
              />
            </div>

            <div className="mt-3">
              <span className="text-xs font-semibold">PHONE</span>
              <PhoneInput
                onChange={phone => setForm(prev => { return {...prev, phoneNumber: phone} })}
                buttonStyle={{borderTop: '0', borderLeft: '0', borderRight: '0',background: 'white'}}
                searchStyle={{border: '0', borderBottomWidth: '1px'}}
                inputStyle={{borderRadius: '0', borderTop: '0', borderLeft: '0', borderRight: '0', width: '100%'}}
                country={'us'}
              />
            </div>

            <div className="flex flex-col mt-3">
              <span className="text-xs font-semibold">TIMEZONE</span>
              <Select
                onSelect={e => setForm(prev => { return {...prev, timezone: e} })}
                options={[{value: 'UTC-5', label: '(UTC-5) Eastern Standard Time'}]}
                className="mt-3"
                bordered={false}
                style={{borderBottom: '1px solid #E5E5E3'}}
                placeholder="e.g (UTC-5) Eastern Standard Time"
              />
            </div>

            <div className="flex flex-col mt-3">
              <span className="text-xs font-semibold">ROLE</span>
              <Radio.Group className="mt-3" onChange={e => setForm(prev => { return {...prev, role: e.target.value} })} value={form.role}>
                <Radio value={'Employee'}>Employee</Radio>
                <Radio value={'Administrator'}>Administrator</Radio>
              </Radio.Group>
            </div>    
          </div>
          )
        }


        {
          modalType === 'delete' && <p>Are you sure want to delete this data ?</p>
        }

        </Modal>
        
        <button
          onClick={() => setEmployeeModal(true) & setModalType('add') }
          className="hover:opacity-80 transition duration-300 absolute bottom-10 right-10 w-[180px] h-[40px] bg-black text-white rounded-full text-[14px]"
        >
          + CREATE EMPLOYEE
        </button>
      </div>
    </ConfigProvider>
  );
};

export default Employee;
