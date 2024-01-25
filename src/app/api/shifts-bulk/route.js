import { NextResponse } from "next/server";
import connect from "@/utils/db";
import Shift from "@/models/shift";
import Employee from "@/models/employee";
import { verifyJwtToken } from '@/lib/jwt'
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";


export const POST = async (request) => {
  const accessToken = request.headers.get("authorization")
  const token = accessToken?.split(' ')[1]
  const decodedToken = verifyJwtToken(token)  

  if (!accessToken || !decodedToken) {
    return new Response(JSON.stringify({ error: "Unauthorized (wrong or expired token)" }), { status: 403 })
  }

  const body = await request.json();


  try {
    await connect();
    console.log(body)
      for (let i=0; i < body.length; i++) {
        let newEmployees;
        console.log('test', String(body[i].employeeId))
        console.log('workspace', body[i].workspace)
        const findEmployee = await Employee.findOne({employeeId: String(body[i].employeeId), workspace: body[i].workspace})
        console.log('masuk', findEmployee)
        const newShift = new Shift({...body[i], employees: [findEmployee._id], user: decodedToken.email});
        await newShift.save();


        if (findEmployee.shifts) {
          newEmployees = [...findEmployee.shifts, newShift._id]
        } else {
          newEmployees = [newShift._id]
        }



        // findEmployee.set({
        //   ...findEmployee,
        //   shifts: newEmployees,
        // })

        await Employee.updateOne({employeeId: String(body[i].employeeId), workspace: body[i].workspace}, {$set: { "shifts": newEmployees }})
  

        }
    
    // let assignNewShift = [];
    // let currentDate = dayjs(body.date);
    // console.log('awal', body.repeatedShift.isRepeated)
    // if (body.repeatedShift.isRepeated) {
    //   console.log(currentDate)
    //   console.log(dayjs(body.repeatedShift.endDate))
    //   console.log(currentDate.isSameOrBefore(dayjs(body.repeatedShift.endDate)))
    //   assignNewShift.push({...body, user: decodedToken.email})
    //   while (currentDate.isSameOrBefore(dayjs(body.repeatedShift.endDate))) {
    //     console.log('masuk')  
    //     if (body.repeatedShift.repeatedDays.includes(currentDate.format('dddd'))) {
    //       const newShift = new Shift({...body, date: currentDate , user: decodedToken.email});

    //       await newShift.save();

    //       assignNewShift.push(newShift);
      
    //     }
    
    //     currentDate = currentDate.add(1, 'day');
    //   }
    // } else {
    //   const newShift = new Shift({...body, user: decodedToken.email});

    //   await newShift.save();

    //   assignNewShift.push(newShift)
    // }
    // console.log('akhir', body.employees.length)

    // if (body.employees.length > 0) {
    //   console.log(body.employees)
    //   for (let i=0; i < body.employees.length; i++) {
    //     const findEmployee = await Employee.findOne({user: decodedToken.email, _id: body.employees[i]})
    //     console.log(findEmployee, 'find')
    //     let newEmployees;

    //     const getAllId = assignNewShift?.map(x => x._id)

    //     newEmployees = findEmployee.shifts?.concat(getAllId)
    //     // if (body.repeatedShift.isRepeated) {
   
    //     //   newEmployees = findEmployee.shifts?.concat(getAllId)
    //     //   // newEmployees = [...findEmployee.shifts, newShift._id]
    //     // } else {
    //     //   newEmployees = [...findEmployee.shifts, newShift._id]
    //     // }
  
    //     // if (findEmployee.shifts) {
    //     //   newEmployees = [...findEmployee.shifts, newShift._id]
    //     // } else {
    //     //   newEmployees = [newShift._id]
    //     // }
    //     console.log(newEmployees, 'new employes')
    //     findEmployee.set({
    //       ...findEmployee,
    //       shifts: newEmployees,
    //     })
  
    //     await findEmployee.save();
    //   }
    // }

    return new NextResponse(JSON.stringify({info: "Success"}), { status: 201 });
  } catch (err) {
    return new NextResponse(err, { status: 500 });
  }
};