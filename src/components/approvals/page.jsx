"use client";

import Image from "next/image";
import { Avatar, ConfigProvider, Table, Popover, Drawer, Divider, Modal, DatePicker, TimePicker, Space } from "antd";
import { useState } from "react";
import dayjs from "dayjs";

const ApprovalsComponent = ({ employees, monthlyDateValue }) => {

  const [popover, setPopover] = useState(false);
  const [actionType, setActionType] = useState("");
  const [currentTimesheet, setCurrentTimesheet] = useState(null);
  const [timesheetDrawer, setTimesheetDrawer] = useState(false);
  const [timesheetDetailModal, setTimesheetDetailModal] = useState(false);
  const [formEdit, setFormEdit] = useState({
    date: null,
    startTime: null,
    endTime: null,
  })

  const handleAction = (type, data) => {
    setActionType(type);

    if (type === "detail") {
      let filteringMonth = {...data, timesheets: data.timesheets.filter(x => dayjs(x.date).isSame(dayjs(monthlyDateValue), 'month') && x.status !== 'Absent')}
      setCurrentTimesheet(filteringMonth);
    }

    if (type === "delete") {
      setId(data);
    }

    setTimesheetDrawer(true);
    setPopover(false);
  };

  const handleDetailAction = data => {
    setFormEdit({...data})
    setTimesheetDetailModal(true);
  }

  const detailColumns = [
    {
      title: "Date",
      dataIndex: "date",
      render: (_, record) => (
        <div>{dayjs(record.date).format('ddd D, MMM YYYY')}</div>
      ),
    },
    {
      title: "Start Hour",
      dataIndex: "startHour",
      render: (_, record) => (
        <div>{dayjs(record.startTime).format('h:mm a')}</div>
      ),
    },
    {
      title: "End Hour",
      dataIndex: "endHour",
      render: (_, record) => (
        <div>{dayjs(record.endTime).format('h:mm a')}</div>
      ),
    },
    {
      title: "Break",
      dataIndex: "break",
      render: (_, record) => (
        <div>{record.break ? record.break : "-"}</div>
      ),
    },
    {
      title: "Overtime",
      dataIndex: "overtime",
      render: (_, record) => (
        <div>{record.overtime ? record.overtime : "-"}</div>
      ),
    },
    {
      title: "Total Hour",
      dataIndex: "totalHour",
      render: (_, record) => (
        <div>{record.totalHour ? record.totalHour : "-"}</div>
      ),
    },
    {
      title: "Edit",
      dataIndex: "action",
      render: (_, record) => (
        <div onClick={() => handleDetailAction(record)}>
          <Image
            className="cursor-pointer hover:bg-stone-200 rounded-full px-1 py-1 transition duration-300"
            width={24}
            height={24}
            alt="arrow-down"
            src={"/static/svg/edit.svg"}
          />
        </div>
      ),
    },
  ]

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Tracked",
      dataIndex: "tracked",
      render: (_, record) => (
        <div>{record.position ? record.position : "-"}</div>
      ),
    },
    {
      title: "Regular",
      dataIndex: "regular",
      render: (_, record) => (
        <div>{record.location ? record.location : "-"}</div>
      ),
    },
    {
      title: "Overtime",
      dataIndex: "overtime",
      render: (_, record) => <div>{record.overtime ? record.overtime : "-"}</div>,
    },
    {
      title: "Timeoff",
      dataIndex: "timeoff",
      render: (_, record) => <div>{record.timeoff ? record.timeoff : "-"}</div>,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (_, record) => <div>{record.status ? record.status : "Pending"}</div>,
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
                  Detail
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

  const editTimesheetDetail = () => {

  }
  


  return (
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
              />

      <Drawer width={1000} title={`Monthly Summary (${dayjs(monthlyDateValue).startOf('month').format('D MMMM')} - ${dayjs(monthlyDateValue).endOf('month').format('D MMMM')})`} placement="right" onClose={() => setTimesheetDrawer(false)} open={timesheetDrawer}>
        <div className="flex h-full">

          <div className="w-56 h-full bg-[#FCFCFC] mr-8 flex flex-col items-center justify-between border-2 border-stone-300 px-3 py-2">
            <div>
              <div className="flex items-center">
                <Avatar /> 
                <p className="ml-2 font-semibold text-stone-500">{currentTimesheet?.name}</p>
              </div>
              <Divider className="border-1" />

              <div className="flex flex-col">
              <p className="text-sm font-semibold text-stone-500">Tracked Hour</p>
              <p className="font-semibold">50 hrs 32 m</p>
              </div>

              <div className="flex flex-col mt-2">
              <p className="text-sm font-semibold text-stone-500">Worked Hour</p>
              <p className="font-semibold">50 hrs 32 m</p>
              </div>

              <div className="flex flex-col mt-2">
              <p className="text-sm font-semibold text-stone-500">Break</p>
              <p className="font-semibold">50 hrs 32 m</p>
              </div>
              </div>

              <button className="w-40 bg-[#E5E5E4] h-[40px] font-semibold cursor-pointer hover:bg-stone-300 transition duration-300">Approve</button>
          </div>

          <div className="w-full">
          <Table
                bordered
                columns={detailColumns}
                dataSource={currentTimesheet?.timesheets}
              />
          </div>



        </div>
      </Drawer>

      <Modal
        footer={[
          <button
            className="mr-3 hover:bg-[#E5E5E3] px-4 py-1 border-[1px] border-[#E5E5E3] rounded-sm"
            key="back"
            onClick={() => setTimesheetDetailModal(false)}
          >
            CLOSE
          </button>,
          <button
            onClick={() => editTimesheetDetail()}
            className="bg-black text-white rounded-sm px-4 py-1 hover:opacity-80"
            key="submit"
          >
            EDIT
          </button>,
        ]}
        title="Edit Timesheet"
        open={timesheetDetailModal}
        onCancel={() => setTimesheetDetailModal(false)}
      >
                  <div className="mt-4">
                    <div className="mt-1">
                      <span className="text-xs font-semibold">
                        DATE
                      </span>
                      <DatePicker
                          value={formEdit.date}
                          className="w-full mt-1 rounded-none border-t-0 border-l-0 border-r-0"
                        />
                    </div>

                    <div className="mt-2">
                      <span className="text-xs font-semibold">
                        START TIME
                      </span>
                      <TimePicker
                                                value={formEdit.startTime}
                          onChange={(e) =>
                            setForm((prev) => {
                              return { ...prev, startTime: e };
                            })
                          }
                          className="w-full rounded-none border-t-0 border-l-0 border-r-0"
                        />
                    </div>

                    <div className="mt-2">
                      <span className="text-xs font-semibold">
                        END TIME
                      </span>
                      <TimePicker
                                                value={formEdit.endTime}
                          onChange={(e) =>
                            setForm((prev) => {
                              return { ...prev, startTime: e };
                            })
                          }
                          className="w-full rounded-none border-t-0 border-l-0 border-r-0"
                        />
                    </div>
                  </div>

      </Modal>
            </ConfigProvider>

  );
};

export default ApprovalsComponent;
