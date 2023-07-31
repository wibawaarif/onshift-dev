"use client";

import Image from "next/image";
import { Avatar } from "antd";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Fragment, useState, useEffect } from "react";
import dayjs from "dayjs";

const TimesheetsComponent = ({ employees }) => {

    // Get the current date
  const currentMonth = dayjs().month();

  // Get the start date of the current week (Sunday)
  const daysInMonth = dayjs().daysInMonth();

  const daysArray = [];

  for (let i = 1; i <= daysInMonth; i++) {
    const date = dayjs().date(i);
    daysArray.push(date);
  }

  // const [employees, setEmployees] = useState([]);
  const [rowIndex, setRowIndex] = useState(null);


  return (
    <div className="flex flex-col justify-center items-center">
      <div
        className={`w-full grid grid-cols-38`}
      >
        <div
          className={`col-span-5 bg-[#F7F7F7] py-8 flex justify-center items-center px-2`}
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
                <span className="text-slate-700 text-xs">{dayjs(x).format('DD')}</span>
                <span className="text-slate-700 text-xs">{dayjs(x).format('dd')[0]}</span>

              </div>
            );
          })}
        
        <div className="bg-[#F7F7F7] px-4 flex justify-center items-center column-start-37 col-span-2">
          Total
        </div>

        {employees &&
          employees.map((row, index) => (
            <Fragment key={index}>
              <div
                className={`flex justify-center items-center col-span-5 bg-[#F2F2F2] h-[64px]`}
              >
                <div className="flex justify-between p-4 h-full w-full">
                  <div className="flex items-center">
                    <Avatar size={32} className="mr-2" />
                    <div className="flex flex-col justify-between">
                      <span className="text-[14px]">
                        {row.name}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* timesheets */}

                {daysArray &&
                  daysArray.map((dataItem, dataIndex) => (
                    <div key={dataIndex}>
                      
                      {
                        row.time
                      }
                          {/* <div
                            className={`flex justify-center items-center col-span-1 bg-white h-full w-full`}
                          >
                            
                            {
                              row.timesheets && row.timesheets.map((z, index) => (
                                z.date === dayjs(dataItem).format('YYYY-MM-DD') ?
                                  <div
                                  key={index}
                                    className={`${dayjs(dataItem).format('YYYY-MM-DD') === z.date ? 'bg-green-600' : 'bg-[#E5E5E3]'} h-8 w-4 rounded-sm p-2`}
                                  >
                                  </div> : <div
                                  key={index}
                                    className={`bg-[#E5E5E3] h-8 w-4 rounded-sm p-2`}
                                  >
                                  </div>
                              ))
                            }
                          </div> */}
                    </div>
                  ))}

                  <div className="bg-[#F2F2F2] column-start-37 col-span-2">1 hrs</div>

            </Fragment>
          ))}
      </div>
    </div>
  );
};

export default TimesheetsComponent;
