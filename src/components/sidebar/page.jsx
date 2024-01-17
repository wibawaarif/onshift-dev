import { signOut } from "next-auth/react";
import { Popover } from "antd";
import Image from "next/image";
import Link from "next/link";

const SidebarComponent = ({ setChangePasswordModal, clicked, setClicked ,currentPath, menu, ScheduleRef, EmployeeRef}) => (
  <div className="flex flex-col justify-between items-center py-4 w-[80px] h-full border-r-[1px] border-[#E5E5E3]">
  <div>
    <Image
      width={50}
      height={50}
      alt="brand-logo"
      src={"/static/img/brand.png"}
    />
  </div>

  <div className="flex flex-col justify-between items-center h-80">
    {menu.map((x, index) => (
      <Link href={`/dashboard/${x}`} key={index}>
        <div className="flex justify-center items-center transition duration-300 hover:bg-[#E5E5E3] w-[32x] h-[30px] cursor-pointer px-1 rounded-lg">
          {currentPath === x && (
            <div className="absolute">
              <div className="w-[75px] h-[30px] border-l-4 border-black"></div>
            </div>
          )}
          <Image
            width={24}
            height={24}
            alt="schedule-logo"
            src={`/static/svg/${x}.svg`}
          />
        </div>
        <p className="text-black text-center capitalize text-xs font-semibold">
          {x}
        </p>
      </Link>
    ))}
  </div>

  <div className="flex flex-col justify-between items-center h-24">
    <Image
      width={24}
      height={24}
      alt="schedule-logo"
      src={"/static/svg/notification.svg"}
    />
    <Popover
      placement="bottomLeft"
      open={clicked}
      content={
        <div className="w-36 flex flex-col justify-center items-start">
                          <button
            onClick={() =>
              push('/accounts')
            }
            className="hover:bg-[#E5E5E3] w-full text-left rounded-lg py-[1px] px-2 cursor-pointer transition duration-300"
          >
            Switch Workspace
          </button>
          <button
            onClick={() =>
              setChangePasswordModal(true) & setClicked(false)
            }
            className="hover:bg-[#E5E5E3] w-full text-left rounded-lg py-[1px] px-2 cursor-pointer transition duration-300"
          >
            Change Password
          </button>
          <button
            onClick={() => signOut({ callbackUrl: "/signin" })}
            className="hover:bg-[#E5E5E3] w-full text-left rounded-lg py-[1px] px-2 cursor-pointer transition duration-300"
          >
            Logout
          </button>
        </div>
      }
      trigger="click"
    >
      <div
        onClick={() => setClicked(true)}
        className="bg-[#E5E5E3] cursor-pointer rounded-full w-12 h-12 flex justify-center items-center"
      >
        A
      </div>
    </Popover>
  </div>
</div>
)


export default SidebarComponent;