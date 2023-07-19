"use client"

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link";
import { Popover } from "antd";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";

const menu = ['schedule', 'employee', 'position', 'location', 'timesheet'];

const DashboardLayout = ({children}) => {
  const pathname = usePathname();
  const currentPath = pathname.split('/').pop()

  const session = useSession();
  const router = useRouter();

  if (session.status === "loading") {
    return <p>Loading...</p>;
  }


  if (session.status === "unauthenticated") {
    router?.push("/signin?message=Unauthorized");
    return
  }

  return (
    <div className="h-screen w-screen bg-white flex">
      <div className="flex flex-col justify-between items-center py-4 w-[70px] h-full border-r-[1px] border-[#E5E5E3]">
        <div>
          <span className="text-sm">Onshift</span>
        </div>

        <div className="flex flex-col justify-between items-center h-52">
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
        <Popover placement="bottomLeft" content={<div className="w-14 flex justify-center items-center"><button onClick={() => signOut({callbackUrl: '/signin'})} className="hover:bg-[#E5E5E3] rounded-lg py-[1px] px-2 cursor-pointer transition duration-300">Logout</button></div>} trigger="click">
        <div className="bg-[#E5E5E3] cursor-pointer rounded-full w-12 h-12 flex justify-center items-center">
          A
        </div>
      </Popover>
        </div>  
      </div>
      { children }
    </div>
  )
}

export default DashboardLayout;