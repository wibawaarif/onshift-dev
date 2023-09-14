"use client";
import { Input, Checkbox } from "antd";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import _ from "lodash"

const FilterComponent = ({allFilterList, checkedFilter, selectedFilter}) => {
  const [filterList, setFilterList] = useState(allFilterList)
  const [filterValue, setFilterValue] = useState("")

  useEffect(() => {
    const filteredList = _.cloneDeep(allFilterList)?.filter(x => {
          x.options = x?.options?.map(y => {
            if (y?.toLowerCase().includes(filterValue.toLowerCase())) {
              return y
            }
          }).filter(item => item)
  
          if (x?.options?.length === 0) {
            return false
          }
  
          return true
        })

    setFilterList(filteredList)

    }, [filterValue, allFilterList])



  return (
    <div className="flex flex-col items-center">
      
      <div className="px-4">
        <p onClick={() => setFilterValue("")} className="text-sm mt-[33px] hover:bg-[#E5E5E3] w-max px-2 py-1 rounded-sm transition duration-300 cursor-pointer">CLEAR FILTER</p>
        <div className="mt-[29px]">
          <Input value={filterValue} onChange={(e) => e.preventDefault(setFilterValue(e.target.value))} placeholder="Search by keyword" className="rounded-sm" prefix={<Image width={20} height={20} src={"/static/svg/lup.svg"} />} />
        </div>
      </div>

      {
        filterList?.length > 0 ? filterList?.map((x, index) => (
          <div key={index} className={`${index === 0 ? 'mt-[20px]' : 'mt-[28px]'} px-4 w-full`}>
            <p className="text-[10px] font-medium">{x.name}</p>
            {
              x?.options?.map((y, index2) => (
                <div key={index2} className="mt-1">
                  <Checkbox name={y} checked={selectedFilter?.some(z => z === y) ? true : false} onChange={checkedFilter} className="font-semibold">{y}</Checkbox>
              </div>
              ))
            }
        </div>
        )) : <span className="text-slate-500 text-sm mt-4">There is no any data.</span>
      }

    </div>
  );
};

export default FilterComponent;
