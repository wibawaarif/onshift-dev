import { NextResponse } from "next/server";
import connect from "@/utils/db";
import Employee from "@/models/employee";
import Location from "@/models/location";
import Shift from "@/models/shift";
import Position from "@/models/position";
import Timesheet from "@/models/timesheet";
import bcrypt from 'bcrypt'
import { getServerSession } from "next-auth";
import { options } from "@/lib/options";

export const GET = async (request, { params }) => {
  const session = await getServerSession(options)

  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized (wrong or expired token)" }), { status: 403 })
  }

  const { workspace } = session.user
  const { id } = params;
  // const url = new URL(request.url);

  // const username = url.searchParams.get("username");

  try {
    await connect();

    const employee = await Shift.findOne({workspace, _id: id}).sort({ createdAt: -1 }).select("date startTime endTime employees location position repeatedShift")
    .populate({
      path: 'location',
      model: Location,
      select: 'name',
    })


    return new NextResponse(JSON.stringify(employee), { status: 200 });
  } catch (err) {
    return new NextResponse(err, { status: 500 });
  }
};

export const PUT = async (request, { params }) => {
  const session = await getServerSession(options)

  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized (wrong or expired token)" }), { status: 403 })
  }


  const { id } = params;
  const body = await request.json();

  try {
    await connect();
    console.log(body)
    if (body?.method === "resetPassword") {
      const hashedPassword = await bcrypt.hash(body.password, 10)
      const employee = await Employee.findById(id)

      employee.set({
        ...body,
        password: hashedPassword
      })
      
      await employee.save();
      return new NextResponse(JSON.stringify(employee), { status: 200 });
    } else {
      console.log('masuk sni')
      const employee = await Employee.findById(id)

      employee.set({
        ...body
      })
  
      await employee.save();
  
      return new NextResponse(JSON.stringify(employee), { status: 200 });
    }


  } catch (err) {
    return new NextResponse(err, { status: 500 });
  }
}

export const DELETE = async (request, { params }) => {
  const session = await getServerSession(options)

  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized (wrong or expired token)" }), { status: 403 })
  }

  
  const { id } = params;

  try {
    await connect();

    await Employee.findByIdAndDelete(id);

    return new NextResponse("Employee has been deleted", { status: 200 });
  } catch (err) {
    return new NextResponse(err, { status: 500 });
  }
};