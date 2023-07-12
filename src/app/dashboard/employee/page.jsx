"use client"

import { ConfigProvider } from "antd";
import FilterComponent from "@/components/filter/page";

const Employee = () => {
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
      name: "ROLE / (DESELECT ALL)",
      options: [
        "Administrator",
        "Employee",
      ],
    },
    {
      name: "STATUS / (DESELECT ALL)",
      options: [
        "Not invited",
        "Pending Approval",
        "Invited",
        "Joined"
      ],
    },
  ];


  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#191407",
        },
      }}
    >
      <div className="flex flex-col flex-1">
      <div className="flex flex-1">
          <div className="w-[202px] border-r-[1px] border-[#E5E5E3] overflow-y-auto h-[720px]">
            <FilterComponent allFilterList={filterExamples} />
          </div>

          <div className="flex-1">

          </div>
        </div>

      </div>


    </ConfigProvider>
  )
}



export default Employee;