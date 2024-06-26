"use client";

import Image from "next/image";
import { Avatar, Tooltip, Divider, Space } from "antd";
import { Fragment } from "react";
import dayjs from "dayjs";

const TimesheetsComponent = ({ employees, monthlyDateValue, onPress }) => {
  // Get the start date of the current week (Sunday)
  const daysInMonth = dayjs(monthlyDateValue).daysInMonth();

  const daysArray = [];

  for (let i = 1; i <= daysInMonth; i++) {
    const date = dayjs(monthlyDateValue).date(i);
    daysArray.push(date);
  }

  return (
    <div className="flex flex-col justify-center items-center">
      <div className={`w-full grid grid-cols-38`}>
        <div
          className={`${
            daysArray.length === 31
              ? "col-span-5"
              : daysArray.length === 28
              ? "col-span-8"
              : daysArray.length === 29
              ? "col-span-7"
              : "col-span-6"
          } bg-[#F7F7F7] py-8 flex justify-center items-center px-2`}
        >
          <span className="text-[#191407]">Monthly Timesheet</span>
          <Image
            width={24}
            height={24}
            alt="arrow-down"
            src={"/static/svg/arrow-down.svg"}
          />
        </div>

        {daysArray &&
          daysArray.map((x, index) => {
            return (
              <div
                className="bg-[#F7F7F7] py-8 flex flex-col justify-center items-center"
                key={x}
              >
                <span className="text-slate-700 font-semibold text-xs">
                  {dayjs(x).format("DD")}
                </span>
                <span className="text-slate-700 font-semibold text-xs">
                  {dayjs(x).format("dd")[0]}
                </span>
              </div>
            );
          })}

        <div className="bg-[#F7F7F7] px-4 flex justify-center items-center column-start-37 col-span-2">
          Total
        </div>
        {/* <div className="bg-[#F7F7F7] px-4 flex justify-center items-center column-start-38 col-span-1" /> */}

        {employees?.length > 0 ? (
          employees.map((row, index) => (
            <Fragment key={index}>
              <div
                className={`flex justify-center items-center ${
                  daysArray.length === 31
                    ? "col-span-5"
                    : daysArray.length === 28
                    ? "col-span-8"
                    : daysArray.length === 29
                    ? "col-span-7"
                    : "col-span-6"
                } bg-[#F2F2F2] h-[64px]`}
              >
                <div className="flex justify-center p-4 h-full w-full">
                  <div className="flex items-center">
                    <Avatar size={32} className="mr-2" />
                    <div className="flex flex-col justify-between">
                      <span className="text-[14px]">{row.name}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* timesheets */}

              {daysArray &&
                daysArray.map((dataItem, dataIndex) => (
                  <div key={dataIndex}>
                    <div className="flex justify-center items-center h-full w-full bg-[#F2F2F2]">
                      {!row?.timesheets
                        ?.map((x) => dayjs(x.date).format("MM-DD-YYYY"))
                        .includes(dayjs(dataItem).format("MM-DD-YYYY")) && (
                        <div onClick={() => onPress({id: row._id, date: dataItem}, 'create')} className="bg-stone-200 cursor-pointer border-r-2 border-black border-opacity-20 h-8 w-8" />
                      )}

                      {row.timesheets &&
                        row.timesheets.map((timesheet, timesheetIndex) => (
                          <>
                            {dayjs(dataItem).format("MM-DD-YYYY") ===
                              dayjs(timesheet.date).format("MM-DD-YYYY") && (
                                timesheet.status === 'Leave' || timesheet.status === 'Week Off' ? <div
                                  className={`${"bg-cyan-500"
                                  } border-r-2 border-black border-opacity-20 h-8 w-8 flex justify-center items-center text-white`}
                                >
                                  {timesheet.status === 'Leave' ? 'L' : 'T'}
                                </div> :
                              timesheet.status !== 'Absent' ? 
                              <div className="cursor-pointer" onClick={() => onPress(timesheet, 'edit')}>
                              <Tooltip
                                placement="bottom"
                                title={<div className="flex flex-col">
                                  <div className="w-48 flex justify-between">
                                    <span>First in</span>
                                    <span>{dayjs(timesheet.startTime).format('h:m a')}</span>
                                  </div>
                                  <div className="w-48 flex justify-between">
                                    <span>Last out</span>
                                    <span>{dayjs(timesheet.endTime).format('h:m a')}</span>
                                  </div>
                                  <Divider className="text-white bg-white my-2 py-0" />
                                  <div className="w-48 flex justify-between">
                                    <span>Regular</span>
                                    <span>{`${dayjs(timesheet.endTime).diff(
                                        timesheet.startTime,
                                        "hour"
                                      )}h ${dayjs(timesheet.endTime).diff(
                                        timesheet.startTime,
                                        "minute"
                                      ) - (dayjs(timesheet.endTime).diff(
                                        timesheet.startTime,
                                        "hour"
                                      ) * 60)}m`}</span>
                                  </div>
                                  <div className="w-48 flex justify-between">
                                    <span>Overtime</span>
                                    <span>-</span>
                                  </div>
                                </div>}
                                color="#464A65"
                                key="#464A65"
                              >
                                <div
                                  className={`${
                                    timesheet.status === "Present"
                                      ? "bg-green-500" : "bg-yellow-500"
                                  } border-r-2 border-black border-opacity-20 h-8 w-8 flex justify-center items-center text-white`}
                                >
                                  {dayjs(timesheet.endTime).diff(
                                        timesheet.startTime,
                                        "hour"
                                      )}
                                </div>
                              </Tooltip> </div> :    <div
                                  className={`${"bg-red-500"
                                  } border-r-2 border-black border-opacity-20 h-8 w-8 flex justify-center items-center text-white`}
                                >
                                  {"A"}
                                </div>
                            )}
                          </>
                        ))}
                    </div>
                  </div>
                ))}

              <div className="bg-[#F2F2F2] column-start-37 col-span-2 text-sm flex justify-center items-center">
                {row.total} hrs
              </div>
              {/* <div className="bg-[#F2F2F2] column-start-38 col-span-1 text-sm flex justify-left items-center"><Image
                    width={20}
                    height={20}
                    alt="checklist-icon"
                    src={"/static/svg/checklist.svg"}
                    className="rounded-full transition duration-300 hover:bg-stone-500 cursor-pointer"
                  /></div> */}
            </Fragment>
          ))
        ) : (
          <div className="col-span-full text-center mt-8">
            There is no data displayed!
          </div>
        )}
      </div>
    </div>
  );
};

export default TimesheetsComponent;
