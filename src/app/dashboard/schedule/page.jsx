"use client";

import useSWR from "swr";
import SchedulerComponent from "@/components/scheduler/page";
import FilterComponent from "@/components/filter/page";
import Image from "next/image";
import {
  Modal,
  Tabs,
  ConfigProvider,
  DatePicker,
  TimePicker,
  Divider,
  Select,
  Input,
  message,
} from "antd";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";

const fetcher = ([url, token]) =>
  fetch(url, { headers: { authorization: "Bearer " + token } }).then((res) =>
    res.json()
  );

const Scheduler = () => {
  const session = useSession();

  const [type, setType] = useState("week");
  const [shiftModal, setShiftModal] = useState(false);
  const [showBreak, setShowBreak] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [form, setForm] = useState({
    date: "",
    startTime: "",
    endTime: "",
    employees: [],
    location: "",
    position: null,
  });
  const { data: shifts, mutate: mutateShifts } = useSWR(
[`${process.env.NEXTAUTH_URL}/api/shifts`, session.data.user.accessToken],
    fetcher
  );
  const { data: locations } = useSWR(
    shiftModal
      ? [`${process.env.NEXTAUTH_URL}/api/locations`, session.data.user.accessToken]
      : null,
    fetcher
  );
  const { data: positions } = useSWR(
    shiftModal
      ? [`${process.env.NEXTAUTH_URL}/api/positions`, session.data.user.accessToken]
      : null,
    fetcher
  );
  const { data: employees, mutate: mutateEmployees } = useSWR(
  [`${process.env.NEXTAUTH_URL}/api/employees`, session.data.user.accessToken],
    fetcher
  );

  const optionsEmployees = [
    { value: "arif", label: "Arif" },
    { value: "wibawa", label: "Wibawa" },
  ];

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
      name: "EVENTS / (DESELECT ALL)",
      options: [
        "Scheduled shifts",
        "Unassigned shifts",
        "Days off",
        "Unavailability",
      ],
    },
    {
      name: "EMPLOYEES / (DESELECT ALL)",
      options: [
        "Arif",
        "Wibawa",
        "David Paul",
        "Jared Martin",
        "Rena Sofer",
        "Rena Sofer",
        "Rena Sofer",
      ],
    },
  ];

  const addShift = async () => {
    setShiftModal(false);
    await fetch(`${process.env.NEXTAUTH_URL}/api/shifts`, {
      method: "POST",
      body: JSON.stringify(form),
      headers: {
        authorization: "Bearer " + session.data.user.accessToken,
      },
    });
    mutateEmployees([
      ...employees
    ]);

    message.success("Shift created");
  };
  

  const editShift = async result => {
    if (
      result.destination &&
      result.source.droppableId !== result.destination.droppableId
    ) { 
      await fetch(`${process.env.NEXTAUTH_URL}/api/shifts/${result.draggableId}`, {
        method: "PUT",
        body: JSON.stringify({date: dayjs(result.destination.droppableId)}),
        headers: {
          authorization: "Bearer " + session.data.user.accessToken,
        },
      });
      mutateEmployees([...employees]);

      message.success("Shift updated");
  }
  }

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#191407",
        },
      }}
    >
      <div className="flex flex-col flex-1">
        <div className="border-b-[1px] border-[#E5E5E3] h-[71px] w-full flex items-center">
          <div className="px-4 py-1 flex w-full">
            <div className="flex border-[1px] border-[#E5E5E5] w-max">
              <button
                onClick={() => setType("day")}
                className={`hover:bg-[#E5E5E3] ${
                  type === "day" ? "bg-[#E5E5E3]" : ""
                } transition duration-300 px-2 py-1 border-r-[1px] border-[#E5E5E5]`}
              >
                Day
              </button>
              <button
                onClick={() => setType("week")}
                className={`hover:bg-[#E5E5E3] ${
                  type === "week" ? "bg-[#E5E5E3]" : ""
                } duration-300 px-2 py-1 border-r-[1px] border-[#E5E5E5]`}
              >
                Week
              </button>
              <button
                onClick={() => setType("month")}
                className={`hover:bg-[#E5E5E3] ${
                  type === "month" ? "bg-[#E5E5E3]" : ""
                } duration-300 px-2 py-1`}
              >
                Month
              </button>
            </div>

            <div className="flex justify-between items-center w-full px-4">
              <div className="w-48 h-full flex">
                <DatePicker
                  className="rounded-none"
                  format={"MM/DD"}
                  picker="week"
                />
                <button
                  onClick={() => setType("week")}
                  className={`hover:bg-[#E5E5E3] duration-300 px-2 py-1 border-[1px] border-[#E5E5E5]`}
                >
                  Today
                </button>
              </div>

              <div className="w-max h-full flex">
                <button className="hover:bg-[#E5E5E3] mr-3 duration-300 px-2 py-1 border-[1px] border-[#E5E5E5]">
                  Publish Shifts
                </button>
                <button className="hover:bg-[#E5E5E3] mr-3 duration-300 px-2 py-1 border-[1px] border-[#E5E5E5]">
                  Copy Shifts
                </button>
                <button className="hover:bg-[#E5E5E3] mr-3 duration-300 px-2 py-1 border-[1px] border-[#E5E5E5]">
                  Export / Print
                </button>
                <button className="hover:bg-[#E5E5E3] duration-300 px-2 py-1 border-[1px] border-[#E5E5E5]">
                  Statistic
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-1">
          <div className="w-[202px] border-r-[1px] border-[#E5E5E3] overflow-y-auto h-[720px]">
            <FilterComponent allFilterList={filterExamples} />
          </div>

          <div className="flex-1">
            <SchedulerComponent editShift={editShift} employees={employees} listOfShifts={shifts} type={type} />
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
              onClick={addShift}
              className="bg-black text-white rounded-sm px-4 py-1 hover:opacity-80"
              key="submit"
            >
              CREATE
            </button>,
          ]}
          title="Create New Shift"
          open={shiftModal}
          onCancel={() => setShiftModal(false)}
        >
          <Tabs
            defaultActiveKey="1"
            items={[
              {
                key: "1",
                label: "CREATE SHIFT",
                children: (
                  <div>
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold">DATE</span>
                      <DatePicker
                        onChange={(date, dateString) =>
                          setForm((prev) => {
                            return { ...prev, date: dateString };
                          })
                        }
                        className="w-full mt-1 rounded-none border-t-0 border-l-0 border-r-0"
                      />
                    </div>

                    <div className="flex mt-4 justify-between">
                      <div className="w-[48%] ">
                        <span className="text-xs font-semibold">
                          START SHIFT
                        </span>
                        <TimePicker
                          onChange={(e) =>
                            setForm((prev) => {
                              return { ...prev, startTime: e };
                            })
                          }
                          className="w-full rounded-none border-t-0 border-l-0 border-r-0"
                        />
                      </div>
                      <div className="w-[48%]">
                        <span className="text-xs font-semibold">
                          FINISH SHIFT
                        </span>
                        <TimePicker
                          onChange={(e) =>
                            setForm((prev) => {
                              return { ...prev, endTime: e };
                            })
                          }
                          className="w-full rounded-none border-t-0 border-l-0 border-r-0"
                        />
                      </div>
                    </div>
                    <div className="mt-6">
                      {!showBreak && (
                        <button
                          onClick={() => setShowBreak(true)}
                          className="transition duration-300 px-1 py-1 hover:bg-[#E5E5E3] rounded-lg"
                        >
                          + ADD BREAK
                        </button>
                      )}

                      {showBreak && (
                        <div className="flex flex-col h-32 justify-center">
                          <div>
                            <span className="text-xs font-semibold">BREAK</span>
                            <TimePicker className="w-full rounded-none border-t-0 border-l-0 border-r-0" />
                          </div>

                          <div className="mt-3">
                            <button className="border-[1px] border-[#E5E5E3] px-2 mr-2">
                              15 min
                            </button>
                            <button className="border-[1px] border-[#E5E5E3] px-2 mr-2">
                              30 min
                            </button>
                            <button className="border-[1px] border-[#E5E5E3] px-2 mr-2">
                              45 min
                            </button>
                            <button className="border-[1px] border-[#E5E5E3] px-2 mr-2">
                              60 min
                            </button>
                            <div className="mt-4">
                              <button
                                onClick={() => setShowBreak(false)}
                                className="transition duration-300 px-1 py-1 hover:bg-[#E5E5E3] rounded-lg"
                              >
                                DELETE BREAK
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                      <Divider />
                    </div>

                    <div className="flex flex-col">
                      <span className="text-xs font-semibold">EMPLOYEE</span>
                      {/* <Image
                        className="absolute bottom-[29.5%] z-50"
                        width={20}
                        height={20}
                        alt="schedule-logo"
                        src={"/static/svg/employee.svg"}
                      /> */}
                      <Select
                        mode="multiple"
                        allowClear
                        placeholder="Select Employee"
                        className="mt-1"
                        options={employees?.map((x) => {
                          return { label: x.name, value: x._id };
                        })}
                        onChange={(e) =>
                          setForm((prev) => {
                            return { ...prev, employees: e };
                          })
                        }
                      />
                    </div>

                    <div className="flex mt-4 justify-between">
                      <div className="w-[48%] flex flex-col">
                        <span className="text-xs font-semibold">LOCATION</span>
                        <Select
                          placeholder="Select Location"
                          className="mt-1"
                          options={locations?.map((x) => {
                            return { label: x.name, value: x._id };
                          })}
                          onChange={(e) =>
                            setForm((prev) => {
                              return { ...prev, location: e };
                            })
                          }
                        />
                      </div>
                      <div className="w-[48%] flex flex-col">
                        <span className="text-xs font-semibold">POSITION</span>
                        <Select
                          placeholder="Select Position"
                          className="mt-1"
                          options={positions?.map((x) => {
                            return { label: x.name, value: x._id };
                          })}
                          onChange={(e) =>
                            setForm((prev) => {
                              return { ...prev, position: e };
                            })
                          }
                        />
                      </div>
                    </div>
                    {!showNotes && (
                      <button
                        onClick={() => setShowNotes(true)}
                        className="mt-2 transition duration-300 px-1 py-1 hover:bg-[#E5E5E3] rounded-lg"
                      >
                        + ADD NOTES
                      </button>
                    )}
                    {showNotes && (
                      <div className="mt-4">
                        <span className="text-xs font-semibold">POSITION</span>
                        <Input
                          className="rounded-none border-t-0 border-l-0 border-r-0"
                          placeholder="Basic usage"
                        />
                      </div>
                    )}
                  </div>
                ),
              },
              {
                key: "2",
                label: "CREATE TIME OFF",
                children: (
                  <div>
                    <DatePicker />
                  </div>
                ),
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
