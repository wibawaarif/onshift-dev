import { NextResponse } from "next/server";
import connect from "@/utils/db";
import Shift from "@/models/shift";
import Employee from "@/models/employee";
import dayjs from "dayjs";
import { getServerSession } from "next-auth";
import { options } from "@/lib/options";


export const POST = async (request) => {
  const session = await getServerSession(options)

  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized (wrong or expired token)" }), { status: 403 })
  }

  const body = await request.json();


  try {
    await connect();
    const start = new Date(dayjs(body.current).startOf("week"))
    const end = new Date(dayjs(body.current).endOf("week"))

    const findSelectedWeek = await Shift.find({workspace: body.workspace, date: {
        $gte: start,
        $lte: end
    }}).lean()
    console.log('hasil find selected week', findSelectedWeek.length)

     for (let i = 0; i < findSelectedWeek?.length; i++) {
        console.log('setiap shift', findSelectedWeek[i])
        delete findSelectedWeek[i]._id
        const findExistingShift = await Shift.findOne({workspace: body.workspace, date: dayjs(findSelectedWeek[i].date).add(body.week, 'week')})
        if (!findExistingShift) {
          const newShift = new Shift({...findSelectedWeek[i], date: dayjs(findSelectedWeek[i].date).add(body.week, 'week')});

          await newShift.save();
  
          const findEmployee = await Employee.findOne({ _id: findSelectedWeek[i].employees[0]}).select('shifts')
  
          await Employee.updateOne({_id: findSelectedWeek[i].employees[0]}, {$set: { "shifts": [...findEmployee.shifts, newShift._id] }})
        }
     }

    // findSelectedWeek.exec((err, result) => {
    //     if (err) {
    //         // Handle the error
    //         console.error(err);
    //         return;
    //     }
    
    //     // Access raw data as an array of plain JavaScript objects
    //     result.forEach(item => {
    //         // Access properties of each item
    //         console.log(item, 'dalam');
    //     });
    // });
    


    return new NextResponse(JSON.stringify({info: "Success"}), { status: 201 });
  } catch (err) {
    return new NextResponse(err, { status: 500 });
  }
};