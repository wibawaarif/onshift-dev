"use client";

import Image from "next/image";
import { Avatar } from "antd";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Fragment, useCallback, useEffect, useState } from "react";
import dayjs from "dayjs";
import Link from "next/link";
import PlusLogo from "@public/static/jsx/plus";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

const SchedulerComponent = ({
  type,
  employees,
  editShift,
  weeklyDateValue,
  addShiftFromTable,
  editShiftModal,
  deleteShiftModal,
  copyAction
}) => {
  // Get the current date

  // Get the start date of the current week (Sunday)
  const [isMultipleDelete, setIsMultipleDelete] = useState(false);
  const [isCopying, setIsCopying] = useState(false);
  const [copiedData, setCopiedData] = useState({});
  const startDate = weeklyDateValue.startOf("week");

  const weekSchedule = [];

  for (let i = 0; i < 7; i++) {
    const date = startDate.add(i, "day");
    weekSchedule.push(date.format("YYYY-MM-DD"));
  }

  // const [employees, setEmployees] = useState([]);
  const [rowIndex, setRowIndex] = useState(null);
  const [selectedMultipleDelete, setSelectedMultipleDelete] = useState([]);

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

  const configureMultipleSelected = (id) => {
    if (selectedMultipleDelete?.includes(id)) {
      const allSelected = [...selectedMultipleDelete];
      const index = allSelected.indexOf(id);
      if (index !== -1) {
        allSelected.splice(index, 1);
        setSelectedMultipleDelete(allSelected);
      }
    } else {
      setSelectedMultipleDelete([...selectedMultipleDelete, id]);
    }
  };

  const escFunction = useCallback((event) => {
    if (event.key === "Escape") {
        setIsCopying(false);
        setCopiedData({});
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", escFunction, false);

    return () => {
      document.removeEventListener("keydown", escFunction, false);
    };
  }, [escFunction]);

  return (
    <div className="flex flex-col h-full justify-start items-center">
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
          {/* <div className="h-[43px] w-[393px] flex justify-between">
            <div className="flex flex-col items-center">
              <span className="text-[20px]">{employees?.map(x => x?.shifts?.length).length}</span>
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
          </div> */}
          <div>
            {selectedMultipleDelete?.length > 0 && isMultipleDelete && (
              <button
                onClick={() =>
                  deleteShiftModal(selectedMultipleDelete, "multiple")
                }
                className={`mr-3 bg-red-500 hover:bg-red-700 text-white duration-300 px-2 py-1 border-[1px] border-[#E5E5E5]`}
              >
                Delete
              </button>
            )}
            <button
              onClick={() => setIsMultipleDelete(!isMultipleDelete)}
              className={`mr-3 ${
                isMultipleDelete
                  ? "bg-[#E5E5E3] hover:bg-white"
                  : "hover:bg-[#E5E5E3]"
              } duration-300 px-2 py-1 border-[1px] border-[#E5E5E5]`}
            >
              Select Multiple
            </button>
          </div>
        </div>
      </div>
      <div
        className={`w-full max-h-full overflow-y-auto grid ${
          type === "week" ? "grid-cols-9" : "grid-cols-25"
        }`}
      >
        <div
          className={`${
            type === "week" ? "col-span-2" : "col-span-6"
          } bg-white flex sticky top-0 items-center px-4 border-b-[1px] border-r-[1px] border-[#E5E5E3]`}
        >
          <Image
            className="mr-2"
            width={20}
            height={20}
            alt="sort"
            src={"/static/svg/sort.svg"}
          />
          <span className="text-[#191407] text-xs md:text-lg lg:text-lg">
            First Name A-Z
          </span>
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
          weekSchedule.map((x) => {
            return (
              <div
                className="bg-white flex sticky top-0 justify-center items-center h-[40px] border-b-[1px] border-r-[1px] border-[#E5E5E3]"
                key={x}
              >
                <span className="text-slate-700 text-xs md:text-base lg:text-base">
                  {dayjs(x).format("ddd D")}
                </span>
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
                } border border-[1px] border-[#E5E5E3] bg-white h-[64px]`}
              >
                <div className="flex justify-between p-4 h-full w-full">
                  <div className="flex items-center">
                    <Avatar size={32} className="mr-2" />
                    <div className="flex flex-col justify-between">
                      <span className="text-[14px]">{row.name}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* schedules */}
              <DragDropContext onDragEnd={editShift}>
                {/* DAY */}
                {
                  type === "day" && (
                    <div
                      className={`flex justify-center items-center col-span-24 bg-white border border-[1px] border-[#E5E5E3] h-full w-full`}
                    >
                      <div className="bg-[#E5E5E3] h-[96%] w-[97%] rounded-sm p-2">
                        <p className="text-[10px] font-semibold">
                          12AM to 12PM
                        </p>
                        {/* <p className="mt-[1px] text-[10px]">POSITION</p> */}
                        {/* <div className="w-[47px] h-[12px] bg-black rounded-xl flex justify-center items-center">
                          <span className="text-white text-[8px]">PENDING</span>
                        </div> */}
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
                  weekSchedule.map((dataItem, dataIndex) => (
                    <div key={dataIndex}>
                      <Droppable droppableId={`${dataItem}`}>
                        {(provided) => (
                          <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className={`flex justify-center items-center col-span-1 ${
                              dataIndex === 0 ? "first-child" : ""
                            } bg-white border border-[1px] border-[#E5E5E3] h-full w-full`}
                          >
                            {!row?.shifts
                              ?.map((x) => dayjs(x.date).format("MM-DD-YYYY"))
                              .includes(dayjs(dataItem).format("MM-DD-YYYY")) &&
                              !row?.shifts?.some(
                                (z, index) =>
                                  dayjs(dataItem).diff(
                                    dayjs(z?.repeatedShift?.endTime),
                                    "day"
                                  ) >=
                                    dayjs(
                                      z?.repeatedShift?.startRepeatedWeek
                                    ).diff(
                                      dayjs(z?.repeatedShift?.endTime),
                                      "day"
                                    ) &&
                                  dayjs(dataItem).diff(
                                    dayjs(z?.repeatedShift?.endDate),
                                    "day"
                                  ) < 0 &&
                                  z?.repeatedShift?.repeatedDays?.some(
                                    (x) => x === dayjs(dataItem).format("dddd")
                                  )
                              ) && (
                                <div
                                  onClick={isCopying ? () => copyAction(dayjs(dataItem), copiedData) : () =>
                                    addShiftFromTable(dayjs(dataItem), row._id)
                                  }
                                  className={`flex justify-center items-center col-span-1 bg-white group/item transition duration-300 hover:bg-stone-200 hover:bg-opacity-50 cursor-pointer h-full w-full`}
                                >
                                  <PlusLogo className="fill-slate-500 w-8 h-8 group/edit invisible group-hover/item:visible" />
                                </div>
                              )}

                            {row?.shifts?.length !== 0 &&
                              row?.shifts?.map(
                                (z, index) =>
                                  // (
                                  //   // repeated week
                                  //   <div
                                  //     key={index}
                                  //     className="bg-[#E5E5E3] h-[96%] w-[97%] rounded-sm p-2"
                                  //   >
                                  //     <p className="text-[10px] font-bold">
                                  //       {dayjs(z.startTime).format("h:mma")} -{" "}
                                  //       {dayjs(z.endTime).format("h:mma")} ·{" "}
                                  //       {dayjs(z.endTime).diff(
                                  //         dayjs(z.startTime),
                                  //         "hour"
                                  //       )}
                                  //       H
                                  //     </p>
                                  //     <div
                                  //       className={`flex ${
                                  //         !z?.position?.name &&
                                  //         !z?.location?.name &&
                                  //         "invisible"
                                  //       } justify-center items-center bg-[#191407] mt-1 px-2 py-[2px] w-max rounded-full`}
                                  //     >
                                  //       <span className="text-white text-[10px]">
                                  //         {z?.location?.name &&
                                  //         z?.position?.name
                                  //           ? `${z?.location.name} • ${z?.position.name}`
                                  //           : z?.location?.name
                                  //           ? `${z?.location?.name}`
                                  //           : `${z?.position?.name}`}
                                  //       </span>
                                  //     </div>
                                  //     <div className="relative">
                                  //             <Image
                                  //               onClick={() =>
                                  //                 editShiftModal(z)
                                  //               }
                                  //               onMouseEnter={() =>
                                  //                 setRowIndex(index)
                                  //               }
                                  //               width={16}
                                  //               height={16}
                                  //               className="hover:bg-stone-400 p-[1px] transition duration-300 rounded-full cursor-pointer absolute -bottom-3 right-3"
                                  //               alt="trash"
                                  //               src={"/static/svg/edit.svg"}
                                  //             />
                                  //             <Image
                                  //               onClick={() =>
                                  //                 deleteShiftModal(z._id)
                                  //               }
                                  //               width={16}
                                  //               height={16}
                                  //               className="hover:bg-stone-400 p-[1px] transition duration-300 rounded-full cursor-pointer absolute -bottom-3 -right-1"
                                  //               alt="trash"
                                  //               src={"/static/svg/trash.svg"}
                                  //             />
                                  //           </div>
                                  //   </div>
                                  // ) : (
                                  dayjs(z.date).format("YYYY-MM-DD") ===
                                    dataItem && (
                                    // non repeated week
                                    <Draggable
                                      key={z._id}
                                      draggableId={`${z._id}`}
                                      index={index}
                                    >
                                      {(provided) =>
                                        z?.category !== "TimeOff" ? (
                                          <div
                                            {...provided.draggableProps}
                                            ref={provided.innerRef}
                                            {...provided.dragHandleProps}
                                            className={`${
                                              selectedMultipleDelete?.includes(
                                                z?._id
                                              )
                                                ? "bg-red-200"
                                                : isCopying && copiedData?._id === z?._id ? "bg-cyan-200" : z?.status ? z?.status === 'Finished' ? 'bg-red-200' : 'bg-green-500' : "bg-[#E5E5E3]"
                                            } h-[96%] hover:animate-pulse group w-[97%] flex flex-col relative rounded-sm p-2`}
                                          >
                                            <p className="text-[10px] font-bold">
                                              {dayjs(z.startTime).format(
                                                "h:mma"
                                              )}{" "}
                                              -{" "}
                                              {dayjs(z.endTime).format("h:mma")}{" "}
                                              ·{" "}
                                              {dayjs(z.endTime).diff(
                                                dayjs(z.startTime),
                                                "hour"
                                              )}
                                              H
                                            </p>
                                            {z.platform === "Mobile App" && (
                                              <div
                                                className={`flex justify-center items-center bg-[#191407] mt-1 px-2 py-[2px] w-max rounded-full`}
                                              >
                                                <span className="text-white text-[10px]">
                                                  Mobile App
                                                </span>
                                              </div>
                                            )}
                                            {/* <div
                                              className={`flex ${
                                                z?.platform === 'Mobile App' &&
                                                "invisible"
                                              } justify-center items-center bg-[#191407] mt-1 px-2 py-[2px] w-max rounded-full`}
                                            >
                                              <span className="text-white text-[10px]">

                                              Mobile App
                                              </span>
                                            </div> */}
                                            <div
                                              className={`flex ${
                                                !z?.position?.name &&
                                                !z?.location?.name &&
                                                "invisible hidden"
                                              } justify-center items-center bg-[#191407] px-2 py-[1px] w-max rounded-full`}
                                            >
                                              <span className="text-white text-[10px]">
                                              {z?.location?.name}
                                              </span>
                                            </div>

                                            {/* <div className="w-full h-full flex justify-center items-end relative"> */}
                                            <button
                                              onClick={() => setIsCopying(true) & setCopiedData(z)}
                                              className={`px-2 text-[10px] text-white hidden group-hover:block bg-[#3b3b3b] absolute bottom-0 left-[54px] rounded-t-md w-max`}
                                            >
                                              COPY
                                            </button>
                                            <button
                                              onClick={() => editShiftModal(z)}
                                              onMouseEnter={() =>
                                                setRowIndex(index)
                                              }
                                              className={`px-2 text-[10px] text-white bg-[#3b3b3b] hidden group-hover:block absolute bottom-0 left-[100px] rounded-t-md w-max`}
                                            >
                                              EDIT
                                            </button>
                                            <button
                                              onClick={
                                                isMultipleDelete
                                                  ? () =>
                                                      configureMultipleSelected(
                                                        z?._id
                                                      )
                                                  : () =>
                                                      deleteShiftModal(
                                                        z._id,
                                                        "single"
                                                      )
                                              }
                                              className={`px-2 text-[10px] bg-[#3b3b3b] text-white absolute bottom-0 left-[140px] hidden group-hover:block rounded-t-md w-max`}
                                            >
                                              DELETE
                                            </button>

                                            {/* <Image
                                                onClick={() =>
                                                  editShiftModal(z)
                                                }
                                                onMouseEnter={() =>
                                                  setRowIndex(index)
                                                }
                                                width={16}
                                                height={16}
                                                className="hover:bg-stone-400 p-[1px] transition duration-300 rounded-full cursor-pointer"
                                                alt="trash"
                                                src={"/static/svg/edit.svg"}
                                              />
                                              <Image
                                                onClick={isMultipleDelete ? () => configureMultipleSelected(z?._id) : () =>
                                                  deleteShiftModal(z._id, 'single')
                                                }
                                                width={16}
                                                height={16}
                                                className="hover:bg-stone-400 p-[1px] transition duration-300 rounded-full cursor-pointer"
                                                alt="trash"
                                                src={"/static/svg/trash.svg"}
                                              /> */}
                                            {/* </div> */}
                                            {provided.placeholder}
                                          </div>
                                        ) : (
                                          <div
                                            {...provided.draggableProps}
                                            ref={provided.innerRef}
                                            {...provided.dragHandleProps}
                                            className="bg-[#E5E5E3] h-[96%] w-[97%] rounded-sm p-2"
                                          >
                                            <p className="text-[13px] font-semibold">
                                              ALL DAY
                                            </p>
                                            <p className="text-[13px]">
                                              TIME OFF
                                            </p>
                                            <div className="relative">
                                              <Image
                                                onClick={() =>
                                                  editShiftModal(z)
                                                }
                                                onMouseEnter={() =>
                                                  setRowIndex(index)
                                                }
                                                width={16}
                                                height={16}
                                                className="hover:bg-stone-400 p-[1px] transition duration-300 rounded-full cursor-pointer absolute -bottom-3 right-3"
                                                alt="trash"
                                                src={"/static/svg/edit.svg"}
                                              />
                                              <Image
                                                onClick={() =>
                                                  deleteShiftModal(z._id)
                                                }
                                                width={16}
                                                height={16}
                                                className="hover:bg-stone-400 p-[1px] transition duration-300 rounded-full cursor-pointer absolute -bottom-3 -right-1"
                                                alt="trash"
                                                src={"/static/svg/trash.svg"}
                                              />
                                            </div>
                                            {provided.placeholder}
                                          </div>
                                        )
                                      }
                                    </Draggable>
                                  )
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

        <div className="col-span-full bg-white h-[60px] border border-[1px] border-[#E5E5E3]">
          <div className="p-4 h-full w-full flex items-center">
            <Link href={"/dashboard/employee"}>+ Add Employee</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchedulerComponent;
