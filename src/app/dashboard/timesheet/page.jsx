"use client";

import { useState } from "react";
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
import dayjs from "dayjs";

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

  const employees = [{
    name: '010_REHMAN SAMA',
    timesheets: [{
      date: dayjs().date(6) ,
      startTime: dayjs().date(6).add(4, 'hour'),
      endTime: dayjs().date(6).add(10, 'hour'),
      status: 'Present',
    }, {
      date:  dayjs().date(13) ,
      startTime: dayjs().date(13).hour(6),
      endTime: dayjs().date(13).hour(9),
      status: 'Late',
    }, 
    {
      date:  dayjs().date(29) ,
      status: 'Absent',
    }],
    total: 9
  }, {
    name: '013_KAMRAN SAMA',
    timesheets: [{
      date: dayjs().date(2) ,
      startTime: dayjs().date(13).hour(2),
      endTime: dayjs().date(13).hour(3),
      status: 'Present',
    }, {
      date:  dayjs().date(24) ,
      status: 'Absent',
    }, {
      date:  dayjs().date(21) ,
      startTime: dayjs().date(21).hour(6),
      endTime: dayjs().date(21).hour(9),
      status: 'Present',
    }],
    total: 4
  }]
  

  const clearFields = () => {

  };


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
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search employee"
              className="rounded-sm"
              prefix={
                <Image width={20} height={20} src={"/static/svg/lup.svg"} />
              }
            />
          </div>
        </div>

        <div className="flex-1 flex flex-col">

          <div className="flex px-8 justify-between items-center h-[62px]">
            <DatePicker
              className="rounded-none"
              format={"MM/DD"}
              picker="week"
            />

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
              <TimesheetsComponent employees={employees} />
          </div>

        </div>
      </div>
    </ConfigProvider>
  );
};

export default Timesheet;
