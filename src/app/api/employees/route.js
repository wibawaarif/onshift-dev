import { NextResponse } from "next/server";
import connect from "@/utils/db";
import Employee from "@/models/employee";
import Location from "@/models/location";
import Shift from "@/models/shift";
import Position from "@/models/position";
import bcrypt from 'bcrypt'
import Timesheet from "@/models/timesheet";
import { getServerSession } from "next-auth";
import { options } from "@/lib/options";

export const GET = async (request) => {
  const session = await getServerSession(options)

  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized (wrong or expired token)" }), { status: 403 })
  }

  const { workspace } = session.user

  // const url = new URL(request.url);

  // const username = url.searchParams.get("username");

  try {
    await connect();

    const employees = await Employee.find({user: session.user.email, workspace}).sort({ createdAt: -1 })
    .populate({
      path: 'shifts',
      model: Shift,
      select: 'date startTime endTime location position platform employees category repeatedShift notes break',
      populate: {
        path: 'location',
        model: Location,
        select: 'name '
      }
    }).populate({
      path: 'timesheets',
      model: Timesheet,
      select: 'date shiftStartTime shiftEndTime startTime endTime status action',
    }).populate({
      path: 'positions',
      model: Position,
      select: 'name',
    }).select("name email phoneNumber shifts timesheets wageOptions positions status employeeId")

    return new NextResponse(JSON.stringify(employees), { status: 200 });
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
  console.log(body)

  const findExistingEmployee = await Employee.findOne({email: body.email})

  if (findExistingEmployee) {
    return new Response(JSON.stringify({ error: `${body.email} already existed`, info: "email existed" }), { status: 400 })
  }

  let newEmployee;

  if (body.password) {
    const hashedPassword = await bcrypt.hash(body.password, 10)
    newEmployee = new Employee({...body, password: hashedPassword, user: session.user.email});
  } else {
    newEmployee = new Employee({...body, user: session.user.email});
  }

  try {
    await connect();

    await newEmployee.save();

    return new NextResponse(JSON.stringify(newEmployee), { status: 201 });
  } catch (err) {
    return new NextResponse(err, { status: 500 });
  }
};