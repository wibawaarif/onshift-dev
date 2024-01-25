"use client";

import FilterComponent from "@/components/filter/page";
import { InboxOutlined, DownloadOutlined } from "@ant-design/icons";
import {
  Avatar,
  ConfigProvider,
  Input,
  Table,
  Popover,
  Modal,
  Upload,
  Radio,
  message,
  Select,
} from "antd";
import Image from "next/image";
import { useState, useEffect } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import Papa from "papaparse";
import axios from "axios";
import { read, utils } from 'xlsx';
// import EmployeeTemplate from "@public/static/templates/Onshift_Employee_Template.xlsx"

const fetcher = ([url, token]) =>
  fetch(url, { headers: { authorization: "Bearer " + token } }).then((res) =>
    res.json()
  );

const { Dragger } = Upload;

const Employee = () => {
  const session = useSession();

  const { data: locations } = useSWR(
    [`/api/locations`, `${session.data.user.accessToken} #${session.data.user.workspace}`],
    fetcher
  );
  const { data: positions } = useSWR(
    [`/api/positions`, `${session.data.user.accessToken} #${session.data.user.workspace}`],
    fetcher
  );
  const {
    data: employees,
    error,
    isLoading,
    mutate,
  } = useSWR([`/api/employees`, `${session.data.user.accessToken} #${session.data.user.workspace}`], fetcher);

  const [clonedEmployees, setClonedEmployees] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState([]);
  const [searchEmployeesInput, setSearchEmployeesInput] = useState("");
  const [actionType, setActionType] = useState("");
  const [popover, setPopover] = useState(false);
  const [uploadedEmployees, setUploadedEmployees] = useState(null);
  const [avatarColor, setAvatarColor] = useState("#FFFFFF");
  const [name, setName] = useState("");
  const [platform, setPlatform] = useState("Mobile App");
  const [wage, setWage] = useState("");
  const [wageAmount, setwageAmount] = useState("");
  const [showPosition, setShowPosition] = useState(false);

  const avatarHexColor = [
    "#FFFFFF",
    "#E5E5E3",
    "#A7A7A7",
    "#7D7D80",
    "#646466",
  ];


  const checklist = (
    <Image
      width={16}
      height={16}
      alt="checklist-icon"
      src={"/static/svg/checklist.svg"}
    />
  );

  useEffect(() => {
    setClonedEmployees(_.cloneDeep(employees));
  }, [employees]);

  useEffect(() => {
    let filteredList = _.cloneDeep(employees)?.filter((x) => {
      return selectedFilter?.some(
        (y) =>
          x.name === y ||
          x?.shifts?.some(
            (z) => z?.location?.name === y || z?.position?.name === y
          )
      );
    });

    if (searchEmployeesInput !== "") {
      filteredList = _.cloneDeep(employees)?.filter((x) =>
        x.name
          .toLocaleLowerCase()
          .includes(searchEmployeesInput.toLocaleLowerCase()) || x.employeeId.includes(searchEmployeesInput)
      );
    }

    if (selectedFilter?.length > 0 || searchEmployeesInput) {
      setClonedEmployees(filteredList);
    } else {
      setClonedEmployees(_.cloneDeep(employees));
    }
  }, [selectedFilter, searchEmployeesInput]);

  // upload action
  const props = {
    name: "file",
    multiple: false,
    action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
    beforeUpload: (file) => {
      console.log(file.type)
      const isCSV = file.type === "text/csv";
      const isXls = filte.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
      if (!isCSV || !isXls) {
        message.error(`${file.name} is not a csv or xls file`);
      }
      return isCSV || Upload.LIST_IGNORE;
    },
    onChange(info) {
        message.success(`${info.file.name} file uploaded successfully.`);
        const reader = new FileReader();

        reader.onload = (e) => {
          let data = e.target.result;

          if (info.file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
          let workbook = read(data, {type: 'binary'});
          const wsname = workbook.SheetNames[0];
          const ws = workbook.Sheets[wsname];
          const result = utils.sheet_to_json(ws, {header: ['#', 'name', 'email', 'password', 'phoneNumber'], range: 3, blankrows: false});
          setUploadedEmployees(result);

          } else {

          Papa.parse(data, {
            complete: (parsedData) => {
              // Process the parsed data here
              console.log(parsedData.data)
              setUploadedEmployees(parsedData.data);
            },
            header: true,
          });
          }
        };
        reader.readAsBinaryString(info.file)
        // reader.readAsText(info.fileList[0].originFileObj);

    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

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
      label: "name",
      key: "name",
    },
    {
      label: "email",
      key: "email",
    },
    {
      label: "phoneNumber",
      key: "phoneNumber",
    },
    {
      label: "positions",
      key: "positions"
    },
    {
      label: "user",
      key: "user",
    },
    {
      label: "wageOptions",
      key: "wageOptions",
    },
  ];

  const columns = [
    {
      title: "ID",
      dataIndex: "employeeId",
      render: (_, record) => (
        <div>{record.employeeId}</div>
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
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
      title: "Position",
      render: (_, record) => <div>{record?.positions[0].name}</div>,
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
                <button onClick={() => handleAction("detail", record)}>
                  Details
                </button>
                <button onClick={() => handleAction("edit", record)}>
                  Edit
                </button>
                <button onClick={() => handleAction("statusAction", record)}>
                  { record.status === "Active" ? "Deactivate": "Activate" }
                </button>
                <button onClick={() => handleAction("resetPassword", record)}>
                  Reset Password
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

  const wageType = [{ value: "Hourly", label: "Hourly" }, { value: "Monthly", label: "Monthly" }];

  const [id, setId] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phoneNumber: null,
    wageOptions: {
      category: "Standard",
      type: null,
      amount: null,
    },
    positions: [],
    status: "",
  });

  const [resetPassword, setResetPassword] = useState({
    password: "",
    confirmPassword: "",
  })
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

  const addUploadedEmployees = async () => {
    setEmployeeModal(false);
    if (uploadedEmployees?.length === 0) {
      message.error('No data inserted');
      return
    }
    console.log(uploadedEmployees)
    // debugger
    for (let i = 0; i < uploadedEmployees.length; i++) {
      if (uploadedEmployees[i].email && uploadedEmployees[i].name && uploadedEmployees[i].password && uploadedEmployees[i].phoneNumber) {
        const employeesToBeSend = {
          name: uploadedEmployees[i].name,
          email: uploadedEmployees[i].email,
          password: uploadedEmployees[i].password + '',
          phoneNumber: uploadedEmployees[i].phoneNumber,
          workspace: session.data.user.workspace,
          user: session.data.user.email
        }
        const res = await fetch(`/api/employees`, {
          method: "POST",
          body: JSON.stringify(employeesToBeSend),
          headers: {
            authorization: "Bearer " + session.data.user.accessToken,
          },
        });
        const respMessage = await res.json();
  
        if (respMessage.info === "email existed") {
          message.error(`${respMessage.error}`);
          continue;
        }
  
        message.success("Employee created");
        mutate([...employees, form]);
      } else {
        message.error('All fields are required');
        return
      }
    }
  };

  const downloadTemplate = async () => {
      const req = await axios({
        method: "GET",
        url: `/static/templates/Onshift_Employee_Template.xlsx`,
        responseType: "blob",
      });
      var blob = new Blob([req.data], {
        type: req.headers["content-type"],
      });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = `Onshift_Employee_Template.xlsx`;
      link.click();
  }

  const addEmployee = async () => {
    if (!showPosition) {
      setEmployeeModal(false);
      const res = await fetch(`/api/employees`, {
        method: "POST",
        body: JSON.stringify({...form, workspace: session.data.user.workspace}),
        headers: {
          authorization: "Bearer " + session.data.user.accessToken,
        },
      });
  
      const respMessage = await res.json();
  
      if (respMessage.info === "email existed") {
        message.error(`${respMessage.error}`);
        return;
      }
  
      mutate([...employees, form]);
  
      message.success("Employee created");
    } else {
      const position = await fetch(`/api/positions`, {
        method: "POST",
        body: JSON.stringify({
          name,
          color: avatarColor,
          wageType: wage,
          wageAmount,
          platform,
          workspace: session.data.user.workspace
        }),
        headers: {
          authorization: "Bearer " + session.data.user.accessToken,
        },
      });

      const toJson = await position.json()

      setEmployeeModal(false);
      const res = await fetch(`/api/employees`, {
        method: "POST",
        body: JSON.stringify({...form, positions: [toJson._id]  ,workspace: session.data.user.workspace}),
        headers: {
          authorization: "Bearer " + session.data.user.accessToken,
        },
      });
  
      const respMessage = await res.json();
  
      if (respMessage.info === "email existed") {
        message.error(`${respMessage.error}`);
        return;
      }
  
      mutate([...employees, form]);
  
      message.success("Employee created");
      console.log(await res.json());
    }
  

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

  const handleResetPassword = async () => {
    console.log('test di handle')
    setEmployeeModal(false);
    await fetch(`/api/employees/${id}`, {
      method: "PUT",
      body: JSON.stringify({...form, password: resetPassword.password, method: "resetPassword"}),
      headers: {
        authorization: "Bearer " + session.data.user.accessToken,
      },
    });
    mutate([...employees]);

    message.success("Successfully reset password");

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

  const bulkDeleteEmployee = async () => {
    setEmployeeModal(false);

    if (selectedRowKeys.length > 0) {
      for (let i = 0; i < selectedRowKeys.length; i++) {
        await fetch(`/api/employees/${selectedRowKeys[i]}`, {
          method: "DELETE",
          headers: {
            authorization: "Bearer " + session.data.user.accessToken,
          },
        });
        mutate([...employees]);

        message.success("Employee deleted");
      }
    }

    setSelectedRowKeys([]);
  };

  const handleAction = (type, data) => {
    setActionType(type);

    if (type === "edit") {
      setId(data._id);

      const newForm = {
        name: data.name,
        email: data.email,
        phoneNumber: data.phoneNumber,
        wageOptions: data.wageOptions,
        positions: data.positions?.map(x => x._id),
      };
      setForm(newForm);
    }

    if (type === "statusAction") {
      setId(data._id);

      const newForm = {
        name: data.name,
        email: data.email,
        phoneNumber: data.phoneNumber,
        wageOptions: data.wageOptions,
        positions: data.positions,
        status: data.status === "Active" ? "Inactive" : "Active",
      };
      setForm(newForm);
    }

    if (type === 'detail') {
      const newForm = {
        name: data.name,
        email: data.email,
        phoneNumber: data.phoneNumber,
        wageOptions: data.wageOptions,
        positions: data.positions,
      };
      setForm(newForm);
    }

    if (type === 'resetPassword') {
      setId(data._id);
      const newForm = {
        name: data.name,
        email: data.email,
        phoneNumber: data.phoneNumber,
        wageOptions: data.wageOptions,
        positions: data.positions,
        password: resetPassword.password
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
      wageOptions: {
        category: "Standard",
        type: null,
        amount: null,
      },
      positions: [],
    });
    setResetPassword({
      password: "",
      confirmPassword: "",
    })
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#191407",
        },
      }}
    >
      <div className="flex flex-1 overflow-y-auto">
        <div className="w-[202px] border-r-[1px] border-[#E5E5E3] overflow-y-auto h-full">
          <FilterComponent
            selectedFilter={selectedFilter}
            checkedFilter={checkedFilter}
            allFilterList={filterOptions}
          />
        </div>
        <div className="flex-1 flex flex-col">
          <div className="h-[71px] flex justify-between items-center px-4 py-1 border-b-[1px] border-[#E5E5E3]">
            <div className="w-48 flex">
              <Input
                onChange={(e) => setSearchEmployeesInput(e.target.value)}
                placeholder="Employee name"
                className="rounded-sm"
                prefix={
                  <Image width={20} height={20} src={"/static/svg/lup.svg"} />
                }
              />
            </div>

            <div className="w-max flex">
              {selectedRowKeys.length > 0 && (
                <button
                  onClick={() =>
                    setActionType("bulkDelete") & setEmployeeModal(true)
                  }
                  className="hover:bg-[#E5E5E3] flex items-center justify-center mr-3 duration-300 px-2 py-1 border-[1px] border-[#E5E5E5]"
                >
                  Delete
                  <Image
                    className="ml-1"
                    width={20}
                    height={20}
                    src={"/static/svg/trash.svg"}
                  />
                </button>
              )}
              {/* <button
                onClick={() =>
                  setEmployeeModal(true) & setActionType("exportImport")
                }
                className="hover:bg-[#E5E5E3] mr-3 duration-300 px-2 py-1 border-[1px] border-[#E5E5E5]"
              >
                Import / Export
              </button> */}
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
                scroll={{y: 1000}}
                pagination={false}
                columns={columns}
                rowKey={(record) => record._id}
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
              maskClosable={false}
        width={800}
          footer={[
            // actionType === "exportImport" ? (
            //   <div className="mr-3 inline-block w-32 h-8 hover:bg-[#E5E5E3] px-4 py-1 border-[1px] border-[#E5E5E3] rounded-sm">
            //     <CSVLink
            //       data={clonedEmployees.map((x) => {
            //         return { ...x, shifts: x?.shifts?.map((z) => z.date) };
            //       })}
            //       headers={headers}
            //       filename={"my-file.csv"}
            //       key="back"
            //       target="_blank"
            //     >
            //       <div className="flex justify-center items-center">
            //         <DownloadOutlined className="mr-2 my-0 py-0 text-black" />{" "}
            //         <span className="text-black">DOWNLOAD</span>
            //       </div>
            //     </CSVLink>
            //   </div>
            // ) : (
              // <button
              //   className="mr-3 hover:bg-[#E5E5E3] px-4 py-1 border-[1px] border-[#E5E5E3] rounded-sm"
              //   key="back"
              //   onClick={() => setEmployeeModal(false)}
              // >
              //   <div className="flex justify-center items-center">
              //   <DownloadOutlined className="mr-2 my-0 py-0" /> <span>DOWNLOAD</span>
              //   </div>
              // </button>
              <button
                className={`mr-3 hover:bg-[#E5E5E3] px-4 mt-10 py-1 border-[1px] border-[#E5E5E3] rounded-sm ${actionType === 'detail' ? 'invisible hidden' : ''}`}
                key="back"
                onClick={() => setEmployeeModal(false)}
              >
                CANCEL
              </button>
            ,
            actionType === "exportImport" ? (
              <button
                onClick={() => addUploadedEmployees()}
                className="bg-black text-white rounded-sm border-[1px] border-black px-4 py-1 hover:opacity-80"
                key="submit"
              >
                <div>UPLOAD</div>
              </button>
            ) : (
              <button
                disabled={actionType === "resetPassword" ? !resetPassword.confirmPassword || !resetPassword.password  || resetPassword.password !== resetPassword.confirmPassword  : actionType === "statusAction" ? false :  actionType === "edit" ? false : !form.name || !form.email || !form.password || !form.phoneNumber || (showPosition ? !name || !wage || !wageAmount : form.positions.length === 0)}
                onClick={
                  actionType === "add"
                    ? addEmployee
                    : actionType === "edit" || actionType === "statusAction"
                    ? editEmployee 
                    : actionType === "bulkDelete"
                    ? bulkDeleteEmployee
                    : actionType === "resetPassword" ? handleResetPassword : deleteEmployee
                }
                className={`bg-black text-white rounded-sm disabled:opacity-50 px-4 py-1 hover:opacity-80 ${actionType === 'detail' ? 'invisible hidden' : ''}`}
                key="submit"
              >
                {actionType === "add"
                  ? "CREATE"
                  : actionType === "edit"
                  ? "EDIT"
                  : "CONFIRM"}
              </button>
            ),
          ]}
          title={`${
            actionType === "add"
              ? "Create Employee"
              : actionType === "edit"
              ? "Edit Employee"
              : actionType === "exportImport"
              ? "Export / Import"
              : actionType === 'detail' ? 'Employee Detail' : actionType === 'statusAction' ? "Update Employee Status" : actionType === "resetPassword" ? "Reset Password" : "Delete Employee"
          }`}
          open={employeeModal}
          onCancel={() => setEmployeeModal(false)}
        >
          {actionType === "exportImport" && (
            <div className="flex gap-x-6">
              <div onClick={downloadTemplate} className="rounded-lg border-dashed border-[1px] border-stone-300 cursor-pointer bg-stone-50 hover:bg-emerald-100 hover:border-black transition delay-100 w-[700px]">
                <div className="flex flex-col px-4 py-4 items-center">
                <p className="ant-upload-drag-icon">
                <DownloadOutlined className="text-black text-5xl" />
                </p>
                <p className="text-lg mt-3">
                  Onshift Employee Template 
                </p>
                <p className="text-stone-400 mt-1 text-center">
                Download the template to import your data in here
                </p>
                </div>
              </div>
              <Dragger className="hover:bg-amber-100" maxCount={1} {...props}>
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">
                  Click or drag file to this area to upload
                </p>
                <p className="ant-upload-hint text-stone-600">
                  Support for a single or bulk upload. Strictly prohibited from
                  uploading company data or other banned files.
                </p>
              </Dragger>
            </div>
          )}

          {
            actionType === "resetPassword" && (
              <>
              <div className="mt-3">
              <span className="text-xs font-semibold">PASSWORD</span>
              <Input
                value={resetPassword.password}
                type="password"
                onChange={(e) =>
                  setResetPassword((prev) => {
                    return { ...prev, password: e.target.value };
                  })
                }
                className="rounded-none border-t-0 border-l-0 border-r-0"
                placeholder="Enter password"
              />
            </div>
                          <div className="mt-3">
                          <span className="text-xs font-semibold">CONFIRM PASSWORD</span>
                          <Input
                            value={resetPassword.confirmPassword}
                            type="password"
                            onChange={(e) =>
                              setResetPassword((prev) => {
                                return { ...prev, confirmPassword: e.target.value };
                              })
                            }
                            className="rounded-none border-t-0 border-l-0 border-r-0"
                            placeholder="Enter password"
                          />
                        </div>
                        </>
            )
          }

          {
            actionType === 'detail' && (
              <div className="w-full flex">

                    {/* <div className="w-1/2 h-full border-r-2 border-slate-200">
                    <div className="w-full flex justify-between">
                  <span className="font-medium">Employee Name</span>
                  <span>: {form.name}</span>
                </div>
                <div className="w-full flex justify-between">
                  <span className="font-medium">Employee Email</span>
                  <span>: {form.email}</span>
                </div>
                    </div>
                    <div className="w-1/2 h-full">

</div> */}
              <div className="w-1/2 mr-2 flex flex-col">
              <div className="flex flex-col">
                  <span>Employee Name</span>
                  <div className="font-medium w-full h-10 rounded-xl bg-stone-100 px-4 flex items-center">{ form.name }</div>
                </div>
                <div className="flex flex-col mt-4">
                  <span>Employee Email</span>
                  <div className="font-medium w-full h-10 rounded-xl bg-stone-100 px-4 flex items-center">{ form.email }</div>
                </div>
              </div>

              <div className="w-1/2 ml-2 flex flex-col">
              <div className="flex flex-col">
                  <span>Phone Number</span>
                  <div className="font-medium w-full h-10 rounded-xl bg-stone-100 px-4 flex items-center">{ form.phoneNumber }</div>
                </div>
              </div>

               
                                {/* <div className="w-1/2 flex justify-between">
                  <span className="font-medium">Phone Number :</span>
                  <span>: {form.phoneNumber}</span>
                </div>

                <div className="w-1/2 flex justify-between">
                  <span className="font-medium">Phone Number :</span>
                  <span>: {form.platform}</span>
                </div> */}
              </div>
            )
          }

          {actionType === "bulkDelete" && (
            <p>Are you sure want to delete selected employees?</p>
          )}

          {(actionType === "add" || actionType === "edit") && (
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

              {actionType === "add" && (
                <div className="mt-3">
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
              )}

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
              {
                !showPosition && (
                  <div className="mt-3 flex flex-col">
                  <span className="text-xs font-semibold">POSITION</span>
                  <Select
                    mode="multiple"
                    allowClear
                    placeholder="Select Position"
                    className="mt-1"
                    value={form?.positions}
                    options={positions?.map((x) => {
                      return { label: x.name, value: x._id };
                    })}
                    onChange={(e) =>
                      setForm((prev) => {
                        return { ...prev, positions: e };
                      })
                    }
                  />
                </div>
                )
              }
           

              {!showPosition && (
                          <button
                            onClick={() => setShowPosition(true)}
                            className="transition duration-300 px-1 py-1 hover:bg-[#E5E5E3] rounded-lg"
                          >
                            + ADD NEW POSITION
                          </button>
                        )}


              {/* start */}

              {
                showPosition && (
                  <div className="mt-4">

                  <div className="mt-1">
                    <span className="text-xs font-semibold">
                      POSITION NAME
                    </span>
                    <Input
                      onChange={(e) => setName(e.target.value)}
                      value={name}
                      className="rounded-none border-t-0 border-l-0 border-r-0"
                      placeholder="e.g Phlebotomist"
                    />
                  </div>

                  <div className="mt-4">
                    <span className="text-xs font-semibold">COLOR</span>
                    <div className="border-b-[1px] border-[#E5E5E3] flex py-2 mt-1">
                      {avatarHexColor?.map((x, index) => (
                        <Avatar
                          key={index}
                          onClick={() => setAvatarColor(x)}
                          className={`flex mr-1 cursor-pointer justify-center items-center ${
                            avatarColor === "#FFFFFF"
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

                  <div className="flex flex-col mt-3">
              <span className="text-xs font-semibold">PLATFORM</span>
              <Radio.Group
                className="mt-3"
                onChange={(e) =>
                  setPlatform(e.target.value)
                }
                value={platform}
              >
                <Radio value={"Mobile App"}>Mobile App</Radio>
                <Radio value={"Web Portal"}>Web Portal</Radio>
              </Radio.Group>
            </div>

                  <div className="flex mt-4 justify-between">
                    <div className="w-[48%] flex flex-col">
                      <span className="text-xs font-semibold">WAGE TYPE</span>
                      <Select
                        value={wage}
                        onChange={(e) => setWage(e)}
                        placeholder="Select wage type"
                        className="mt-1"
                        options={wageType}
                      />
                    </div>
                    <div className="w-[48%] flex flex-col">
                      <span className="text-xs font-semibold">
                        WAGE AMOUNT
                      </span>
                      <Input
                        onChange={(e) => setwageAmount(e.target.value)}
                        value={wageAmount}
                        className="rounded-none border-t-0 border-l-0 border-r-0"
                        suffix="usd per hour"
                      />
                    </div>
</div>
<div className="mt-2">
                                <button
                                  onClick={() =>
                                    setShowPosition(false) &
                                    setForm((prev) => {
                                      return { ...prev, break: null };
                                    })
                                  }
                                  className="transition duration-300 px-1 py-1 hover:bg-[#E5E5E3] rounded-lg"
                                >
                                  SELECT EXISTING EMPLOYEE
                                </button>
                              </div>
</div>
                )
              }
            
              {/* end */}

              <div className="flex flex-col mt-3">
                <span className="text-xs font-semibold">WAGE TYPE</span>
                <Radio.Group
                  className="mt-3"
                  onChange={(e) =>
                    setForm((prev) => {
                      return {
                        ...prev,
                        wageOptions: {
                          ...prev.wageOptions,
                          category: e.target.value,
                        },
                      };
                    })
                  }
                  value={form.wageOptions?.category}
                >
                  <Radio value={"Standard"}>Standard</Radio>
                  <Radio value={"Custom"}>Custom</Radio>
                </Radio.Group>
              </div>

              {form.wageOptions?.category === "Custom" && (
                <div className="flex mt-4 justify-between">
                  <div className="w-[48%] flex flex-col">
                    <span className="text-xs font-semibold">WAGE TYPE</span>
                    <Select
                      value={form.wageOptions.type}
                      onChange={(e) =>
                        setForm((prev) => {
                          return {
                            ...prev,
                            wageOptions: { ...prev.wageOptions, type: e },
                          };
                        })
                      }
                      placeholder="Select wage type"
                      className="mt-1"
                      options={wageType}
                    />
                  </div>
                  <div className="w-[48%] flex flex-col">
                    <span className="text-xs font-semibold">WAGE AMOUNT</span>
                    <Input
                      onChange={(e) =>
                        setForm((prev) => {
                          return {
                            ...prev,
                            wageOptions: {
                              ...prev.wageOptions,
                              amount: e.target.value,
                            },
                          };
                        })
                      }
                      value={form.wageOptions.amount}
                      className="rounded-none border-t-0 border-l-0 border-r-0"
                      suffix="usd per hour"
                    />
                  </div>
                </div>
              )}

            
            </div>
          )}

          {actionType === "delete" && (
            <p>Are you sure want to delete this employee?</p>
          )}
          {
            actionType === "statusAction" && <p>Are you sure want to update the status of this employee?</p>
          }
        </Modal>

        <button
          onClick={() =>
            setEmployeeModal(true) & setActionType("exportImport")
          }
          className="hover:opacity-80 transition duration-300 absolute bottom-10 right-60 w-[180px] h-[40px] rounded-full text-[14px] bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          IMPORT EMPLOYEE
        </button>

        <button
          onClick={() =>
            setEmployeeModal(true) & setActionType("add") & clearFields()
          }
          className="hover:opacity-80 transition duration-300 absolute bottom-10 right-10 w-[180px] h-[40px] rounded-full text-[14px] bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          + CREATE EMPLOYEE
        </button>
      </div>
    </ConfigProvider>
  );
};

export default Employee;
