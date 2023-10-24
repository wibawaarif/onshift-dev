"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Input,
  Avatar,
  Modal,
  Select,
  Tabs,
  Checkbox,
  message,
  Popover,
  DatePicker,
  Dropdown
} from "antd";
import { ConfigProvider } from "antd";
import Image from "next/image";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import TimesheetsComponent from "@/components/timesheets/page";
import ApprovalsComponent from "@/components/approvals/page";
import dayjs from "dayjs";
import _ from "lodash";
import updateLocale from "dayjs/plugin/updateLocale";
import { CSVLink } from "react-csv";

dayjs.extend(updateLocale);
dayjs.updateLocale("en", {
  weekStart: 1,
});

const fetcher = ([url, token]) =>
  fetch(url, { headers: { authorization: "Bearer " + token } }).then((res) =>
    res.json()
  );

const Timesheet = () => {
  const session = useSession();
  


  // const { data: employees, mutate: mutateEmployees } = useSWR(
  //   [`/api/employees`, session.data.user.accessToken],
  //     fetcher
  //   );

  const [monthlyDateValue, setMonthlyDateValue] = useState(dayjs());
  const [clonedEmployees, setClonedEmployees] = useState([]);
  const [searchEmployeesInput, setSearchEmployeesInput] = useState('');
  const [section, setSection] = useState('Timesheet');

  const employees = useMemo(() => [{
    _id: 1,
    name: '010_REHMAN SAMA',
    timesheets: [{
      date: dayjs().date(6).subtract(1, 'month'),
      shiftStartTime: dayjs().year(2023).month(7).date(13).hour(3),
      shiftEndTime: dayjs().year(2023).month(7).date(13).hour(11),
      startTime: dayjs().date(6).add(4, 'hour').add(21, 'minute'),
      endTime: dayjs().date(6).add(10, 'hour'),
      status: 'Present',
    }, {
      date:  dayjs().date(13),
      shiftStartTime: dayjs().year(2023).month(7).date(13).hour(5),
      shiftEndTime: dayjs().year(2023).month(7).date(13).hour(10),
      startTime: dayjs().year(2023).month(7).date(13).hour(6),
      endTime: dayjs().year(2023).month(7).date(13).hour(9),
      status: 'Late',
    }, 
    {
      date:  dayjs().date(29) ,
      status: 'Absent',
    }],
    total: 9
  }, {
    _id: 2,
    name: '013_KAMRAN SAMA',
    timesheets: [{
      date: dayjs().date(2) ,
      shiftStartTime: dayjs().year(2023).month(7).date(13).hour(1),
      shiftEndTime: dayjs().year(2023).month(7).date(13).hour(4),
      startTime: dayjs().year(2023).month(7).date(13).hour(2),
      endTime: dayjs().year(2023).month(7).date(13).hour(3),
      status: 'Present',
    }, {
      date:  dayjs().date(24) ,
      status: 'Absent',
    }, {
      date:  dayjs().date(21) ,
      shiftStartTime: dayjs().year(2023).month(7).date(13).hour(5),
      shiftEndTime: dayjs().year(2023).month(7).date(13).hour(11),
      startTime: dayjs().year(2023).month(7).date(21).hour(6),
      endTime: dayjs().year(2023).month(7).date(21).hour(9),
      status: 'Present',
    }],
    total: 4
  }], [])

  useEffect(() => {
    setClonedEmployees(_.cloneDeep(employees));
  }, [employees]);

  useEffect(() => {
    const filteredList = _.cloneDeep(employees)?.filter((x) => {
      return x.name.toLocaleLowerCase().includes(searchEmployeesInput.toLocaleLowerCase())
    });

    if (searchEmployeesInput) {
      setClonedEmployees(filteredList);
    } else {
      setClonedEmployees(_.cloneDeep(employees));
    }
  }, [searchEmployeesInput]);


  const monthlyDateChange = (date, dateString) => {
    setMonthlyDateValue(date);
  };
  

  const clearFields = () => {

  };

  const headers = [
    {
      label: "Name",
      key: "name",
    },
    {
      label: "Date",
      key: "date"
    },
    {
      label: "Shift Start Time",
      key: "shiftStartTime"
    },
    {
      label: "Start Time",
      key: "startTime"
    },
    {
      label: "Shift End Time",
      key: "shiftEndTime"
    },
    {
      label: "End Time",
      key: "endTime"
    },
    {
      label: "Status",
      key: "status"
    }
  ];



  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#191407",
        },
      }}
    >
      <div className="flex-1 flex flex-col">
        <div className="h-[71px] flex justify-between items-center px-8 py-1 border-b-[1px] border-[#E5E5E3]">
          <div className="w-48 flex">
            <Input
              onChange={e => setSearchEmployeesInput(e.target.value)}
              placeholder="Search employee"
              className="rounded-sm"
              prefix={
                <Image width={20} height={20} src={"/static/svg/lup.svg"} />
              }
            />
          </div>

          <div className="flex w-48 justify-between">
              <p onClick={() => setSection('Timesheet')} className={`${section === 'Timesheet' ? 'text-black' : 'text-[#B5B5B5] '} font-semibold cursor-pointer`}>Timesheet</p>
              <p onClick={() => setSection('Approvals')} className={`${section === 'Approvals' ? 'text-black' : 'text-[#B5B5B5] '} font-semibold cursor-pointer`}>Approvals</p>
          </div>


          <div>
          <CSVLink
                  data={clonedEmployees.reduce((acc, employee) => {
                    const { name, timesheets } = employee;

                    timesheets.forEach((timesheets) => {
                      acc.push({
                        name,
                        ...timesheets,
                      date: dayjs(timesheets.date).format("DD/MM/YYYY"),
                      shiftStartTime: timesheets.status === 'Absent'? '-' : dayjs(timesheets.shiftStartTime).format("hh:mmA"),
                      shiftEndTime: timesheets.status === 'Absent'? '-' : dayjs(timesheets.shiftEndTime).format("hh:mmA"),
                      startTime: timesheets.status === 'Absent'? '-' : dayjs(timesheets.startTime).format("hh:mmA"),
                      endTime: timesheets.status === 'Absent'? '-' : dayjs(timesheets.endTime).format("hh:mmA"),
                      })
                    })

                    return acc
                  }, [])}
                  headers={headers}
                  filename={"my-file.csv"}
                  key="back"
                  target="_blank"
                >
            <button className="hover:bg-[#E5E5E3] mr-3 duration-300 px-2 py-1 border-[1px] border-[#E5E5E5]">
              Export Sheet
            </button>
            </CSVLink>
          </div>
        </div>

        <div className="flex-1 flex flex-col">

          <div className="flex px-8 justify-between items-center h-[62px]">
            <div className="w-56 h-max flex">
          <button
                  onClick={() =>
                    setMonthlyDateValue(monthlyDateValue.subtract(1, "month"))
                  }
                  className={`hover:bg-[#E5E5E3] duration-300 px-2 py-1 border-l-[1px] border-b-[1px] border-t-[1px] border-[#E5E5E5]`}
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
                  onChange={monthlyDateChange}
                  picker="month"
                  allowClear={false}
                  format={(value) =>
                    `${dayjs(value).format("MMMM")} - ${dayjs(value).format("YYYY")}`
                  }
                  value={monthlyDateValue}
                />
                <button
                  onClick={() =>
                    setMonthlyDateValue(monthlyDateValue.add(1, "month"))
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
                </div>

            <div className="flex justify-between items-center w-96">
              <Dropdown
              menu={{items: [{ key: '1', label: (<div>Test</div>) }]}}
              >
                <div>
                <a onClick={(e) => e.preventDefault()}>
                  All tracked hour
                </a>
                </div>
              </Dropdown>

              <Dropdown
              menu={{items: [{ key: '1', label: (<div>Test</div>) }]}}
              >
                <div>
                <a onClick={(e) => e.preventDefault()}>
                  Group
                </a>
                </div>
              </Dropdown>

              <Dropdown
              menu={{items: [{ key: '1', label: (<div>Test</div>) }]}}
              >
                <div>
                <a onClick={(e) => e.preventDefault()}>
                  Members
                </a>
                </div>
              </Dropdown>

              <Dropdown
              menu={{items: [{ key: '1', label: (<div>Test</div>) }]}}
              >
                <div>
                <a onClick={(e) => e.preventDefault()}>
                  Schedule
                </a>
                </div>
              </Dropdown>

            </div>

          </div>

          <div className="flex-1">
            {
              section === 'Timesheet' ? <TimesheetsComponent employees={clonedEmployees} monthlyDateValue={monthlyDateValue} /> : <ApprovalsComponent monthlyDateValue={monthlyDateValue} employees={clonedEmployees} />
            }
          </div>

        </div>
      </div>
    </ConfigProvider>
  );
};

export default Timesheet;
