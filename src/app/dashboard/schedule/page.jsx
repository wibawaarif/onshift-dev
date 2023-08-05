"use client";

import useSWR from "swr";
import SchedulerComponent from "@/components/scheduler/page";
import FilterComponent from "@/components/filter/page";
import Image from "next/image";
import { InboxOutlined,DownloadOutlined } from '@ant-design/icons';
import Papa from "papaparse";
import { CSVLink } from "react-csv";
import {
  Modal,
  Tabs,
  ConfigProvider,
  DatePicker,
  TimePicker,
  Select,
  Input,
  message,
  Upload
} from "antd";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import _ from "lodash";
import dayjs from "dayjs";
import updateLocale from "dayjs/plugin/updateLocale";

const { Dragger } = Upload;

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
  const [actionType, setActionType] = useState(null);
  const [Id, setId] = useState(null);
  const [uploadedEmployees, setUploadedEmployees] = useState(null);
  const [isFormInvalid, setIsFormInvalid] = useState(true);
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

    if (form.date !== "" && form.startTime !== "" && form.endTime !== "" && form.location !== null && form.employees.length > 0) {
      if (selectedRepeatedDays.length > 0) {
        if (form.repeatedShift.endDate === null) {
          setIsFormInvalid(true);
        } else {
          setIsFormInvalid(false);
        }
      } else {
        setIsFormInvalid(false)
      }
      return
    }

    setIsFormInvalid(true)

  }, [form, selectedRepeatedDays])

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

  // upload action
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
              setUploadedEmployees(parsedData.data)
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

  const disabledDate = (current) => {
    // const currentDate = dayjs(current);

    // const startOfWeek = dayjs().startOf('week')
    // const endOfWeek = dayjs().endOf('week')

    // return currentDate.isBefore(startOfWeek) || currentDate.isAfter(endOfWeek);

    return current && current < dayjs().endOf("day");
  };

  const headers = [
    {
      label: "Date",
      key: "dame"
    },
    {
      label: "Start Time",
      key: "startTime"
    },
    {
      label: "End Time",
      key: "endTime"
    },
    {
      label: "Break",
      key: "break"
    },
    {
      label: "Notes",
      key: "notes"
    },
    {
      label: "Notes",
      key: "notes"
    },
    {
      label: "Employees",
      key: "employees"
    },
    {
      label: "isRepeated",
      key: "repeatedShift.isRepeated"
    },
    {
      label: "startRepeatedWeek",
      key: "repeatedShift.startRepeatedWeek"
    },
    {
      label: "repeatedDays",
      key: "repeatedShift.repeatedDays"
    },
    {
      label: "endDate",
      key: "repeatedShift.endDate"
    },
  ]

  const filterOptions = [
    {
      name: "LOCATIONS / (DESELECT ALL)",
      options: locations?.map((location) => location?.name),
    },
    {
      name: "POSITIONS / (DESELECT ALL)",
      options: positions?.map((position) => position?.name),
    },
    {
      name: "EMPLOYEES / (DESELECT ALL)",
      options: employees?.map((employee) => employee?.name),
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
        return prev.filter((x) => x !== getDay);
      } else {
        return [...prev, getDay];
      }
    });
  }

  const endRepeatedShift = date => {  
    setForm((prev) => {
      return {
        ...prev,
        repeatedShift: { ...prev.repeatedShift, endDate: date },
      };
    });
  }

  const editShiftModal = data => {
    setId(data._id)
    setForm(prev => { return { ...prev, ...data, location: data?.location?._id, position: data?.position?._id, startTime: dayjs(data.startTime), endTime: dayjs(data.endTime), date: dayjs(data.date), repeatedShift: {...prev.repeatedShift, startRepeatedWeek: dayjs(data.repeatedShift.startRepeatedWeek), endDate: dayjs(data.repeatedShift.endDate)} } })
    setActionType('edit')
    setShiftModal(true)
  } 

  const addShiftFromTable = (date, id) => {
    setForm(prev => { return { ...prev, date, employees: [...prev.employees, id] } })
    setActionType('add')
    setShiftModal(true)
  }

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
    mutateEmployees([...shifts]);

    message.success("Shift created");

    clearFields();
  };

  const editDraggableShift = async () => {
    await fetch(`/api/shifts/${Id}`, {
      method: "PUT",
      body: JSON.stringify(form),
      headers: {
        authorization: "Bearer " + session.data.user.accessToken,
      },
    });
    setShiftModal(false);
    mutateEmployees([...employees]);

    message.success("Shift updated");
    clearFields();
  }

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
      location: null,
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
                  allowClear={false}
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
                <button onClick={() => setShiftModal(true) & setActionType("exportImport")} className="hover:bg-[#E5E5E3] mr-3 duration-300 px-2 py-1 border-[1px] border-[#E5E5E5]">
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
              addShiftFromTable={addShiftFromTable}
              weeklyDateValue={weeklyDateValue}
              editShift={editShift}
              editShiftModal={editShiftModal}
              employees={clonedEmployees}
              listOfShifts={shifts}
              type={type}
            />
          </div>
        </div>

        {/* MODAL ADD NEW SHIFT / TIME OFF */}
        <Modal
          footer={[ actionType === "exportImport" ? <div className="mr-3 inline-block w-32 h-8 hover:bg-[#E5E5E3] px-4 py-1 border-[1px] border-[#E5E5E3] rounded-sm"><CSVLink
          data={shifts}
          headers={headers}
          filename={"my-file.csv"}
          key="back"
          target="_blank"
        >
            <div className="flex justify-center items-center">
          <DownloadOutlined className="mr-2 my-0 py-0 text-black" /> <span className="text-black">DOWNLOAD</span>
          </div>
        </CSVLink></div> :
            <button
              className="mr-3 hover:bg-[#E5E5E3] px-4 py-1 border-[1px] border-[#E5E5E3] rounded-sm"
              key="back"
              onClick={() => setShiftModal(false) & clearFields()}
            >
              CANCEL
            </button>,
             actionType === "exportImport" ? 
             <button
               onClick={() => addUploadedEmployees()}
               className="bg-black text-white rounded-sm border-[1px] border-black px-4 py-1 hover:opacity-80"
               key="submit"
             >
               <div>
               UPLOAD
               </div>
             </button> :
            <button
              disabled={isFormInvalid}
              onClick={actionType === 'add' ? () => addShift() : () => editDraggableShift()}
              className="bg-black text-white rounded-sm px-4 py-1 disabled:opacity-50 hover:opacity-80"
              key="submit"
            >
              {actionType === 'add' ? 'CREATE' : 'EDIT'}
            </button>,
          ]}
          title="Create New Shift"
          open={shiftModal}
          onCancel={() => setShiftModal(false) & clearFields()}
        >
          {
            actionType === 'exportImport' &&  (
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

          {
            actionType !== 'exportImport' && 
            <Tabs
            defaultActiveKey="1"
            items={[
              {
                key: "1",
                label: "CREATE SHIFT",
                children: (
                  <div>
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold">DATE <span className="text-xs text-red-500">*</span></span>
                      <DatePicker
                        disabledDate={disabledDate}
                        value={form?.date}
                        onChange={date =>
                          setForm((prev) => {
                            return { ...prev, date: date };
                          })
                        }
                        className="w-full mt-1 rounded-none border-t-0 border-l-0 border-r-0"
                      />

                      <div className="flex flex-col">
                        <span className="text-xs font-semibold mt-4">
                          REPEATED DAYS
                        </span>
                        <div className="flex mt-2">
                          {Array.from(Array(7))?.map((x, index) => (
                            <p
                              onClick={() => checkRepeatedDays(index)}
                              className={`px-4 py-1 border-[1px] border-[#E5E5E3] hover:cursor-pointer mr-2 ${
                                selectedRepeatedDays?.includes(
                                  dayjs()
                                    .day(index + 1)
                                    .format("dddd")
                                )
                                  ? "bg-stone-300"
                                  : "bg-white"
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
                          value={form?.repeatedShift?.endDate}
                          disabledDate={disabledDate}
                          disabled={selectedRepeatedDays?.length === 0}
                          onChange={endRepeatedShift}
                          className="w-full mt-1 rounded-none border-t-0 border-l-0 border-r-0"
                        />
                      </div>
                    </div>

                    <div className="flex mt-4 justify-between">
                      <div className="w-[48%] ">
                        <span className="text-xs font-semibold">
                          START SHIFT  <span className="text-xs text-red-500">*</span>
                        </span>
                        <TimePicker
                          value={form?.startTime}
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
                          FINISH SHIFT  <span className="text-xs text-red-500">*</span>
                        </span>
                        <TimePicker
                          value={form?.endTime}
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
                      <span className="text-xs font-semibold">EMPLOYEE  <span className="text-xs text-red-500">*</span></span>
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
                        value={form?.employees}
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
                        <span className="text-xs font-semibold">LOCATION  <span className="text-xs text-red-500">*</span></span>
                        <Select
                          value={form?.location}
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
                          value={form?.position}
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
                          value={form?.notes}
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
          }
        </Modal>

        <button
          onClick={() => setShiftModal(true) & setActionType('add')}
          className="hover:opacity-80 transition duration-300 absolute bottom-10 right-10 w-[220px] h-[40px] bg-black text-white rounded-full text-[14px]"
        >
          + CREATE SHIFT / TIME OFF
        </button>
      </div>
    </ConfigProvider>
  );
};

export default Scheduler;
