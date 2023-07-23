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
  Select,
  Input,
  message,
} from "antd";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import _ from "lodash";
import dayjs from "dayjs";
import updateLocale from "dayjs/plugin/updateLocale";

dayjs.extend(updateLocale);
dayjs.updateLocale("en", {
  weekStart: 1,
});

const fetcher = ([url, token]) =>
  fetch(url, { headers: { authorization: "Bearer " + token } }).then((res) =>
    res.json()
  );

const Scheduler = () => {
  const session = useSession();

  const { data: shifts, mutate: mutateShifts } = useSWR(
    [`/api/shifts`, session.data.user.accessToken],
    fetcher
  );
  const { data: locations } = useSWR(
    [`/api/locations`, session.data.user.accessToken],
    fetcher
  );
  const { data: positions } = useSWR(
    [`/api/positions`, session.data.user.accessToken],
    fetcher
  );
  const { data: employees, mutate: mutateEmployees } = useSWR(
    [`/api/employees`, session.data.user.accessToken],
    fetcher
  );

  const [type, setType] = useState("week");
  const [shiftModal, setShiftModal] = useState(false);
  const [showBreak, setShowBreak] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [selectedRepeatedDays, setSelectedRepeatedDays] = useState([]);
  const [clonedEmployees, setClonedEmployees] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState([]);
  const [weeklyDateValue, setWeeklyDateValue] = useState(dayjs());
  const [form, setForm] = useState({
    date: "",
    startTime: "",
    endTime: "",
    employees: [],
    location: null,
    position: null,
    notes: "",
    break: null,
    repeatedShift: {
      isRepeated: false,
      startRepeatedWeek: null,
      repeatedDays: [],
      endDate: null,
    },
  });

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
      );
    });

    if (selectedFilter?.length > 0) {
      setClonedEmployees(filteredList);
    } else {
      setClonedEmployees(_.cloneDeep(employees));
    }
  }, [selectedFilter]);

  const disabledDate = (current) => {
    // const currentDate = dayjs(current);

    // const startOfWeek = dayjs().startOf('week')
    // const endOfWeek = dayjs().endOf('week')

    // return currentDate.isBefore(startOfWeek) || currentDate.isAfter(endOfWeek);

    return current && current < dayjs().endOf("day");
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

  const weeklyDateChange = (date, dateString) => {
    setWeeklyDateValue(date);
  };

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
  const checkRepeatedDays = index => {

    setSelectedRepeatedDays((prev) => {
      const getDay = dayjs()
        .day(index + 1)
        .format("dddd");
      if (prev.includes(getDay)) {
        console.log('test');
        return prev.filter((x) => x !== getDay);
      } else {
        console.log('masuk');
        return [...prev, getDay];
      }
    });
  }

  const endRepeatedShift = (date, dateString) =>
    setForm((prev) => {
      return {
        ...prev,
        repeatedShift: { ...prev.repeatedShift, endDate: dateString },
      };
    });

  const addShift = async () => {
    if (selectedRepeatedDays.length > 0) {
      let newForm = form;
      newForm.repeatedShift.isRepeated = true;
      newForm.repeatedShift.repeatedDays = selectedRepeatedDays;
      newForm.repeatedShift.startRepeatedWeek = dayjs(newForm.date).endOf(
        "week"
      );
      setForm(newForm);
    }
    setShiftModal(false);
    await fetch(`/api/shifts`, {
      method: "POST",
      body: JSON.stringify(form),
      headers: {
        authorization: "Bearer " + session.data.user.accessToken,
      },
    });
    mutateEmployees([...employees]);

    message.success("Shift created");

    clearFields();
  };

  const editShift = async (result) => {
    if (
      result.destination &&
      result.source.droppableId !== result.destination.droppableId
    ) {
      await fetch(`/api/shifts/${result.draggableId}`, {
        method: "PUT",
        body: JSON.stringify({ date: dayjs(result.destination.droppableId) }),
        headers: {
          authorization: "Bearer " + session.data.user.accessToken,
        },
      });
      mutateEmployees([...employees]);

      message.success("Shift updated");
    }
  };

  const clearFields = () => {
    setForm({
      date: "",
      startTime: "",
      endTime: "",
      employees: [],
      location: "",
      position: null,
      notes: "",
      break: "",
      repeatedShift: {
        isRepeated: false,
        repeatedDays: [],
        endDate: null,
      },
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
      <div className="flex flex-col flex-1">
        <div className="border-b-[1px] border-[#E5E5E3] h-[71px] w-full flex items-center">
          <div className="px-4 py-1 flex w-full">
            <div className="flex border-[1px] border-[#E5E5E5] w-max">
              {/* <button
                onClick={() => setType("day")}
                className={`hover:bg-[#E5E5E3] ${
                  type === "day" ? "bg-[#E5E5E3]" : ""
                } transition duration-300 px-2 py-1 border-r-[1px] border-[#E5E5E5]`}
              >
                Day
              </button> */}
              <button
                onClick={() => setType("week")}
                className={`hover:bg-[#E5E5E3] ${
                  type === "week" ? "bg-[#E5E5E3]" : ""
                } duration-300 px-2 py-1 border-r-[1px] border-[#E5E5E5]`}
              >
                Weekly
              </button>
              {/* <button
                onClick={() => setType("month")}
                className={`hover:bg-[#E5E5E3] ${
                  type === "month" ? "bg-[#E5E5E3]" : ""
                } duration-300 px-2 py-1`}
              >
                Month
              </button> */}
            </div>

            <div className="flex justify-between items-center w-full px-4">
              <div className="w-72 h-full flex">
                <button
                  onClick={() =>
                    setWeeklyDateValue(weeklyDateValue.subtract(1, "week"))
                  }
                  disabled={weeklyDateValue
                    .startOf("week")
                    .isSameOrBefore(dayjs().startOf("week"))}
                  className={`hover:bg-[#E5E5E3] disabled:bg-stone-100 duration-300 px-2 py-1 border-l-[1px] border-b-[1px] border-t-[1px] border-[#E5E5E5]`}
                >
                  <Image
                    width={20}
                    height={20}
                    className="mt-[3px] rotate-90"
                    alt="arrow-down"
                    src={"/static/svg/arrow-down.svg"}
                  />
                </button>
                <DatePicker
                  className="rounded-none"
                  onChange={weeklyDateChange}
                  picker="week"
                  format={(value) =>
                    `${dayjs(value).startOf("week").format("D MMM")} - ${dayjs(
                      value
                    )
                      .endOf("week")
                      .format("D MMM")}`
                  }
                  value={weeklyDateValue}
                  disabledDate={disabledDate}
                />
                <button
                  onClick={() =>
                    setWeeklyDateValue(weeklyDateValue.add(1, "week"))
                  }
                  className={`hover:bg-[#E5E5E3] duration-300 px-2 py-1 border-r-[1px] border-b-[1px] border-t-[1px] border-[#E5E5E5]`}
                >
                  <Image
                    width={20}
                    height={20}
                    className="mt-[3px] -rotate-90"
                    alt="arrow-down"
                    src={"/static/svg/arrow-down.svg"}
                  />
                </button>
                <button
                  onClick={() => setWeeklyDateValue(dayjs())}
                  className={`hover:bg-[#E5E5E3] ml-4 duration-300 px-2 py-1 border-[1px] border-[#E5E5E5]`}
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
            <FilterComponent
              selectedFilter={selectedFilter}
              checkedFilter={checkedFilter}
              allFilterList={filterOptions}
            />
          </div>

          <div className="flex-1">
            <SchedulerComponent
              weeklyDateValue={weeklyDateValue}
              editShift={editShift}
              employees={clonedEmployees}
              listOfShifts={shifts}
              type={type}
            />
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
              onClick={() => addShift()}
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
                        disabledDate={disabledDate}
                        onChange={(date, dateString) =>
                          setForm((prev) => {
                            return { ...prev, date: dateString };
                          })
                        }
                        className="w-full mt-1 rounded-none border-t-0 border-l-0 border-r-0"
                      />

                      <div className="flex flex-col">
                        <span className="text-xs font-semibold mt-4">
                          REPEATED DAYS
                        </span>
                        <div className="flex mt-2">
                          {Array.from(Array(7)).map((x, index) => (
                            <p
                              onClick={() => checkRepeatedDays(index)}
                              className={`px-4 py-1 bg-white border-[1px] border-[#E5E5E3] hover:cursor-pointer mr-2 ${
                                selectedRepeatedDays.includes(
                                  dayjs()
                                    .day(index + 1)
                                    .format("dddd")
                                )
                                  ? "bg-stone-300"
                                  : undefined
                              }`}
                              key={index}
                            >
                              {dayjs()
                                .day(index + 1)
                                .format("ddd")}
                            </p>
                          ))}
                        </div>
                        <span className="text-xs font-semibold mt-4">ENDS</span>
                        <DatePicker
                          disabledDate={disabledDate}
                          onChange={endRepeatedShift}
                          className="w-full mt-1 rounded-none border-t-0 border-l-0 border-r-0"
                        />
                      </div>
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
                    <div className="mt-2">
                      {!showBreak && (
                        <button
                          onClick={() => setShowBreak(true)}
                          className="transition duration-300 px-1 py-1 hover:bg-[#E5E5E3] rounded-lg"
                        >
                          + ADD BREAK
                        </button>
                      )}

                      {showBreak && (
                        <div className="flex flex-col h-16 justify-center">
                          <div className="mt-3">
                            <button
                              onClick={() =>
                                setForm((prev) => {
                                  return { ...prev, break: "15" };
                                })
                              }
                              className={`border-[1px] border-[#E5E5E3] px-2 mr-2 ${
                                form.break === "15" ? "bg-[#F7F7F5]" : undefined
                              }`}
                            >
                              15 min
                            </button>
                            <button
                              onClick={() =>
                                setForm((prev) => {
                                  return { ...prev, break: "30" };
                                })
                              }
                              className={`border-[1px] border-[#E5E5E3] px-2 mr-2 ${
                                form.break === "30" ? "bg-[#F7F7F5]" : undefined
                              }`}
                            >
                              30 min
                            </button>
                            <button
                              onClick={() =>
                                setForm((prev) => {
                                  return { ...prev, break: "45" };
                                })
                              }
                              className={`border-[1px] border-[#E5E5E3] px-2 mr-2 ${
                                form.break === "45" ? "bg-[#F7F7F5]" : undefined
                              }`}
                            >
                              45 min
                            </button>
                            <button
                              onClick={() =>
                                setForm((prev) => {
                                  return { ...prev, break: "60" };
                                })
                              }
                              className={`border-[1px] border-[#E5E5E3] px-2 mr-2 ${
                                form.break === "60" ? "bg-[#F7F7F5]" : undefined
                              }`}
                            >
                              60 min
                            </button>
                            <div className="mt-2">
                              <button
                                onClick={() =>
                                  setShowBreak(false) &
                                  setForm((prev) => {
                                    return { ...prev, break: null };
                                  })
                                }
                                className="transition duration-300 px-1 py-1 hover:bg-[#E5E5E3] rounded-lg"
                              >
                                DELETE BREAK
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col mt-4">
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
                        <span className="text-xs font-semibold">NOTES</span>
                        <Input
                          onChange={(e) =>
                            setForm((prev) => {
                              return { ...prev, notes: e.target.value };
                            })
                          }
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
