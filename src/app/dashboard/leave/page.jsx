"use client";

import FilterComponent from "@/components/filter/page";
import { InboxOutlined, DownloadOutlined } from "@ant-design/icons";
import {
  ConfigProvider,
  Input,
  Table,
  Popover,
  Modal,
  Upload,
  Radio,
  message,
  Select,
  Tag
} from "antd";
import Image from "next/image";
import { useState, useEffect } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import Papa from "papaparse";
import { CSVLink } from "react-csv";
import axios from "axios";
import dayjs from "dayjs";
// import EmployeeTemplate from "@public/static/templates/Onshift_Employee_Template.xlsx"

const fetcher = ([url, token]) =>
  fetch(url, { headers: { authorization: "Bearer " + token } }).then((res) =>
    res.json()
  );

const { Dragger } = Upload;

const Location = () => {
  const session = useSession();

  const { data: locations } = useSWR(
    [
      `/api/locations`,
      `${session.data.user.accessToken} #${session.data.user.workspace}`,
    ],
    fetcher
  );
  const { data: positions } = useSWR(
    [
      `/api/positions`,
      `${session.data.user.accessToken} #${session.data.user.workspace}`,
    ],
    fetcher
  );
  const {
    data: leaves,
    error,
    isLoading,
    mutate,
  } = useSWR(
    [
      `/api/leave`,
      `${session.data.user.accessToken} #${session.data.user.workspace}`,
    ],
    fetcher
  );

  const [clonedLeaves, setClonedLeaves] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState([]);
  const [searchLeavesInput, setSearchLeavesInput] = useState("");
  const [actionType, setActionType] = useState("");
  const [popover, setPopover] = useState(false);
  const [uploadedLeaves, setUploadedLeaves] = useState(null);

  useEffect(() => {
    setClonedLeaves(_.cloneDeep(leaves));
  }, [leaves]);

  useEffect(() => {
    let filteredList = _.cloneDeep(leaves)?.filter((x) => {
      return selectedFilter?.some(
        (y) =>
          x.name === y ||
          x?.shifts?.some(
            (z) => z?.location?.name === y || z?.position?.name === y
          )
      );
    });

    if (searchLeavesInput !== "") {
      filteredList = _.cloneDeep(leaves)?.filter(
        (x) =>
          x.name
            .toLocaleLowerCase()
            .includes(searchLeavesInput.toLocaleLowerCase()) ||
          x.employeeId.includes(searchLeavesInput)
      );
    }

    if (selectedFilter?.length > 0 || searchLeavesInput) {
      setClonedLeaves(filteredList);
    } else {
      setClonedLeaves(_.cloneDeep(leaves));
    }
  }, [selectedFilter, searchLeavesInput]);

  // upload action
  const props = {
    name: "file",
    multiple: false,
    action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
    beforeUpload: (file) => {
      const isCSV = file.type === "text/csv";
      if (!isCSV) {
        message.error(`${file.name} is not a csv file`);
      }
      return isCSV || Upload.LIST_IGNORE;
    },
    onChange(info) {
      const { status } = info.file;
      if (status !== "uploading") {
      }
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
        const reader = new FileReader();

        reader.onload = (e) => {
          const contents = e.target.result;
          Papa.parse(contents, {
            complete: (parsedData) => {
              // Process the parsed data here
              setUploadedLeaves(parsedData.data);
            },
            header: true,
          });
        };

        reader.readAsText(info.fileList[0].originFileObj);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
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
      label: "Platform",
      key: "platform",
    },
    {
      label: "positions",
      key: "positions",
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
      title: "Employee ID",
      dataIndex: "employeeId",
      render: (_, record) => <div>{record.employee.employeeId}</div>,
    },
    {
      title: "Name",
      dataIndex: "name",
      render: (_, record) => <div>{record.employee.name}</div>,
    },
    {
      title: "Date",
      dataIndex: "date",
      render: (_, record) => (
        <div>{dayjs(record.employee.date).format("D MMMM YYYY")}</div>
      ),
    },
    {
      title: "Reason",
      dataIndex: "reason",
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (_, record) => <Tag color={record.status === 'Requested' ? 'yellow' : record.status === 'Approved' ? 'green' : 'red'}>{record.status}</Tag>
      
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (_, record) => (
        <div>
          <Popover
            content={
              <div className="flex flex-col items-start">
                {record.status === "Requested" && (
                  <>
                    <button onClick={() => handleAction("approve", record)}>
                      Approve
                    </button>
                    <button onClick={() => handleAction("disapprove", record)}>
                      Disapprove
                    </button>
                  </>
                )}

                <button onClick={() => handleAction("detail", record)}>
                  Details
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

  const wageType = [{ value: "Hourly", label: "Hourly" }];

  const [id, setId] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phoneNumber: null,
    platform: "Mobile App",
    wageOptions: {
      category: "Standard",
      type: null,
      amount: null,
    },
    positions: [],
    status: "",
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

  const addUploadedLeaves = async () => {
    setEmployeeModal(false);

    for (let i = 0; i < uploadedLeaves.length; i++) {
      if (uploadedLeaves[i].email) {
        const res = await fetch(`/api/Leaves`, {
          method: "POST",
          body: JSON.stringify({
            ...uploadedLeaves[i],
            workspace: session.data.user.workspace,
          }),
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
        mutate([...leaves, form]);
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
  };

  const addEmployee = async () => {
    setEmployeeModal(false);
    const res = await fetch(`/api/employees`, {
      method: "POST",
      body: JSON.stringify({ ...form, workspace: session.data.user.workspace }),
      headers: {
        authorization: "Bearer " + session.data.user.accessToken,
      },
    });

    const respMessage = await res.json();

    if (respMessage.info === "email existed") {
      message.error(`${respMessage.error}`);
      return;
    }

    mutate([...leaves, form]);

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
    mutate([...leaves]);

    message.success("Employee updated");

    clearFields();
  };

  
  const actionApproval = async () => {
    setEmployeeModal(false);
    await fetch(`/api/leave/${id}`, {
      method: "PUT",
      body: JSON.stringify(form),
      headers: {
        authorization: "Bearer " + session.data.user.accessToken,
      },
    });
    mutate([...leaves]);

    message.success("Status updated");

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
    mutate([...leaves]);

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
        mutate([...leaves]);

        message.success("Employee deleted");
      }
    }

    setSelectedRowKeys([]);
  };

  const handleAction = (type, data) => {
    setActionType(type);

    if (type === "approve") {
      setId(data._id);

      setForm({...data, status: "Approved"});
    }

    if (type === "disapprove") {
      setId(data._id);

      setForm({...data, status: "Disapproved"});
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
      wageOptions: {
        category: "Standard",
        type: null,
        amount: null,
      },
      positions: [],
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
                onChange={(e) => setSearchLeavesInput(e.target.value)}
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
                columns={columns}
                rowKey={(record) => record._id}
                dataSource={clonedLeaves}
                rowSelection={rowSelection}
                title={() => (
                  <div className="py-2">
                    <p className="text-2xl">Leave</p>
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
            actionType === "exportImport" ? (
              <div className="mr-3 inline-block w-32 h-8 hover:bg-[#E5E5E3] px-4 py-1 border-[1px] border-[#E5E5E3] rounded-sm">
                <CSVLink
                  data={clonedLeaves.map((x) => {
                    return { ...x, shifts: x?.shifts?.map((z) => z.date) };
                  })}
                  headers={headers}
                  filename={"my-file.csv"}
                  key="back"
                  target="_blank"
                >
                  <div className="flex justify-center items-center">
                    <DownloadOutlined className="mr-2 my-0 py-0 text-black" />{" "}
                    <span className="text-black">DOWNLOAD</span>
                  </div>
                </CSVLink>
              </div>
            ) : (
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
                className={`mr-3 hover:bg-[#E5E5E3] px-4 py-1 border-[1px] border-[#E5E5E3] rounded-sm ${
                  actionType === "detail" ? "invisible hidden" : ""
                }`}
                key="back"
                onClick={() => setEmployeeModal(false)}
              >
                CANCEL
              </button>
            ),
            actionType === "exportImport" ? (
              <button
                onClick={() => addUploadedLeaves()}
                className="bg-black text-white rounded-sm border-[1px] border-black px-4 py-1 hover:opacity-80"
                key="submit"
              >
                <div>UPLOAD</div>
              </button>
            ) : (
              <button
                onClick={
                  actionType === "add"
                    ? addEmployee
                    : actionType === "edit" || actionType === "statusAction"
                    ? editEmployee
                    : actionApproval
                }
                className={`bg-black text-white rounded-sm px-4 py-1 hover:opacity-80 ${
                  actionType === "detail" ? "invisible hidden" : ""
                }`}
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
          title={"Update Status Approval"}
          open={employeeModal}
          onCancel={() => setEmployeeModal(false)}
        >
          {actionType === "exportImport" && (
            <div className="flex gap-x-6">
              <div
                onClick={downloadTemplate}
                className="rounded-lg border-dashed border-[1px] border-stone-300 cursor-pointer bg-stone-50 hover:bg-emerald-100 hover:border-black transition delay-100 w-[700px]"
              >
                <div className="flex flex-col px-4 py-4 items-center">
                  <p className="ant-upload-drag-icon">
                    <DownloadOutlined className="text-black text-5xl" />
                  </p>
                  <p className="text-lg mt-3">Onshift Employee Template</p>
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

          {actionType === "detail" && (
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
                  <div className="font-medium w-full h-10 rounded-xl bg-stone-100 px-4 flex items-center">
                    {form.name}
                  </div>
                </div>
                <div className="flex flex-col mt-4">
                  <span>Employee Email</span>
                  <div className="font-medium w-full h-10 rounded-xl bg-stone-100 px-4 flex items-center">
                    {form.email}
                  </div>
                </div>
              </div>

              <div className="w-1/2 ml-2 flex flex-col">
                <div className="flex flex-col">
                  <span>Phone Number</span>
                  <div className="font-medium w-full h-10 rounded-xl bg-stone-100 px-4 flex items-center">
                    {form.phoneNumber}
                  </div>
                </div>
                <div className="flex flex-col mt-4">
                  <span>Platform</span>
                  <div className="font-medium w-full h-10 rounded-xl bg-stone-100 px-4 flex items-center">
                    {form.platform}
                  </div>
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
          )}

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

          {`Are you sure want to ${actionType} this leave?`}
        </Modal>
      </div>
    </ConfigProvider>
  );
};

export default Location;
