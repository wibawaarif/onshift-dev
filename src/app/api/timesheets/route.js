import { NextResponse } from "next/server";
import connect from "@/utils/db";
import Timesheet from "@/models/timesheet";
import { getServerSession } from "next-auth";
import { options } from "@/lib/options";

export const GET = async (request) => {
  const session = await getServerSession(options)

  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized (wrong or expired token)" }), { status: 403 })
  }

  try {
    await connect();

    const timesheets = await Timesheet.find({}).populate('employee');

    return new NextResponse(JSON.stringify(timesheets), { status: 200 });
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

  const newTimesheet = new Timesheet(body);

  try {
    await connect();

    await newTimesheet.save();

    console.log(body);
    if (body.employees.length > 0) {
      console.log(body);
      for (let i=0; i < body.employees.length; i++) {
        const findEmployee = await Employee.findOne({user: session.user.email, _id: body.employees[i]})
        let newEmployees;
  
        if (findEmployee.timesheets) {
          newEmployees = [...findEmployee.timesheets, newTimesheet._id]
        } else {
          newEmployees = [newTimesheet._id]
        }
  
        findEmployee.set({
          ...findEmployee,
          timesheets: newEmployees,
        })
  
        await findEmployee.save();
      }
    }


    return new NextResponse(JSON.stringify(newTimesheet), { status: 201 });
  } catch (err) {
    return new NextResponse(err, { status: 500 });
  }
};