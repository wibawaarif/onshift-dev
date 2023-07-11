"use client";
import { Input, Checkbox } from "antd";
import Image from "next/image";
import Lup from '../../../public/static/svg/lup.svg'

const FilterComponent = () => {
  const filterExamples = [
    {
      name: 'LOCATIONS / (DESELECT ALL)',
      options: ['Anaheim', 'Santa Barbara']
    },
    {
      name: 'POSITIONS / (DESELECT ALL)',
      options: ['Surgical Tech', 'Dentist', 'Nurse Practitioner', 'Phlebotomist']
    },
    {
      name: 'EVENTS / (DESELECT ALL)',
      options: ['Scheduled shifts', 'Unassigned shifts', 'Days off', 'Unavailability']
    },
    {
      name: 'EMPLOYEES / (DESELECT ALL)',
      options: ['Arif', 'Wibawa', 'David Paul', 'Jared Martin', 'Rena Sofer', 'Rena Sofer', 'Rena Sofer']
    }
  ]


  return (
    <div className="flex flex-col items-center">
      
      <div className="px-4">
        <p className="text-sm mt-[33px]">CLEAR FILTER</p>
        <div className="mt-[29px]">
          <Input placeholder="Search by keyword" className="rounded-sm" prefix={<Image width={20} height={20} src={"/static/svg/lup.svg"} />} />
        </div>
      </div>

      {
        filterExamples.map((x, index) => (
          <div key={index} className={`${index === 0 ? 'mt-[20px]' : 'mt-[28px]'} px-4 w-full`}>
            <p className="text-[10px] font-medium">{x.name}</p>
            {
              x.options.map((y, index2) => (
                <div key={index2} className="mt-1">
                  <Checkbox className="font-semibold">{y}</Checkbox>
              </div>
              ))
            }
        </div>
        ))
      }

      {/* <div className="mt-[20px] px-4">
        <p className="text-[10px] font-medium">LOCATIONS / (DESELECT ALL)</p>
        <div className="mt-2">
          <Checkbox>Anaheim</Checkbox>
          <Checkbox>Santa Barbara</Checkbox>
        </div>
      </div> */}
    
    </div>
  );
};

export default FilterComponent;
