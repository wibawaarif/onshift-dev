"use client";
import { Input, Checkbox } from "antd";
import Image from "next/image";
import { useState, useEffect } from "react";
import _ from "lodash"

const FilterComponent = ({allFilterList}) => {
  const allFilterListClone = _.cloneDeep(allFilterList)

  const [filterList, setFilterList] = useState(allFilterListClone)
  const [filterValue, setFilterValue] = useState("")

  useEffect(() => {
    const filteredList = allFilterListClone.filter(x => {
          x.options = x.options.map(y => {
            if (y?.toLowerCase().includes(filterValue.toLowerCase())) {
              return y
            }
          }).filter(item => item)
  
          if (x.options.length === 0) {
            return false
          }
  
          return true
        })

    setFilterList(filteredList)

    }, [filterValue])



  return (
    <div className="flex flex-col items-center">
      
      <div className="px-4">
        <p className="text-sm mt-[33px]">CLEAR FILTER</p>
        <div className="mt-[29px]">
          <Input onChange={(e) => e.preventDefault(setFilterValue(e.target.value))} placeholder="Search by keyword" className="rounded-sm" prefix={<Image width={20} height={20} src={"/static/svg/lup.svg"} />} />
        </div>
      </div>

      {
        filterList.map((x, index) => (
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

    </div>
  );
};

export default FilterComponent;
