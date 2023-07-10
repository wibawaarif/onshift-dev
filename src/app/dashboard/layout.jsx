import Image from "next/image";

const DashboardLayout = ({children}) => {

  return (
    <div className="h-screen w-screen bg-white flex">
      <div className="flex flex-col justify-between items-center py-4 w-[70px] h-full border-r-[1px] border-[#E5E5E3]">
        <div>
          <span className="text-sm">Onshift</span>
        </div>

        <div className="flex flex-col justify-between items-center h-40">

          <div className="flex justify-center items-center transition duration-300 hover:bg-[#E5E5E3] w-[32x] h-[30px] cursor-pointer px-1 rounded-lg">
          <div className="absolute">
            <div className="w-[68px] h-[30px] border-l-4 border-black">

            </div>
          </div>
            <Image width={24} height={24} alt="schedule-logo" src={"/static/svg/schedule.svg"} />
          </div>


          <Image width={24} height={24} alt="schedule-logo" src={"/static/svg/employee.svg"} />
          <Image width={24} height={24} alt="schedule-logo" src={"/static/svg/position.svg"} />
          <Image width={24} height={24} alt="schedule-logo" src={"/static/svg/location.svg"} />
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