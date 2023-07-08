'use client'

import SchedulerComponent from "@/components/scheduler/page";
import { Select } from 'antd';
const Scheduler = () => {
  const options = [
    {value: 'day', label: 'Day'},
    {value: 'week', label: 'Week'},
    {value: 'month', label: 'Month'}
  ]


  return (
    <div className="h-screen w-screen bg-[#F7F7F7]">
      <div className="flex flex-col items-center pt-16 mb-6">
        <h1>Scheduler component</h1>
        {/* <Select className="mt-4" defaultValue="week" options={options} /> */}
      </div>
      <SchedulerComponent />
    </div>
  )
}




export default Scheduler;