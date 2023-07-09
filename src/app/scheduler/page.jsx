'use client'

import SchedulerComponent from "@/components/scheduler/page";
import { Radio } from 'antd';
import { useState } from "react";
import './style.css'
const Scheduler = () => {
  const [type, setType] = useState('week')

  return (
    <div className="h-screen w-screen bg-[#F7F7F7]">
      <div className="flex flex-col items-center pt-16 mb-6">
        <h1>Scheduler component</h1>
      <Radio.Group onChange={(e) => setType(e.target.value)} defaultValue="week" buttonStyle="solid">
      <Radio.Button value="day">Day</Radio.Button>
      <Radio.Button value="week">Week</Radio.Button>
      <Radio.Button value="month">Month</Radio.Button>
    </Radio.Group>
      </div>
      <SchedulerComponent type={type} />
    </div>
  )
}




export default Scheduler;