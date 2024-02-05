"use client";

import useSWR from "swr";
import SchedulerComponent from "@/components/scheduler/page";
import FilterComponent from "@/components/filter/page";
import Image from "next/image";
import { InboxOutlined, DownloadOutlined } from "@ant-design/icons";
import { read, utils } from 'xlsx';
import {
  Modal,
  Tabs,
  ConfigProvider,
  DatePicker,
  Select,
  Input,
  message,
  Upload,
  AutoComplete,
  Dropdown
} from "antd";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import _ from "lodash";
import dayjs from "dayjs";
import updateLocale from "dayjs/plugin/updateLocale";
import axios from "axios";
import { shiftTemplates } from "@/utils/schedule";
import PlaceComponent from "@/components/place-autocomplete/page";
import GoogleMaps from "@/components/google-maps/page";

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
    [`/api/shifts`, `${session.data.user.accessToken} #${session.data.user.workspace}`],
    fetcher
  );
  const { data: locations, mutate: mutateLocation } = useSWR(
    [`/api/locations`, `${session.data.user.accessToken} #${session.data.user.workspace}`],
    fetcher
  );
  const { data: positions } = useSWR(
    [`/api/positions`, `${session.data.user.accessToken} #${session.data.user.workspace}`],
    fetcher
  );
  const { data: employees, mutate: mutateEmployees } = useSWR(
    [`/api/employees`, `${session.data.user.accessToken} #${session.data.user.workspace}`],
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
  const [uploadedShifts, setUploadedShifts] = useState(null);
  const [isFormInvalid, setIsFormInvalid] = useState(true);
  const [currentTab, setCurrentTab] = useState("1");
  const [locationModal, setLocationModal] = useState(false);
  // const [items, setItems] = useState([
  //   {
  //     label: "12/06/2017",
  //     key: "1"
  //   }
  // ])
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

  const [formLocation, setFormLocation] = useState({
    name: "",
    address: "",
    latitude: null,
    longitude: null,
    radius: 500,
  });
  const [address, setAddress] = useState(null);
  const [latitude, setLatitude] = useState(24.432928);
  const [longitude, setLongitude] = useState(54.644539);

  const [timeoffForm, setTimeoffForm] = useState({
    date: "",
    employee: [],
    reason: "",
    workspace: "",
  })
  const options = [];
  const [shiftTemplate, setShiftTemplate] = useState('')

  const items = [
    {
      key: "1",
      type: "group",
      label: "Copy this week to:",
      children: [
        {
          label: `${dayjs(weeklyDateValue).add("1", "week").startOf('week').format('DD MMM')} - ${dayjs(weeklyDateValue).add("1", "week").endOf('week').format('DD MMM')}`,
          key: 1,
        },
        {
          label: `${dayjs(weeklyDateValue).add("2", "week").startOf('week').format('DD MMM')} - ${dayjs(weeklyDateValue).add("2", "week").endOf('week').format('DD MMM')}`,
          key: 2,
        },
        {
          label: `${dayjs(weeklyDateValue).add("3", "week").startOf('week').format('DD MMM')} - ${dayjs(weeklyDateValue).add("3", "week").endOf('week').format('DD MMM')}`,
          key: 3,
        },
        {
          label: `${dayjs(weeklyDateValue).add("4", "week").startOf('week').format('DD MMM')} - ${dayjs(weeklyDateValue).add("4", "week").endOf('week').format('DD MMM')}`,
          key: 4,
        },
      ]
    },
  ]

  var x = 30; //minutes interval
  var times = []; // time array
  var tt = 0; // start time
  var ap = ["AM", "PM"]; // AM-PM

  for (var i = 0; tt < 24 * 60; i++) {
    var hh = Math.floor(tt / 60); // getting hours of day in 0-24 format
    var mm = tt % 60; // getting minutes of the hour in 0-55 format
    options[i] = {
      value:
        ("0" + (hh % 12)).slice(-2) +
        ":" +
        ("0" + mm).slice(-2) +
        ap[Math.floor(hh / 12)],
      label:
        ("0" + (hh % 12)).slice(-2) +
        ":" +
        ("0" + mm).slice(-2) +
        ap[Math.floor(hh / 12)],
    };
    tt = tt + x;
  }

  useEffect(() => {
    if (employees?.length !== 0) {
      setClonedEmployees(_.cloneDeep(employees));
    }
  }, [employees]);

  useEffect(() => {
    if (
      form.date !== "" &&
      form.startTime !== "" &&
      form.endTime !== "" &&
      form.location !== null &&
      form.employees.length > 0
    ) {
      if (selectedRepeatedDays.length > 0) {
        if (form.repeatedShift.endDate === null) {
          setIsFormInvalid(true);
        } else {
          setIsFormInvalid(false);
        }
      } else {
        setIsFormInvalid(false);
      }
      return;
    }

    setIsFormInvalid(true);
  }, [form, selectedRepeatedDays]);

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
    name: "file",
    multiple: false,
    action:"https://www.mocky.io/v2/5cc8019d300000980a055e76",
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
        const result = utils.sheet_to_json(ws, {header: ['#', 'date', 'startTime', 'endTime', 'break', 'employeeId', 'notes'], range: 3, blankrows: false});
        console.log(result)
         setUploadedShifts(result);

        } else {

        Papa.parse(data, {
          complete: (parsedData) => {
            // Process the parsed data here
            console.log(parsedData.data)
            setUploadedShifts(parsedData.data);
          },
          header: true,
        });
        }
      };
      reader.readAsBinaryString(info.file)


    },
    onDrop(e) {
      console.log("Dropped files", e.dataTransfer.files);
    },
  };

  const disabledDate = (current) => {
    // const currentDate = dayjs(current);

    // const startOfWeek = dayjs().startOf('week')
    // const endOfWeek = dayjs().endOf('week')

    // return currentDate.isBefore(startOfWeek) || currentDate.isAfter(endOfWeek);

    return current && current < dayjs().endOf("day");
  };

  const disableForMonth = (current) => {

    return current && current < dayjs().endOf("day") || current > dayjs().add(30, 'day')
  }

  const headers = [
    {
      label: "date",
      key: "date",
    },
    {
      label: "startTime",
      key: "startTime",
    },
    {
      label: "endTime",
      key: "endTime",
    },
    {
      label: "break",
      key: "break",
    },
    {
      label: "notes",
      key: "notes",
    },
    {
      label: "employees",
      key: "employees",
    },
    {
      label: "isRepeated",
      key: "repeatedShift.isRepeated",
    },
    {
      label: "startRepeatedWeek",
      key: "repeatedShift.startRepeatedWeek",
    },
    {
      label: "repeatedDays",
      key: "repeatedShift.repeatedDays",
    },
    {
      label: "endDate",
      key: "repeatedShift.endDate",
    },
  ];

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
  const checkRepeatedDays = (index) => {
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
  };

  const endRepeatedShift = (date) => {
    setForm((prev) => {
      return {
        ...prev,
        repeatedShift: { ...prev.repeatedShift, endDate: date },
      };
    });
  };

  const editShiftModal = (data) => {
    setId(data._id);
    if (data.repeatedShift.repeatedDays.length > 0) {
      setSelectedRepeatedDays(data.repeatedShift.repeatedDays);
      setForm((prev) => {
        return {
          ...prev,
          ...data,
          location: data?.location?._id,
          position: data?.position?._id,
          startTime: dayjs(data.startTime).format('hh:mmA'),
          endTime: dayjs(data.endTime).format('hh:mmA'),
          date: dayjs(data.date),
          repeatedShift: {
            ...prev.repeatedShift,
            startRepeatedWeek: dayjs(data.repeatedShift.startRepeatedWeek),
            endDate: dayjs(data.repeatedShift.endDate),
          },
        };
      });
    } else {
      if (data?.category === "TimeOff") {
        setCurrentTab("2")
        setTimeoffForm((prev) => {
          return {
            ...prev,
            ...data,
            date: dayjs(data.date)
          }
        })
      } else {
        setCurrentTab("1")
        setForm((prev) => {
          return {
            ...prev,
            ...data,
            location: data?.location?._id,
            position: data?.position?._id,
            startTime: dayjs(data.startTime).format('hh:mmA'),
            endTime: dayjs(data.endTime).format('hh:mmA'),
            date: dayjs(data.date),
          };
        });
      }
    }

    setActionType("edit");
    setShiftModal(true);
  };

  const deleteShiftModal = (id, type) => {
    setId(id);
    setShiftModal(true);
    if (type === "single") {
      setActionType("delete");
    } else {
      setActionType("deleteMultiple");
      }
    }

  const addLocation = async () => {
    setLocationModal(false);
    const data = await fetch(`/api/locations`, {
      method: "POST",
      body: JSON.stringify({...formLocation, address, longitude, latitude, workspace: session.data.user.workspace}),
      headers: {
        authorization: "Bearer " + session.data.user.accessToken,
      },
    });

    const res = await data.json();

    if (res.error === "Location already exists") {
      message.error("Location already exists");
      clearFields();
      return;
    }
    mutateLocation([...locations, formLocation]);

    message.success("Location created");
    clearFields();
  };

  const addShiftFromTable = (date, id) => {
    setSelectedRepeatedDays([]);
    setForm((prev) => {
      return { ...prev, date, employees: [...prev.employees, id] };
    });
    setTimeoffForm((prev) => {
      return { ...prev, date, employee: [...prev.employee, id] }
    })
    setActionType("add");
    setShiftModal(true);
  };

  const addTimeoff = async () => {
    setShiftModal(false);
    await fetch(`/api/leave`, {
      method: "POST",
      body: JSON.stringify({...timeoffForm, workspace: session.data.user.workspace}),
      headers: {
        authorization: "Bearer " + session.data.user.accessToken,
      },
    });
    mutateEmployees([...employees]);
    mutateEmployees([...shifts]);

    message.success("TimeOff created");

    clearFields();
  }

  const editTimeoff = async () => {
    await fetch(`/api/shifts/${Id}`, {
      method: "PUT",
      body: JSON.stringify(timeoffForm),
      headers: {
        authorization: "Bearer " + session.data.user.accessToken,
      },
    });
    setShiftModal(false);
    mutateEmployees([...employees]);

    message.success("Timeoff updated");
    clearFields();
  }

  const addShift = async () => {
    const validateEndTime = isStartGreaterThanEnd();
    form.startTime = dayjs()
      .hour(
        form.startTime.slice(5, 7) === "PM"
          ? Number(form.startTime.slice(0, 2)) + 12
          : Number(form.startTime.slice(0, 2))
      )
      .minute(Number(form.startTime.slice(3, 5)));
    form.endTime = dayjs()
      .hour(
        form.endTime.slice(5, 7) === "PM"
          ? Number(form.endTime.slice(0, 2)) + 12
          : Number(form.endTime.slice(0, 2))
      )
      .minute(Number(form.endTime.slice(3, 5)));
    if (validateEndTime) {
      message.error("End time must be greater than start time");
      return;
    }

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
      body: JSON.stringify({...form, workspace: session.data.user.workspace, category: 'Shift'}),
      headers: {
        authorization: "Bearer " + session.data.user.accessToken,
      },
    });
    // mutateEmployees([...employees]);
    mutateEmployees([...shifts]);

    message.success("Shift created");

    clearFields();
  };

  const editDraggableShift = async () => {
    if (selectedRepeatedDays.length > 0) {
      let newForm = form;
      newForm.repeatedShift.isRepeated = true;
      newForm.repeatedShift.repeatedDays = selectedRepeatedDays;
      newForm.repeatedShift.startRepeatedWeek = dayjs(newForm.date).endOf(
        "week"
      );
      setForm(newForm);
    }
    form.startTime = dayjs()
    .hour(
      form.startTime.slice(5, 7) === "PM"
        ? Number(form.startTime.slice(0, 2)) + 12
        : Number(form.startTime.slice(0, 2))
    )
    .minute(Number(form.startTime.slice(3, 5)));
  form.endTime = dayjs()
    .hour(
      form.endTime.slice(5, 7) === "PM"
        ? Number(form.endTime.slice(0, 2)) + 12
        : Number(form.endTime.slice(0, 2))
    )
    .minute(Number(form.endTime.slice(3, 5)));

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

  const copyAction = async (date, shift) => {
    delete shift["_id"];
    await fetch(`/api/shifts`, {
      method: "POST",
      body: JSON.stringify({...shift, date, workspace: session.data.user.workspace, category: 'Shift'}),
      headers: {
        authorization: "Bearer " + session.data.user.accessToken,
      },
    });
      mutateEmployees([...employees]);

      message.success("Shift copied");
  };

  const downloadTemplate = async () => {
    const req = await axios({
      method: "GET",
      url: `/static/templates/Onshift_Shift_Template.xlsx`,
      responseType: "blob",
    });
    var blob = new Blob([req.data], {
      type: req.headers["content-type"],
    });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = `Onshift_Shift_Template.xlsx`;
    link.click();
  };

  const handleCopyShift = async (e) => {
    console.log(e, 'test')
    await fetch(`/api/copy-shifts`, {
      method: "POST",
      body: JSON.stringify({workspace: session.data.user.workspace, current: weeklyDateValue , week: e.key}),
      headers: {
        authorization: "Bearer " + session.data.user.accessToken,
      },
    });
      mutateEmployees([...employees]);

      message.success("Shift copied");
  }

  const deleteShift = async () => {
    setShiftModal(false);
    await fetch(`/api/shifts/${Id}`, {
      method: "DELETE",
      headers: {
        authorization: "Bearer " + session.data.user.accessToken,
      },
    });
    mutateEmployees([...employees]);

    message.success("Shift deleted");
  };

  const deleteBulk = async () => {
    setShiftModal(false);
    for (let i = 0; i < Id?.length; i++) {
      await fetch(`/api/shifts/${Id[i]}`, {
        method: "DELETE",
        headers: {
          authorization: "Bearer " + session.data.user.accessToken,
        },
      });
    }

    mutateEmployees([...employees]);

    message.success("Shift deleted");
  };

  const addUploadedShifts = async () => {
    let allShifts = []
    setShiftModal(false);
    if (uploadedShifts?.length === 0) {
      message.error('No data inserted');
      return
    }
    for (let i = 0; i < uploadedShifts.length; i++) {
      if (
        uploadedShifts[i].date &&
        uploadedShifts[i].startTime &&
        uploadedShifts[i].endTime &&
        uploadedShifts[i].employeeId
      ) {
        const shiftToBeSend = {
          date: dayjs(uploadedShifts[i].date),
          startTime: dayjs(uploadedShifts[i].date).set('hour', dayjs(uploadedShifts[i].startTime, 'HH:mm').hour()).set('minute', dayjs(uploadedShifts[i].startTime, 'HH:mm').minute()),
          endTime: dayjs(uploadedShifts[i].date).set('hour', dayjs(uploadedShifts[i].endTime, 'HH:mm').hour()).set('minute', dayjs(uploadedShifts[i].endTime, 'HH:mm').minute()),
          employeeId: uploadedShifts[i].employeeId,
          break: uploadedShifts[i].break + '',
          notes: uploadedShifts[i].notes + '',
          workspace: session.data.user.workspace,
        }
        
        allShifts.push(shiftToBeSend)
      }
    }

    const res = await fetch(`/api/shifts-bulk`, {
      method: "POST",
      body: JSON.stringify(allShifts),
      headers: {
        authorization: "Bearer " + session.data.user.accessToken,
      },
    });
    const respMessage = await res.json();

    if (respMessage.info === "email existed") {
      message.error(`${respMessage.error}`);
    }

    message.success("Shift created");
    mutateEmployees([...employees]);

  };

  const isStartGreaterThanEnd = () => {
    if (form.startTime && form.endTime) {
      return dayjs(form.startTime).isAfter(dayjs(form.endTime));
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
    setTimeoffForm({
      date: "",
      employee: [],
      reason: "",
      workspace: "",
    })
    setShiftTemplate('')
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
                <Dropdown className="hover:bg-[#E5E5E3] mr-3 duration-300 cursor-pointer px-2 py-1 border-[1px] border-[#E5E5E5]" trigger="click" menu={{items, onClick: handleCopyShift}}>
                  <p>Copy Shifts</p>
                </Dropdown>
                <button
                  onClick={() =>
                    setShiftModal(true) & setActionType("exportImport")
                  }
                  className="hover:bg-[#E5E5E3] mr-3 duration-300 px-2 py-1 border-[1px] border-[#E5E5E5]"
                >
                  Export / Print
                </button>
                <button className="hover:bg-[#E5E5E3] duration-300 px-2 py-1 border-[1px] border-[#E5E5E5]">
                  Statistic
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-1 overflow-y-auto">
          <div className="w-[202px] border-r-[1px] border-[#E5E5E3] overflow-y-auto h-full">
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
              deleteShiftModal={deleteShiftModal}
              employees={clonedEmployees}
              listOfShifts={shifts}
              type={type}
              copyAction={copyAction}
            />
          </div>
        </div>

        {/* MODAL ADD NEW SHIFT / TIME OFF */}
        <Modal
              maskClosable={false}
          footer={[
            // actionType === "exportImport" ? (
            //   <div className="mr-3 inline-block w-32 h-8 hover:bg-[#E5E5E3] px-4 py-1 border-[1px] border-[#E5E5E3] rounded-sm">
            //     <CSVLink
            //       data={shifts}
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
            // ) :
             (
              <button
                className="mr-3 hover:bg-[#E5E5E3] px-4 py-1 border-[1px] border-[#E5E5E3] rounded-sm"
                key="back"
                onClick={() => setShiftModal(false) & clearFields()}
              >
                CANCEL
              </button>
            ),
            actionType === "exportImport" ? (
              <button
                onClick={() => addUploadedShifts()}
                className="bg-black text-white rounded-sm border-[1px] border-black px-4 py-1 hover:opacity-80"
                key="submit"
              >
                <div>UPLOAD</div>
              </button>
            ) : currentTab === "1" ? (
              <button
                disabled={isFormInvalid && actionType !== "delete" && actionType !== "deleteMultiple"}
                onClick={
                  actionType === "add"
                    ? () => addShift()
                    : actionType === "delete"
                    ? () => deleteShift()
                    : actionType === "deleteMultiple" ? () => deleteBulk() : () => editDraggableShift()
                }
                className="bg-black text-white rounded-sm px-4 py-1 disabled:opacity-50 hover:opacity-80"
                key="submit"
              >
                {actionType === "add"
                  ? "CREATE"
                  : actionType === "delete" || actionType === "deleteMultiple"
                  ? "CONFIRM"
                  : "EDIT"}
              </button>
            ) : <button onClick={actionType === "delete" ? () => deleteShift() : actionType === "deleteMultiple" ? () => deleteBulk()  : actionType === "edit" ? () => editTimeoff() : () => addTimeoff()} disabled={actionType !== "delete" && (!timeoffForm.date || !timeoffForm.employee)} className="bg-black text-white rounded-sm px-4 py-1 disabled:opacity-50 hover:opacity-80"
            key="submit">{actionType === "delete" ? "CONFIRM" : actionType === "edit" ? "EDIT" : "CREATE"}</button>,
          ]}
          title="Create New Shift"
          open={shiftModal}
          onCancel={() => setShiftModal(false) & clearFields()}
          width={800}
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
                <p className="ant-upload-hint">
                  Support for a single or bulk upload. Strictly prohibited from
                  uploading company data or other banned files.
                </p>
              </Dragger>
            </div>
          )}

          {actionType === "delete" && (
            <p>Are you sure want to delete this shift?</p>
          )}

          {
           actionType === "deleteMultiple" && (
            <p>Are you sure want to delete all selected shift?</p> 
           )}
          {(actionType === "add" || actionType === "edit") && (
            <Tabs
              onChange={(x) => setCurrentTab(x)}
              defaultActiveKey="1"
              activeKey={currentTab}
              items={[
                {
                  key: "1",
                  label: "CREATE SHIFT",
                  children: (
                    <div>
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold">
                          DATE <span className="text-xs text-red-500">*</span>
                        </span>
                        <DatePicker
                          disabledDate={disabledDate}
                          value={form?.date}
                          onChange={(date) =>
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
                          <span className="text-xs font-semibold mt-4">
                            ENDS
                          </span>
                          <DatePicker
                            value={form?.repeatedShift?.endDate}
                            disabledDate={disableForMonth}
                            disabled={selectedRepeatedDays?.length === 0}
                            onChange={endRepeatedShift}
                            className="w-full mt-1 rounded-none border-t-0 border-l-0 border-r-0"
                          />
                        </div>
                      </div>

                      <div className="flex mt-4 justify-between">
                        <div className="w-[48%] ">
                          <span className="text-xs font-semibold">
                            START SHIFT{" "}
                            <span className="text-xs text-red-500">*</span>
                          </span>
                          <AutoComplete
                            className="w-full"
                            value={form.startTime}
                            onChange={(data, option) =>
                              setForm((prev) => {
                                return { ...prev, startTime: data };
                              })
                            }
                            onSelect={(data, option) =>
                              setForm((prev) => {
                                return { ...prev, startTime: option.label };
                              })
                            }
                            placeholder="Select Start Time"
                            filterOption={(inputValue, option) =>
                              option.value
                                .toUpperCase()
                                .indexOf(inputValue.toUpperCase()) !== -1
                            }
                            options={options}
                          />

                        </div>
                        <div className="w-[48%]">
                          <span className="text-xs font-semibold">
                            FINISH SHIFT{" "}
                            <span className="text-xs text-red-500">*</span>
                          </span>
                          <AutoComplete
                            className="w-full"
                            value={form.endTime}
                            onChange={(data, option) =>
                              setForm((prev) => {
                                return { ...prev, endTime: data };
                              })
                            }
                            onSelect={(data, option) =>
                              setForm((prev) => {
                                return { ...prev, endTime: option.label };
                              })
                            }
                            placeholder="Select End Time"
                            filterOption={(inputValue, option) =>
                              option.value
                                .toUpperCase()
                                .indexOf(inputValue.toUpperCase()) !== -1
                            }
                            options={options}
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
                                  form.break === "15"
                                    ? "bg-[#F7F7F5]"
                                    : undefined
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
                                  form.break === "30"
                                    ? "bg-[#F7F7F5]"
                                    : undefined
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
                                  form.break === "45"
                                    ? "bg-[#F7F7F5]"
                                    : undefined
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
                                  form.break === "60"
                                    ? "bg-[#F7F7F5]"
                                    : undefined
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
                        <span className="text-xs font-semibold">
                          EMPLOYEE{" "}
                          <span className="text-xs text-red-500">*</span>
                        </span>
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
                          <span className="text-xs font-semibold">
                            LOCATION{" "}
                            <span className="text-xs text-red-500">*</span>
                          </span>
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
                          <span className="text-xs font-semibold">
                            POSITION
                          </span>
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
                      <div className="w-full">
                      <button
                          onClick={() => setLocationModal(true)}
                          className="mt-2 transition duration-300 px-1 py-1 hover:bg-[#E5E5E3] rounded-lg"
                        >
                          + ADD LOCATION
                        </button>
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
                      <p className="text-xs font-semibold mt-3">
                        OR, CHOOSE FROM A SHIFT TEMPLATES
                      </p>
                      <div className="w-full mt-2 grid-cols-2 gap-7 grid">
                        {
                          shiftTemplates.map((x, index) =>  <div key={index} onClick={() => setShiftTemplate(`${x.startTime} - ${x.endTime}`) & setForm((prev) => { return { ...prev, startTime: x.startTime, endTime: x.endTime } })} className={`h-10 ${x.color} px-5 justify-between flex items-center hover:opacity-80 cursor-pointer py-1 rounded-md`}>
                          <p>{ `${x.startTime} - ${x.endTime}` }</p>
                          {
                            shiftTemplate === `${x.startTime} - ${x.endTime}` && <Image
                            width={20}
                            height={20}
                            alt="checklist-icon"
                            src={"/static/svg/checklist.svg"}
                          />
                          }
                        </div>
                          )
                        }
                        {/* <div className="h-10 bg-cyan-100 px-5 justify-between flex items-center hover:opacity-80 cursor-pointer py-1 rounded-md">
                          <p>09:00 AM - 05:00 PM</p>
                          <Image
                            width={20}
                            height={20}
                            alt="checklist-icon"
                            src={"/static/svg/checklist.svg"}
                          />
                        </div>

                        <div className="h-10 bg-red-100 px-5 flex items-center hover:opacity-80 cursor-pointer  py-1 rounded-md">
                          <p>01:00 PM - 06:00 PM</p>
                        </div> */}
                      </div>
                    </div>
                  ),
                },
                {
                  key: "2",
                  label: "CREATE TIME OFF",
                  children: (
                    <div>
                       <span className="text-xs font-semibold">
                          DATE <span className="text-xs text-red-500">*</span>
                        </span>
                        <DatePicker
                          disabledDate={disabledDate}
                          value={timeoffForm?.date}
                          onChange={(date) =>
                            setTimeoffForm((prev) => {
                              return { ...prev, date: date };
                            })
                          }
                          className="w-full mt-1 rounded-none border-t-0 border-l-0 border-r-0"
                        />

                                              {/* <div className="flex mt-4 justify-between">
                        <div className="w-[48%] ">
                          <span className="text-xs font-semibold">
                            START SHIFT{" "}
                            <span className="text-xs text-red-500">*</span>
                          </span>
                          <AutoComplete
                            className="w-full"
                            value={timeoffForm.startTime}
                                                        disabled={allday}
                            onChange={(data, option) =>
                              setTimeoffForm((prev) => {
                                return { ...prev, startTime: data };
                              })
                            }
                            onSelect={(data, option) =>
                              setTimeoffForm((prev) => {
                                return { ...prev, startTime: option.label };
                              })
                            }
                            placeholder="Select Start Time"
                            filterOption={(inputValue, option) =>
                              option.value
                                .toUpperCase()
                                .indexOf(inputValue.toUpperCase()) !== -1
                            }
                            options={options}
                          />

                        </div>
                        <div className="w-[48%]">
                          <span className="text-xs font-semibold">
                            FINISH SHIFT{" "}
                            <span className="text-xs text-red-500">*</span>
                          </span>
                          <AutoComplete
                            className="w-full"
                            disabled={allday}
                            value={timeoffForm.endTime}
                            onChange={(data, option) =>
                              setTimeoffForm((prev) => {
                                return { ...prev, endTime: data };
                              })
                            }
                            onSelect={(data, option) =>
                              setTimeoffForm((prev) => {
                                return { ...prev, endTime: option.label };
                              })
                            }
                            placeholder="Select End Time"
                            filterOption={(inputValue, option) =>
                              option.value
                                .toUpperCase()
                                .indexOf(inputValue.toUpperCase()) !== -1
                            }
                            options={options}
                          />
                        </div>
                      </div> */}

                  {/* <Checkbox
                  className="mt-2"
                    value={allday}
                    onChange={(e) => setAllday(e.target.checked)}
                  >
                    All Day
                  </Checkbox> */}

<div className="flex flex-col mt-4">
                        <span className="text-xs font-semibold">
                          EMPLOYEE{" "}
                          <span className="text-xs text-red-500">*</span>
                        </span>
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
                          value={timeoffForm?.employee}
                          options={employees?.map((x) => {
                            return { label: x.name, value: x._id };
                          })}
                          onChange={(e) =>
                            setTimeoffForm((prev) => {
                              return { ...prev, employee: e };
                            })
                          }
                        />
                      </div>
                      <div className="flex flex-col mt-4">
                        <span className="text-xs font-semibold">
                          Reason{" "}
                          <span className="text-xs text-red-500">*</span>
                        </span>
                          <Select
                            value={timeoffForm?.reason}
                            className="mt-1"
                            options={[{label: "Week off", value: "Week off"}, {label: "Annual Leave", value: "Annual Leave"}, {label: "Sick Leave", value: "Sick Leave"}, {label: "Bereavement Leave", value: "Bereavement Leave"}, {label: "Unpaid Leave", value: "Unpaid Leave"}]}
                            onChange={(e) =>
                              setTimeoffForm((prev) => {
                                return { ...prev, reason: e };
                              })
                            }
                          />
                        </div>
                    </div>
                  ),
                },
              ]}
            />
          )}

<Modal
      maskClosable={false}
        footer={[
          <button
            className="mr-3 hover:bg-[#E5E5E3] px-4 py-1 border-[1px] border-[#E5E5E3] rounded-sm"
            key="back"
            onClick={() => setLocationModal(false) & setAddress(null) & setLatitude(24.432928) & setLongitude(54.644539)}
          >
            CANCEL
          </button>,
          <button
            onClick={
         addLocation
            }
            disabled={!address || !formLocation.radius || !formLocation.name}
            className="bg-black text-white rounded-sm px-4 disabled:opacity-50 py-1 hover:opacity-80"
            key="submit"
          >
            CREATE
          </button>,
        ]}
        title={
          "Create Location"
        }
        open={locationModal}
        onCancel={() => setLocationModal(false) & setAddress(null) & setLatitude(24.432928) & setLongitude(54.644539)}
      >

            <div className="mt-4">
              <span className="text-xs font-semibold">LOCATION NAME</span>
              <Input
                value={formLocation.name}
                onChange={(e) =>
                  setFormLocation((prev) => {
                    return { ...prev, name: e.target.value };
                  })
                }
                className="rounded-none border-t-0 border-l-0 border-r-0"
                placeholder="e.g My Location"
              />
            </div>

            <div className="mt-4">
              <span className="text-xs font-semibold">ADDRESS</span>
              <PlaceComponent address={address} setAddress={setAddress} setLatitude={setLatitude} setLongitude={setLongitude} style="w-full px-2 py-1 border-b-[1px] border-[#E5E5E3]" />
            </div>

            <div className="mt-4">
              <span className="text-xs font-semibold">RADIUS</span>
                          <Input
                          type="number"
                value={formLocation.radius}
                onChange={(e) =>
                  setFormLocation((prev) => {
                    return { ...prev, radius: Number(e.target.value) };
                  })
                }
                className="rounded-none border-t-0 border-l-0 border-r-0"
                placeholder="Enter radius..."
              />
              </div>
            <div className="mt-2 px-1 py-1 border-[1px] border-[#E5E5E3]">
              <GoogleMaps radius={formLocation.radius} latitude={latitude} longitude={longitude} setLatitude={setLatitude} setLongitude={setLongitude} />
            </div>


      </Modal>

        </Modal>

        <button
          onClick={() => setActionType("add") & setShiftModal(true)}
          className="hover:opacity-80 transition duration-300 absolute bottom-10 right-10 w-[220px] h-[40px] rounded-full text-[14px] bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          + CREATE SHIFT / TIME OFF
        </button>
      </div>
    </ConfigProvider>
  );
};

export default Scheduler;
