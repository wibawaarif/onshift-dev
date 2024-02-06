import { NextResponse } from "next/server";
import connect from "@/utils/db";
import Shift from "@/models/shift";
import Employee from "@/models/employee";
import Location from "@/models/location";
import Position from "@/models/position";
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { getServerSession } from "next-auth";
import { options } from "@/lib/options";

dayjs.extend(isSameOrBefore)

export const GET = async (request) => {
  const session = await getServerSession(options)

  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized (wrong or expired token)" }), { status: 403 })
  }

  const { workspace } = session.user

  try {
    await connect();

    const shifts = await Shift.find({workspace}).populate({ path: 'location', select: 'name', model: Location }).populate({ path: 'position', select: 'name', model: Position })

    return new NextResponse(JSON.stringify(shifts), { status: 200 });
  } catch (err) {
    return new NextResponse(err, { status: 500 });
  }
};

export const POST = async (request) => {
  const session = await getServerSession(options)

  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized (wrong or expired token)" }), { status: 403 })
  }

  const body = await request.json();


  try {
    await connect();
    
    let assignNewShift = [];
    let currentDate = dayjs(body.date);

    if (body.repeatedShift.isRepeated) {
      assignNewShift.push({...body, user: session.user.email})
      while (currentDate.isSameOrBefore(dayjs(body.repeatedShift.endDate))) {
        console.log('masuk')  
        if (body.repeatedShift.repeatedDays.includes(currentDate.format('dddd'))) {
          const newShift = new Shift({...body, date: currentDate , user: session.user.email});

          await newShift.save();

          assignNewShift.push(newShift);
      
        }
    
        currentDate = currentDate.add(1, 'day');
      }
    } else {
      const newShift = new Shift({...body, user: session.user.email});

      await newShift.save();

      assignNewShift.push(newShift)
    }
    console.log('akhir', body.employees.length)

    if (body.employees.length > 0) {
      console.log(body.employees)
      for (let i=0; i < body.employees.length; i++) {
        const findEmployee = await Employee.findOne({user:session.user.email, _id: body.employees[i]})
        console.log(findEmployee, 'find')
        let newEmployees;

        const getAllId = assignNewShift?.map(x => x._id)

        newEmployees = findEmployee.shifts?.concat(getAllId)
        // if (body.repeatedShift.isRepeated) {
   
        //   newEmployees = findEmployee.shifts?.concat(getAllId)
        //   // newEmployees = [...findEmployee.shifts, newShift._id]
        // } else {
        //   newEmployees = [...findEmployee.shifts, newShift._id]
        // }
  
        // if (findEmployee.shifts) {
        //   newEmployees = [...findEmployee.shifts, newShift._id]
        // } else {
        //   newEmployees = [newShift._id]
        // }
        // console.log(newEmployees, 'new employes')
        // findEmployee.set({
        //   ...findEmployee,
        //   shifts: newEmployees,
        // })
  
        // await findEmployee.save();

        await Employee.updateOne({user:session.user.email, _id: body.employees[i]}, {$set: { "shifts": newEmployees }})
      }
    }


    return new NextResponse(JSON.stringify({info: "Success"}), { status: 201 });
  } catch (err) {
    return new NextResponse(err, { status: 500 });
  }
};