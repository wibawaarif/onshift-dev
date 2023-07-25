"use client";

import FilterComponent from "@/components/filter/page";
import { InboxOutlined,DownloadOutlined } from '@ant-design/icons';
import {
  ConfigProvider,
  Input,
  Table,
  Popover,
  Modal,
  Upload,
  Radio,
  message,
} from "antd";
import Image from "next/image";
import { useState, useEffect } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import Papa from "papaparse";
import { CSVLink } from "react-csv";

const fetcher = ([url, token]) =>
  fetch(url, { headers: { authorization: "Bearer " + token } }).then((res) =>
    res.json()
  );

const { Dragger } = Upload;

const props = {
  name: 'file',
  multiple: false,
  action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
  beforeUpload: (file) => {
    const isCSV = file.type === "text/csv"
    if (!isCSV) {
      message.error(`${file.name} is not a csv file`);
    }
    return isCSV || Upload.LIST_IGNORE;
  },
  onChange(info) {
    const { status } = info.file;
    if (status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (status === 'done') {
      message.success(`${info.file.name} file uploaded successfully.`);
      const reader = new FileReader();
  
      reader.onload = (e) => {
        const contents = e.target.result;
        Papa.parse(contents, {
          complete: (parsedData) => {
            // Process the parsed data here
            console.log(parsedData.data);
          },
          header: true,
        });
      };

      reader.readAsText(info.fileList[0].originFileObj)
    } else if (status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
  onDrop(e) {
    console.log('Dropped files', e.dataTransfer.files);
  },
};

const Employee = () => {
  const session = useSession();


  const { data: locations } = useSWR(
    [`/api/locations`, session.data.user.accessToken],
    fetcher
  );
  const { data: positions } = useSWR(
    [`/api/positions`, session.data.user.accessToken],
    fetcher
  );
  const {
    data: employees,
    error,
    isLoading,
    mutate,
  } = useSWR(
    [`/api/employees`, session.data.user.accessToken],
    fetcher
  );

  const [clonedEmployees, setClonedEmployees] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState([]);
  const [searchEmployeesInput, setSearchEmployeesInput] = useState('');
  const [actionType, setActionType] = useState("");
  const [popover, setPopover] = useState(false);

  useEffect(() => {
    setClonedEmployees(_.cloneDeep(employees));
  }, [employees]);

  useEffect(() => {
    const filteredList = _.cloneDeep(employees)?.filter((x) => {
      return selectedFilter?.some(
        (y) =>
          x.name === y ||
          x?.shifts?.some(
            (z) => z?.location?.name === y || z?.position?.name === y
          )
      ) || x.name.includes(searchEmployeesInput)
    });

    if (selectedFilter?.length > 0 || searchEmployeesInput) {
      setClonedEmployees(filteredList);
    } else {
      setClonedEmployees(_.cloneDeep(employees));
    }
  }, [selectedFilter, searchEmployeesInput]);

  const filterOptions = [
    {
      name: "LOCATIONS / (DESELECT ALL)",
      options: locations?.map((location) => location.name),
    },
    {
      name: "POSITIONS / (DESELECT ALL)",
      options: positions?.map((position) => position.name),
    },
    {
      name: "EMPLOYEES / (DESELECT ALL)",
      options: employees?.map((employee) => employee.name),
    },
  ];

  const headers = [
    {
      label: "Full Name",
      key: "name"
    },
    {
      label: "Email",
      key: "email"
    },
    {
      label: "Phone Number",
      key: "phoneNumber"
    },
    {
      label: "Platform",
      key: "platform"
    },
    {
      label: "Created At",
      key: "createdAt"
    },
    {
      label: "Shifts",
      key: "shifts"
    }
  ]

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Position",
      dataIndex: "position",
      render: (_, record) => (
        <div>{record.position ? record.position : "-"}</div>
      ),
    },
    {
      title: "Location",
      dataIndex: "location",
      render: (_, record) => (
        <div>{record.location ? record.location : "-"}</div>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Phone",
      dataIndex: "phoneNumber",
      render: (_, record) => <div>{`+${record.phoneNumber}`}</div>,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (_, record) => <div>{record.status ? record.status : "-"}</div>,
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (_, record) => (
        <div>
          <Popover
            content={
              <div className="flex flex-col items-start">
                <button onClick={() => handleAction("edit", record)}>
                  Edit
                </button>
                <button onClick={() => handleAction("delete", record._id)}>
                  Delete
                </button>
              </div>
            }
            placement="bottomRight"
            title="Action"
            trigger="click"
            open={popover === record._id}
            onOpenChange={(e) => {
              if (e) {
                setPopover(record._id);
              } else {
                setPopover(null);
              }
            }}
          >
            <Image
              className="hover:bg-[#E5E5E3] rounded-xl py-[1px] cursor-pointer transition duration-300"
              width={20}
              height={20}
              src={"/static/svg/action.svg"}
            />
          </Popover>
        </div>
      ),
    },
  ];
  const [id, setId] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phoneNumber: null,
    platform: "Mobile App",
  });
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [employeeModal, setEmployeeModal] = useState(false);

  const checkedFilter = (e) => {
    let newSelectedFilter = [...selectedFilter];

    if (e.target.checked) {
      newSelectedFilter.push(e.target.name);
      setSelectedFilter(newSelectedFilter);
    } else {
      newSelectedFilter = newSelectedFilter.filter((x) => x !== e.target.name);
      setSelectedFilter(newSelectedFilter);
    }
  };

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const addEmployee = async () => {
    setEmployeeModal(false);
    await fetch(`/api/employees`, {
      method: "POST",
      body: JSON.stringify(form),
      headers: {
        authorization: "Bearer " + session.data.user.accessToken,
      },
    });
    mutate([...employees, form]);

    message.success("Employee created");
  };

  const editEmployee = async () => {
    setEmployeeModal(false);
    await fetch(`/api/employees/${id}`, {
      method: "PUT",
      body: JSON.stringify(form),
      headers: {
        authorization: "Bearer " + session.data.user.accessToken,
      },
    });
    mutate([...employees]);

    message.success("Employee updated");

    clearFields();
  };

  const deleteEmployee = async () => {
    setEmployeeModal(false);
    await fetch(`/api/employees/${id}`, {
      method: "DELETE",
      headers: {
        authorization: "Bearer " + session.data.user.accessToken,
      },
    });
    mutate([...employees]);

    message.success("Employee deleted");
  };

  const handleAction = (type, data) => {
    setActionType(type);

    if (type === "edit") {
      setId(data._id);

      const newForm = {
        name: data.name,
        email: data.email,
        phoneNumber: data.phoneNumber,
        platform: data.platform,
      };
      setForm(newForm);
    }

    if (type === "delete") {
      setId(data);
    }

    setEmployeeModal(true);
    setPopover(false);
  };

  const clearFields = () => {
    setForm({
      name: "",
      email: "",
      password: "",
      phoneNumber: null,
      platform: "Mobile App",
    });
  };

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
          <FilterComponent               selectedFilter={selectedFilter}
              checkedFilter={checkedFilter}
              allFilterList={filterOptions} />
        </div>

        <div className="flex-1 flex flex-col">
          <div className="h-[71px] flex justify-between items-center px-4 py-1 border-b-[1px] border-[#E5E5E3]">
            <div className="w-48 flex">
              <Input
                onChange={e => setSearchEmployeesInput(e.target.value)}
                placeholder="Employee name"
                className="rounded-sm"
                prefix={
                  <Image width={20} height={20} src={"/static/svg/lup.svg"} />
                }
              />
            </div>

            <div className="w-max flex">
              <button onClick={() => setEmployeeModal(true) & setActionType("exportImport")} className="hover:bg-[#E5E5E3] mr-3 duration-300 px-2 py-1 border-[1px] border-[#E5E5E5]">
                Import / Export
              </button>
              <button className="hover:bg-[#E5E5E3] mr-3 duration-300 px-2 py-1 border-[1px] border-[#E5E5E5]">
                Invite Users
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
                dataSource={clonedEmployees}
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
          footer={[ actionType === "exportImport" ? <CSVLink
          data={clonedEmployees.map(x => { return { ...x, shifts: x.shifts.map(z => z.date) }})}
          headers={headers}
          filename={"my-file.csv"}
          key="back"
          target="_blank"
        >
            <div className="flex justify-center items-center">
          <DownloadOutlined className="mr-2 my-0 py-0" /> <span>DOWNLOAD</span>
          </div>
        </CSVLink>        
        // <button
        //   className="mr-3 hover:bg-[#E5E5E3] px-4 py-1 border-[1px] border-[#E5E5E3] rounded-sm"
        //   key="back"
        //   onClick={() => setEmployeeModal(false)}
        // >
        //   <div className="flex justify-center items-center">
        //   <DownloadOutlined className="mr-2 my-0 py-0" /> <span>DOWNLOAD</span>
        //   </div>
        // </button> 
        : 
            <button
              className="mr-3 hover:bg-[#E5E5E3] px-4 py-1 border-[1px] border-[#E5E5E3] rounded-sm"
              key="back"
              onClick={() => setEmployeeModal(false)}
            >
              CANCEL
            </button>,
            actionType === "exportImport" ? 
            <button
              className="bg-black text-white rounded-sm border-[1px] border-black px-4 py-1 hover:opacity-80"
              key="submit"
            >
              <div>
              UPLOAD
              </div>
            </button> :
            <button
              onClick={
                actionType === "add"
                  ? addEmployee
                  : actionType === "edit"
                  ? editEmployee
                  : deleteEmployee
              }
              className="bg-black text-white rounded-sm px-4 py-1 hover:opacity-80"
              key="submit"
            >
              {actionType === "add"
                ? "CREATE"
                : actionType === "edit"
                ? "EDIT"
                : "CONFIRM"}
            </button>,
          ]}
          title={`${
            actionType === "add"
              ? "Create Employee"
              : actionType === "edit"
              ? "Edit Employee"
              : actionType === "exportImport" ? "Export / Import" : "Delete Employee"
          }`}
          open={employeeModal}
          onCancel={() => setEmployeeModal(false)}
        >
          {
            actionType === "exportImport" && (
              <div>
                  <Dragger maxCount={1} {...props}>
                    <p className="ant-upload-drag-icon">
                      <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">Click or drag file to this area to upload</p>
                    <p className="ant-upload-hint">
                      Support for a single or bulk upload. Strictly prohibited from uploading company data or other
                      banned files.
                    </p>
                  </Dragger>
              </div>
            )
          }

          {actionType === "add" || actionType === "edit" && (
            <div className="mt-4 mb-4">
              <div>
                <span className="text-xs font-semibold">FULL NAME</span>
                <Input
                  value={form.name}
                  onChange={(e) =>
                    setForm((prev) => {
                      return { ...prev, name: e.target.value };
                    })
                  }
                  className="rounded-none border-t-0 border-l-0 border-r-0"
                  placeholder="e.g John Doe"
                />
              </div>

              <div className="mt-3">
                <span className="text-xs font-semibold">EMAIL</span>
                <Input
                  value={form.email}
                  type="email"
                  onChange={(e) =>
                    setForm((prev) => {
                      return { ...prev, email: e.target.value };
                    })
                  }
                  className="rounded-none border-t-0 border-l-0 border-r-0"
                  placeholder="company@gmail.com"
                />
              </div>

              {
                actionType === 'add' && <div className="mt-3">
                <span className="text-xs font-semibold">PASSWORD</span>
                <Input
                  value={form.password}
                  type="password"
                  onChange={(e) =>
                    setForm((prev) => {
                      return { ...prev, password: e.target.value };
                    })
                  }
                  className="rounded-none border-t-0 border-l-0 border-r-0"
                  placeholder="Enter password"
                />
              </div>
              }
            

              <div className="mt-3">
                <span className="text-xs font-semibold">PHONE</span>
                <PhoneInput
                  value={String(form.phoneNumber)}
                  onChange={(phone) =>
                    setForm((prev) => {
                      return { ...prev, phoneNumber: phone };
                    })
                  }
                  buttonStyle={{
                    borderTop: "0",
                    borderLeft: "0",
                    borderRight: "0",
                    background: "white",
                  }}
                  searchStyle={{ border: "0", borderBottomWidth: "1px" }}
                  inputStyle={{
                    borderRadius: "0",
                    borderTop: "0",
                    borderLeft: "0",
                    borderRight: "0",
                    width: "100%",
                  }}
                  country={"ae"}
                />
              </div>

              {/* <div className="mt-3">
                <span className="text-xs font-semibold">POSITION</span>
                <Input
                  value={form.email}
                  type="email"
                  onChange={(e) =>
                    setForm((prev) => {
                      return { ...prev, email: e.target.value };
                    })
                  }
                  className="rounded-none border-t-0 border-l-0 border-r-0"
                  placeholder="company@gmail.com"
                />
              </div> */}

              <div className="flex flex-col mt-3">
                <span className="text-xs font-semibold">PLATFORM</span>
                <Radio.Group
                  className="mt-3"
                  onChange={(e) =>
                    setForm((prev) => {
                      return { ...prev, platform: e.target.value };
                    })
                  }
                  value={form.platform}
                >
                  <Radio value={"Mobile App"}>Mobile App</Radio>
                  <Radio value={"Web Portal"}>Web Portal</Radio>
                </Radio.Group>
              </div>
            </div>
          )}

          {actionType === "delete" && (
            <p>Are you sure want to delete this employee?</p>
          )}
        </Modal>

        <button
          onClick={() =>
            setEmployeeModal(true) & setActionType("add") & clearFields()
          }
          className="hover:opacity-80 transition duration-300 absolute bottom-10 right-10 w-[180px] h-[40px] bg-black text-white rounded-full text-[14px]"
        >
          + CREATE EMPLOYEE
        </button>
      </div>
    </ConfigProvider>
  );
};

export default Employee;
