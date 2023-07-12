"use client"

import Image from "next/image";
import { usePathname } from "next/navigation"
import Link from "next/link";

const menu = ['schedule', 'employee', 'position', 'location'];

const DashboardLayout = ({children}) => {
  const pathname = usePathname();
  const currentPath = pathname.split('/').pop()

  return (
    <div className="h-screen w-screen bg-white flex">
      <div className="flex flex-col justify-between items-center py-4 w-[70px] h-full border-r-[1px] border-[#E5E5E3]">
        <div>
          <span className="text-sm">Onshift</span>
        </div>

        <div className="flex flex-col justify-between items-center h-40">
          {
            menu.map((x, index) => (
              <Link href={`/dashboard/${x}`} key={index}>
              <div className="flex justify-center items-center transition duration-300 hover:bg-[#E5E5E3] w-[32x] h-[30px] cursor-pointer px-1 rounded-lg">
              {
                currentPath === x && (
                  <div className="absolute">
                    <div className="w-[68px] h-[30px] border-l-4 border-black">
                    </div>
                </div>
                )
              }
                <Image width={24} height={24} alt="schedule-logo" src={`/static/svg/${x}.svg`} />
              </div>
              </Link>
            ))
          }
        </div> 

        <div className="flex flex-col justify-between items-center h-24">
        <Image width={24} height={24} alt="schedule-logo" src={"/static/svg/notification.svg"} />
        <div className="bg-[#E5E5E3] rounded-full w-12 h-12 flex justify-center items-center">
          A
        </div>
        </div>  
      </div>
      { children }
    </div>
  )
}

export default DashboardLayout;