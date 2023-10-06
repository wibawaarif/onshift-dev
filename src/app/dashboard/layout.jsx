"use client"

import Image from "next/image";
import { usePathname } from "next/navigation"
import Link from "next/link";
import { Input, Modal, Popover, message } from "antd";
import { useSession, signOut } from "next-auth/react";
import LoadingPage from "@/components/LoadingPage/page";
import { useState } from "react";
import { LockOutlined } from "@ant-design/icons";
const menu = ['schedule', 'employee', 'position', 'location', 'timesheet'];

const DashboardLayout = ({children}) => {
  const [changePasswordModal, setChangePasswordModal] = useState(false)
  const [clicked, setClicked] = useState(false)
  const [form , setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  })
  const pathname = usePathname();
  const currentPath = pathname.split('/').pop()

  const session = useSession()
  if (session.status === "loading") {
    return <LoadingPage />
  }

  if (session.status === "unauthenticated") {
    signOut({callbackUrl: '/signin?message=Unauthorized'})
    return
  }

  const handleChangePassword = async () => {
    const response = await fetch("/api/change-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({...form, email: session.data.user.email}),
    });

    const data = await response.json();

    if (data === 'Wrong current password') {
      message.error('Wrong current password')
      return
    }

    message.success('Password changed successfully')
    setChangePasswordModal(false)
    clearFields()
  }

  const clearFields = () => {
    setForm({
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: ''
    })
  }

  return (
    <div className="h-screen w-screen bg-white flex">
      <div className="flex flex-col justify-between items-center py-4 w-[80px] h-full border-r-[1px] border-[#E5E5E3]">
      <Modal
        footer={[
          <button
            className="mr-3 hover:bg-[#E5E5E3] px-4 py-1 border-[1px] border-[#E5E5E3] rounded-sm"
            key="back"
            onClick={() => setChangePasswordModal(false) & clearFields()}
          >
            CANCEL
          </button>,
          <button
            onClick={handleChangePassword}
            disabled={form.currentPassword === '' || form.newPassword === '' || form.confirmNewPassword === '' || (form.newPassword !== form.confirmNewPassword)}
            className="bg-black text-white disabled:opacity-60 rounded-sm px-4 py-1 hover:opacity-80"
            key="submit"
          >
            CHANGE PASSWORD
          </button>,
        ]}
        title="Change Password"
        open={changePasswordModal}
        onCancel={() => setChangePasswordModal(false) & clearFields()}
      >
    <div className="mt-5">
                  <span>Current Password</span>
                  <Input.Password
                    onChange={(e) => setForm((prev) => { return { ...prev, currentPassword: e.target.value } })}
                    prefix={<LockOutlined />}
                    value={form.currentPassword}
                    placeholder="Enter your current password"
                    className="py-2"
                  />
                </div>

                <div className="mt-2">
                  <span>New Password</span>
                  <Input.Password
                    onChange={(e) => setForm((prev) => { return { ...prev, newPassword: e.target.value } })}
                    prefix={<LockOutlined />}
                    value={form.newPassword}
                    placeholder="Enter your new password"
                    className="py-2"
                  />
                </div>

                <div className="mt-2 mb-5">
                  <span>Confirm New Password</span>
                  <Input.Password
                    onChange={(e) => setForm((prev) => { return { ...prev, confirmNewPassword: e.target.value } })}
                    prefix={<LockOutlined />}
                    value={form.confirmNewPassword}
                    placeholder="Enter your new password"
                    className="py-2"
                  />
                </div>
      </Modal>
        <div>
        <Image width={50} height={50} alt="brand-logo" src={'/static/img/brand.png'} />
        </div>

        <div className="flex flex-col justify-between items-center h-72">
          {
            menu.map((x, index) => (
              <Link href={`/dashboard/${x}`} key={index}>
              <div className="flex justify-center items-center transition duration-300 hover:bg-[#E5E5E3] w-[32x] h-[30px] cursor-pointer px-1 rounded-lg">
              {
                currentPath === x && (
                  <div className="absolute">
                    <div className="w-[75px] h-[30px] border-l-4 border-black">
                    </div>
                </div>
                )
              }
                <Image width={24} height={24} alt="schedule-logo" src={`/static/svg/${x}.svg`} />
              </div>
              <p className="text-black text-center capitalize text-xs font-semibold">{x}</p>
              </Link>
            ))
          }
        </div> 

        <div className="flex flex-col justify-between items-center h-24">
        <Image width={24} height={24} alt="schedule-logo" src={"/static/svg/notification.svg"} />
        <Popover placement="bottomLeft" open={clicked} content={<div className="w-36 flex flex-col justify-center items-start"><button onClick={() => setChangePasswordModal(true) & setClicked(false)} className="hover:bg-[#E5E5E3] w-full text-left rounded-lg py-[1px] px-2 cursor-pointer transition duration-300">Change Password</button><button onClick={() => signOut({callbackUrl: '/signin'})} className="hover:bg-[#E5E5E3] w-full text-left rounded-lg py-[1px] px-2 cursor-pointer transition duration-300">Logout</button></div>} trigger="click">
        <div onClick={() => setClicked(true)} className="bg-[#E5E5E3] cursor-pointer rounded-full w-12 h-12 flex justify-center items-center">
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