"use client";

import Image from "next/image";
import { Avatar } from "antd";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Fragment, useState, useEffect } from "react";

const SchedulerComponent = ({ type }) => {
  const listOfEmployees = [
    {
      employeeDetail: {
        name: "Arif Wibawa",
        totalHours: "12hr",
      },
      schedules: [
        {
          id: "h7yUg1iD4cSISD",
          name: "Austin",
          time: "1:00A - 5:00P",
          total: "7hrs",
        },
        {
          id: "DUvZnxWuK14co90ZlDQZ",
          name: "Jessie",
          time: "1am to 5pm",
          total: "89hrs",
        },
        {
          id: "4B58mk3Oi",
          name: "Irene",
          time: "11am to 7pm",
          total: "38hrs",
        },
        {
          id: "ss0IBd6bIvfn0",
          name: "Ernest",
          time: "11am to 5pm",
          total: "17hrs",
        },
        {
          id: "nO4wLQVEUOwRC",
          name: "Sallie",
          time: "12am to 10pm",
          total: "9hrs",
        },
        {
          id: "zsJS3WkAHEeXb7E4nMqs",
          name: "Isabelle",
          time: "12am to 10pm",
          total: "7hrs",
        },
        {
          id: "JYnaeCT6ZuXafu",
          name: "Etta",
          time: "8am to 7pm",
          total: "68hrs",
        },
      ],
    },
    {
      employeeDetail: {
        name: "John Doe",
        totalHours: "8hr",
      },
      schedules: [
        {
          id: "z2EnspI7zkLOkQU7yd",
          name: "Lettie",
          time: "10am to 2pm",
          total: "71hrs",
        },
        {
          id: "1QINY",
          name: "Blanche",
          time: "5am to 7pm",
          total: "91hrs",
        },
        {
          id: "ZzPfEddIP86G",
          name: "Alta",
          time: "11am to 9pm",
          total: "69hrs",
        },
        {
          id: "hbfFNEqsn430nXyf",
          name: "Linnie",
          time: "6am to 6pm",
          total: "88hrs",
        },
        {
          // name: "Genevieve",
          // time: "3am to 4pm",
          // total: "99hrs",
        },
        {
          id: "fZf6GnLVyrmImJ2nmbwp",
          name: "Genevieve",
          time: "5am to 6pm",
          total: "72hrs",
        },
        {
          id: "datxunAzma3K0EYa",
          name: "Craig",
          time: "12am to 1pm",
          total: "57hrs",
        },
      ],
    },
    // {
    //   employeeDetail: {
    //     name: "Michael",
    //     totalHours: "8hr",
    //   },
    //   schedules: [
    //     {
    //       id: 1,
    //       name: "Lettie",
    //       time: "10am to 2pm",
    //       total: "71hrs",
    //     },
    //     {
    //       id: 2,
    //       name: "Blanche",
    //       time: "5am to 7pm",
    //       total: "91hrs",
    //     },
    //     {
    //       id: 3,
    //       name: "Alta",
    //       time: "11am to 9pm",
    //       total: "69hrs",
    //     },
    //     {
    //       id: 4,
    //       name: "Linnie",
    //       time: "6am to 6pm",
    //       total: "88hrs",
    //     },
    //     {
    //       id: 5,
    //       name: "Genevieve",
    //       time: "3am to 4pm",
    //       total: "99hrs",
    //     },
    //     {
    //       id: 6,
    //       name: "Genevieve",
    //       time: "5am to 6pm",
    //       total: "72hrs",
    //     },
    //     {
    //       id: 7,
    //       name: "Craig",
    //       time: "12am to 1pm",
    //       total: "57hrs",
    //     },
    //   ],
    // },
  ];

  const [employees, setEmployees] = useState([]);
  const [rowIndex, setRowIndex] = useState(null);

  useEffect(() => {
    setEmployees(listOfEmployees);
  }, []);

  const week = [
    "Mon 7",
    "Tue 8",
    "Wed 9",
    "Thu 10",
    "Fri 11",
    "Sat 12",
    "Sun 13",
  ];

  const day = [
    "12AM",
    "1AM",
    "2AM",
    "3AM",
    "4AM",
    "5AM",
    "6AM",
    "7AM",
    "8AM",
    "9AM",
    "10AM",
    "11AM",
    "12PM",
    "1PM",
    "2PM",
    "3PM",
    "4PM",
    "5PM",
    "6PM",
    "7PM",
    "8PM",
    "9PM",
    "10PM",
    "11PM",
  ];

  const updateTable = (result) => {
    if (
      result.destination &&
      result.source.droppableId !== result.destination.droppableId
    ) {
      let newListOfEmployees = [...employees];
      newListOfEmployees[result.source.index].schedules[
        result.destination.droppableId
      ] =
        newListOfEmployees[result.source.index].schedules[
          result.source.droppableId
        ];
      newListOfEmployees[result.source.index].schedules[
        result.source.droppableId
      ] = {};
      setEmployees(newListOfEmployees);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="w-full h-[90px] bg-white border-b-[1px] border-[#E5E5E3]">
        {/* header table */}
        <div className="p-6 flex h-full w-full justify-between items-center">
          <div className="flex flex-col">
            <p className="text-[20px]">
              {type === "week" ? "Weekly Total" : "Daily Total"}
            </p>
            <p className="text-[14px] text-[#7D7D80]">
              The data is displayed based on the specified filters
            </p>
          </div>
          <div className="h-[43px] w-[393px] flex justify-between">
            <div className="flex flex-col items-center">
              <span className="text-[20px]">6</span>
              <span className="text-[#7D7D80] text-[10px]">SHIFTS</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[20px]">40h</span>
              <span className="text-[#7D7D80] text-[10px]">HOURS</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[20px]">$800</span>
              <span className="text-[#7D7D80] text-[10px]">WAGE</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[20px]">$2000</span>
              <span className="text-[#7D7D80] text-[10px]">SALES</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[20px]">40%</span>
              <span className="text-[#7D7D80] text-[10px]">LABOR %</span>
            </div>
          </div>
        </div>
      </div>
      <div
        className={`w-full grid ${
          type === "week" ? "grid-cols-9" : "grid-cols-25"
        }`}
      >
        <div
          className={`${
            type === "week" ? "col-span-2" : "col-span-6"
          } bg-white flex items-center px-4 border-b-[1px] border-r-[1px] border-[#E5E5E3]`}
        >
          <Image
            className="mr-2"
            width={20}
            height={20}
            alt="sort"
            src={"/static/svg/sort.svg"}
          />
          <span className="text-[#191407]">First Name A-Z</span>
          <Image
            width={24}
            height={24}
            alt="arrow-down"
            src={"/static/svg/arrow-down.svg"}
          />
        </div>

        {type === "day" &&
          day.map((x) => {
            return (
              <div
                className="bg-white flex justify-center items-center h-[40px] border border-[1px] border-[#E5E5E3]"
                key={x}
              >
                <div className="px-1">
                  <span className="text-slate-700 text-sm">{x}</span>
                </div>
              </div>
            );
          })}

        {type === "week" &&
          week.map((x) => {
            return (
              <div
                className="bg-white flex justify-center items-center h-[40px] border-b-[1px] border-r-[1px] border-[#E5E5E3]"
                key={x}
              >
                <span className="text-slate-700">{x}</span>
                <Image
                  className="ml-[8px]"
                  alt="chart"
                  width={16}
                  height={16}
                  src={"/static/svg/chart.svg"}
                />
              </div>
            );
          })}


        {employees &&
          employees.map((row, index) => (
            <Fragment key={index}>
              <div
                className={`flex justify-center items-center ${
                  type === "week" ? "col-span-2" : "col-span-6"
                } border border-[1px] border-[#E5E5E3] bg-white h-[64px] w-[262px]`}
              >
                <div className="flex justify-between p-4 h-full w-full">
                  <div className="flex items-center">
                    <Avatar size={32} className="mr-2" />
                    <div className="flex flex-col justify-between">
                      <span className="text-[14px]">
                        {row.employeeDetail.name}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* schedules */}
              <DragDropContext onDragEnd={updateTable}>
              {/* DAY */}
                {type === "day" &&
                (
                  <div
                          className={`flex justify-center items-center col-span-24 bg-white border border-[1px] border-[#E5E5E3] h-full w-full`}
                        >
                          <div className="bg-[#E5E5E3] h-[96%] w-[97%] rounded-sm p-2">
                            <p className="text-[10px] font-semibold">12AM to 12PM</p>
                            <p className="mt-[1px] text-[10px]">POSITION</p>
                            <div className="w-[47px] h-[12px] bg-black rounded-xl flex justify-center items-center">
                              <span className="text-white text-[8px]">
                                PENDING
                              </span>
                            </div>
                          </div>
                        </div>
                )
                  // day.map((row, dataIndex) => {
                  //   return (
                  //     <div key={dataIndex}>
                  //       <div
                  //         className={`flex justify-center items-center col-span-1 ${
                  //           dataIndex === 0 ? "first-child" : ""
                  //         } bg-white border border-[1px] border-[#E5E5E3] h-full w-full`}
                  //       >
                  //         <div className="bg-[#E5E5E3] h-[96%] w-[97%] rounded-sm p-2">
                  //           <p className="text-[10px] font-semibold">tes</p>
                  //           <p className="mt-[1px] text-[10px]">tes</p>
                  //           <div className="w-[47px] h-[12px] bg-black rounded-xl flex justify-center items-center">
                  //             <span className="text-white text-[8px]">
                  //               PENDING
                  //             </span>
                  //           </div>
                  //         </div>
                  //       </div>
                  //     </div>
                  //   );
                  // })
                }

                {/* WEEK */}
                {type === "week" &&
                  row.schedules.map((dataItem, dataIndex) => (
                    <div key={dataIndex}>
                      <Droppable droppableId={`${dataIndex}`}>
                        {(provided) => (
                          <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className={`flex justify-center items-center col-span-1 ${
                              dataIndex === 0 ? "first-child" : ""
                            } bg-white border border-[1px] border-[#E5E5E3] h-full w-full`}
                          >
                            {dataItem.id && (
                              <Draggable
                                key={dataItem.id}
                                draggableId={`${dataItem.id}`}
                                index={index}
                              >
                                {(provided) => (
                                  <div
                                    {...provided.draggableProps}
                                    ref={provided.innerRef}
                                    {...provided.dragHandleProps}
                                    onMouseEnter={() => setRowIndex(index)}
                                    className="bg-[#E5E5E3] h-[96%] w-[97%] rounded-sm p-2"
                                  >
                                    <p className="text-[10px] font-semibold">
                                      {dataItem.time} · {dataItem.total}
                                    </p>
                                    <p className="mt-[1px] text-[10px]">
                                      LOCATION · POSITI...
                                    </p>
                                    <div className="w-[47px] h-[12px] bg-black rounded-xl flex justify-center items-center">
                                      <span className="text-white text-[8px]">
                                        PENDING
                                      </span>
                                    </div>
                                    {provided.placeholder}
                                  </div>
                                )}
                              </Draggable>
                            )}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </div>
                  ))}
              </DragDropContext>
            </Fragment>
          ))}

        <div
          className="col-span-full bg-white h-[60px] border border-[1px] border-[#E5E5E3]"
        >
          <div className="p-4 h-full w-full flex items-center">
            <button>+ Add Employee</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchedulerComponent;
